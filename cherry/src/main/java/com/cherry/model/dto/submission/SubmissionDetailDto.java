package com.cherry.model.dto.submission;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmissionDetailDto {

    private Long id;
    private Long userId;
    private Long problemId;
    private Long languageId;
    private String languageCode;
    private String status;
    private String resultCode;
    private Integer score;
    private Integer timeUsedMs;
    private Integer memoryUsedKb;
    private Integer codeLength;
    private Integer passedCases;
    private Integer totalCases;
    private String message;
    private LocalDateTime judgedAt;
    private LocalDateTime createdAt;
    private List<SubmissionCaseResultDto> testCaseResults;
}
