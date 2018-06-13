package com.myalice.config;

import java.net.InetAddress;

import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.TransportAddress;
import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "alice.elasticsearch")
public class ElasticsearchProporties {

	Logger logger = LoggerFactory.getLogger(ElasticsearchProporties.class);
	private String clusterNodes;
	private String elasticsearch;
	private String clusterName;
	private Integer clusterPort;

	protected static TransportClient transportClient = null;

	public TransportClient createTransportClient() {
		try {
			if (null == transportClient) {
				Settings settings = Settings.builder()
						.put("cluster.name", getClusterName()) // 集群名字
						.put("client.transport.sniff", true)// 增加嗅探机制，找到ES集群
						.put("thread_pool.search.size", 5)// 增加线程池个数，暂时设为5
						.build();
				transportClient = new PreBuiltTransportClient(settings);
				TransportAddress transportAddress = new TransportAddress(
						InetAddress.getByName(getClusterNodes()),
						getClusterPort());
				transportClient.addTransportAddresses(transportAddress);
			}
			return transportClient;
		} catch (Exception e) {
			logger.error("createTransportClient had error:" + e.getMessage(), e);
		}
		return transportClient;
	}

	public String getClusterNodes() {
		return clusterNodes;
	}

	public void setClusterNodes(String clusterNodes) {
		this.clusterNodes = clusterNodes;
	}

	public String getElasticsearch() {
		return elasticsearch;
	}

	public void setElasticsearch(String elasticsearch) {
		this.elasticsearch = elasticsearch;
	}

	public String getClusterName() {
		return clusterName;
	}

	public void setClusterName(String clusterName) {
		this.clusterName = clusterName;
	}

	public Integer getClusterPort() {
		return clusterPort;
	}

	public void setClusterPort(Integer clusterPort) {
		this.clusterPort = clusterPort;
	}

}
