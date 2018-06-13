package org.myalice.websocket.message;

import java.util.List;
import java.util.Map;

import org.myalice.websocket.Util;

public class Message {
	
	public static final String CONTENT_KEY_SESSIONID = "sessionId";
	
	public static final String CONTENT_KEY_TALK_CONTENT = "talkContent";
	
	public static final String CONTENT_KEY_USERNAME = "userName";
	
	public static final String CONTENT_KEY_USERLOGO = "userLogo";
	
	Message() {
		this.time = Util.getDayTimeString();
	}
	
	private String type;
	
	private String time;
	
	private Map<String, String> content;
	
	private List<SimpleTalk> history;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Map<String, String> getContent() {
		return content;
	}

	public void setContent(Map<String, String> content) {
		this.content = content;
	}

	public List<SimpleTalk> getHistory() {
		return history;
	}

	public void setHistory(List<SimpleTalk> history) {
		this.history = history;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}
}
