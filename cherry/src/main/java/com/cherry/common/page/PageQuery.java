package com.cherry.common.page;

import lombok.Getter;

/**
 * 分页查询参数（1-based page）。
 */
@Getter
public class PageQuery {

    private final int page;
    private final int pageSize;

    public PageQuery(Integer page, Integer pageSize) {
        int p = page == null ? 1 : page;
        int ps = pageSize == null ? 20 : pageSize;
        this.page = Math.max(1, p);
        this.pageSize = Math.min(200, Math.max(1, ps));
    }

    public long offset() {
        return (long) (page - 1) * pageSize;
    }
}
