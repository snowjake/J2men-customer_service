package com.myalice.ctrl;

import io.swagger.annotations.Api;

import java.io.File;
import java.io.FileInputStream;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import springfox.documentation.swagger2.annotations.EnableSwagger2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myalice.domain.SysDictionaries;
import com.myalice.domain.Users;
import com.myalice.properties.AttachmentProperties;
import com.myalice.security.BindingResultUtils;
import com.myalice.services.SysDictionariesService;
import com.myalice.services.UsersService;
import com.myalice.util.VerifyCodeUtils;
import com.myalice.utils.MyAliceUtils;
import com.myalice.utils.ResponseMessageBody;
import com.myalice.utils.Tools;
import com.myalice.utils.ValidGroup;

@RequestMapping("/pub")
@RestController
@EnableSwagger2
@Api(value = "公共接口", description = "J2men测试用", tags = "Swagger Test Control Tag")
public class PubCtrl {
	protected static Logger logger = org.slf4j.LoggerFactory.getLogger("ctrl") ; 

	@Autowired
	protected AttachmentProperties attachmentProperties;
	@Autowired
	UsersService userService;
	
	@Autowired
	protected SysDictionariesService dictionariesService;

 
	@RequestMapping("/loadUserinfo")
	public Map<String, Object> loadUserinfo(Principal principal) {
		Map<String, Object> principalMap = new HashMap<>(); 
		if(null != principal){
			principalMap.put("username", principal.getName());
		}
		return principalMap;
	}
	
	@PostMapping("/orderType")
	public Map<Integer, String> list(String type) {
		if(StringUtils.isEmpty(type)){
			type="orderType" ;
		}
		List<SysDictionaries> selectForDType = dictionariesService.selectForDType(type);
		if (null != selectForDType){
			Map<Integer, String> collect = selectForDType.parallelStream().collect(HashMap<Integer, String>::new,
					(map, item) -> {
						map.put(item.getTindex(), item.getTname());
					}, (m1, m2) -> {
						m1.putAll(m2);
					});
			return collect;
		}
		return null;
	}
	
	
	@PostMapping("/user/insert")
	@ResponseBody 
	public ResponseMessageBody insert(@Validated(value=ValidGroup.Second.class) Users user,
			BindingResult result,String password1 , HttpServletRequest request,String code){
		try {
			ResponseMessageBody msgBody = BindingResultUtils.parse(result) ;
			if(null != msgBody){
				msgBody.setMsg("验证有误");
				return msgBody ;
			}
			if(null == password1 || !password1.equals(user.getPassword())){
				return new ResponseMessageBody("两次密码输入不一致" , false);
			}
			
			Object verifyCodeObj = request.getSession().getAttribute("VerifyCode");
			String verifyCode = null==verifyCodeObj?"":verifyCodeObj.toString() ;
			System.out.println(verifyCode + "--->" + code);
			if(!verifyCode.equalsIgnoreCase(code)){
				return new ResponseMessageBody("验证码输入不正确" , false);
			}
			
			if(userService.selectUser(user.getUsername()) != null){
				return new ResponseMessageBody(String.format("账号%s已经注册" , user.getUsername()), false);
			}
			user.setUserType("0");
			user.setRemarks("");
			user.setMobilePhone("");
			user.setEnabled(true); 
			user.setPortraitUrl("");
			user.setName(user.getUsername()); 
			user.setCreateTime(Tools.currentDate());
			int insertCount = userService.insert( user );
			return new ResponseMessageBody("新增账号成功" , insertCount>0) ; 
		} catch (Exception e) {
			return new ResponseMessageBody("新增账号失败,原因：" 
					+ e.getMessage() , false) ;
		}
	}

	@PostMapping("/orderTypes")
	public Map<String, String> list(String[] dtypes) {
		Map<String, String> returnResult = new HashMap<>();
		try {
			
		
		List<SysDictionaries> selectForDType = dictionariesService.selectForDTypes(dtypes);
		if (null != selectForDType) {
			ObjectMapper mapper = new ObjectMapper();  
			Map<String, Map<Integer, String>> collect = selectForDType.stream().collect(HashMap<String, Map<Integer, String>>::new,
			(map, item) -> {
				String dtype = item.getDtype() ;
				Map<Integer, String> result = map.get(dtype);
				result=null==result?new HashMap<>():result;
				result.put(item.getTindex(), item.getTname()) ;
				map.put(dtype, result) ;
			}, (m1, m2) -> {
				m1.putAll(m2);
			});
			
			for(Map.Entry<String, Map<Integer, String>> entry:collect.entrySet()){
				returnResult.put(entry.getKey(), mapper.writeValueAsString(entry.getValue())) ; 
			}
		}
		} catch (Exception e) {
			logger.error("/pub/orderTypes resion:" + e.getMessage() , e);
		}
		return returnResult;
	}

	@RequestMapping("/validateCode")
	public void validateCode(HttpServletRequest request , HttpServletResponse response){
		try {
			response.setHeader("Pragma","No-cache");
			response.setHeader("Cache-Control","no-cache");
			response.setHeader("Cache-Control","no-cache");
			response.setHeader("Content-Type","image/png");
			response.setDateHeader("Expires", 0); 
			String code = VerifyCodeUtils.generateVerifyCode(4) ;
			request.getSession().setAttribute("VerifyCode", code) ;
			VerifyCodeUtils.outputImage(80, 40, response.getOutputStream(), code) ; 
		} catch (Exception e) {
			logger.error("/pub/validateCode resion:" + e.getMessage() , e);
		}
	}
	
	
	@RequestMapping("/showImg")
	public void showImg(HttpServletRequest request , HttpServletResponse response){
		FileInputStream is = null ;
		try {
			String imgPath = MyAliceUtils.toString(request.getParameter("imgPath")) ; 
			response.setHeader("Pragma","No-cache");
			response.setHeader("Cache-Control","no-cache");
			response.setHeader("Cache-Control","no-cache");
			response.setHeader("Content-Type","image/png");
			response.setDateHeader("Expires", 0); 
			String filePath = attachmentProperties.getFilePath(imgPath) ; 
			if(new File(filePath).exists()){
				is = new FileInputStream(filePath);
				IOUtils.copy(is, response.getOutputStream()) ; 
			}
		} catch (Exception e) {
			logger.error("/pub/validateCode resion:" + e.getMessage() , e);
		}finally {
			if(is!=null){
				IOUtils.closeQuietly(is);
			}
		}
	}
	
}
