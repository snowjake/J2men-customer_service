package org.myalice.websocket.manager;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;

import org.apache.commons.lang3.StringUtils;
import org.myalice.websocket.Constant;
import org.myalice.websocket.Util;
import org.myalice.websocket.message.MessageFactory;
import org.myalice.websocket.pool.CustomerPool;
import org.myalice.websocket.pool.CustomerWaitingPool;
import org.myalice.websocket.pool.SupporterPool;
import org.myalice.websocket.service.TalkService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.core.JsonProcessingException;

@Component
public class AssignManager {
	
	private Logger log = LoggerFactory.getLogger(AssignManager.class);
	
	//private static LinkedBlockingDeque<WebSocketSession> assignCustomerInfo = new LinkedBlockingDeque<WebSocketSession>(1000);
	
	//private static LinkedBlockingDeque<WebSocketSession> assignSupporterInfo = new LinkedBlockingDeque<WebSocketSession>(1000);
	
	@Value("${websocket.customer.unset.limit:100}")
	private int unsetMessageLimit;
	
	@Value("${websocket.assign.limit:10}")
	private int assignLimit;
	
	@Value("${websocket.assign.frequence:1000}")
	private int assignFrequence;
	
	@Autowired
	private CustomerPool customerPool;
	
	@Autowired
	private CustomerWaitingPool customerWaitingPool;
	
	@Autowired
	private SupporterPool supporterPool;
	
	@Autowired
	private SessionMappingManager sessionMappingManager;
	
	@Autowired
	private TalkService talkService;
	
	@Autowired
	private MessageFactory messageFactory;
	
	@Scheduled(fixedRate = 1000)
	public void assignTask() throws IOException, InterruptedException {
		assignSession();
	}
	
	@Scheduled(fixedRate = 1000)
	public void waitTimeArrived() {
		WebSocketSession customer = customerWaitingPool.getTimeoutElement();
		while (customer != null && customer.isOpen()) {
			String supporterSessionId = sessionMappingManager.getLastSupporterHttpSession(Util.getHttpSessionId(customer));
			WebSocketSession supporter = sessionMappingManager.getLastSupporter(supporterSessionId);
			if (supporter == null || !supporter.isOpen()) {
				sessionMappingManager.unassignMapping(Util.getHttpSessionId(customer));
			}			
		}
	}
	
	private void assignSession() throws IOException, InterruptedException {
		try {
			int count = customerPool.size();
			WebSocketSession customer = customerPool.getUnassignedCustomer();
			while (customer != null && customer.isOpen() && count > 0) {
				count--;
				WebSocketSession supporter = null;
				//判断是否需要连接原客服
				String lastSupporterHttpSessionId = sessionMappingManager.getLastSupporterHttpSession(Util.getHttpSessionId(customer));
				if (StringUtils.isNotEmpty(lastSupporterHttpSessionId)) {
					WebSocketSession lastSupporter = sessionMappingManager.getLastSupporter(lastSupporterHttpSessionId);
					if (lastSupporter != null && lastSupporter.isOpen()) {
						supporter = lastSupporter;
					} else {
						//判断是否需要等待
						customerWaitingPool.wait(customer);
						customerPool.addCustomer(customer);
						customer = customerPool.getUnassignedCustomer();
						continue;
					}
				} else {
					supporter = supporterPool.getFreeSupporter();
				}
				//在找不到空闲的客服人员时，客户继续等待
				if (supporter == null) {
					customerPool.freeCustomer(customer);
					break;
				}
				
				//设置客户、客服关联关系
				setMapping(customer, supporter);
				sessionMappingManager.assigned(Util.getHttpSessionId(customer), Util.getHttpSessionId(supporter));
				//发送分配消息
				sendAssignMessage(customer, supporter);
				//发送历史信息
				//sendHistory(customer, supporter);
				
				//向客服发送未接收的信息
				sendUnsetMessage(customer, supporter);
				
				/*assignCustomerInfo.put(customer);
				assignSupporterInfo.put(supporter);*/
				talkService.assign(customer, supporter);
				
				customer = customerPool.getUnassignedCustomer();
			}
		} catch (Exception e) {
			log.error("Assign error!", e);
		}
	}
	
	/**
	 * 向客户、客服发送对接消息
	 * @param customer
	 * @param supporter
	 * @throws JsonProcessingException
	 * @throws IOException
	 */
	private void sendAssignMessage(WebSocketSession customer, WebSocketSession supporter) throws JsonProcessingException, IOException {
		TextMessage customerMessage = messageFactory.generateMessage(customer, supporter, MessageFactory.MESSAGE_TYPE_ASSIGN_TO_CUSTOMER, null); 
		TextMessage supporterMessage = messageFactory.generateMessage(customer, supporter, MessageFactory.MESSAGE_TYPE_ASSIGN_TO_SUPPORTER, null);
		
		customer.sendMessage(customerMessage);
		supporter.sendMessage(supporterMessage);
		log.info("ASSIGN CUSTOMER  : " + customerMessage.getPayload());
		log.info("ASSIGN SUPPORTER : " + supporterMessage.getPayload());
	}
	
	private void setMapping(WebSocketSession customer, WebSocketSession supporter) {
		if (customer == null || supporter == null 
				|| !customer.isOpen() || !supporter.isOpen()) {
			return;
		}
		//一个客户对应一个客服
		customer.getAttributes().put(Constant.WS_SESSION_KEY.SESSION_KEY_TALKER_OF_CUSTOMER, supporter);
		//一个客服对应多个客户
		@SuppressWarnings("unchecked")
		Map<String, WebSocketSession> supporterTalkers = ((Map<String, WebSocketSession>)supporter.getAttributes().get(Constant.WS_SESSION_KEY.SESSION_KEY_TALKER_OF_SUPPORTER));
		if (supporterTalkers == null) {
			supporterTalkers = new HashMap<String, WebSocketSession>();
			supporter.getAttributes().put(Constant.WS_SESSION_KEY.SESSION_KEY_TALKER_OF_SUPPORTER, supporterTalkers);
		}
		supporterTalkers.put(customer.getId(), customer);
	}
	
	private void sendUnsetMessage(WebSocketSession customerSession, WebSocketSession supporterSession) {
		if (customerSession == null || supporterSession == null 
				|| !customerSession.isOpen() || !supporterSession.isOpen()) {
			return;
		}
		
		@SuppressWarnings("unchecked")
		ArrayBlockingQueue<String> unsendMessages = (ArrayBlockingQueue<String>)customerSession.getAttributes().get(Constant.WS_SESSION_KEY.SESSION_KEY_UNSENT_MESSAGES);
		if (unsendMessages != null && unsendMessages.size() > 0) {
			for (String message : unsendMessages) {
				try {
					supporterSession.sendMessage(messageFactory.generateMessage(customerSession, supporterSession, MessageFactory.MESSAGE_TYPE_TALK_TO_SUPPORTER, message));
				} catch (IOException e) {
					log.error("Send unset messsage error : from " + customerSession.getId() 
						+ " to " + supporterSession.getId(), e);
				}
			}
			unsendMessages.clear();
		}
	}
}
