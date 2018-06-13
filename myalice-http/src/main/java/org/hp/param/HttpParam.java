package org.hp.param;

import org.apache.http.message.BasicNameValuePair;

public class HttpParam extends BasicNameValuePair {
    private static final long serialVersionUID = 3957451374853189910L;

    public HttpParam(String name, String value) {
        super(name, value);
    }

    public HttpParam(String name) {
        super(name, null);
    }

}
