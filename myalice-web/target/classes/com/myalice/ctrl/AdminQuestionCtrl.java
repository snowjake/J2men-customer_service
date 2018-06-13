package com.myalice.ctrl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import springfox.documentation.swagger2.annotations.EnableSwagger2;

import com.myalice.beans.CoolQMessage;
import com.myalice.beans.CoolQMessageType;
import com.myalice.beans.CoolQResponse;
import com.myalice.chat.ChatComposite;
import com.myalice.domain.ElasticsearchData;
import com.myalice.domain.TalkRecord;
import com.myalice.service.CoolQMessageService;
import com.myalice.services.ESQuestionService;
import com.myalice.services.TalkRecordService;
import com.myalice.utils.MyAliceUtils;
import com.myalice.utils.ResponseMessageBody;
import com.myalice.utils.Tools;

@RequestMapping("/admin/question")
@RestController
@EnableSwagger2
@Api(value = "系統問題接口", description = "J2men测试用", tags = "Swagger Test Control Tag")
public class AdminQuestionCtrl {

	@Autowired
	ApplicationContext context;

	@Autowired
	protected TalkRecordService talkRecordService;

	@Autowired
	protected CoolQMessageService coolQMessageService;

	@Autowired
	protected ESQuestionService esQuestionService;

	protected static Logger logger = org.slf4j.LoggerFactory.getLogger("ctrl");

	@ApiOperation(value = "聊天", response = CoolQResponse.class)
	@RequestMapping(path = "/pull", produces = "application/json; charset=UTF-8", method = { RequestMethod.GET,
			RequestMethod.POST })
	public CoolQResponse pull(HttpServletRequest request, @RequestBody CoolQMessage cqMessage) {
		CoolQResponse response = new CoolQResponse();
		try {
			if (Arrays.asList(2854196300L, 2854196306L).contains(cqMessage.getUser_id())) {
				response = new CoolQResponse();
				response.setAt_sender(false);
				return response;
			}
			ChatComposite composite = new ChatComposite(context, cqMessage);
			response = composite.chat();

			if (null == response) {
				response = new CoolQResponse();
				response.setAt_sender(false);
				return response;
			}

			if (cqMessage.isAnwser()) {
				String message = MyAliceUtils.trimQQ(cqMessage.getMessage());
				if (!org.apache.commons.lang3.StringUtils.isEmpty(message)) {
					TalkRecord record = new TalkRecord();
					record.setContent(message);
					record.setReply(response.getReply());
					record.setUserId(MyAliceUtils.toString(cqMessage.getUser_id()));
					record.setGroupId(MyAliceUtils.toString(cqMessage.getGroup_id()));
					record.setUserType("");
					record.setConnectionId(StringUtils.isEmpty(cqMessage.getAnswerId()) ? "" : cqMessage.getAnswerId());
					record.setQuestionId(StringUtils.isEmpty(cqMessage.getQuestionId())?"":cqMessage.getQuestionId());
					record.setCreateTime(Tools.currentDate());
					record.setReplyType(!cqMessage.isSearchData() ? 0 : 1);
					talkRecordService.insert(record);
				}
			}

			CoolQMessageType messageType = CoolQMessageType.getCoolQMessageType(cqMessage.getMessage_type());
			switch (messageType) {
			case PRIVATE:
				response.setAt_sender(true);
				break;
			case DISCUSS:
				response.setAt_sender(true);
				break;
			case GROUP:
				response.setAt_sender(true);
				response.setBan(false);
				response.setKick(false);
				break;
			}
		} catch (Exception e) {
			logger.error(" question es query ", e);
		}
		return response;
	}

	@ApiOperation(value = "獲取列表", response = ElasticsearchData.class)
	@RequestMapping("/list")
	public ElasticsearchData list(HttpServletRequest request) {
		String title = MyAliceUtils.toString(request.getParameter("title"));
		String id = MyAliceUtils.toString(request.getParameter("id"));
		int pageId = MyAliceUtils.toInt(request.getParameter("pageId"));
		ElasticsearchData searchData = new ElasticsearchData();
		try {
			BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();
			if (!StringUtils.isEmpty(title)) {
				queryBuilder.must(QueryBuilders.matchQuery("title", title));
			}

			if (!StringUtils.isEmpty(id)) {
				queryBuilder.must(QueryBuilders.idsQuery().addIds(id));
			}
			searchData.setBuilder(queryBuilder);

			searchData.setPageId(pageId);
			searchData.setSize(10);

			esQuestionService.query(searchData);
		} catch (Exception e) {
			logger.error(" question es query ", e);
		}
		return searchData;
	}

	@ApiOperation(value = "刪除數據", response = ResponseMessageBody.class)
	@PostMapping("/remove")
	public ResponseMessageBody remove(String id) {
		esQuestionService.remove(id);
		return new ResponseMessageBody("删除成功", true);
	}

	@ApiOperation(value = "添加數據", response = ResponseMessageBody.class)
	@PostMapping("/add")
	public ResponseMessageBody add(HttpServletRequest request, Authentication authentication) {
		String questionType = MyAliceUtils.toString(request.getParameter("questionType"));
		String question = MyAliceUtils.toString(request.getParameter("question"));

		String[] anwsers = request.getParameterValues("anwser[]");
		String id = MyAliceUtils.toString(request.getParameter("id"));
		Map<String, Object> questionMap = new HashMap<>();
		questionMap.put("title", question);
		questionMap.put("state", 1);
		questionMap.put("id", id);
		questionMap.put("questionType", questionType);
		questionMap.put("create_user", authentication.getName());
		questionMap.put("create_date", Tools.currentDate());

		esQuestionService.addQuestions(questionMap, anwsers);
		return new ResponseMessageBody("保存成功", true);
	}

	@ApiOperation(value = "根據ID加載數據", response = Map.class)
	@PostMapping("load")
	public Map<String, Object> load(String id) {
		Map<String, Object> map = esQuestionService.get(id);
		List<Map<String, Object>> anwser = esQuestionService.queryAnswer(QueryBuilders.matchQuery("question_id", id));
		map.put("anwser", anwser);
		map.put("question_id", id);
		return map;
	}

	@ApiOperation(value = "根據ID刪除數據", response = ResponseMessageBody.class)
	@PostMapping("delete")
	public ResponseMessageBody delete(String id) {

		try {
			List<Map<String, Object>> queryAnswer = esQuestionService
					.queryAnswer(QueryBuilders.matchQuery("question_id", id));
			queryAnswer.forEach(v -> {
				String answerId = MyAliceUtils.toString(v.get("id"));
				esQuestionService.getAnwserEsService().remove(answerId);
			});
			esQuestionService.getQuestionEsService().remove(id);
		} catch (Exception e) {
		}

		return new ResponseMessageBody("删除成功", true);
	}
}