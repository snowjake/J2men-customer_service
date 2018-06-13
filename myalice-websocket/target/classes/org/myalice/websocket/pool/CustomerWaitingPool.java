package org.myalice.websocket.pool;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.LinkedBlockingQueue;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class CustomerWaitingPool {
	
	private LinkedBlockingQueue<WebSocketSession> waitingCustomerQueue = null;
	
	private Map<String, Date> waitingTimeMap = null;
	
	@Value("${websocket.customer.connection.limit:1000}")
	private int customerConnectionLimit;
	
	@Value("${websocket.customer.connection.wait:30000}")
	private int customerConnectionWait;
	
	@PostConstruct
	public void init() {
		waitingCustomerQueue = new LinkedBlockingQueue<WebSocketSession>();
		waitingTimeMap = new HashMap<String, Date>();
	}
	
	public void wait(WebSocketSession sessionToWait) {
		if (waitingTimeMap.get(sessionToWait.getId()) != null) {
			return;
		}
		waitingCustomerQueue.add(sessionToWait);
		waitingTimeMap.put(sessionToWait.getId(), 
				new Date(System.currentTimeMillis() + customerConnectionWait));
	}
	
	@SuppressWarnings("resource")
	public WebSocketSession getTimeoutElement() {
		if (waitingCustomerQueue.size() > 0) {
			WebSocketSession session = waitingCustomerQueue.peek();
			while ((session == null || !session.isOpen()) 
					&& waitingCustomerQueue.size() > 0) {
				if (waitingTimeMap.get(session.getId()).compareTo(new Date()) < 0) {
					session = waitingCustomerQueue.poll();
					waitingTimeMap.remove(session.getId());
					break;
				}
				waitingCustomerQueue.poll();
				session = waitingCustomerQueue.peek();
			}
			if (session != null && session.isOpen()) {
				return session;
			}
		}
		return null;
	}
	
	
}
