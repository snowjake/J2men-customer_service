package com.myalice.security;

import java.util.HashMap;
import java.util.List;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import com.myalice.utils.ResponseMessageBody;

public class BindingResultUtils {

	public static ResponseMessageBody parse(BindingResult bindingResult) {
		ResponseMessageBody result = null;
		if (bindingResult.hasErrors()) {
			List<FieldError> errors = bindingResult.getFieldErrors();
			errors.get(0).getField();
			errors.get(0).getDefaultMessage();
			HashMap<String, String> collect = errors.parallelStream().collect(HashMap::new, (coll, e) -> {
				coll.put(e.getField(), e.getDefaultMessage());
			}, (col1, col2) -> {
				col1.putAll(col2);
			});
			result = new ResponseMessageBody();
			result.setMsgMap(collect);
		}
		return result;
	}
}
