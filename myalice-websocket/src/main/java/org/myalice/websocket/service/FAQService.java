package org.myalice.websocket.service;

import java.util.List;

import org.myalice.domain.websocket.FAQ;
import org.myalice.mapping.websocket.FAQMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FAQService {
	
	@Autowired
	private FAQMapper mapper;
	
	public List<FAQ> getFAQ() {
		return mapper.selectValid();
	}
}
