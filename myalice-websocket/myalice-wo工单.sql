CREATE TABLE `question_order` (
  `id` varchar(32) NOT NULL COMMENT '主键（UUID）',
  `create_time` datetime DEFAULT NULL COMMENT '创建日起',
  `create_user` varchar(32) DEFAULT NULL COMMENT '提交人',
  `solved_time` datetime DEFAULT NULL COMMENT '工单处理时间',
  `state` tinyint(2) DEFAULT NULL COMMENT '0:已创建；1:待处理；2：处理中；3：已处理；4：已解决；',
  `question_type` tinyint(2) DEFAULT NULL COMMENT '0:通用类型;1:其他类型',
  `question_summary` varchar(128) DEFAULT NULL COMMENT '问题概述',
  `question_content` varchar(2000) DEFAULT NULL COMMENT '问题内容',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工单表'



CREATE TABLE `question_order_attachment` (
  `id` varchar(32) NOT NULL COMMENT 'id',
  `question_order_id` varchar(32) DEFAULT NULL COMMENT '问题工单ID',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `status` tinyint(2) DEFAULT NULL COMMENT '状态 0:已创建；1：已删除',
  `url` varchar(256) DEFAULT NULL COMMENT '工单地址',
  PRIMARY KEY (`id`),
  KEY `question_order_id` (`question_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工单附件'


CREATE TABLE `question_record` (
  `id` varchar(32) NOT NULL COMMENT 'id',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `content` varchar(1000) DEFAULT NULL COMMENT '交谈内容',
  `commit_user` varchar(32) DEFAULT NULL COMMENT '提交人',
  `userType` tinyint(2) DEFAULT NULL COMMENT '0 用户 1管理员',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='沟通记录表'
