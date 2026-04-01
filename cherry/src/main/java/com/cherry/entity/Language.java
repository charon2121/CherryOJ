package com.cherry.entity;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Language {

    private Long id;
    private String code;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
