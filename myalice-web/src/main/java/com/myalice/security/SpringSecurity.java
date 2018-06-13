package com.myalice.security;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configurers.FormLoginConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.annotation.web.configurers.LogoutConfigurer;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.header.writers.HstsHeaderWriter;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SpringSecurity extends WebSecurityConfigurerAdapter {

	@Value("${spring.security.jdbc.enable}")
	String securityJdbcEnable;

	@Autowired
	protected SecurityProperties securityProperties;

	@Autowired
	protected DataSource datasource;

	protected void configure(HttpSecurity http) throws Exception {

		CookieCsrfTokenRepository withHttpOnlyFalse = CookieCsrfTokenRepository.withHttpOnlyFalse();
		http.csrf().csrfTokenRepository(withHttpOnlyFalse).ignoringAntMatchers("/admin/question/pull") ; 
		
		HeadersConfigurer<HttpSecurity> headers = http.headers();
		headers.addHeaderWriter(new HstsHeaderWriter());
		headers.addHeaderWriter(new XXssProtectionHeaderWriter());
		headers.frameOptions().sameOrigin();
		http.authorizeRequests()
				.antMatchers("/admin/dologin", "/admin/js/**", "/admin/css/**", "/admin/img/**", "/admin/fonts/**" , "/pub/**")
				.permitAll()
				.antMatchers("/admin/question/pull").permitAll() 
				.antMatchers("/qo/**" , "/index.html" , "/admin/list" , "/" , "/cs-index.html").authenticated().antMatchers("/admin/**")
				.hasAnyRole("admin");
		String loginPage = "/admin/login.html";
		FormLoginConfigurer<HttpSecurity> formLogin = http.formLogin();
		formLogin.loginPage(loginPage).loginProcessingUrl("/admin/dologin").permitAll();
		
		formLogin.successForwardUrl("/admin/list").permitAll();
		formLogin.failureForwardUrl(loginPage + "?error=true").permitAll();
		formLogin.failureUrl(loginPage + "?error=true").permitAll();
		
		LogoutConfigurer<HttpSecurity> logout = http.logout();
		logout.logoutSuccessUrl(loginPage);
		logout.logoutUrl("/logout"); 
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers("**/js/**", "**/fonts/**", "**/css/**", "**/img/**", "**/**/favicon.ico");
	}

	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		if ("1".equalsIgnoreCase(securityJdbcEnable)) {
			/* 密码先不加密 */
			auth.userDetailsService(jdbcUserDetailsManager());
		} else {
			auth.inMemoryAuthentication().withUser("admin").password("123456").roles("admin").and().withUser("basara")
					.password("basara").roles("user");
		}
	}

	/* 采用jdbc方式 */
	public UserDetailsManager jdbcUserDetailsManager() throws Exception {
		JdbcUserDetailsManager userMan = new JdbcUserDetailsManager();
		userMan.setDataSource(datasource);
		userMan.setRolePrefix("ROLE_");
		userMan.setAuthoritiesByUsernameQuery("SELECT username,IF(user_type='1','admin','other') authority FROM users WHERE username = ?");
		return userMan;
	}
}
