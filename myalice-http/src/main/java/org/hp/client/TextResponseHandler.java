package org.hp.client;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.hp.client.views.TextView;

import java.io.Closeable;
import java.io.InputStream;

public class TextResponseHandler implements SpiderResponseHandler {

    SpiderHttp spiderHttp;
    HttpResponse response;

    public TextResponseHandler(SpiderHttp spiderHttp, HttpResponse response) {
        this.spiderHttp = spiderHttp;
        this.response = response;
    }

    @Override
    public TextView process() {
        try {
            if (null == response) {
                return null;
            }
            InputStream input = response.getEntity().getContent();
            return new TextView(IOUtils.toString(input, spiderHttp.getCharset()));
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            if (spiderHttp.getCurrentHttpClient() instanceof Closeable) {
                Closeable closeable = (Closeable) spiderHttp.getCurrentHttpClient();
                try {
                    closeable.close();
                } catch (Exception e2) {
                }
            }

            if (response instanceof Closeable) {
                Closeable closeable = (Closeable) spiderHttp.getCurrentHttpClient();
                try {
                    closeable.close();
                } catch (Exception e2) {
                }
            }
        }
    }

}
