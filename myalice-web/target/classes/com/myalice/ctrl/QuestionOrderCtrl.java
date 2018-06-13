package com.myalice.ctrl;

import io.swagger.annotations.Api;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import javax.validation.Valid;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import springfox.documentation.swagger2.annotations.EnableSwagger2;

import com.github.pagehelper.PageInfo;
import com.myalice.domain.QuestionOrder;
import com.myalice.domain.QuestionOrderAttachment;
import com.myalice.domain.QuestionRecord;
import com.myalice.properties.AttachmentProperties;
import com.myalice.services.QuestionOrderAttachmentService;
import com.myalice.services.QuestionOrderService;
import com.myalice.services.QuestionRecordService;
import com.myalice.services.UsersService;
import com.myalice.util.AuthorityUtils;
import com.myalice.utils.ResponseMessageBody;
import com.myalice.utils.Tools;

@RequestMapping("/qo/")
@RestController
@EnableSwagger2
@Api(value = "問題查詢排序接口", description = "J2men测试用", tags = "Swagger Test Control Tag")
public class QuestionOrderCtrl {
	protected static Logger logger = org.slf4j.LoggerFactory.getLogger("QuestionRecord");

	@Autowired
	protected AttachmentProperties attachmentProperties;

	@Autowired
	protected UsersService usersService;

	@Autowired
	protected QuestionOrderService questionOrderService;

	@Autowired
	protected QuestionRecordService questionRecordService;

	@Autowired
	protected QuestionOrderAttachmentService qrderAttachmentService;

	@RequestMapping("queryOrder")
	public Map<String, Object> queryOrder(String id) {
		Map<String, Object> resultMap = new HashMap<>();
		try {
			QuestionOrder questionOrder = questionOrderService.selectByPrimaryKey(id);
			List<QuestionRecord> records = questionRecordService.selectRecord(id);
			List<QuestionOrderAttachment> attachments = qrderAttachmentService.selectAttachments( id );
			resultMap.put( "questionOrder" , questionOrder );
			resultMap.put( "attachments" , attachments );
			resultMap.put( "user" , usersService.selectUser( questionOrder.getCreateUser() ) );
			resultMap.put( "records" , records );
		} catch (Exception e) {
			logger.error("/qo/queryOrder", e);
		}
		return resultMap;
	}

	@RequestMapping("listData")
	public PageInfo<QuestionOrder> list(Integer pageNum, QuestionOrder qo, Date sTime, Date eTime) {
		if (null == qo) {
			qo = new QuestionOrder();
		}
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
		boolean isAdmin = AuthorityUtils.isAdmin(authorities);
		if (!isAdmin) {
			qo.setCreateUser(authentication.getName());
		}
		pageNum = null == pageNum ? 1 : pageNum;
		return new PageInfo<QuestionOrder>(questionOrderService.list(pageNum, qo, sTime, eTime));
	}

	

	@PostMapping("addRecord")
	public ResponseMessageBody addRecord(String questionOrderId, String content, Authentication authentication) {
		try {
			if (StringUtils.isEmpty(questionOrderId)) {
				return new ResponseMessageBody("订单编号不能为空", false);
			}

			if (StringUtils.isEmpty(content)) {
				return new ResponseMessageBody("反馈内容不能为空", false);
			}

			QuestionRecord questionRecord = new QuestionRecord();
			questionRecord.setCommitUser(authentication.getName());
			questionRecord.setContent(content);
			questionRecord.setQuestionOrderId(questionOrderId);
			questionRecord.setUsertype(AuthorityUtils.isAdmin(authentication.getAuthorities()) ? Tools.ONE : Tools.ZORE);
			questionRecord.setCreateTime(Tools.currentDate());
			questionRecord.setId(Tools.uuid());

			questionRecordService.insert(questionRecord);
			return new ResponseMessageBody("保存成功", true);
		} catch (Exception e) {
			logger.error("/qo/addRecord reson:" + e.getMessage(), e);
			return new ResponseMessageBody("保存成功", true);
		}
	}

	/**
	 * 创建工单，并上传附件
	 */
	@PostMapping("upload")
	public ResponseMessageBody upload(@Valid QuestionOrder order, BindingResult result,
			@RequestParam(value = "attachments") MultipartFile[] attachments, Authentication authentication) {

		String headpath = attachmentProperties.getCurrentPath();
		try {
			List<String> attachmentFile = new Vector<>();
			for (MultipartFile attachment : attachments) {
				if (!StringUtils.isEmpty(attachment.getOriginalFilename())) {
					String fileName = attachmentProperties.getNewFileName(attachment.getOriginalFilename());
					File file = new File(headpath);
					file.mkdirs();
					FileOutputStream out = new FileOutputStream(headpath + "/" + fileName);
					String addFile = attachmentProperties.getCurrentDate() + "/" + fileName;
					logger.debug("上传文件:" + addFile);
					try {
						IOUtils.copy(attachment.getInputStream(), out);
						attachmentFile.add(addFile);
					} finally {
						IOUtils.closeQuietly(out);
					}
				}
			}
			if (null != authentication) {
				order.setCreateUser(authentication.getName());
			}
			order.setQuestionSummary("");
			order.setState(Tools.ONE);
			questionOrderService.insert(order, attachmentFile);
			return new ResponseMessageBody("工单创建成功", true);
		} catch (Exception e) {
			logger.error("/qo/upload", e);
			return new ResponseMessageBody("工单创建失败,原因：" + e.getMessage(), true);
		}
	}

	@PostMapping("/changeState")
	public ResponseMessageBody changeState(QuestionOrder order, Authentication authentication) {
		String msg = "受理";
		try {
			if (order.getState() == null) {
				return new ResponseMessageBody("参数获取失败", false);
			}
			QuestionOrder questionOrder = questionOrderService.selectByPrimaryKey(order.getId());
			if (null == questionOrder) {
				return new ResponseMessageBody("获取订单为空", false);
			}
			if (order.getState() == 2) {
				if (!AuthorityUtils.isAdmin(authentication.getAuthorities())) {
					return new ResponseMessageBody("非管理员不能受理", false);
				}
				order.setAccept(authentication.getName());
				if (null != questionOrder.getState() && questionOrder.getState() != 1) {
					return new ResponseMessageBody("不是待受理状态", false);
				}
			}
			if (order.getState() == 3) {
				msg = "关闭";
				order.setSolvedTime(Tools.currentDate());

				if (!authentication.getName().equalsIgnoreCase(questionOrder.getCreateUser())) {
					return new ResponseMessageBody(String.format("不是工单创建人，不能关闭工单", msg), true);
				}
			}
			order.setAccept(questionOrder.getAccept());
			questionOrderService.updateOrderState(order);
			return new ResponseMessageBody(String.format("%s成功", msg), true);
		} catch (Exception e) {
			logger.error("/qo/changeState", e);
			return new ResponseMessageBody(String.format("%s失败", msg), true);
		}
	}
}
