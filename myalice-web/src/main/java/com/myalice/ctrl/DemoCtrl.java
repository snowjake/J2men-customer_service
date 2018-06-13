package com.myalice.ctrl;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoCtrl {


	@GetMapping("/list")
	public String list1() {
		return "list";
	}
}
