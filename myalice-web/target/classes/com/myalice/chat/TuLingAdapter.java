package com.myalice.chat;

import java.util.Map;

import org.springframework.context.ApplicationContext;

import com.myalice.beans.CoolQMessage;
import com.myalice.beans.CoolQResponse;
import com.myalice.party.BranchTuling;
import com.myalice.party.InterBus.BusType;
import com.myalice.util.ParseJson;
import com.myalice.utils.MyAliceUtils;

public class TuLingAdapter extends ChatAdapter {

	protected ApplicationContext context;

	public TuLingAdapter(ApplicationContext context) {
		this.context = context;
	}
	
	@Override
	public boolean isThisChat(String message,String[]qqs) {
		return false;
	}

	@Override
	public CoolQResponse chat(CoolQMessage message) {
		CoolQResponse response = new CoolQResponse() ; 
		
		String json = BranchTuling.getBus( BusType.TULING ).call( message.getMessage() );
		Map<String, Object> jsonMap = ParseJson.parseToObj(json);
		String text = MyAliceUtils.toString(jsonMap.get("text"));
		response.setAt_sender(true);
		response.setReply( text.replaceAll("图灵", "Myalice") ) ;
		
		return response;
	}

}
