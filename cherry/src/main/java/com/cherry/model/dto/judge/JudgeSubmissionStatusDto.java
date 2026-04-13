package com.cherry.model.dto.judge;

import lombok.Data;

@Data
public class JudgeSubmissionStatusDto {

    private String status;
    private JudgeResultDto result;
}
