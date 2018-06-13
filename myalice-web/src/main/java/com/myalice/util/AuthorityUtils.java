package com.myalice.util;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.CollectionUtils;

public class AuthorityUtils {

	
	public static boolean isAdmin(Collection<? extends GrantedAuthority> authorities) {
		boolean isAdmin = false;
		if (!CollectionUtils.isEmpty(authorities)) {
			for (GrantedAuthority authority : authorities) {
				isAdmin = authority.getAuthority().indexOf("admin") > 0;
				if (isAdmin) {
					break;
				}
			}
		}
		return isAdmin;
	}
	
}
