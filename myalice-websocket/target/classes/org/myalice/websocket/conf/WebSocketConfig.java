package org.myalice.websocket.conf;

import org.myalice.websocket.handler.CustomerHandler;
import org.myalice.websocket.handler.SupporterHandler;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration
@EnableWebSocket
@PropertySource("classpath:/websocket.properties")
@EnableScheduling
@MapperScan("org.myalice.mapping.websocket")
@EnableTransactionManagement
public class WebSocketConfig implements WebSocketConfigurer {
	
	@Autowired
	private CustomerHandler customerHandler;
	
	@Autowired
	private SupporterHandler supporterHandler;
	
	@Value("${websocket.endpoint.customer:/customer}")
	private String customerEndPoint;
	
	@Value("${websocket.endpoint.supporter:/supporter}")
	private String supporterEndPoint;

	@Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(customerHandler, customerEndPoint).
        	addHandler(supporterHandler, supporterEndPoint).
        	addInterceptors(new HttpSessionHandshakeInterceptor()).
        	setAllowedOrigins("*").
        	withSockJS();
    }
	
	@Bean
	public ServletServerContainerFactoryBean createServletServerContainerFactoryBean() {
	    ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
	    container.setMaxTextMessageBufferSize(1024*1024*3);
	    container.setMaxBinaryMessageBufferSize(1024*1024*3);
	    container.setMaxSessionIdleTimeout(1000 * 60 * 3);
	    return container;
	}
}