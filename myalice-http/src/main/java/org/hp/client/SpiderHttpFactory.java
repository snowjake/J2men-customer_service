package org.hp.client;

import org.hp.impl.client.DefaultSpiderHttp;

public class SpiderHttpFactory {

    public static final SpiderHttp createFactory() {
        return new DefaultSpiderHttp();
    }

}
