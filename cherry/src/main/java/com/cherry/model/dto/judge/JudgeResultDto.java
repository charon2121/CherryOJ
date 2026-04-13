package com.cherry.model.dto.judge;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class JudgeResultDto {

    @JsonProperty("submission_id")
    private String submissionId;

    @JsonProperty("final_verdict")
    private String finalVerdict;

    @JsonProperty("passed_cases")
    private Integer passedCases;

    @JsonProperty("total_cases")
    private Integer totalCases;

    @JsonProperty("total_time_ms")
    private Integer totalTimeMs;

    @JsonProperty("peak_memory_kb")
    private Integer peakMemoryKb;

    @JsonProperty("compile_result")
    private JudgeCompileResultDto compileResult;

    @JsonProperty("run_results")
    private List<JudgeRunResultDto> runResults;

    private String message;
}
