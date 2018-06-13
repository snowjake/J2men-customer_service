package com.myalice.chat;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.context.ApplicationContext;

import com.myalice.beans.CoolQMessage;
import com.myalice.beans.CoolQResponse;
import com.myalice.domain.TalkRecord;
import com.myalice.services.ESQuestionService;
import com.myalice.services.TalkRecordService;
import com.myalice.utils.MyAliceUtils;

public class ElasticsearchAnswerAdapter extends ChatAdapter {

	protected ApplicationContext context;

	public ElasticsearchAnswerAdapter(ApplicationContext context) {
		this.context = context;
	}

	@Override
	public boolean isThisChat(String message, String[] qqs) {
		
		return true;
	}

	@Override
	public CoolQResponse chat(CoolQMessage message) {
		CoolQResponse response = new CoolQResponse();
		response.setAt_sender(true);

		if (StringUtils.isEmpty(message.getMessage())) {
			response.setReply("有什么可以帮助你的?");
			return response;
		}
		message.setAnwser(true);
		ESQuestionService esQuestionService = context.getBean(ESQuestionService.class);
		String messageStr = MyAliceUtils.trimQQ(message.getMessage()).trim();
		
		if(StringUtils.equalsAny(messageStr, "下一个" , "下一个答案")){
			TalkRecordService talkRecordService = context.getBean(TalkRecordService.class );
			TalkRecord select = talkRecordService.selectLastAsk(MyAliceUtils.toString(message.getGroup_id()), 
					MyAliceUtils.toString( message.getUser_id()) , 1) ;
			if(null == select || StringUtils.isEmpty(select.getQuestionId())){
				response.setReply( "没有更多答案" );
				return response;
			}
			String questionId = select.getQuestionId() ; 
			List<Map<String, Object>> answers = esQuestionService.queryAnswer( QueryBuilders.matchQuery("question_id", questionId) ) ;
			int size = null == answers ? 0 : answers.size() ;
			SecureRandom random = new SecureRandom();
			int nextInt = random.nextInt(size) ;
			message.setSearchData( false );
			message.setAnwser( false); 
			try {
				Map<String, Object> answer = answers.get( nextInt );
				response.setReply( warp(answer) ); 
			} catch (Exception e) {
			}
			return response; 
		}
		
		Map<String, Object> answer = esQuestionService.searchAnswer(messageStr);
		if (null != answer) {
			message.setQuestionId(  MyAliceUtils.toString(answer.get("question_id")) ) ; 
			message.setAnswerId(  MyAliceUtils.toString(answer.get("id")) ) ;
			message.setSearchData( true );
			response.setReply( warp(answer) ); 
			return response;
		} else {
			message.setSearchData( false );
			message.setQuestionId( "" ) ; 
			message.setAnswerId( "" ) ;
			response.setReply("很抱歉，我还不知道答案 你可以教我 我会更聪明哦");
			return response;
		}
	}
	

	protected String warp( Map<String, Object> answer ){
		if(null == answer){
			return StringUtils.EMPTY ;
		}
		
		String anwser = MyAliceUtils.toString(answer.get("anwser"));
		
		String user = StringUtils.equalsAny("1", MyAliceUtils.toString(answer.get("state")) ) ? "J2men"
				:  MyAliceUtils.toString(answer.get("create_user")) + " 仅供参考" ;
		user = user.replaceAll("719867650", "Leader-us") ; 
		
		String ext = MyAliceUtils.toString( answer.get("ext") ) ;
		ext = StringUtils.isEmpty(ext)?StringUtils.EMPTY : StringUtils.LF + ext ;
		
		return anwser + " by：" + user
				+ ext  ;
	}
	
}
