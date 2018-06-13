package com.myalice.services;

import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.myalice.domain.Users;
import com.myalice.mapping.UsersMapper;
import com.myalice.utils.MyAliceConstant;
import com.myalice.utils.Tools;

@Service
public class UsersService {
	
	protected int pageSize = MyAliceConstant.PAGE_SIZE; 
	
	@Autowired
	protected UsersMapper usersMapper ;
	
	@Transactional(propagation = Propagation.SUPPORTS)
	public Page<Users> searchUsers(Integer pageNum , Users users){
		pageNum=null==pageNum?1:pageNum;
		Page<Users> startPage = PageHelper.startPage(pageNum, pageSize) ;
		usersMapper.searchUsers(users);
		return startPage ; 
	}
	
	
	@Transactional(propagation = Propagation.SUPPORTS)
	public Users selectUser(String userName){
		return usersMapper.selectUser(userName);
	}
	
	public boolean updateUserType(String username ,String userType){
		return usersMapper.updateUserType(username, userType) > 0;
	}
	
	@Transactional
	public int updateUser(Users users){
		return usersMapper.updateByPrimaryKey(users) ;
	}
	
	@Transactional
	public int enableUser(String[] userNames,final Integer enabled){
		Stream.of(userNames).parallel()
		.forEach((userName)->{
			usersMapper.enableUser(userName, enabled) ;
		});
		return 1;
	}
	
	@Transactional
	public int insert(Users user){
		user.setId(Tools.uuid()) ;
		return usersMapper.insert(user); 
	}
	
	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}
}
