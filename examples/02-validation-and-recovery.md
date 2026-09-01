# 验证记录与会话恢复

v0.4 增加了两类项目记忆：

- `.super-pm/state.yaml`：当前阶段、目标、开放假设和下一步
- `.super-pm/validations.md`：已经执行的验证及其结果

## 恢复项目上下文

新会话开始时：

```text
调用 super_pm_recovery_summary
project: /absolute/path/to/project
```

它会返回：

- 当前产品阶段
- 当前目标和负责人
- 当前产品决定
- 未解决假设
- 最近三次验证
- 下一步行动

## 记录已执行验证

只有验证实际执行后才记录：

```text
调用 super_pm_record_validation
project: /absolute/path/to/project
title: 一周留存验证
hypothesis: 独立开发者愿意持续使用
predicted: 用户会在第二周再次整理反馈
method: 邀请 10 位独立开发者试用一周
threshold: 次周留存 >= 40%
observed: 6 位用户完成第二次整理
interpretation: 达到预设阈值
decision_change: 保持 DEC-0001
next_action: 扩大到 30 位用户
decision_id: DEC-0001
```

验证记录必须区分计划和事实。没有执行的验证不能填写观察结果。

## 更新当前状态

```text
调用 super_pm_update_state
project: /absolute/path/to/project
stage: validation
objective: 验证独立开发者是否愿意持续使用
lead: 产品负责人
current_decision: DEC-0001
open_assumptions:
  - 用户愿意持续使用
last_validation: VAL-0001
next_action: 扩大到 30 位用户
```

状态更新只保存当前摘要，不替代完整决策和验证历史。

## 根据结果改变决定

如果结果推翻了原来的方向：

1. 先解释观察结果和解释。
2. 查看 `super_pm_decision_history`。
3. 明确新的产品决定和变更原因。
4. 得到用户确认后调用 `super_pm_save_decision`。
5. 再更新 `super_pm_update_state` 和后续 Task Board 草稿。

不要因为验证记录写入成功，就自动修改产品决定或创建开发任务。
