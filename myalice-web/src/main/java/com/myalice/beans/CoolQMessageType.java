package com.myalice.beans;

public enum CoolQMessageType {
	
	PRIVATE("private"),   /* 私聊消息        */
	GROUP("group"),       /* 群消息            */
	DISCUSS("discuss")    /* 讨论组消息    */
	;
	
	CoolQMessageType(String type){
		this.type = type;
	}
	
	private String type;
	
	public String getType(){
		return type;
	}
	
	public static CoolQMessageType getCoolQMessageType(String type){
		for (CoolQMessageType e : values()) {  
            if(e.getType().equals(type)) {  
                return e;  
            }  
        }  
        return null; 
	}
}
