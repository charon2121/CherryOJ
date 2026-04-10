# CherryOJ 文档分类体系

## Problem Layer（问题层） 

解决：为什么做

只回答：
为什么做
不讨论怎么做

```
/project/problem.md
```

内容：

- 用户问题
- 业务目标
- 成功指标

用途：生成 PRD

## Requirement Layer（需求层）

```
/prd/*.md
```

解决：要做什么
只回答：
功能是什么
不涉及技术实现

内容：

- 功能描述
- 用户场景
- 规则 / 边界

用途：生成结构

## Structure Layer（结构层）

解决：系统长什么样（抽象结构）
只回答：
系统结构 / 页面结构
不涉及数据库、技术选型

```
/structure/*.md
/ui/*.md   （结构化原型）
```

用途：生成 UI

## Design Layer（设计层）

解决：怎么实现
只回答：

技术实现
API / DB / 架构

```
/design/*.md
```

内容：
架构设计
API
数据模型
技术选型

生成：生成代码

## Execution Layer（执行层）

解决：怎么落地执行
只回答：
具体要做哪些步骤

```
/tasks/*.json
/tests/*.md
/deploy/*.md
```

内容：
任务拆解
测试用例
部署流程
