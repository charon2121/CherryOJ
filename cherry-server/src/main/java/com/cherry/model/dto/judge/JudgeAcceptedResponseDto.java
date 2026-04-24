package com.cherry.model.dto.judge;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class JudgeAcceptedResponseDto {

    @JsonProperty("submission_id")
    private String submissionId;

    @JsonProperty("task_id")
    private String taskId;

    private String status;
}
