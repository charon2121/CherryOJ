package com.cherry.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "app.judge")
public class JudgeProperties {

    private boolean enabled = true;
    private String baseUrl = "http://127.0.0.1:8081";
    private int connectTimeoutMs = 2000;
    private int pollIntervalMs = 200;
    private int maxWaitMs = 15000;
}
