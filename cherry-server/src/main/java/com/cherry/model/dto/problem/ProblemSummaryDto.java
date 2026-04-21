package com.cherry.model.dto.problem;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProblemSummaryDto {

    private Long id;
    private String problemCode;
    private String title;
    private Integer difficulty;
    private Integer status;
    private Integer judgeMode;
    private Integer defaultTimeLimitMs;
    private Integer defaultMemoryLimitMb;
}
