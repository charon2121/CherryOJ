package com.cherry.model.dto.judge;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class JudgeWebhookRequest {

    @JsonProperty("task_id")
    private String taskId;

    @JsonProperty("submission_id")
    private String submissionId;

    private String status;

    private JudgeResultDto result;

    private JudgeWebhookError error;

    @Data
    public static class JudgeWebhookError {

        private String code;

        private String message;
    }
}
