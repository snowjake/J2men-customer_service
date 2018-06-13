package com.myalice.services.elasticsearch;


import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryStringQueryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myalice.domain.Elasticsearch;

@Service
public class ESQuestionOrderService {
    static Logger logger = LoggerFactory.getLogger(ESQuestionOrderService.class);

    @Autowired(required = false)
    TransportClient client;
    

    public void createIndex(Elasticsearch es) {
        IndexResponse create = client.prepareIndex(es.getIndex(), es.getType(), es.getId()).setSource(es.getData()).execute().actionGet();
        logger.debug("[索引创建]  [{}]", create.status());
        client.close();
    }

    public void findQuestionOrderByVague(String vague) {
        SearchRequestBuilder builder =  client.prepareSearch();
        QueryBuilder queryBuilder = new QueryStringQueryBuilder(vague);
        //QueryBuilder queryBuilder = new QueryBuilder();
        builder.setQuery(queryBuilder);
        System.out.println(builder.get());
        
        client.close();
    }

}