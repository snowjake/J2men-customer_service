package com.myalice.es;

import java.util.List;
import java.util.Map;

import org.elasticsearch.index.query.QueryBuilder;

import com.myalice.domain.ElasticsearchData;

public interface IElasticsearch {
	
	public boolean add(Map<String, Object> data);

	public boolean adds(List<Map<String, Object>> datas);

	public boolean remove(String id);

	public boolean removes(String... ids);
	
	public void query(ElasticsearchData searchData);
	
	
	public Map<String,Object> get(String id );
	
	
	public  List<Map<String, Object>>  queryList(QueryBuilder builder) ;
}
