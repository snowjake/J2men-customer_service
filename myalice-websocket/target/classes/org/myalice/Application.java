package org.myalice;

import org.apache.ibatis.logging.LogFactory;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableScheduling
@MapperScan("org.myalice.mapping.websocket")
@EnableTransactionManagement
public class Application {

    public static void main(String[] args) {
    	LogFactory.useLog4JLogging();
        SpringApplication.run(Application.class, args);
    }
}
