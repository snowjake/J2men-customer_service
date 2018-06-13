package com.myalice.aspect;

import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.myalice.config.ElasticsearchProporties;

@Component
@Aspect
public class ElasticsearchAop {
	Logger logger = LoggerFactory.getLogger(ElasticsearchAop.class);

	@Autowired
	protected ElasticsearchProporties elasticsearchProporties;

	@After("execution(* com.myalice.services.ESQuestionService.*(..)) ")
	public void doAfter() throws Throwable {
		
	}
}