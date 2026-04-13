package com.cherry.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cherry.common.api.ApiResponse;
import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.model.dto.problem.ProblemDetailDto;
import com.cherry.model.dto.problem.ProblemSummaryDto;
import com.cherry.service.OjProblemFacadeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final OjProblemFacadeService ojProblemFacadeService;

    @GetMapping
    public ApiResponse<PageResult<ProblemSummaryDto>> listProblems(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize) {
        return ApiResponse.ok(ojProblemFacadeService.listPublicProblems(new PageQuery(page, pageSize)));
    }

    @GetMapping("/{problemId}")
    public ApiResponse<ProblemDetailDto> getProblem(@PathVariable Long problemId) {
        return ApiResponse.ok(ojProblemFacadeService.getPublicProblem(problemId));
    }
}
