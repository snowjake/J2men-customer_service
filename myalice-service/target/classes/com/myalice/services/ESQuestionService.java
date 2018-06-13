package com.myalice.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.ArrayUtils;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.myalice.config.ElasticsearchProporties;
import com.myalice.domain.ElasticsearchData;
import com.myalice.es.impl.ElasticsearchService;
import com.myalice.utils.MyAliceUtils;
import com.myalice.utils.Tools;

@Service
public class ESQuestionService {

	protected ElasticsearchService questionEsService;
	protected ElasticsearchService anwserEsService;

	public ESQuestionService(ElasticsearchProporties elasticsearchProporties) {
		questionEsService = new ElasticsearchService("myalice", "question");
		questionEsService.setElasticsearchProporties(elasticsearchProporties);

		anwserEsService = new ElasticsearchService("myalice", "question");//es 6.x版本不支持多个type创建 所以type设为一样  之前是anwser
		anwserEsService.setElasticsearchProporties(elasticsearchProporties);
	}

	public void addQuestion(Map<String, Object> question, Map<String, Object> anwser) {

		String id = MyAliceUtils.toString(question.get("id"));

		if (!StringUtils.isEmpty(id)) {
			List<Map<String, Object>> queryAnswer = queryAnswer(QueryBuilders.matchQuery("question_id", id));
			queryAnswer.forEach(v -> {
				String answerId = MyAliceUtils.toString(v.get("id"));
				anwserEsService.remove(answerId);
			});
		}

		questionEsService.add(question);
		anwser.put("question_id", question.get("id"));
		anwserEsService.add(anwser);
	}

	
	public void addQuestions(Map<String, Object> question, String[]anwsers) {

		String id = MyAliceUtils.toString(question.get("id"));

		if (!StringUtils.isEmpty(id)) {
			List<Map<String, Object>> queryAnswer = queryAnswer(QueryBuilders.matchQuery("question_id", id));
			queryAnswer.forEach(v -> {
				String answerId = MyAliceUtils.toString(v.get("id"));
				anwserEsService.remove(answerId);
			});
		}

		questionEsService.add(question);
		if(ArrayUtils.isNotEmpty(anwsers)){
			for(String anwser:anwsers){
				Map<String,Object> anwserMap = new HashMap<>() ;
				anwserMap.put("anwser", anwser); 
				anwserMap.put("create_time", Tools.currentDate()); 
				anwserMap.put("source", 0 ) ;
				anwserMap.put("question_id", question.get("id"));
				anwserEsService.add(anwserMap);
			}
		}
	}
	
	public boolean add(Map<String, Object> data) {
		return questionEsService.add(data);
	}

	public boolean remove(String id) {
		return questionEsService.remove(id);
	}

	public void query(ElasticsearchData searchData) {
		questionEsService.query(searchData);
	}

	public Map<String, Object> get(String id) {
		return questionEsService.get(id);
	}

	public List<Map<String, Object>> queryAnswer(QueryBuilder builder) {
		List<Map<String, Object>> datas = anwserEsService.queryList(builder);
		return datas;
	}

	public Map<String, Object> queryAnswerOne(String id) {
		List<Map<String, Object>> datas = anwserEsService.queryList(QueryBuilders.matchQuery("question_id", id));
		return CollectionUtils.isEmpty(datas) ? null : datas.get(0);
	}

	/**
	 * @desc:根据问题搜索对应答案方法
	 * @param: question
	 *             问题内容
	 * @return Map<String, Object> anwser 答案内容 create_time 创建日期 question_id 问题id
	 *         id 答案id source 评分
	 */
	public Map<String, Object> searchAnswer(String question) {
		List<Map<String, Object>> datas = questionEsService.queryList(QueryBuilders.boolQuery()
				.must(QueryBuilders.matchQuery("title", question)).must(QueryBuilders.matchQuery("state", 1)));

		if (CollectionUtils.isEmpty(datas)) {
			datas = questionEsService.queryList(QueryBuilders.boolQuery()
					.must(QueryBuilders.matchQuery("title", question)).must(QueryBuilders.matchQuery("state", 2)));
		}

		if (!CollectionUtils.isEmpty(datas)) {
			questionEsService.sort(datas, question);
			Map<String, Object> data = datas.get(0);
			String id = MyAliceUtils.toString(data.get("id"));
			List<Map<String, Object>> answers = queryAnswer(
					QueryBuilders.boolQuery().must(QueryBuilders.matchQuery("question_id", id)));
			
			if (!CollectionUtils.isEmpty(answers)) {
				Map<String, Object> map = answers.get(0);
				map.put("state", data.get("state")); 
				map.put("create_user", data.get("create_user")); 
				return map; 
			}
		}
		return null;
	}

	public ElasticsearchService getQuestionEsService() {
		return questionEsService;
	}

	public ElasticsearchService getAnwserEsService() {
		return anwserEsService;
	}

}
