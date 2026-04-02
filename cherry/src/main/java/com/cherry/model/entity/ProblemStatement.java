package com.cherry.model.entity;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ProblemStatement {

    private Long problemId;
    private String description;
    private String hint;
    private String source;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
