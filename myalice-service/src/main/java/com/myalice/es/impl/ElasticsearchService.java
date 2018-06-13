package com.myalice.es.impl;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Vector;
import java.util.stream.Stream;

import org.apache.commons.lang3.math.NumberUtils;
import org.elasticsearch.action.ActionFuture;
import org.elasticsearch.action.admin.indices.analyze.AnalyzeAction;
import org.elasticsearch.action.admin.indices.analyze.AnalyzeRequestBuilder;
import org.elasticsearch.action.admin.indices.analyze.AnalyzeResponse;
import org.elasticsearch.action.admin.indices.analyze.AnalyzeResponse.AnalyzeToken;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.IndicesAdminClient;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.rest.RestStatus;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.util.StringUtils;

import com.myalice.config.ElasticsearchProporties;
import com.myalice.domain.ElasticsearchData;
import com.myalice.es.IElasticsearch;
import com.myalice.utils.MyAliceUtils;
import com.myalice.utils.Tools;

public class ElasticsearchService implements IElasticsearch {

	protected String index;

	protected String type;

	protected ElasticsearchProporties elasticsearchProporties;

	public ElasticsearchService() {
	}

	public ElasticsearchService(String index, String type) {
		this.index = index;
		this.type = type;
	}

	public List<AnalyzeToken> ik(String text) {
		try {
			TransportClient client = elasticsearchProporties.createTransportClient();
			IndicesAdminClient indices = client.admin().indices() ;
			AnalyzeRequestBuilder requestBuilder = new AnalyzeRequestBuilder(indices,AnalyzeAction.INSTANCE, index, text) ;
			
			requestBuilder.setAnalyzer("ik_max_word"); 
			
			ActionFuture<AnalyzeResponse> execute = requestBuilder.execute();
			
			AnalyzeResponse actionGet = execute.actionGet(); 
			
			List<AnalyzeToken> tokens = actionGet.getTokens();
			return tokens;
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		}
	}

	public List<Map<String, Object>> sort(List<Map<String, Object>> datas, String text) {
		List<AnalyzeToken> textTokens = ik(text);
		for (Map<String, Object> data : datas) {
			String title = MyAliceUtils.toString(data.get("title"));
			List<AnalyzeToken> titleTokens = ik(title);
			int sameInt = 0;
			for (AnalyzeToken titleToken : titleTokens) {
				for (AnalyzeToken textToken : textTokens) {
					if (MyAliceUtils.toString( titleToken.getTerm()).equalsIgnoreCase(textToken.getTerm())) {
						sameInt++;
					}else if (MyAliceUtils.toString(titleToken.getTerm()).indexOf(textToken.getTerm()) > -1){
						sameInt++;
					}
				}
			}
			data.put("tokenSameCount", sameInt);
		}

		Collections.sort(datas, (v1, v2) -> {
			int tokenSameCount1 = NumberUtils.toInt(MyAliceUtils.toString(v1.get("tokenSameCount")));
			int tokenSameCount2 = NumberUtils.toInt(MyAliceUtils.toString(v2.get("tokenSameCount")));
			if (tokenSameCount1 == tokenSameCount2) {
				return 0;
			}
			if (tokenSameCount1 > tokenSameCount2) {
				return -1;
			}
			return 1;
		});
		return datas;
	}

	@Override
	public boolean add(Map<String, Object> data) {
		TransportClient client = elasticsearchProporties.createTransportClient();
		String id = MyAliceUtils.toString(data.get("id"));
		if (StringUtils.isEmpty(id)) {
			id = Tools.uuid();
		}
		IndexResponse actionGet = client.prepareIndex(index, type, id).setSource(data).execute().actionGet();
		data.put("id", id);
		return actionGet.status() == RestStatus.OK;
	}

	@Override
	public boolean adds(List<Map<String, Object>> datas) {
		datas.forEach(data -> add(data));
		return true;
	}

	@Override
	public Map<String, Object> get(String id) {
		TransportClient client = elasticsearchProporties.createTransportClient();
		GetResponse actionGet = client.prepareGet(index, type, id).execute().actionGet();

		return actionGet.getSource();
	}

	@Override
	public boolean remove(String id) {
		TransportClient client = elasticsearchProporties.createTransportClient();
		DeleteResponse actionGet = client.prepareDelete(index, type, id).execute().actionGet();
		return actionGet.status() == RestStatus.OK;
	}

	@Override
	public boolean removes(String... ids) {
		Stream.of(ids).forEach(id -> remove(id));
		return true;
	}

	@Override
	public void query(ElasticsearchData searchData) {
		TransportClient client = elasticsearchProporties.createTransportClient();

		SearchRequestBuilder requestBuilder = client.prepareSearch(index).setTypes(type)
				.setSearchType(SearchType.DFS_QUERY_THEN_FETCH).setFrom(searchData.getFrom())
				.setSize(searchData.getSize());
		requestBuilder.addSort("create_date" , SortOrder.DESC) ;
		if (null != searchData.getBuilder()) {
			requestBuilder.setQuery(searchData.getBuilder());
		}
		SearchResponse response = requestBuilder.execute().actionGet();
		SearchHits hits = response.getHits();
		searchData.setDocCount(hits.getTotalHits());
		List<Map<String, Object>> docs = new Vector<>();
		for (SearchHit hit : hits.getHits()) {
			Map<String, Object> source = hit.getSourceAsMap();
			source.put("id", hit.getId());
			String dateStr = MyAliceUtils.toString(source.get("create_date"));
			try {
				String newDateStr = dateStr.substring(0 , 10) ;
				newDateStr += " " + dateStr.substring(11 , 19) ;
				source.put("createDateStr", newDateStr);
			} catch (Exception e) {
				source.put("createDateStr", dateStr); 
			}
			docs.add(source);
		}
		searchData.setDocs(docs);
	}

	@Override
	public List<Map<String, Object>> queryList(QueryBuilder builder) {
		TransportClient client = elasticsearchProporties.createTransportClient();
		SearchRequestBuilder requestBuilder = client.prepareSearch(index).setTypes(type).setFrom(0).setSize(5)
				.setSearchType(SearchType.DFS_QUERY_THEN_FETCH);
		requestBuilder.setQuery(builder);
		SearchResponse response = requestBuilder.execute().actionGet();
		SearchHits hits = response.getHits();
		List<Map<String, Object>> docs = new Vector<>();
		for (SearchHit hit : hits.getHits()) {
			if(hit.getScore() > 0.15){
				Map<String, Object> source = hit.getSourceAsMap();
				source.put("id", hit.getId());
				docs.add(source);
			}
		}
		return docs;
	}

	public String getIndex() {
		return index;
	}

	public ElasticsearchProporties getElasticsearchProporties() {
		return elasticsearchProporties;
	}

	public void setElasticsearchProporties(ElasticsearchProporties elasticsearchProporties) {
		this.elasticsearchProporties = elasticsearchProporties;
	}

	public void setIndex(String index) {
		this.index = index;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}
