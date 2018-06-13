package com.myalice.util;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import org.json.JSONArray;
import org.json.JSONObject;

import com.alibaba.fastjson.JSON;
import com.myalice.utils.MyAliceUtils;

public class ParseJson {

	public static List<Map<String, Object>> parseToList(String json) {
		JSONArray jsonArray = null;
		try {
			jsonArray = new JSONArray(json);
		} catch (Exception e) {
		}
		return parseToMaps(jsonArray);
	}

	public static Map<String, Object> parseToObj(String json) {
		JSONObject jSONObject = null;
		try {
			jSONObject = new JSONObject(json);
		} catch (Exception e) {
		}
		return parseToMap(jSONObject);
	}

	public static Map<String, Object> parseToMap(JSONObject obj) {
		Map<String, Object> map = new HashMap<String, Object>() ;
		if(null == obj){
			return map ;
		}
		try {
			for (Iterator<?> iterator = obj.keys(); iterator.hasNext();) {
				String key = MyAliceUtils.toString(iterator.next());
				Object data = obj.get(key);
				if (data instanceof JSONArray) {
					map.put(key, parseToMapsObj((JSONArray) data));
				} else if (data instanceof JSONObject) {
					map.put(key, parseToMap((JSONObject) data));
				} else {
					map.put(key, MyAliceUtils.toString(data));
				}
			}
		} catch (Exception e) {
		}
		return map;
	}
	
	
	public static List<Object> parseToMapsObj(JSONArray jsonArray) {
		List<Object> maps = new Vector<Object>();
		if(null == jsonArray){
			return maps ;
		}
		try {
			int length = jsonArray.length();
			for (int x = 0; x < length; x++) {
				Object data = jsonArray.get(x);
				if (data instanceof JSONObject) {
					maps.add(parseToMap((JSONObject) data));
				}else{
					maps.add(data);
				}
			}
		} catch (Exception e) {
		}
		return maps;
	}

	public static List<Map<String, Object>> parseToMaps(JSONArray jsonArray) {
		List<Map<String, Object>> maps = new Vector<Map<String, Object>>();
		if(null == jsonArray){
			return maps ;
		}
		try {
			int length = jsonArray.length();
			for (int x = 0; x < length; x++) {
				Object data = jsonArray.get(x);
				if (data instanceof JSONObject) {
					maps.add(parseToMap((JSONObject) data));
				}
			}
		} catch (Exception e) {
		}
		return maps;
	}
	
	public static void main(String[] args) {
		Map<String,Object> hashMap = new HashMap<String, Object>();
		hashMap.put("姓名", "张三");
		hashMap.put("性别", "男");
		hashMap.put("年龄", 18 );
		String json = JSON.toJSONString(hashMap) ;
		System.out.println( json  );
		Map<String, Object> parseToObj = ParseJson.parseToObj( json ); 
		System.out.println( parseToObj );
	}
}
