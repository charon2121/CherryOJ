package com.cherry.config;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.cors")
public class CorsProperties {

    private List<String> allowedOriginPatterns = List.of(
            "http://localhost:3000",
            "http://127.0.0.1:3000");

    private List<String> allowedMethods = List.of(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD");

    private List<String> allowedHeaders = List.of("*");

    private boolean allowCredentials = false;

    private long maxAge = 3600;
}
