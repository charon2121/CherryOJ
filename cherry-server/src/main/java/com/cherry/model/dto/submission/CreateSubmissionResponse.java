package com.cherry.model.dto.submission;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateSubmissionResponse {

    private Long submissionId;
    private String status;
    private String resultCode;
}
