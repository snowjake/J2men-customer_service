package com.myalice.domain;

import java.util.List;
import java.util.Map;

import org.elasticsearch.index.query.QueryBuilder;
import org.springframework.util.CollectionUtils;

public class ElasticsearchData {

	private long docCount;

	private List<Map<String, Object>> docs;

	private QueryBuilder builder;

	private String index;
	
	private int from ;
	private int pageId ;
	private int size ;

	private String type;
	
	public int getFrom() {
		pageId = pageId < 1 ? 1 : pageId ;
		from = (pageId-1) * size ;
		return from;
	}

	public int getSize() {
		return size;
	}


	public int getPageId() {
		return pageId;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public void setPageId(int pageId) {
		this.pageId = pageId;
	}
	public long getDocCount() {
		
		docCount = docCount > 10000 ? 10000 : docCount;
		
		return docCount;
	}

	public void setDocCount(long docCount) {
		this.docCount = docCount;
	}

	public Map<String, Object> getDoc() {
		return CollectionUtils.isEmpty(docs) ? null : docs.get(0);
	}

	public List<Map<String, Object>> getDocs() {
		return docs;
	}

	public QueryBuilder getBuilder() {
		return builder;
	}
	
	public void setBuilder(QueryBuilder builder) {
		this.builder = builder;
	}

	public void setDocs(List<Map<String, Object>> docs) {
		this.docs = docs;
	}

	public String getIndex() {
		return index;
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
