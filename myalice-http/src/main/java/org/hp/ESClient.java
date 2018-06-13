package org.hp;

import com.alibaba.fastjson.JSON;
import org.apache.http.HttpResponse;
import org.hp.client.SpiderHttp;
import org.hp.client.SpiderHttpFactory;
import org.hp.client.TextResponseHandler;
import org.hp.client.views.TextView;
import org.hp.util.JsonHandler;

import java.util.HashMap;
import java.util.Map;

public class ESClient {

    public static void main(String[] args) throws Exception {

        String uri = "http://127.0.0.1:9200/myalice/q/5";
        System.out.println("===============================");
        SpiderHttp spiderHttp = SpiderHttpFactory.createFactory();
        Map<String, String> jsonMap = new HashMap<String, String>();
        jsonMap.put("message", "Mycat如何配置一个分表在一个数据库里？");
        jsonMap.put("content", "从mysql开始");
        HttpResponse response = spiderHttp.postBody(uri, JSON.toJSONString(jsonMap));

        TextResponseHandler handler = new TextResponseHandler(spiderHttp, response);
        TextView process = handler.process();
        System.out.println(process.getValue());

        // get
        String qUri = "http://127.0.0.1:9200/myalice/q/_search";
        SpiderHttp spiderHttp2 = SpiderHttpFactory.createFactory();
        Map<String, Object> jsonMap2 = new HashMap<String, Object>();
        Map<String, Object> matchMap2 = new HashMap<String, Object>();
        Map<String, Object> contentMap2 = new HashMap<String, Object>();
        jsonMap2.put("query", matchMap2);
        matchMap2.put("match", contentMap2);
        contentMap2.put("message", "如何处理");
        HttpResponse response2 = spiderHttp2.postBody(qUri, JSON.toJSONString(jsonMap2));
        TextResponseHandler handler2 = new TextResponseHandler(spiderHttp2, response2);
        TextView process2 = handler2.process();
        System.out.println(JsonHandler.parseObject(process2.getValue()));
    }
}
