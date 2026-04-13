package com.cherry.controller;

import com.cherry.auth.RequireLogin;
import com.cherry.common.api.ApiResponse;
import com.cherry.model.dto.submission.CreateSubmissionRequest;
import com.cherry.model.dto.submission.CreateSubmissionResponse;
import com.cherry.model.dto.submission.SubmissionDetailDto;
import com.cherry.service.OjSubmissionFacadeService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final OjSubmissionFacadeService ojSubmissionFacadeService;

    /**
     * 获取判题结果
     */
    @RequireLogin
    @GetMapping("/{submissionId}")
    public ApiResponse<SubmissionDetailDto> getSubmission(@PathVariable Long submissionId) {
        return ApiResponse.ok(ojSubmissionFacadeService.getSubmission(submissionId));
    }

    /**
     * 提交代码
     */
    @RequireLogin
    @PostMapping
    public ApiResponse<CreateSubmissionResponse> submit(@RequestBody CreateSubmissionRequest request) {
        return ApiResponse.ok(ojSubmissionFacadeService.createSubmission(request));
    }
}
