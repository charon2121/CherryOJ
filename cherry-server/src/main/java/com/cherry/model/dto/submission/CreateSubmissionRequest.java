package com.cherry.model.dto.submission;

import lombok.Data;

@Data
public class CreateSubmissionRequest {

    private Long problemId;
    private String languageCode;
    private String sourceCode;
}
