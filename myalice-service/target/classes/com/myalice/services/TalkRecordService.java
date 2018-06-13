package com.myalice.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.myalice.domain.TalkRecord;
import com.myalice.mapping.TalkRecordMapper;
import com.myalice.utils.Tools;

@Service
public class TalkRecordService {

	@Autowired
	protected TalkRecordMapper talkRecordMapper;

	public void insert(TalkRecord talkRecord) {
		talkRecord.setId(Tools.uuid());
		talkRecord.setCreateTime(Tools.currentDate());
		talkRecordMapper.insert(talkRecord);
	}

	public Page<TalkRecord> list(int pageId, TalkRecord record) {
		Page<TalkRecord> startPage = PageHelper.startPage(pageId, 10);
		talkRecordMapper.select(record);
		return startPage;
	}

	public TalkRecord selectLastAsk(String groupId, String userId,Integer replyType) {
		TalkRecord record = talkRecordMapper.selectLastAsk(groupId, userId , replyType);
		if(null == record){
			return null ;
		}
		replyType = replyType == null ? 0 : replyType ; 
		if(replyType.intValue() == (null == record.getReplyType() ? 0 : record.getReplyType())){
			return record ;
		}
		return null ;
	}
}
