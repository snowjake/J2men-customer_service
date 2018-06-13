package com.myalice.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.myalice.domain.QuestionRecord;
import com.myalice.mapping.QuestionRecordMapper;
import com.myalice.utils.Tools;

@Service
public class QuestionRecordService {

    @Autowired
    QuestionRecordMapper questionRecordMapper;
    
    @Transactional
    public void insert( QuestionRecord record) {
    	record.setId(Tools.uuid());
    	record.setCreateTime(new Date());
        this.questionRecordMapper.insert(record); 
    }
    
    @Transactional(propagation = Propagation.SUPPORTS)
    public List<QuestionRecord> selectRecord(String orderId){
    	return questionRecordMapper.selectQoRecord(orderId) ;
    }
}
