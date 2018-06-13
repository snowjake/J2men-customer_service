package com.myalice.utils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;

public interface Tools {
	
	public static String uuid(){
		return UUID.randomUUID().toString().replaceAll("-", "");
	}
	
	public static Date currentDate(){
		return Date.from(LocalDateTime.now().atZone(ZoneId.of("GMT+8")).toInstant());
	}
	
	public static final Byte ZORE = (byte)0;
	public static final Byte ONE = (byte)1;
	
	
}