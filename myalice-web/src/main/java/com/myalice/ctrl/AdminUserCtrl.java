package com.myalice.ctrl;

import io.swagger.annotations.Api;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import springfox.documentation.swagger2.annotations.EnableSwagger2;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import com.myalice.domain.Users;
import com.myalice.security.BindingResultUtils;
import com.myalice.services.UsersService;
import com.myalice.util.AuthorityUtils;
import com.myalice.utils.ResponseMessageBody;
import com.myalice.utils.Tools;
import com.myalice.utils.ValidGroup;

@Controller
@RequestMapping("/admin")
@EnableSwagger2
@Api(value = "系統用戶接口", description = "J2men测试用", tags = "Swagger Test Control Tag")
public class AdminUserCtrl {

	protected static Logger logger = org.slf4j.LoggerFactory.getLogger("ctrl");

	@Autowired
	UsersService userService;

	@RequestMapping("/list")
	public String list(Authentication authentication) {
		if(null != authentication){
			if(AuthorityUtils.isAdmin(authentication.getAuthorities())){
				return  "redirect:/index.html" ;
			}
		}
		return "redirect:/cs-index.html" ;
	}

	@RequestMapping("/loadUserinfo")
	@ResponseBody
	public Map<String, Object> loadUserinfo(Principal principal) {
		Map<String, Object> principalMap = new HashMap<>();
		principalMap.put("username", principal.getName());
		return principalMap;
	}

	@RequestMapping("/listdata")
	@ResponseBody
	public PageInfo<Users> listData(Integer pageNum, Users user) {
		Page<Users> searchUsers = userService.searchUsers(pageNum, user);
		return new PageInfo<Users>(searchUsers);
	}

	@PostMapping("/user/enable")
	@ResponseBody
	public ResponseMessageBody enable(String[] username, Integer enable) {
		try {
			int enableUser = userService.enableUser(username, enable);
			return new ResponseMessageBody("账号启用成功", enableUser > 0);
		} catch (Exception e) {
			return new ResponseMessageBody("账号启用失败,原因：" + e.getMessage(), false);
		}
	}

	@PostMapping("/user/authorize")
	@ResponseBody
	public ResponseMessageBody authorize(String username, String userType) {
		try {
			if (StringUtils.isEmpty(userType) || StringUtils.isEmpty(username)) {
				return new ResponseMessageBody("参数为空", false);
			}
			if("admin".equals(username)){
				return new ResponseMessageBody("不能修改admin的权限", false);
			}
			
			Users selectUser = userService.selectUser(username);
			if (null == selectUser) {
				return new ResponseMessageBody("账号不存在", false);
			}
			if (userType.equalsIgnoreCase(selectUser.getUserType())) {
				return new ResponseMessageBody("用户角色设置成功", true);
			}

			boolean updateUserType = userService.updateUserType(username, userType);

			return new ResponseMessageBody("用户角色设置成功", updateUserType);
		} catch (Exception e) {
			logger.error("authorize", e);

			return new ResponseMessageBody("设置管理失败,原因：" + e.getMessage(), false);
		}
	}

	@PostMapping("/user/insert")
	@ResponseBody
	@Validated(value = ValidGroup.Second.class)
	public ResponseMessageBody insert(@Valid Users user, BindingResult result, String password1) {
		try {
			ResponseMessageBody msgBody = BindingResultUtils.parse(result);
			if (null != msgBody) {
				return msgBody;
			}
			if (null == password1 || !password1.equals(user.getPassword())) {
				return new ResponseMessageBody("两次密码输入不一致", false);
			}
			if (userService.selectUser(user.getUsername()) != null) {
				return new ResponseMessageBody(String.format("账号%s已经注册", user.getUsername()), false);
			}
			user.setRemarks("");
			user.setEnabled(true);
			user.setPortraitUrl("");
			user.setName(user.getUsername());
			user.setMobilePhone("");
			user.setCreateTime(Tools.currentDate());
			int insertCount = userService.insert(user);
			return new ResponseMessageBody("新增账号成功", insertCount > 0);
		} catch (Exception e) {
			return new ResponseMessageBody("新增账号失败,原因：" + e.getMessage(), false);
		}
	}

	@PostMapping("/user/update")
	@ResponseBody
	public ResponseMessageBody update(@Valid Users user, BindingResult result, String password1) {
		try {
			ResponseMessageBody msgBody = BindingResultUtils.parse(result);
			if (null != msgBody) {
				return msgBody;
			}
			if (null == password1 || !password1.equals(user.getPassword())) {
				return new ResponseMessageBody("两次密码输入不一致", false);
			}
			int insertCount = userService.updateUser(user);
			return new ResponseMessageBody("修改成功", insertCount > 0);
		} catch (Exception e) {
			return new ResponseMessageBody("修改失败,原因：" + e.getMessage(), false);
		}
	}
}