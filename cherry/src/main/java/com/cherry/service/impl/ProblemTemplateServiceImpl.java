package com.cherry.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.entity.ProblemTemplate;
import com.cherry.mapper.ProblemTemplateMapper;
import com.cherry.service.ProblemTemplateService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProblemTemplateServiceImpl implements ProblemTemplateService {

    private final ProblemTemplateMapper problemTemplateMapper;

    @Override
    @Transactional
    public ProblemTemplate create(ProblemTemplate template) {
        problemTemplateMapper.insert(template);
        return template;
    }

    @Override
    @Transactional
    public void update(ProblemTemplate template) {
        problemTemplateMapper.updateById(template);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        problemTemplateMapper.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProblemTemplate> findById(Long id) {
        return Optional.ofNullable(problemTemplateMapper.selectById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<ProblemTemplate> page(PageQuery pageQuery) {
        long total = problemTemplateMapper.count();
        List<ProblemTemplate> items =
                problemTemplateMapper.selectPage(pageQuery.offset(), pageQuery.getPageSize());
        return new PageResult<>(items, total, pageQuery.getPage(), pageQuery.getPageSize());
    }
}
