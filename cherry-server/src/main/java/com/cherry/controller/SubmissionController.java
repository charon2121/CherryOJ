package com.cherry.controller;

import com.cherry.auth.RequireLogin;
import com.cherry.common.api.ApiResponse;
import com.cherry.model.dto.submission.CreateSubmissionRequest;
import com.cherry.model.dto.submission.CreateSubmissionResponse;
import com.cherry.model.dto.submission.SubmissionDetailDto;
import com.cherry.model.dto.submission.SubmissionEventDto;
import com.cherry.service.SubmissionEventService;
import com.cherry.service.OjSubmissionFacadeService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final OjSubmissionFacadeService ojSubmissionFacadeService;
    private final SubmissionEventService submissionEventService;

    /**
     * 获取判题结果
     */
    @RequireLogin
    @GetMapping("/{submissionId}")
    public ApiResponse<SubmissionDetailDto> getSubmission(@PathVariable Long submissionId) {
        return ApiResponse.ok(ojSubmissionFacadeService.getSubmission(submissionId));
    }

    @RequireLogin
    @GetMapping(value = "/{submissionId}/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeSubmission(@PathVariable Long submissionId) {
        SubmissionEventDto snapshot = ojSubmissionFacadeService.getSubmissionEvent(submissionId);
        return submissionEventService.subscribe(submissionId, snapshot);
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
