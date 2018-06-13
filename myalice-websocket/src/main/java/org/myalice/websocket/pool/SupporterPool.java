package org.myalice.websocket.pool;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.atomic.AtomicInteger;

import javax.annotation.PostConstruct;

import org.myalice.websocket.Constant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class SupporterPool {
	
	private Logger log = LoggerFactory.getLogger(SupporterPool.class);
	
	private TreeMap<String, Integer> supporterWorkload = null;
	
	private Map<String, WebSocketSession> supporterMap = null;
	
	private int capacity = 0;
	
	private int freeCount = 0;
	
	@Value("${websocket.customer.connection.limit:1000}")
	private int supporterConnectionLimit;
	
	@Value("${websocket.supporter.workload.limit:10}")
	private int workloadLimit;
	
	@PostConstruct
	public void init() {
		supporterWorkload = new TreeMap<String, Integer>();
		supporterMap = new HashMap<String, WebSocketSession>();
	}
	
	synchronized public boolean addSupporter(WebSocketSession session) {
		if (session == null) {
			return false;
		}
		if (supporterMap.size() >= supporterConnectionLimit) {
			return false;
		}
		session.getAttributes().put(Constant.WS_SESSION_KEY.SESSION_KEY_SUPPORTER_WORKLOAD, 
				new AtomicInteger(0));
		session.getAttributes().put(Constant.WS_SESSION_KEY.SESSION_KEY_TALKER_OF_SUPPORTER, 
				new HashMap<String, WebSocketSession>());
		supporterWorkload.put(session.getId(), 0);
		supporterMap.put(session.getId(), session);
		capacity += workloadLimit;
		freeCount += workloadLimit;
		log.info("Support pool, size : " + capacity + "; free count : " + freeCount + "; supporter count : " + supporterMap.size());
		return true;
	}
	
	synchronized public boolean removeSupporter(WebSocketSession session) {
		if (session == null) {
			return false;
		}
		int curWorkload = supporterWorkload.get(session.getId());
		supporterWorkload.remove(session.getId());
		supporterMap.remove(session.getId());
		capacity -= workloadLimit;
		freeCount -= workloadLimit - curWorkload;
		log.info("Support pool, size : " + capacity + "; free count : " + freeCount + "; supporter count : " + supporterMap.size());
		return true;
	}
	
	synchronized public WebSocketSession getFreeSupporter() {
		if (freeCount <= 0) {
			return null;
		}
		if (supporterWorkload.size() == 0) {
			return null;
		}
		String firstKey = supporterWorkload.firstKey();
		supporterWorkload.put(firstKey, 
				supporterWorkload.get(firstKey) + 1);
		freeCount -= 1;
		log.info("Support pool, size : " + capacity + "; free count : " + freeCount + "; supporter count : " + supporterMap.size());
		return supporterMap.get(firstKey);
	}
	
	synchronized public boolean freeSupporter(WebSocketSession supporter) {
		if (supporter == null) {
			return false;
		}
		if (!supporter.isOpen()) {
			return false;
		}
		
		supporterWorkload.put(supporter.getId(), supporterWorkload.get(supporter.getId()) - 1 < 0 ? 0 : supporterWorkload.get(supporter.getId()) - 1);
		freeCount += 1;
		return true;
	}
	
}
