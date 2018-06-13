package com.myalice.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myalice.domain.QuestionOrderAttachment;
import com.myalice.mapping.QuestionOrderAttachmentMapper;

@Service
public class QuestionOrderAttachmentService {

	@Autowired
	protected QuestionOrderAttachmentMapper questionAttachmentMapper;

	public List<QuestionOrderAttachment> selectAttachments(String orderId) {
		return questionAttachmentMapper.selectAttachments( orderId );
	}
}
