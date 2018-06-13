package org.hp.impl.client;

import java.nio.charset.Charset;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Arrays;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpHead;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.ssl.TrustStrategy;
import org.hp.charset.SpiderCharset;
import org.hp.client.SpiderHttp;
import org.hp.request.SpiderRequestContentType;
import org.hp.request.SpiderRequestUserAgent;

public class DefaultSpiderHttp implements SpiderHttp {

    protected ThreadLocal<HttpClient> httpClientThread = new ThreadLocal<>();


    protected Charset charset = SpiderCharset.UTF_8;

    public HttpClient getHttpClient(String uri) {
        boolean withAny = StringUtils.startsWithAny(uri, "https", "HTTPS");
        if (withAny) {
            try {
                javax.net.ssl.SSLContext sslContext = new SSLContextBuilder()
                        .loadTrustMaterial(null,
                                new TrustStrategy() {
                                    public boolean isTrusted(X509Certificate[] chain, String authType)
                                            throws CertificateException {
                                        return true;
                                    }
                                }).build();
                SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext);
                CloseableHttpClient build = HttpClients.custom().setSSLSocketFactory(sslsf).build();
                return build;
            } catch (Exception e) {
                e.printStackTrace();
            }
            throw new RuntimeException("create Https Exception");
        }
        HttpClientBuilder create = HttpClientBuilder.create();
        create.addInterceptorFirst(new SpiderRequestUserAgent());
        create.addInterceptorFirst(new SpiderRequestContentType());
        CloseableHttpClient build = create.build();
        return build;
    }

    @Override
    public HttpClient getCurrentHttpClient() {
        return httpClientThread.get();
    }

    public HttpResponse execute(HttpClient client, HttpRequestBase request) {
        try {
            return client.execute(request);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public HttpEntity getEntity(NameValuePair... data) {
        return new UrlEncodedFormEntity(Arrays.asList(data), charset);
    }

    public HttpResponse put(String uri, NameValuePair... data) {
        HttpPut request = new HttpPut(uri);
        request.setEntity(getEntity(data));

        return execute(getHttpClient(uri), request);
    }

    public HttpResponse delete(String uri) {
        HttpDelete request = new HttpDelete(uri);
        return execute(getHttpClient(uri), request);
    }

    public HttpResponse post(String uri, NameValuePair... data) {
        HttpPost request = new HttpPost(uri);
        request.setEntity(getEntity(data));
        return execute(getHttpClient(uri), request);
    }

    public HttpResponse postBody(String uri, String content) {
        HttpPost request = new HttpPost(uri);
        request.setEntity(new StringEntity(content, charset));
        return execute(getHttpClient(uri), request);
    }

    public HttpResponse head(String uri, NameValuePair... data) {
        HttpHead request = new HttpHead();
        return execute(getHttpClient(uri), request);
    }

    public HttpResponse patch(String uri, NameValuePair... data) {
        HttpPatch request = new HttpPatch();
        return execute(getHttpClient(uri), request);
    }

    public HttpResponse get(String uri, NameValuePair... data) {
        StringBuffer buffer = new StringBuffer();
        Stream.of(data).forEach(param -> {
            if (buffer.length() > 0) {
                buffer.append("&");
            }
            buffer.append(param.getName());
            if (!StringUtils.isBlank(param.getValue())) {
                buffer.append("=").append(param.getValue());
            }
        });
        if (!StringUtils.isEmpty(buffer)) {
            if (StringUtils.indexOf(uri, "?") == StringUtils.INDEX_NOT_FOUND) {
                uri = uri + "?" + buffer;
            } else {
                uri = uri + "&" + buffer;
            }
        }
        HttpGet request = new HttpGet(uri);

        return execute(getHttpClient(uri), request);
    }

    public void setCharset(Charset charset) {
        this.charset = charset;
    }


    @Override
    public Charset getCharset() {
        return charset;
    }
}
