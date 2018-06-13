package org.myalice.websocket.manager;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class SessionMappingManager {
	
	private Map<String, String> csMapping = new HashMap<String, String>();
	
	private Map<String, String> scMapping = new HashMap<String, String>();
	
	private Map<String, WebSocketSession> httpSessionWebSocketSessionMapping = new HashMap<String, WebSocketSession>();
	
	/**
	 * 连接分配操作
	 * @param customerHttpSessionId
	 * @param supporterHttpSessionId
	 */
	public void assigned(String customerHttpSessionId, String supporterHttpSessionId) {
		csMapping.put(customerHttpSessionId, supporterHttpSessionId);
		scMapping.put(supporterHttpSessionId, customerHttpSessionId);
	}
	
	/**
	 * 连接操作
	 * @param httpSessionId
	 * @param webSocketSession
	 */
	public void connected(String httpSessionId, WebSocketSession webSocketSession) {
		httpSessionWebSocketSessionMapping.put(httpSessionId, webSocketSession);
	}
	
	/**
	 * 获取最近链接的客服session对应的连接
	 * @param customerHttpSessionId
	 * @return
	 */
	public WebSocketSession getLastSupporter(String supporterSessionId) {
		if (StringUtils.isEmpty(supporterSessionId)) {
			return null;
		}
		WebSocketSession lastSupporter = httpSessionWebSocketSessionMapping.get(supporterSessionId);
		return lastSupporter;
	}
	
	/**
	 * 获取最近链接的客服session
	 * @param customerHttpSessionId
	 * @return
	 */
	public String getLastSupporterHttpSession(String customerHttpSessionId) {
		if (StringUtils.isEmpty(customerHttpSessionId)) {
			return null;
		}
		return csMapping.get(customerHttpSessionId);
	}
	
	public void unassignMapping(String customerSessionId) {
		if (StringUtils.isNotEmpty(customerSessionId)) {
			String supporterSessionId = csMapping.get(customerSessionId);
			scMapping.remove(supporterSessionId);
			csMapping.remove(customerSessionId);
		}
	}
	
	public void disconnected(String httpSessionId) {
		httpSessionWebSocketSessionMapping.remove(httpSessionId);
	}
}
