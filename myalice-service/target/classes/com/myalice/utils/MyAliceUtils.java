package com.myalice.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.ArrayUtils;

public class MyAliceUtils {

	public final static String EMPTY_STR = "";

	public final static String toString(Object vo) {
		if (vo == null) {
			return EMPTY_STR;
		}
		return vo.toString().trim();
	}

	public final static int toInt(Object vo) {
		if (vo == null) {
			return 0;
		}
		String voStr = toString(vo);

		try {
			return Integer.parseInt(voStr);
		} catch (Exception e) {
		}
		return 0;
	}
	
	public static String[] parseQqs(String input){
		Matcher matcher = PATTERN_QQ.matcher(input) ;
		String[]qqs = new String[0];
		while(matcher.find()){
			qqs = ArrayUtils.add(qqs, parseQQ(matcher.group())) ;
		}
		return qqs ;
	}
	
	public static String trimQQ(String input){
		Matcher matcher = PATTERN_QQ.matcher(input) ;
		String result = input;
		while(matcher.find()){
			result = result.replace(matcher.group(), "");
		}
		return result ; 
	}
	
	public static String parseQQ(String text){
		Matcher matcher = PATTERN_INTEGER.matcher(text);
		if(matcher.find()){
			return matcher.group();
		}
		return null ; 
	}
	
	protected static final Pattern PATTERN_INTEGER = Pattern.compile("\\d+") ; 
	protected static final Pattern PATTERN_QQ = Pattern.compile("\\[CQ:at,qq=\\d*\\]") ;  
}
