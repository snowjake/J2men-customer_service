package com.alice;

import com.alibaba.fastjson.JSON;
import com.myalice.MyAliceSpringConfig;
import com.myalice.domain.Elasticsearch;
import com.myalice.domain.QuestionOrder;
import com.myalice.services.elasticsearch.ESQuestionOrderService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.UUID;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT)
@ContextConfiguration( classes = MyAliceSpringConfig.class )
public class ESQuestionOrderServiceTest {

    @Autowired
    ESQuestionOrderService service;

    @Test
     public void create(){
        Elasticsearch es = new Elasticsearch();
        es.setId(UUID.randomUUID().toString());
        es.setIndex("alice");
        es.setType("questionOrder");
        QuestionOrder questionOrder = new QuestionOrder();
        questionOrder.setQuestionContent("你猜猜我是谁");
        questionOrder.setQuestionSummary("不猜");
        questionOrder.setQuestionType((byte)0);
        questionOrder.setState((byte)0);
        es.setData(JSON.toJSONString(questionOrder));
        service.createIndex(es);
     }

    @Test
    public void search(){
        service.findQuestionOrderByVague("什么");
    }

}
