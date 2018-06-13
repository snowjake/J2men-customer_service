package com.myalice.chat;

import com.myalice.beans.CoolQMessage;
import com.myalice.beans.CoolQResponse;

public abstract class ChatAdapter {
	
	
	public abstract boolean isThisChat(String message,String[]qqs);
	
	public abstract CoolQResponse chat(CoolQMessage message);
	
}
