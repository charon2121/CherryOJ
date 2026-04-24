package com.cherry.model.dto.submission;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmissionEventDto {

    private Long submissionId;
    private String status;
    private String resultCode;
    private Integer passedCases;
    private Integer totalCases;
    private String message;
}
