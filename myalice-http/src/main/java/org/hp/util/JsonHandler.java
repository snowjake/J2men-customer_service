package org.hp.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class JsonHandler {

    public static Map<String, Object> parseObject(String json) {
        JSONObject obj = JSON.parseObject(json) ;

        return asMap(obj);
    }


    protected static Map<String, Object> asMap(JSONObject json) {
        if(null == json){
            return null;
        }
        Map<String, Object> jsonMap = new HashMap<>() ;

        json.entrySet().stream()
                .forEach( ( entry )
                        -> {
                    if(entry.getValue() instanceof JSONArray){
                        jsonMap.put(entry.getKey() , asListMap((JSONArray)entry.getValue())) ;
                    }else if (entry.getValue() instanceof JSONObject){
                        jsonMap.put(entry.getKey() , asMap((JSONObject)entry.getValue())) ;
                    }else{
                        jsonMap.put(entry.getKey() , entry.getValue()) ;
                    }
        } );
        return jsonMap;
    }


    protected static List<Object> asListMap(JSONArray json){
        List<Object> result = new ArrayList<>();
        json.stream()
                .forEach(
                        data -> {
                            if(data instanceof JSONObject){
                                result.add(asMap((JSONObject) data)) ;
                            }else{
                                result.add(data);
                            }
                        }
                );
        return result;
    }

}
