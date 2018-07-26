package com.myalice.beans;
/**
 * coolq response
 * @author yanjunli
 *
 */
public class CoolQResponse {
	private String reply;   /* 要回复的内容 */
	
	private boolean at_sender;   /* 是否要在回复开头 at 发送者（自动添加），默认为 true，发送者是匿名用户时无效 */
	
	private boolean kick;  /* 把发送者踢出群组（需要登录号权限足够），不拒绝此人后续加群请求，默认为 false，发送者是匿名用户时无效 */
	
	private boolean ban;   /* 把发送者禁言 30 分钟（需要登录号权限足够），对匿名用户也有效，不支持指定禁言时长（如需指定，请调用相应 API），默认为 false */

	public String getReply() {
		return reply;
	}

	public void setReply(String reply) {
		this.reply = reply;
	}

	public boolean isAt_sender() {
		return at_sender;
	}

	public void setAt_sender(boolean at_sender) {
		this.at_sender = at_sender;
	}

	public boolean isKick() {
		return kick;
	}

	public void setKick(boolean kick) {
		this.kick = kick;
	}

	public boolean isBan() {
		return ban;
	}

	public void setBan(boolean ban) {
		this.ban = ban;
	}
}
