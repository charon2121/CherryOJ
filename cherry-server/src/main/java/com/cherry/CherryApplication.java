package com.cherry;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.cherry.mapper")
public class CherryApplication {

    public static void main(String[] args) {
        SpringApplication.run(CherryApplication.class, args);
    }

}
