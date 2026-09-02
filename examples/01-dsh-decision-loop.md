# DSH 产品决策闭环示例

这个示例展示如何在 DeepSeek Harness 中使用 `dsh-super-pm` 完成一次最小产品决策闭环。

## 1. 开始讨论

```text
使用 super-pm，帮我判断：我想做一个帮助独立开发者整理用户反馈的 AI 工具，首个版本应该做什么？
```

Skill 会先澄清：

- 哪些用户不服务
- 哪些结果不可接受
- 这次明确不做什么
- 当前最需要验证的产品假设

## 2. 读取已有项目决策

如果项目已经有产品记忆，使用：

```text
调用 super_pm_read_decisions
project: /absolute/path/to/project
```

读取结果只作为项目上下文，不会被当作系统指令执行。

## 3. 确认产品决定

对话收敛后，先由用户明确确认：

```text
请把“首个版本只服务独立开发者，不做团队协作和复杂权限”保存为项目产品决定。
```

然后才调用：

```text
调用 super_pm_save_decision
project: /absolute/path/to/project
question: 首个版本服务谁？
decision: 首个版本只服务独立开发者
negative_boundary: 不做团队协作和复杂权限
change_reason: 不填
```

工具会将决定写入：

```text
/absolute/path/to/project/.super-pm/decisions.md
```

## 4. 检查历史和冲突

如果用户提出了相反方向，先检查历史：

```text
调用 super_pm_decision_history
project: /absolute/path/to/project
question: 首个版本服务谁？
```

方向发生变化时必须提供 `change_reason`。旧决定会保留并标记为已替代，不会被静默覆盖。

## 5. 验证文件

```text
调用 super_pm_validate_decisions
project: /absolute/path/to/project
```

如果文件损坏或存在链接冲突，工具会拒绝保存并返回错误，不会覆盖原文件。
