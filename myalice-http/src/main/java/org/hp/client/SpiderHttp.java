package org.hp.client;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;

import java.nio.charset.Charset;

public interface SpiderHttp {

     HttpResponse put(String uri, NameValuePair... data);

     HttpResponse delete(String uri);

     HttpResponse post(String uri, NameValuePair... data);

     HttpResponse postBody(String uri, String content);

     HttpResponse head(String uri, NameValuePair... data);

     HttpResponse patch(String uri, NameValuePair... data);

     HttpResponse get(String uri, NameValuePair... data);

     void setCharset(Charset charset);

     Charset getCharset();

     HttpClient getCurrentHttpClient();
}
