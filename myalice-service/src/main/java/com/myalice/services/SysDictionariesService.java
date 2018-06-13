package com.myalice.services;

import java.util.List;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myalice.domain.SysDictionaries;
import com.myalice.mapping.SysDictionariesMapper;

@Service
public class SysDictionariesService {

	@Autowired
	protected SysDictionariesMapper dictionariesMapper;

	public List<SysDictionaries> selectForDType(String dtype) {
		return dictionariesMapper.selectForDType(dtype);
	}
	
	
	public List<SysDictionaries> selectForDTypes(String[]dtype) {
		return dictionariesMapper.selectForDTypes(dtype);
	}
	
	public String[] findQQ(String[] qqs){
		List<SysDictionaries> dictionaries = dictionariesMapper.selectForDType("chatbot");
		String[] returnQqs = new String[0] ; 
		for(String qq : qqs){
			boolean isFlag = false ;
			for(SysDictionaries dictionary:dictionaries){
				if(StringUtils.equals(dictionary.getTname(), qq)){
					isFlag = true ;  
				}
			}
			if(!isFlag){
				returnQqs = ArrayUtils.add(returnQqs, qq) ;
			}
		}
		return returnQqs; 
	}
	
}
