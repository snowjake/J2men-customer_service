package org.hp.client.views;

public class TextView extends View {

    public String text;

    public TextView(String text) {
        this.text = text;
    }

    @Override
    public String getValue() {
        return text;
    }
}
