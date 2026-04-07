package com.cherry.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    /**
     * HS256 密钥（UTF-8 字节长度至少 32）。
     */
    private String secret = "";

    /**
     * JWT 与 Cookie Max-Age 一致的有效期（毫秒）。
     */
    private long expirationMs = 86_400_000L;

    private String cookieName = "cherry_jwt";

    private String cookiePath = "/";

    private boolean cookieSecure = false;
}
