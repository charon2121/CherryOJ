package com.cherry.model.entity;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ProblemTemplate {

    private Long id;
    private Long problemId;
    private Long languageId;
    private String templateCode;
    private String wrapperCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
