package com.cherry.model.dto.submission;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmissionCaseResultDto {

    private Integer caseNo;
    private String resultCode;
    private Integer timeUsedMs;
    private Integer memoryUsedKb;
    private String message;
}
