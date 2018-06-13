package com.myalice.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.myalice.beans.CoolQMessage;
import com.myalice.beans.CoolQResponse;
import com.myalice.domain.TalkRecord;
import com.myalice.party.BranchTuling;
import com.myalice.party.InterBus.BusType;
import com.myalice.services.ESQuestionService;
import com.myalice.services.SysDictionariesService;
import com.myalice.services.TalkRecordService;
import com.myalice.util.ParseJson;
import com.myalice.utils.MyAliceUtils;
import com.myalice.utils.Tools;

@Service
public class CoolQMessageService {
	
	Logger log = LoggerFactory.getLogger("myalice");
	
	@Autowired
	protected ESQuestionService esQuestionService;

	@Autowired
	protected TalkRecordService talkRecordService;
	
	@Autowired
	protected SysDictionariesService dictionariesService ;

	public CoolQResponse getMessageType(CoolQMessage cqMessage) {
		String message = MyAliceUtils.trimQQ(cqMessage.getMessage()).trim();
		message = message.replaceAll("@机器猫", "");
		String[] qqs = MyAliceUtils.parseQqs(cqMessage.getMessage());
		qqs = dictionariesService.findQQ( qqs ) ;  
		CoolQResponse response = new CoolQResponse();
		/* 如果没有AT其他QQ号，则是认为是提问 */
		if (ArrayUtils.isEmpty(qqs)) {
			cqMessage.setSearchData( searchAnswer(message, response) );
		} else {
			TalkRecord talkRecord = talkRecordService.selectLastAsk(MyAliceUtils.toString(cqMessage.getGroup_id()),
					MyAliceUtils.toString( qqs[0] )  , 0);
			if (null == talkRecord) {
				String json = BranchTuling.getBus( BusType.TULING ).call( message );
				Map<String, Object> jsonMap = ParseJson.parseToObj(json);
				String text = MyAliceUtils.toString(jsonMap.get("text"));
				text.replaceAll("图灵", "Myalice");
				response.setReply( text ) ;
			} else {
				cqMessage.setAnwser( false ); 
				List<Map<String, Object>> datas = esQuestionService.getQuestionEsService().queryList(QueryBuilders.boolQuery().must(QueryBuilders.termQuery("talkId", talkRecord.getId()))) ;
				if(CollectionUtils.isEmpty(datas)){
					Map<String, Object> questionMap = new HashMap<>();
					questionMap.put("title", talkRecord.getContent());
					questionMap.put("state", 2);
					questionMap.put("questionType", 1);
					questionMap.put("create_user", cqMessage.getUser_id() );
					questionMap.put("talkId", talkRecord.getId());
					questionMap.put("create_date", Tools.currentDate());
					message = message.replaceAll("建议答案", "") ;  
					if(StringUtils.startsWithAny(message, "：" , ":")){
						message = message.substring(1) ;
					}
					Map<String,Object> anwserMap = new HashMap<>() ;
					anwserMap.put("anwser", message); 
					anwserMap.put("create_time", Tools.currentDate()); 
					anwserMap.put("create_user", cqMessage.getUser_id()) ;
					anwserMap.put("source", 0 ) ;
					esQuestionService.addQuestion(questionMap, anwserMap) ; 
				}else{
					Map<String, Object> question = datas.get(0) ;
					Map<String,Object> anwserMap = new HashMap<>() ;
					message = message.replaceAll("建议答案", "") ;  
					if(StringUtils.startsWithAny(message, "：" , ":")){
						message = message.substring(1) ;
					} 
					anwserMap.put("anwser", message); 
					anwserMap.put("create_time", Tools.currentDate()); 
					anwserMap.put("create_user", cqMessage.getUser_id()) ; 
					anwserMap.put("source", 0 ) ;
					anwserMap.put("question_id", question.get("id"));
					esQuestionService.getAnwserEsService().add( anwserMap ) ; 
				}
				response.setReply("非常感谢您的回答");
				
			}
		}
		return response;
	}
	
	private boolean searchAnswer(String message, CoolQResponse response) {
		if(StringUtils.isEmpty(message)){
			response.setReply("有什么可以帮助你的?") ; 
			return true ;
		}
		Map<String, Object> answer = esQuestionService.searchAnswer(message);
		if (null != answer) {
			String anwser = MyAliceUtils.toString(answer.get("anwser")) ;
			
			String user=StringUtils.equalsAny("1", MyAliceUtils.toString(answer.get("state"))) ? "MyCat官方"
					:MyAliceUtils.toString(answer.get("create_user") + " 仅供参考") ;
			
			response.setReply( anwser + " 来源：" + user) ;
			return true ;
		} else {
			response.setReply("很抱歉，我还不知道答案 群里知道此问题答案的请 @机器猫 @提问者 建议答案：xxxxx") ; 
			return false ;
		}
	}
}