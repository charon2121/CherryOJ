package com.cherry.model.entity;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ProblemLanguageLimit {

    private Long id;
    private Long problemId;
    private Long languageId;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private Integer stackLimitMb;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
