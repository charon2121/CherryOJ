package com.cherry.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cherry.common.api.PageResult;
import com.cherry.common.api.ResultCode;
import com.cherry.common.exception.BusinessException;
import com.cherry.common.page.PageQuery;
import com.cherry.mapper.LanguageMapper;
import com.cherry.mapper.ProblemLanguageLimitMapper;
import com.cherry.mapper.ProblemMapper;
import com.cherry.mapper.ProblemStatementMapper;
import com.cherry.mapper.TestCaseMapper;
import com.cherry.model.dto.problem.ProblemDetailDto;
import com.cherry.model.dto.problem.ProblemLanguageDto;
import com.cherry.model.dto.problem.ProblemSampleCaseDto;
import com.cherry.model.dto.problem.ProblemSummaryDto;
import com.cherry.model.entity.Language;
import com.cherry.model.entity.Problem;
import com.cherry.model.entity.ProblemLanguageLimit;
import com.cherry.model.entity.ProblemStatement;
import com.cherry.model.entity.TestCase;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OjProblemFacadeService {

    private static final int PROBLEM_STATUS_PUBLISHED = 1;

    private final ProblemMapper problemMapper;
    private final ProblemStatementMapper problemStatementMapper;
    private final TestCaseMapper testCaseMapper;
    private final LanguageMapper languageMapper;
    private final ProblemLanguageLimitMapper problemLanguageLimitMapper;

    @Transactional(readOnly = true)
    public PageResult<ProblemSummaryDto> listPublicProblems(PageQuery pageQuery) {
        long total = problemMapper.countPublished(PROBLEM_STATUS_PUBLISHED);
        List<ProblemSummaryDto> items = problemMapper
                .selectPublishedPage(PROBLEM_STATUS_PUBLISHED, pageQuery.offset(), pageQuery.getPageSize())
                .stream()
                .map(this::toProblemSummary)
                .toList();
        return new PageResult<>(items, total, pageQuery.getPage(), pageQuery.getPageSize());
    }

    @Transactional(readOnly = true)
    public ProblemDetailDto getPublicProblem(long problemId) {
        Problem problem = problemMapper.selectPublishedById(problemId, PROBLEM_STATUS_PUBLISHED);
        if (problem == null) {
            throw new BusinessException(ResultCode.NOT_FOUND, "题目不存在或未发布");
        }

        ProblemStatement statement = problemStatementMapper.selectByProblemId(problemId);
        List<TestCase> sampleCases = testCaseMapper.selectSamplesByProblemId(problemId);
        List<ProblemLanguageLimit> languageLimits = problemLanguageLimitMapper.selectByProblemId(problemId);
        Map<Long, Language> languagesById = languageMapper.selectAll().stream()
                .collect(Collectors.toMap(Language::getId, language -> language));

        List<ProblemLanguageDto> supportedLanguages;
        if (!languageLimits.isEmpty()) {
            supportedLanguages = languageLimits.stream()
                    .map(limit -> toProblemLanguage(limit, languagesById.get(limit.getLanguageId())))
                    .filter(language -> language.getCode() != null)
                    .sorted(Comparator.comparing(ProblemLanguageDto::getId))
                    .toList();
        } else {
            supportedLanguages = languageMapper.selectAll().stream()
                    .map(language -> ProblemLanguageDto.builder()
                            .id(language.getId())
                            .code(language.getCode())
                            .name(language.getName())
                            .timeLimitMs(problem.getDefaultTimeLimitMs())
                            .memoryLimitMb(problem.getDefaultMemoryLimitMb())
                            .stackLimitMb(problem.getDefaultStackLimitMb())
                            .build())
                    .toList();
        }

        return ProblemDetailDto.builder()
                .id(problem.getId())
                .problemCode(problem.getProblemCode())
                .title(problem.getTitle())
                .difficulty(problem.getDifficulty())
                .status(problem.getStatus())
                .judgeMode(problem.getJudgeMode())
                .defaultTimeLimitMs(problem.getDefaultTimeLimitMs())
                .defaultMemoryLimitMb(problem.getDefaultMemoryLimitMb())
                .defaultStackLimitMb(problem.getDefaultStackLimitMb())
                .description(statement != null ? statement.getDescription() : "")
                .hint(statement != null ? statement.getHint() : null)
                .source(statement != null ? statement.getSource() : null)
                .sampleCases(sampleCases.stream().map(this::toSampleCase).toList())
                .supportedLanguages(supportedLanguages)
                .build();
    }

    private ProblemSummaryDto toProblemSummary(Problem problem) {
        return ProblemSummaryDto.builder()
                .id(problem.getId())
                .problemCode(problem.getProblemCode())
                .title(problem.getTitle())
                .difficulty(problem.getDifficulty())
                .status(problem.getStatus())
                .judgeMode(problem.getJudgeMode())
                .defaultTimeLimitMs(problem.getDefaultTimeLimitMs())
                .defaultMemoryLimitMb(problem.getDefaultMemoryLimitMb())
                .build();
    }

    private ProblemSampleCaseDto toSampleCase(TestCase testCase) {
        return ProblemSampleCaseDto.builder()
                .caseNo(testCase.getCaseNo())
                .input(testCase.getInputData())
                .output(testCase.getExpectedOutput())
                .build();
    }

    private ProblemLanguageDto toProblemLanguage(ProblemLanguageLimit limit, Language language) {
        return ProblemLanguageDto.builder()
                .id(limit.getLanguageId())
                .code(language != null ? language.getCode() : null)
                .name(language != null ? language.getName() : null)
                .timeLimitMs(limit.getTimeLimitMs())
                .memoryLimitMb(limit.getMemoryLimitMb())
                .stackLimitMb(limit.getStackLimitMb())
                .build();
    }
}
