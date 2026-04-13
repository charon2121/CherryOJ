package com.cherry.service;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cherry.common.api.ResultCode;
import com.cherry.common.api.PageResult;
import com.cherry.common.exception.BusinessException;
import com.cherry.common.page.PageQuery;
import com.cherry.mapper.ProblemMapper;
import com.cherry.mapper.ProblemStatementMapper;
import com.cherry.mapper.TestCaseMapper;
import com.cherry.model.dto.admin.AdminProblemDetailDto;
import com.cherry.model.dto.admin.AdminProblemListItemDto;
import com.cherry.model.dto.admin.AdminProblemTestCaseDto;
import com.cherry.model.dto.admin.AdminProblemUpsertRequest;
import com.cherry.model.entity.Problem;
import com.cherry.model.entity.ProblemStatement;
import com.cherry.model.entity.TestCase;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminProblemFacadeService {

    private final ProblemMapper problemMapper;
    private final ProblemStatementMapper problemStatementMapper;
    private final TestCaseMapper testCaseMapper;

    @Transactional(readOnly = true)
    public PageResult<AdminProblemListItemDto> listProblems(PageQuery pageQuery) {
        long total = problemMapper.count();
        List<AdminProblemListItemDto> items = problemMapper.selectPage(pageQuery.offset(), pageQuery.getPageSize())
                .stream()
                .map(this::toListItem)
                .toList();
        return new PageResult<>(items, total, pageQuery.getPage(), pageQuery.getPageSize());
    }

    @Transactional(readOnly = true)
    public AdminProblemDetailDto getProblem(long problemId) {
        Problem problem = problemMapper.selectById(problemId);
        if (problem == null) {
            throw new BusinessException(ResultCode.NOT_FOUND, "题目不存在");
        }
        ProblemStatement statement = problemStatementMapper.selectByProblemId(problemId);
        List<TestCase> testCases = testCaseMapper.selectByProblemId(problemId);
        return toDetail(problem, statement, testCases);
    }

    @Transactional
    public AdminProblemDetailDto createProblem(AdminProblemUpsertRequest request) {
        validateRequest(request, null);

        Problem problem = new Problem();
        applyToProblem(problem, request);
        problemMapper.insert(problem);

        upsertStatement(problem.getId(), request);
        replaceTestCases(problem.getId(), request);
        return getProblem(problem.getId());
    }

    @Transactional
    public AdminProblemDetailDto updateProblem(long problemId, AdminProblemUpsertRequest request) {
        Problem problem = problemMapper.selectById(problemId);
        if (problem == null) {
            throw new BusinessException(ResultCode.NOT_FOUND, "题目不存在");
        }
        validateRequest(request, problemId);

        problem.setId(problemId);
        applyToProblem(problem, request);
        problemMapper.updateById(problem);

        upsertStatement(problemId, request);
        replaceTestCases(problemId, request);
        return getProblem(problemId);
    }

    @Transactional
    public void deleteProblem(long problemId) {
        Problem problem = problemMapper.selectById(problemId);
        if (problem == null) {
            throw new BusinessException(ResultCode.NOT_FOUND, "题目不存在");
        }
        testCaseMapper.deleteByProblemId(problemId);
        problemStatementMapper.deleteByProblemId(problemId);
        problemMapper.deleteById(problemId);
    }

    private AdminProblemListItemDto toListItem(Problem problem) {
        return AdminProblemListItemDto.builder()
                .id(problem.getId())
                .problemCode(problem.getProblemCode())
                .title(problem.getTitle())
                .difficulty(problem.getDifficulty())
                .status(problem.getStatus())
                .judgeMode(problem.getJudgeMode())
                .defaultTimeLimitMs(problem.getDefaultTimeLimitMs())
                .defaultMemoryLimitMb(problem.getDefaultMemoryLimitMb())
                .createdAt(problem.getCreatedAt())
                .updatedAt(problem.getUpdatedAt())
                .build();
    }

    private AdminProblemDetailDto toDetail(Problem problem, ProblemStatement statement, List<TestCase> testCases) {
        return AdminProblemDetailDto.builder()
                .id(problem.getId())
                .problemCode(problem.getProblemCode())
                .title(problem.getTitle())
                .judgeMode(problem.getJudgeMode())
                .defaultTimeLimitMs(problem.getDefaultTimeLimitMs())
                .defaultMemoryLimitMb(problem.getDefaultMemoryLimitMb())
                .defaultStackLimitMb(problem.getDefaultStackLimitMb())
                .difficulty(problem.getDifficulty())
                .status(problem.getStatus())
                .description(statement != null ? statement.getDescription() : "")
                .hint(statement != null ? statement.getHint() : "")
                .source(statement != null ? statement.getSource() : "")
                .createdAt(problem.getCreatedAt())
                .updatedAt(problem.getUpdatedAt())
                .testCases(testCases.stream().map(this::toTestCaseDto).toList())
                .build();
    }

    private AdminProblemTestCaseDto toTestCaseDto(TestCase testCase) {
        return AdminProblemTestCaseDto.builder()
                .id(testCase.getId())
                .caseNo(testCase.getCaseNo())
                .inputData(testCase.getInputData())
                .expectedOutput(testCase.getExpectedOutput())
                .score(testCase.getScore())
                .isSample(testCase.getIsSample())
                .status(testCase.getStatus())
                .build();
    }

    private void applyToProblem(Problem problem, AdminProblemUpsertRequest request) {
        problem.setProblemCode(request.getProblemCode().trim());
        problem.setTitle(request.getTitle().trim());
        problem.setJudgeMode(defaultIfNull(request.getJudgeMode(), 1));
        problem.setDefaultTimeLimitMs(defaultIfNull(request.getDefaultTimeLimitMs(), 1000));
        problem.setDefaultMemoryLimitMb(defaultIfNull(request.getDefaultMemoryLimitMb(), 256));
        problem.setDefaultStackLimitMb(request.getDefaultStackLimitMb());
        problem.setDifficulty(defaultIfNull(request.getDifficulty(), 1));
        problem.setStatus(defaultIfNull(request.getStatus(), 1));
    }

    private void upsertStatement(Long problemId, AdminProblemUpsertRequest request) {
        ProblemStatement existing = problemStatementMapper.selectByProblemId(problemId);
        ProblemStatement statement = new ProblemStatement();
        statement.setProblemId(problemId);
        statement.setDescription(orEmpty(request.getDescription()));
        statement.setHint(orEmpty(request.getHint()));
        statement.setSource(orEmpty(request.getSource()));
        if (existing == null) {
            problemStatementMapper.insert(statement);
        } else {
            problemStatementMapper.updateByProblemId(statement);
        }
    }

    private void replaceTestCases(Long problemId, AdminProblemUpsertRequest request) {
        testCaseMapper.deleteByProblemId(problemId);
        if (request.getTestCases() == null) {
            return;
        }
        for (AdminProblemUpsertRequest.AdminProblemTestCaseInput input : request.getTestCases()) {
            if (input == null) {
                continue;
            }
            boolean blank = isBlank(input.getInputData()) && isBlank(input.getExpectedOutput());
            if (blank) {
                continue;
            }
            TestCase testCase = new TestCase();
            testCase.setProblemId(problemId);
            testCase.setCaseNo(defaultIfNull(input.getCaseNo(), 1));
            testCase.setInputData(orEmpty(input.getInputData()));
            testCase.setExpectedOutput(orEmpty(input.getExpectedOutput()));
            testCase.setScore(defaultIfNull(input.getScore(), 0));
            testCase.setIsSample(defaultIfNull(input.getIsSample(), 1));
            testCase.setStatus(defaultIfNull(input.getStatus(), 1));
            testCaseMapper.insert(testCase);
        }
    }

    private void validateRequest(AdminProblemUpsertRequest request, Long currentProblemId) {
        if (request == null) {
            throw new IllegalArgumentException("请求体不能为空");
        }
        if (isBlank(request.getProblemCode())) {
            throw new IllegalArgumentException("题号不能为空");
        }
        if (isBlank(request.getTitle())) {
            throw new IllegalArgumentException("标题不能为空");
        }
        Problem existed = problemMapper.selectByProblemCode(request.getProblemCode().trim());
        if (existed != null && !Objects.equals(existed.getId(), currentProblemId)) {
            throw new BusinessException(ResultCode.CONFLICT, "题号已存在");
        }
    }

    private static String orEmpty(String value) {
        return value == null ? "" : value;
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private static Integer defaultIfNull(Integer value, Integer fallback) {
        return value != null ? value : fallback;
    }
}
