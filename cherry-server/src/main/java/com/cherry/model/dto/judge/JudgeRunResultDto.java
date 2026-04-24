package com.cherry.model.dto.judge;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class JudgeRunResultDto {

    @JsonProperty("case_id")
    private String caseId;

    @JsonProperty("case_no")
    private Integer caseNo;

    private String verdict;

    @JsonProperty("exit_code")
    private Integer exitCode;

    private Integer signal;

    @JsonProperty("time_ms")
    private Integer timeMs;

    @JsonProperty("memory_kb")
    private Integer memoryKb;

    @JsonProperty("stdout_text")
    private String stdoutText;

    @JsonProperty("stderr_text")
    private String stderrText;
}
