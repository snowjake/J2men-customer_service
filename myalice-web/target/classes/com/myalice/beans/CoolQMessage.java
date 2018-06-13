package com.myalice.beans;

public class CoolQMessage {
	
	private String post_type;
	
	private String message_type;
	
	private long time;
	
	private long group_id;
	
	private long user_id;
	
	private String anonymous;
	
	private String anonymous_flag;
	
	private String message;
	
	private boolean isSearchData ;
	
	private boolean isAnwser ; 
	
	private String answerId ;
	
	private String questionId ;
	
	public String getAnswerId() {
		return answerId;
	}

	public void setAnswerId(String answerId) {
		this.answerId = answerId;
	}

	public String getQuestionId() {
		return questionId;
	}

	public void setQuestionId(String questionId) {
		this.questionId = questionId;
	}

	public boolean isAnwser() {
		return isAnwser;
	}

	public void setAnwser(boolean isAnwser) {
		this.isAnwser = isAnwser;
	}

	public boolean isSearchData() {
		return isSearchData;
	}

	public void setSearchData(boolean isSearchData) {
		this.isSearchData = isSearchData;
	}

	public String getPost_type() {
		return post_type;
	}

	public void setPost_type(String post_type) {
		this.post_type = post_type;
	}

	public String getMessage_type() {
		return message_type;
	}

	public void setMessage_type(String message_type) {
		this.message_type = message_type;
	}

	public long getTime() {
		return time;
	}

	public void setTime(long time) {
		this.time = time;
	}

	public long getGroup_id() {
		return group_id;
	}

	public void setGroup_id(long group_id) {
		this.group_id = group_id;
	}

	public long getUser_id() {
		return user_id;
	}

	public void setUser_id(long user_id) {
		this.user_id = user_id;
	}

	public String getAnonymous() {
		return anonymous;
	}

	public void setAnonymous(String anonymous) {
		this.anonymous = anonymous;
	}

	public String getAnonymous_flag() {
		return anonymous_flag;
	}

	public void setAnonymous_flag(String anonymous_flag) {
		this.anonymous_flag = anonymous_flag;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
