package com.cherry.model.dto.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminProblemTestCaseDto {

    private Long id;
    private Integer caseNo;
    private String inputData;
    private String expectedOutput;
    private Integer score;
    private Integer isSample;
    private Integer status;
}
