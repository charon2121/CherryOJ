package com.cherry.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.cherry.auth.AuthorizationInterceptor;

@Configuration
@EnableConfigurationProperties({CorsProperties.class, JwtProperties.class})
public class CorsConfig implements WebMvcConfigurer {

    private final CorsProperties corsProperties;
    private final AuthorizationInterceptor authorizationInterceptor;

    public CorsConfig(
            CorsProperties corsProperties,
            AuthorizationInterceptor authorizationInterceptor) {
        this.corsProperties = corsProperties;
        this.authorizationInterceptor = authorizationInterceptor;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(
                        corsProperties.getAllowedOriginPatterns().toArray(String[]::new))
                .allowedMethods(
                        corsProperties.getAllowedMethods().toArray(String[]::new))
                .allowedHeaders(
                        corsProperties.getAllowedHeaders().toArray(String[]::new))
                .allowCredentials(corsProperties.isAllowCredentials())
                .maxAge(corsProperties.getMaxAge());
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authorizationInterceptor);
    }
}
