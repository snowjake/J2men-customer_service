package com.myalice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

import com.myalice.properties.AttachmentProperties;

@SpringBootApplication(scanBasePackages = "com.myalice")
@EnableConfigurationProperties(AttachmentProperties.class)
public class App extends SpringBootServletInitializer {
	@Override
	protected SpringApplicationBuilder configure(
			SpringApplicationBuilder application) {
		return application.sources(App.class);
	}

	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
	}

	@Bean
	public Docket api() {
		return new Docket(DocumentationType.SWAGGER_2)
				.apiInfo(getApiInfo())
				// .pathMapping("/")// base，最终调用接口后会和paths拼接在一起
				.select()
				// .paths(Predicates.or(PathSelectors.regex("/api/.*")))//过滤的接口
				.apis(RequestHandlerSelectors.basePackage("com.myalice.ctrl")) // 过滤的接口
				.paths(PathSelectors.any()).build();
	}

	private ApiInfo getApiInfo() {
		// 定义联系人信息
		String contact = "snow";
		return new ApiInfoBuilder()
				.title("智能客服")
				// 标题
				.description("测试智能客服接口")
				// 描述信息
				.version("1.1.2")
				// //版本
				.license("Apache 2.0")
				.licenseUrl("http://www.apache.org/licenses/LICENSE-2.0")
				.contact(contact).build();
	}
}
