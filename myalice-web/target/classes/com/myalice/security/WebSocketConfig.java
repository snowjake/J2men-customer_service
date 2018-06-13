package com.myalice.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

@Configuration
@EnableWebSocketMessageBroker
//通过EnableWebSocketMessageBroker 开启使用STOMP协议来传输基于代理(message broker)的消息,
//此时浏览器支持使用@MessageMapping 就像支持@RequestMapping一样。
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer{
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){
    	// 注册 websocket 客户端与服务器链接的url
    	// var sock = new SockJS("/endpointChat"); 
        registry.addEndpoint("/endpointTest").withSockJS();
        registry.addEndpoint("/endpointChat").withSockJS();
    }
    
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
		messages
		//任何没有目的地的消息（即消息类型为MESSAGE或SUBSCRIBE的任何其他消息）将要求用户被认证
		.nullDestMatcher().authenticated()
		//任何人都可以访问 /user/queue/errors
        .simpSubscribeDestMatchers("/topic/getResponse").permitAll()  
        .simpSubscribeDestMatchers("/user/queue/notifications").permitAll() 
        .anyMessage().permitAll() ;
	}
    
}
