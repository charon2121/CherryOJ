package com.cherry.model.dto.problem;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProblemDetailDto {

    private Long id;
    private String problemCode;
    private String title;
    private Integer difficulty;
    private Integer status;
    private Integer judgeMode;
    private Integer defaultTimeLimitMs;
    private Integer defaultMemoryLimitMb;
    private Integer defaultStackLimitMb;
    private String description;
    private String hint;
    private String source;
    private List<ProblemSampleCaseDto> sampleCases;
    private List<ProblemLanguageDto> supportedLanguages;
}
