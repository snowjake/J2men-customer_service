package com.myalice.chat;

import java.util.List;
import java.util.Vector;

import org.springframework.context.ApplicationContext;

import com.myalice.beans.CoolQMessage;
import com.myalice.beans.CoolQResponse;
import com.myalice.services.SysDictionariesService;
import com.myalice.utils.MyAliceUtils;

public class ChatComposite {

	protected ApplicationContext context;

	protected CoolQMessage cqMessage;

	protected List<ChatAdapter> adapters = new Vector<ChatAdapter>();

	public ChatComposite(ApplicationContext context, CoolQMessage cqMessage) {
		this.context = context;
		this.cqMessage = cqMessage;
		String message = cqMessage.getMessage();
		message = message.replaceAll("@机器猫", "");
		cqMessage.setMessage(message);

		adapters.add(new InputAnswerAdapter(context));
		adapters.add(new ElasticsearchAnswerAdapter(context));
		adapters.add(new TuLingAdapter(context));
	}

	public CoolQResponse chat() {
		String msgInfo = cqMessage.getMessage() ;
		String[] qqs = MyAliceUtils.parseQqs( msgInfo ) ; 
		
		SysDictionariesService dictionariesService = context.getBean( SysDictionariesService.class ) ;
		
		String[] findQQ = dictionariesService.findQQ( qqs ) ; 
		
		for (ChatAdapter adapter : adapters) {
			if (adapter.isThisChat(msgInfo , findQQ)) {
				return adapter.chat(cqMessage);
			}
		}
		return null;
	}
}
