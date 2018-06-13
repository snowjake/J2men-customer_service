package org.hp.request;

import org.apache.http.HttpException;
import org.apache.http.HttpRequest;
import org.apache.http.HttpRequestInterceptor;
import org.apache.http.protocol.HTTP;
import org.apache.http.protocol.HttpContext;
import org.apache.http.util.Args;

import java.io.IOException;

public class SpiderRequestContentType implements HttpRequestInterceptor {
    protected static final String CONTENT_TYPE = "application/json";
    private String contentType = CONTENT_TYPE;

   
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}


	public void process(HttpRequest request, HttpContext context) throws HttpException, IOException {
        Args.notNull(request, "HTTP request");
        request.addHeader(HTTP.CONTENT_TYPE, contentType); 
    }
}
