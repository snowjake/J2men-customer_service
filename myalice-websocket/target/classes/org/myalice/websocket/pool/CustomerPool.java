package org.myalice.websocket.pool;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import javax.annotation.PostConstruct;

import org.myalice.websocket.Constant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class CustomerPool {

	private LinkedBlockingQueue<WebSocketSession> unassignedCustomerQueue = null;
	
	private Map<String, WebSocketSession> customerMap = null;
	
	@Value("${websocket.customer.connection.limit:1000}")
	private int customerConnectionLimit;
	
	@Value("${websocket.talk.without.supporter.limit:100}")
	private int cunsendLimit;
	
	@PostConstruct
	public void init() {
		unassignedCustomerQueue = new LinkedBlockingQueue<WebSocketSession>();
		customerMap = new HashMap<String, WebSocketSession>();
	}
	
	synchronized public boolean addCustomer(WebSocketSession session) {
		if (session == null) {
			return false;
		}
		if (customerMap.size() >= customerConnectionLimit) {
			return false;
		}
		session.getAttributes().put(Constant.WS_SESSION_KEY.SESSION_KEY_UNSENT_MESSAGES, 
				new ArrayBlockingQueue<String>(cunsendLimit));
		unassignedCustomerQueue.add(session);
		customerMap.put(session.getId(), session);
		return true;
	}
	
	synchronized public boolean removeCustomer(WebSocketSession session) {
		if (session == null) {
			return false;
		}
		customerMap.remove(session.getId());
		return true;
	}
	
	@SuppressWarnings("resource")
	synchronized public WebSocketSession getUnassignedCustomer() {
		if (unassignedCustomerQueue.size() > 0) {
			WebSocketSession session = unassignedCustomerQueue.poll();
			while ((session == null || !session.isOpen()) 
					&& unassignedCustomerQueue.size() > 0) {
				session = unassignedCustomerQueue.poll();
				break;
			}
			if (session != null && session.isOpen()) {
				return session;
			}
		}
		return null;
	}
	
	synchronized public boolean freeCustomer(WebSocketSession session) {
		if (session == null) {
			return false;
		}
		unassignedCustomerQueue.add(session);
		return true;
	}
	
	public int size() {
		return unassignedCustomerQueue.size();
	}
}
