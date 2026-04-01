package com.cherry.entity;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Submission {

    private Long id;
    private Long userId;
    private Long problemId;
    private Long languageId;
    private Integer submitMode;
    private String sourceCode;
    private Integer status;
    private String resultCode;
    private Integer score;
    private Integer timeUsedMs;
    private Integer memoryUsedKb;
    private Integer codeLength;
    private LocalDateTime judgedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
