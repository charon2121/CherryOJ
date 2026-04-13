package com.cherry.controller.admin;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cherry.auth.RequireAdmin;
import com.cherry.common.api.ApiResponse;
import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.model.dto.admin.AdminProblemDetailDto;
import com.cherry.model.dto.admin.AdminProblemListItemDto;
import com.cherry.model.dto.admin.AdminProblemUpsertRequest;
import com.cherry.service.AdminProblemFacadeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/problems")
@RequireAdmin
@RequiredArgsConstructor
public class AdminProblemController {

    private final AdminProblemFacadeService adminProblemFacadeService;

    @GetMapping
    public ApiResponse<PageResult<AdminProblemListItemDto>> listProblems(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize) {
        return ApiResponse.ok(adminProblemFacadeService.listProblems(new PageQuery(page, pageSize)));
    }

    @GetMapping("/{problemId}")
    public ApiResponse<AdminProblemDetailDto> getProblem(@PathVariable Long problemId) {
        return ApiResponse.ok(adminProblemFacadeService.getProblem(problemId));
    }

    @PostMapping
    public ApiResponse<AdminProblemDetailDto> createProblem(@RequestBody AdminProblemUpsertRequest request) {
        return ApiResponse.ok(adminProblemFacadeService.createProblem(request));
    }

    @PutMapping("/{problemId}")
    public ApiResponse<AdminProblemDetailDto> updateProblem(
            @PathVariable Long problemId,
            @RequestBody AdminProblemUpsertRequest request) {
        return ApiResponse.ok(adminProblemFacadeService.updateProblem(problemId, request));
    }

    @DeleteMapping("/{problemId}")
    public ApiResponse<Void> deleteProblem(@PathVariable Long problemId) {
        adminProblemFacadeService.deleteProblem(problemId);
        return ApiResponse.ok();
    }
}
