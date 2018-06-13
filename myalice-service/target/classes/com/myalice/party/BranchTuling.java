package com.myalice.party;

import java.util.HashMap;
import java.util.Map;

import org.apache.http.HttpResponse;
import org.hp.client.SpiderHttp;
import org.hp.client.SpiderHttpFactory;
import org.hp.client.TextResponseHandler;

import com.alibaba.fastjson.JSON;

public class BranchTuling extends InterBus{
	
	
	String apiKey = "8eb2b8c12c8a4cf58daa5af41a68bb06" ; 
	
	@Override
	public String call(String info) {
		Map<String,String> outInfoMap = new HashMap<String,String>();
		outInfoMap.put("key", apiKey);
		outInfoMap.put("info", info ); 
		SpiderHttp spiderHttp = SpiderHttpFactory.createFactory();
		
		HttpResponse response = spiderHttp.postBody("http://www.tuling123.com/openapi/api",
				JSON.toJSONString(outInfoMap) );
		
		TextResponseHandler handler = new TextResponseHandler(spiderHttp, response);
		
		return handler.process().getValue();
	}
}
