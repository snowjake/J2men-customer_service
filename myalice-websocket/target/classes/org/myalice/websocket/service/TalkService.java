package org.myalice.websocket.service;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.myalice.domain.websocket.AssignRecord;
import org.myalice.domain.websocket.ConnectionRecord;
import org.myalice.domain.websocket.TalkRecord;
import org.myalice.mapping.websocket.AssignRecordMapper;
import org.myalice.mapping.websocket.ConnectionRecordMapper;
import org.myalice.mapping.websocket.TalkRecordMapper;
import org.myalice.websocket.Constant;
import org.myalice.websocket.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.WebSocketSession;

@Service
public class TalkService {
	
	@Autowired
	private AssignRecordMapper assignMapper;
	
	@Autowired
	private ConnectionRecordMapper connMapper;
	
	@Autowired
	private TalkRecordMapper talkMapper;
	
	@Value("${websocket.lasttalk.display.limit:10}")
	private int laskTalkNumberLimit;
	
	public void connectionOpen(WebSocketSession session, String type) {
		if (session == null || StringUtils.isEmpty(session.getId()) 
				|| StringUtils.isEmpty(type)) {
			return;
		}
		ConnectionRecord conn = new ConnectionRecord();
		conn.setClientAddress(session.getRemoteAddress().getAddress().getHostAddress());
		conn.setCloseTime(null);
		conn.setId(session.getId());
		conn.setOpenTime(new Date());
		conn.setServerAddress(session.getLocalAddress().getAddress().getHostAddress());
		conn.setStatus(Constant.DOMAIN_STATUS.CONNECTION_OPENED);
		conn.setType(type);
		conn.setUserId((String)session.getAttributes().get(Constant.WS_SESSION_KEY.SESSION_KEY_USER_ID));
		connMapper.insert(conn);
	}
	
	@Transactional(readOnly=false, rollbackFor=Exception.class)
	public void connectionClose(WebSocketSession session) {
		if (session == null || StringUtils.isEmpty(session.getId())) {
			return;
		}
		ConnectionRecord conn = connMapper.selectByPrimaryKey(session.getId());
		if (conn != null) {
			conn.setCloseTime(new Date());
			conn.setStatus(Constant.DOMAIN_STATUS.CONNECTION_CLOSED);
			connMapper.updateByPrimaryKey(conn);
		}
	}
	
	public void connectionAssign(WebSocketSession customerSession, 
			final WebSocketSession supporterSession) {
		if (customerSession == null || supporterSession == null 
				|| StringUtils.isEmpty(customerSession.getId()) 
				|| StringUtils.isEmpty(supporterSession.getId())) {
			return;
		}
		AssignRecord assign = new AssignRecord();
		assign.setId(Util.randomUUID());
		assign.setAssignTime(new Date());
		assign.setCustomerConnId(customerSession.getId());
		assign.setCustomerId((String)customerSession.getAttributes().get(Constant.WS_SESSION_KEY.SESSION_KEY_USER_ID));
		assign.setSupporterConnId(supporterSession.getId());
		assign.setSupporterId((String)supporterSession.getAttributes().get(Constant.WS_SESSION_KEY.SESSION_KEY_USER_ID));
		assignMapper.insert(assign);
		return;
	}
	
	
	public void saveTalk(WebSocketSession fromSession, WebSocketSession toSession, String type, String message) {
		if (fromSession == null || StringUtils.isEmpty(type) || StringUtils.isEmpty(message)) {
			return;
		}
		TalkRecord talk = new TalkRecord();
		talk.setId(Util.randomUUID());
		talk.setConnectionId(fromSession.getId());
		talk.setCreateTime(new Date());
		talk.setContent(message);
		talk.setFromIp(fromSession.getRemoteAddress().getAddress().getHostAddress());
		talk.setFromUserId(Util.getUserId(fromSession));
		talk.setFromUserName(Util.getUserName(fromSession));
		if (toSession != null) {
			talk.setToIp((String)toSession.getRemoteAddress().getAddress().getHostAddress());
			talk.setToUserId(Util.getUserId(toSession));
			talk.setToUserName(Util.getUserName(toSession));
		}
		talk.setType(type);
		talkMapper.insert(talk);
		return;
	}
	
	public List<TalkRecord> getHistoryTalk(WebSocketSession session) {
		if (session == null) {
			return null;
		}
		String userId = Util.getUserId(session);
		List<TalkRecord> history = null;
		if (StringUtils.isNotEmpty(userId)) {
			history = this.getHistoryTalkByUserId(userId);
			Collections.reverse(history);
			return history;
		} else {
			String remoteIp = Util.getRemoteIp(session);
			if (StringUtils.isNotEmpty(remoteIp)) {
				history = this.getHistoryTalkByIp(remoteIp);
				Collections.reverse(history);
				return history;
			}
			return null;
		}
	}
	
	private List<TalkRecord> getHistoryTalkByIp(String ip) {
		if (StringUtils.isEmpty(ip)) {
			return null;
		}
		List<TalkRecord> history = talkMapper.selectLastTalkByIp(ip, laskTalkNumberLimit);
		return history;
	}
	
	private List<TalkRecord> getHistoryTalkByUserId(String userId) {
		if (StringUtils.isEmpty(userId)) {
			return null;
		}
		return talkMapper.selectLastTalkByUserId(userId, laskTalkNumberLimit);
	}
	
	public void assign(WebSocketSession customerSession, WebSocketSession supporterSession) {
		if (customerSession == null || supporterSession == null) {
			return;
		}
		AssignRecord assign = new AssignRecord();
		assign.setId(Util.randomUUID());
		assign.setAssignTime(new Date());
		assign.setCustomerConnId(customerSession.getId());
		assign.setCustomerId((String)customerSession.getAttributes()
				.get(Constant.WS_SESSION_KEY.SESSION_KEY_USER_ID));
		assign.setSupporterConnId(supporterSession.getId());
		assign.setSupporterId((String)supporterSession
				.getAttributes().get(Constant.WS_SESSION_KEY.SESSION_KEY_USER_ID));
		assignMapper.insert(assign);
	}
}
