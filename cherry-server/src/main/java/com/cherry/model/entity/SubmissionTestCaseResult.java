package com.cherry.model.entity;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class SubmissionTestCaseResult {

    private Long id;
    private Long submissionId;
    private Long testCaseId;
    private Integer caseNo;
    private String resultCode;
    private Integer timeUsedMs;
    private Integer memoryUsedKb;
    private String message;
    private LocalDateTime createdAt;
}
