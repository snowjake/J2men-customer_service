package org.myalice.websocket;

public class Constant {
	
	public static interface WS_SESSION_KEY {
		
		public static final String SESSION_KEY_TALKER_OF_CUSTOMER = "WS_TALKER_OF_CUSTOMER";
		
		public static final String SESSION_KEY_TALKER_OF_SUPPORTER = "WS_TALKER_OF_SUPPORTER";
		
		public static final String SESSION_KEY_SUPPORTER_WORKLOAD = "WS_SUPPORTER_WORKLOAD";
		
		public static final String SESSION_KEY_UNSENT_MESSAGES = "UNSENT_MESSAGES";
		
		//需要外部传入WebSocketSession的参数
		public static final String SESSION_KEY_USER_NAME = "USER_NAME";
		//需要外部传入WebSocketSession的参数
		public static final String SESSION_KEY_LOGO_URL = "USER_LOGO";
		//需要外部传入WebSocketSession的参数
		public static final String SESSION_KEY_USER_ID = "USER_ID";
		//需要外部传入WebSocketSession的参数——客户类型("0":tourist;"1":user)
		public static final String SESSION_KEY_CUSTOMER_TYPE = "CUSTOMER_TYPE";
	}
	
	public static interface WS_SESSION_CONTENT {
		//客户类型——游客
		public static final String SESSION_CUSTOMER_TYPE_TOURIST = "0";
		//客户类型——用户
		public static final String SESSION_CUSTOMER_TYPE_USER = "1";
	}
	
	public static interface DOMAIN_STATUS {
		
		public static final String CONNECTION_OPENED = "0";
		
		public static final String CONNECTION_CLOSED = "1";
	}
	
	public static interface DOMAIN_TYPE {
		
		public static final String CONNECTION_TYPE_CUSTOMER = "0";
		
		public static final String CONNECTION_TYPE_SUPPORTER = "1";
		
		public static final String TALK_TYPE_CUSTOMER_TO_SUPPORTER = "0";
		
		public static final String TALK_TYPE_SUPPORTER_TO_CUSTOMER = "1";
		
		public static final String TALK_TYPE_IMAGE_CUSTOMER_TO_SUPPORTER = "2";
		
		public static final String TALK_TYPE_IMAGE_SUPPORTER_TO_CUSTOMER = "3";
	}
	
	public static final String USER_LOGO_DEFAULT_ADDRESS = "/img/websocket/defaultUserLogo.png";
	
	public static final String IMAGE_UPLOAD_PATH = "/static/upload/";
	
	public static final String IMAGE_ACCESS_PATH = "/upload/";
}