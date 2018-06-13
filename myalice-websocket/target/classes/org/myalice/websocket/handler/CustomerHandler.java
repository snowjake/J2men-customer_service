package org.myalice.websocket.handler;

import org.apache.commons.lang3.StringUtils;
import org.myalice.websocket.Constant;
import org.myalice.websocket.Util;
import org.myalice.websocket.Util.ImageMeta;
import org.myalice.websocket.manager.SessionMappingManager;
import org.myalice.websocket.message.Message;
import org.myalice.websocket.message.MessageFactory;
import org.myalice.websocket.pool.CustomerPool;
import org.myalice.websocket.pool.SupporterPool;
import org.myalice.websocket.service.TalkService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class CustomerHandler extends TextWebSocketHandler {

	private Logger log = LoggerFactory.getLogger(CustomerHandler.class);

	@Autowired
	private CustomerPool customerPool;

	@Autowired
	private SupporterPool supporterPool;

	@Autowired
	private TalkService talkService;

	@Autowired
	private MessageFactory messageFactory;

	@Autowired
	private SessionMappingManager sessionMappingManager;

	@Override
	public void afterConnectionEstablished(WebSocketSession session)
			throws Exception {
		/*TextMessage message = messageFactory.generateMessage(session, null,
				MessageFactory.MESSAGE_TYPE_CUSTOMER_CONNECT, null);
		if (message != null) {
			session.sendMessage(message);
		}*/
		customerPool.addCustomer(session);
		talkService.connectionOpen(session,
				Constant.DOMAIN_TYPE.CONNECTION_TYPE_CUSTOMER);
		// 发送历史信息
		log.info("Customer " + session.getId() + " connected.");
		// 记录http session和websocket session映射
		sessionMappingManager
				.connected(Util.getHttpSessionId(session), session);
	}

	@Override
	protected void handleTextMessage(WebSocketSession session,
			TextMessage message) throws Exception {
		log.info("Receive from " + session.getId() + ": "
				+ message.getPayload());
		try {
			// 获取聊天内容
			Message tb = null;
			String content = message.getPayload();
			if (StringUtils.isNotEmpty(content)) {
				tb = Util.parseMessage(content, Message.class);
			}
			if (tb == null) {
				return;
			}
			// 获取聊天对象
			WebSocketSession talker = (WebSocketSession) session
					.getAttributes()
					.get(Constant.WS_SESSION_KEY.SESSION_KEY_TALKER_OF_CUSTOMER);

			String talkType = MessageFactory.MESSAGE_TYPE_TALK_TO_SUPPORTER;
			String talkDomainType = Constant.DOMAIN_TYPE.TALK_TYPE_CUSTOMER_TO_SUPPORTER;
			// 插入未发送队列
			if (talker == null || !talker.isOpen()) {
				Util.setUnsetMessage(
						session,
						(String) tb.getContent().get(
								Message.CONTENT_KEY_TALK_CONTENT));
				if (tb != null) {
					if (tb.getType()
							.equals(MessageFactory.MESSAGE_TYPE_IMAGE_TALK_TO_SUPPORTER)) {
						ImageMeta im = Util.parseImgString(tb.getContent().get(
								Message.CONTENT_KEY_TALK_CONTENT));
						String path = Util.imageUploadPath(im.getSuffix());
						Util.GenerateImage(im.getContent(), path);
						tb.getContent()
								.put(Message.CONTENT_KEY_TALK_CONTENT,
										Constant.IMAGE_ACCESS_PATH
												+ path.substring(path
														.lastIndexOf("/") + 1));
						talkType = MessageFactory.MESSAGE_TYPE_IMAGE_TALK_TO_SUPPORTER;
						talkDomainType = Constant.DOMAIN_TYPE.TALK_TYPE_IMAGE_CUSTOMER_TO_SUPPORTER;
					}
					talkService
							.saveTalk(
									session,
									null,
									talkDomainType,
									tb.getContent().get(
											Message.CONTENT_KEY_TALK_CONTENT));
					log.info(session.getId()
							+ " To no one : "
							+ tb.getContent().get(
									Message.CONTENT_KEY_TALK_CONTENT));
				}
			}
			// 发送聊天内容
			else {
				if (tb.getType().equals(
						MessageFactory.MESSAGE_TYPE_IMAGE_TALK_TO_SUPPORTER)) {
					ImageMeta im = Util.parseImgString(tb.getContent().get(
							Message.CONTENT_KEY_TALK_CONTENT));
					String path = Util.imageUploadPath(im.getSuffix());
					Util.GenerateImage(im.getContent(), path);
					tb.getContent()
							.put(Message.CONTENT_KEY_TALK_CONTENT,
									Constant.IMAGE_ACCESS_PATH
											+ path.substring(path
													.lastIndexOf("/") + 1));
					talkType = MessageFactory.MESSAGE_TYPE_IMAGE_TALK_TO_SUPPORTER;
					talkDomainType = Constant.DOMAIN_TYPE.TALK_TYPE_IMAGE_CUSTOMER_TO_SUPPORTER;
				}
				talker.sendMessage(messageFactory.generateMessage(session,
						talker, talkType,
						tb.getContent().get(Message.CONTENT_KEY_TALK_CONTENT)));
				talkService.saveTalk(session, talker, talkDomainType, tb
						.getContent().get(Message.CONTENT_KEY_TALK_CONTENT));
				log.info(session.getId() + " To " + talker.getId() + " : "
						+ tb.getContent().get(Message.CONTENT_KEY_TALK_CONTENT));
			}
		} catch (Exception e) {
			log.error("处理客户信息失败：" + message.getPayload(), e);
		}
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session,
			CloseStatus status) throws Exception {
		customerPool.removeCustomer(session);
		WebSocketSession talker = (WebSocketSession) session.getAttributes()
				.get(Constant.WS_SESSION_KEY.SESSION_KEY_TALKER_OF_CUSTOMER);
		supporterPool.freeSupporter(talker);
		if (talker != null && talker.isOpen()) {
			TextMessage message = messageFactory
					.generateMessage(
							session,
							talker,
							MessageFactory.MESSAGE_TYPE_CLOSE_CUSTOMER_TO_SUPPORTER,
							"");
			talker.sendMessage(message);
		}
		talkService.connectionClose(session);
		log.info("Customer " + session.getId() + " closed.");
		sessionMappingManager.disconnected(Util.getHttpSessionId(session));
	}
}
