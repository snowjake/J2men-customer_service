package com.myalice.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.myalice.domain.QuestionOrder;
import com.myalice.domain.QuestionOrderAttachment;
import com.myalice.mapping.QuestionOrderAttachmentMapper;
import com.myalice.mapping.QuestionOrderMapper;
import com.myalice.utils.Tools;

@Service
public class QuestionOrderService {

	@Autowired
	protected QuestionOrderMapper questionOrderMapper;

	@Autowired
	QuestionOrderAttachmentMapper orderAttachmentMapper;

	public Page<QuestionOrder> list(int pageId, QuestionOrder qo, Date sTime, Date eTime) {
		Page<QuestionOrder> startPage = PageHelper.startPage(pageId, 10);
		questionOrderMapper.query(qo, sTime, eTime);
		return startPage;
	}

	@Transactional(propagation = Propagation.SUPPORTS)
	public QuestionOrder selectByPrimaryKey(String id) {
		return questionOrderMapper.selectByPrimaryKey(id);
	}

	@Transactional
	public void insert(final QuestionOrder record, List<String> attachmentFile) {
		record.setId(Tools.uuid());
		record.setCreateTime(new Date());
		this.questionOrderMapper.insert(record);
		attachmentFile.forEach((attachment) -> {
			QuestionOrderAttachment questionOrderAttachment = new QuestionOrderAttachment();
			questionOrderAttachment.setCreateTime(new Date());
			questionOrderAttachment.setQuestionOrderId(record.getId());
			questionOrderAttachment.setStatus((byte) 1);
			questionOrderAttachment.setId(Tools.uuid());
			;
			questionOrderAttachment.setUrl(attachment);
			orderAttachmentMapper.insert(questionOrderAttachment);
		});
	}

	@Transactional
	public int updateOrderState(QuestionOrder record) {
		return questionOrderMapper.updateOrderState(record);

	}
}
