package org.myalice.websocket.ctrl;

import java.util.List;

import org.myalice.domain.websocket.FAQ;
import org.myalice.websocket.service.FAQService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/websocket/faq")
@RestController
public class FAQAction {
	
	@Autowired
	private FAQService faqService;

	@RequestMapping("/list")
	public List<FAQ> getFAQ() {
		return faqService.getFAQ();
	}
}
