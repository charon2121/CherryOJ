package com.cherry.model.dto.judge;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class JudgeCompileResultDto {

    private boolean success;

    @JsonProperty("exit_code")
    private Integer exitCode;

    @JsonProperty("time_ms")
    private Integer timeMs;

    @JsonProperty("memory_kb")
    private Integer memoryKb;

    @JsonProperty("stdout_text")
    private String stdoutText;

    @JsonProperty("stderr_text")
    private String stderrText;

    @JsonProperty("executable_path")
    private String executablePath;
}
