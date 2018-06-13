package com.myalice.utils;

import java.util.Map;

public class ResponseMessageBody {
	
	protected String msg ; 
	
	protected boolean suc ;
	
	protected Map<String,String> msgMap ;
	
	
	public ResponseMessageBody() {
	}

	public ResponseMessageBody(String msg, boolean suc) {
		this.msg = msg;
		this.suc = suc;
	}

	public String getMsg() {
		return msg;
	}
	public Map<String, String> getMsgMap() {
		return msgMap;
	}

	public void setMsgMap(Map<String, String> msgMap) {
		this.msgMap = msgMap;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public boolean isSuc() {
		return suc;
	}

	public void setSuc(boolean suc) {
		this.suc = suc;
	}
	
}