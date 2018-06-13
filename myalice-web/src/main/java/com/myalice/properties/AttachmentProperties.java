package com.myalice.properties;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.boot.autoconfigure.security.SecurityPrerequisite;
import org.springframework.boot.context.properties.ConfigurationProperties;

import com.myalice.utils.Tools;

@ConfigurationProperties(prefix = "spring.upload")
public class AttachmentProperties  implements SecurityPrerequisite {
	
	
	
	private String path ; 
	
	private String dateformat ;
	
	private String currentDate ; 

	public String getPath() {
		return path;
	}

	public String getCurrentDate() {
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern(dateformat);
		LocalDateTime dateTime = LocalDateTime.now() ;
		currentDate = dtf.format(dateTime) ; 
		return currentDate;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getDateformat() {
		return dateformat;
	}

	public void setDateformat(String dateformat) {
		this.dateformat = dateformat; 
	}
	
	
	public String getCurrentPath(){
		return String.format("%s/%s", path , getCurrentDate() ) ;
	}
	public String getFilePath(String path){
		return String.format("%s/%s", this.path , path ) ; 
	}
	
	
	public String getNewFileName(String originalFilename){
		int indexOf = originalFilename.indexOf(".");
		if(indexOf != -1){
			return Tools.uuid() + originalFilename.substring(indexOf) ;
		}
		return Tools.uuid();
	}
	
}
