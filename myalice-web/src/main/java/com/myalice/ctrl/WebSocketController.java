package com.myalice.ctrl;

import io.swagger.annotations.Api;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import springfox.documentation.swagger2.annotations.EnableSwagger2;

import com.alibaba.fastjson.JSON;
import com.myalice.beans.Message;
import com.myalice.beans.Response;
import com.myalice.domain.TalkRecord;
import com.myalice.services.ESQuestionService;
import com.myalice.services.TalkRecordService;
import com.myalice.utils.MyAliceUtils;
import com.myalice.utils.Tools;

@Controller
@EnableSwagger2
@Api(value = "WebSocker接口", description = "J2men测试用", tags = "Swagger Test Control Tag")
public class WebSocketController {
	
	@Autowired
	protected SimpMessagingTemplate messagingTemplate;
	
	@Autowired
	protected ESQuestionService questionService ;
	
	@Autowired
	protected TalkRecordService talkRecordService;
	
	@MessageMapping("/welcome")
	@SendTo("/topic/getResponse")
	public Response say(Message message) throws Exception {
		Thread.sleep(1000);
		return new Response("Welcome, " + message.getName() + "!");
	}

	@MessageMapping("/chat")
	// 在springmvc 中可以直接获得principal,principal 中包含当前用户的信息
	public void handleChat(Principal principal, Message message) {
		
		Map<String, Object> answer = questionService.searchAnswer(message.getName()) ;
		TalkRecord record = new TalkRecord();
		{
			Map<String,Object> responseMsg = new HashMap<>() ;
			responseMsg.put("date", Tools.currentDate());
			responseMsg.put("clazz", "even");
			responseMsg.put("name", principal.getName() ); 
			responseMsg.put("anwser", message.getName());
			record.setContent( message.getName() ); ;
			messagingTemplate.convertAndSendToUser(principal.getName()
					, "/queue/notifications",JSON.toJSONStringWithDateFormat(responseMsg, "MM-dd HH:mm") );
		}
		record.setUserId(principal.getName());
		record.setUserType("");
		record.setConnectionId("");
		Map<String,Object> responseMsg = new HashMap<>() ;
		responseMsg.put("date", Tools.currentDate());
		responseMsg.put("clazz", "odd");
		responseMsg.put("name", "系统管理员" );
		if(null != answer){
			record.setReplyType(1);
			responseMsg.put("anwser", answer.get("anwser"));
		}else{
			record.setReplyType(0);
			responseMsg.put("anwser", "请重新描述您的问题");
		}
		
		record.setReply( MyAliceUtils.toString(responseMsg.get("anwser")));
		
		talkRecordService.insert( record ); 
		
		messagingTemplate.convertAndSendToUser(principal.getName()
				, "/queue/notifications",JSON.toJSONStringWithDateFormat(responseMsg, "MM-dd HH:mm") );   
		
	}
}
