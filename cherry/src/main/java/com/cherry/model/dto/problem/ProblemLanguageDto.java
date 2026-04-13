package com.cherry.model.dto.problem;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProblemLanguageDto {

    private Long id;
    private String code;
    private String name;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private Integer stackLimitMb;
}
