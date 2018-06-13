package org.hp;

import java.util.HashMap;
import java.util.Map;

import org.apache.http.HttpResponse;
import org.hp.client.SpiderHttp;
import org.hp.client.SpiderHttpFactory;
import org.hp.client.TextResponseHandler;
import org.hp.client.views.TextView;

import com.alibaba.fastjson.JSON;

public class ESClient21 {

	public static void main(String[] args) throws Exception {

		String uri = "http://127.0.0.1:8080/admin/question/pull";

		Map<String, String> paramMap = new HashMap<>();
		paramMap.put("group_id", "0");
		paramMap.put("user_id", "834865081");
		// paramMap.put("message", "[CQ:at,qq=834865081]建议答案：大家都好");
		// 	paramMap.put("message", "[CQ:at,qq=834865081]补充:全世界人民都很好");
		paramMap.put("message", "你好");
		paramMap.put("message_type", "discuss");
		SpiderHttp spiderHttp = SpiderHttpFactory.createFactory();

		HttpResponse response = spiderHttp.postBody(uri, JSON.toJSONString(paramMap));

		TextResponseHandler handler = new TextResponseHandler(spiderHttp, response);
		TextView process = handler.process();
		System.out.println(process.getValue());
	}
}
