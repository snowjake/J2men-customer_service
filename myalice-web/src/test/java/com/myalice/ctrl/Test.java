package com.myalice.ctrl;

import java.util.Arrays;

import com.myalice.utils.MyAliceUtils;

public class Test {
	
	
	public static void main(String[] args) throws Exception {
		String str = "[CQ:at,qq=3359888365] [CQ:at,qq=834865081] 你好"  ;
		
		System.out.println(Arrays.toString( MyAliceUtils.parseQqs(str) )) ; 
	}
	
}
