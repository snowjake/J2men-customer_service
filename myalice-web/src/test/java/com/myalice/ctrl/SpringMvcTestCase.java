package com.myalice.ctrl;
import java.io.FileInputStream;
import java.util.Arrays;

import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.myalice.App;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@SpringBootTest(webEnvironment=WebEnvironment.MOCK)
@ContextConfiguration( classes = App.class )
@AutoConfigureMockMvc
public class SpringMvcTestCase {
	
	@Autowired
	protected MockMvc mockMvc;
	
	protected TestRestTemplate template = new TestRestTemplate(new RestTemplateBuilder());
	@Test
	public void test()throws Exception{
		MvcResult andReturn = mockMvc.perform(MockMvcRequestBuilders.get("/list")).andReturn() ;
		int status = andReturn.getResponse().getStatus() ;
		System.out.println("----");
		System.out.println( "response status:" + status );
		System.out.println( "response status content:" + andReturn.getResponse().getContentAsString() );
		System.out.println("----");
	}
	
	@Before
	public  void setUp(){
		TestingAuthenticationToken token = new TestingAuthenticationToken("admin" , 
				"123456", "admin") ; 
		SecurityContextImpl secureContext = new SecurityContextImpl();  
	    secureContext.setAuthentication(token);  
	    SecurityContextHolder.setContext(secureContext);
	}
	
	@Test
	public void testInsertUser()throws Exception{
	    
		MultiValueMap<String, String> valueMap = new LinkedMultiValueMap<String, String>();
		valueMap.put("username", Arrays.asList("")); 
		valueMap.put("password", Arrays.asList("123456")); 
		valueMap.put("password1", Arrays.asList("123456"));
		valueMap.put("email", Arrays.asList("garhp@qq.com"));
		valueMap.put("name", Arrays.asList("garhp@qq.com"));
		MvcResult andReturn = mockMvc.perform(MockMvcRequestBuilders.post("/admin/user/insert").params(valueMap)).andReturn() ;
		System.out.println("-------------");
		System.out.println(andReturn.getResponse().getStatus());
		System.out.println(andReturn.getResponse().getContentAsString());
		System.out.println("-------------");
	}
	
	@Test
	public void testUpdateUser()throws Exception{
		MultiValueMap<String, String> valueMap = new LinkedMultiValueMap<String, String>();
		valueMap.put("username", Arrays.asList("")); 
		valueMap.put("password", Arrays.asList("123457")); 
		valueMap.put("password1", Arrays.asList("123457"));
		valueMap.put("email", Arrays.asList("garhp@qq.com"));
		valueMap.put("id", Arrays.asList("2dea00a36aa64d6d9c36cc3e3ef3f770"));
		valueMap.put("name", Arrays.asList("garhp@qq.com"));
		MvcResult andReturn = mockMvc.perform(MockMvcRequestBuilders.post("/admin/user/update").params(valueMap)).andReturn() ;
		System.out.println("-------------");
		System.out.println(andReturn.getResponse().getContentAsString());
		System.out.println("-------------");
	}
	
	@Test
	public void testAddQuestion()throws Exception{
		MockMultipartHttpServletRequestBuilder fileUpload = MockMvcRequestBuilders.fileUpload("/admin/qr/upload"); 
		fileUpload.file(new MockMultipartFile("attachments", "2.png", "image/png",
				IOUtils.readFully(new FileInputStream("c:/2.png"), 45553))) ;
		fileUpload.param("content", "有一些小问题要咨询一些呢");
		MvcResult andReturn = mockMvc.perform(fileUpload).andReturn() ;
		System.out.println("-------------");
		System.out.println(andReturn.getResponse().getStatus());
		System.out.println(andReturn.getResponse().getContentAsString());
		System.out.println("-------------");
	}
	
	
	@Test
	public void testIK()throws Exception{
		
	}
}
