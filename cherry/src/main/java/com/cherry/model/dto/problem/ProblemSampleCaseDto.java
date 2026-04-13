package com.cherry.model.dto.problem;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProblemSampleCaseDto {

    private Integer caseNo;
    private String input;
    private String output;
}
