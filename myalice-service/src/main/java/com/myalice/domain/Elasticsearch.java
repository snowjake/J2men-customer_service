package com.myalice.domain;

/**
 * @author  唐亚峰
 * @desc  ES的基础实体类
 */
public class Elasticsearch extends BaseDomain {
    private static final long serialVersionUID = -6503868296240621491L;

    private String id;
    private String index;
    private String type;
    private String data;

    public Elasticsearch() {
    }

    public Elasticsearch(String index, String id, String type) {
        this.index = index;
        this.id = id;
        this.type = type;
    }

    public Elasticsearch(String index, String id, String type, String data) {
        this.index = index;
        this.id = id;
        this.type = type;
        this.data = data;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "ElasticsearchVO{" +
                "index='" + index + '\'' +
                ", id='" + id + '\'' +
                ", type='" + type + '\'' +
                ", data='" + data + '\'' +
                '}';
    }
}
