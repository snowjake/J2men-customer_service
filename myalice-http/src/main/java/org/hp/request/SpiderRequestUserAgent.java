package org.hp.request;

import org.apache.http.HttpException;
import org.apache.http.HttpRequest;
import org.apache.http.HttpRequestInterceptor;
import org.apache.http.protocol.HTTP;
import org.apache.http.protocol.HttpContext;
import org.apache.http.util.Args;

import java.io.IOException;

public class SpiderRequestUserAgent implements HttpRequestInterceptor {
    protected static final String DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Spider1.0";
    private String userAgent = DEFAULT_USER_AGENT;

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public void process(HttpRequest request, HttpContext context) throws HttpException, IOException {
        Args.notNull(request, "HTTP request");
        request.addHeader(HTTP.USER_AGENT, userAgent);
    }
}
