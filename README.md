# dsh-super-pm

`dsh-super-pm` 是一个面向 **DeepSeek Harness（DSH）** 的标准插件，用于打包和分发 [Super PM](https://github.com/Lohaslee/super-pm) 产品思考 Skill。

它不是一个独立的产品管理系统，也不是简单的提示词集合，而是把 Super PM 的产品分析方法、七套产品视角、双语参考资料和工作流，以 DSH 可安装的插件形式提供给模型使用。

## Super PM 是什么

这个需求是真的吗？用户为什么要放弃现在的做法？如果只能做好一件事，应该是什么？又有哪些东西看起来很诱人，但这次坚决不能做？

AI 可以很快列出功能、写出 PRD，却不一定能陪你把产品真正想明白。有时文档越完整，一个没有被验证的假设反而越像事实。

Super PM 的目标，是陪你分析需求、拆开事实与假设、讨论取舍，把一个模糊想法逐步收敛成可以验证、可以交付的产品方向。

它最初面向独立开发者验证 0 到 1 的产品想法，也适用于已有产品诊断。软件、AI、硬件、服务、内容、平台、企业产品和线下体验，都可以使用这套方法进行讨论。

## 核心能力

- **负向边界优先**：先明确这次绝不能发生、明确不做和不可接受的成本，再讨论功能和方案。
- **区分事实与假设**：分开记录用户原话、事实、推断、建议和待验证假设，不用肯定语气掩盖未知。
- **动态组织产品视角**：只使用能够改变当前判断的产品维度和视角，不机械地让所有角色轮流发言。
- **支持 Lead PM**：可以指定一个产品视角负责整体方向，其他视角负责挑战、补充和识别风险。
- **适配不同产品类型**：根据问题选择需求与价值、产品系统、使用与交付、触点与形态、体验与信任等相关维度。
- **优先验证高风险假设**：先给出最低成本的验证方案，再决定是否进行外部研究、竞品检查或原型验证。
- **支持决策沉淀**：在获得明确授权后，将重要产品决定保存到项目的 `.super-pm/decisions.md`。
- **按需输出产物**：可以生成决策简报、产品报告或面向 AI coding agent 和交付团队的 PRD。
- **知道何时退出**：纯工程实现、翻译、一般事实问答以及需要专业权威的法律和财务结论，不会被强行套用产品视角。

## 七个产品视角

七套产品经验以化名呈现。它们是判断问题的方法，不是真人模拟，也不会为了凑人数轮流发言。

| 产品视角 | 主要关注 |
| --- | --- |
| 乔帮主 | 聚焦、取舍、完整体验、产品品质与叙事 |
| 龙哥 | 人性、克制、自然交互、注意力与社交压力 |
| 梁老师 | 用户状态、情绪驱动力、真需求、系统能力与机会判断 |
| 俞老师 | 用户价值、替换成本、交易结构、优先级与假设验证 |
| 师母 | 本质思考、一手用户洞察、突破机制、内容与推荐产品 |
| 想哥 | 产品定义、核心体验、商业闭环、组织与规模化 |
| 军哥 | 时机、专注执行、性价比、口碑、用户参与与复盘 |

其中“师母”是本 Skill 使用的一套产品视角化名，并非对具体人物的模拟或代言。

## 这是一个 DSH 插件

本项目与上游 `super-pm` Skill 的关系是：

```text
上游 super-pm Skill
        ↓ 随包分发
 dsh-super-pm DSH 插件
        ↓ 安装到 DeepSeek Harness
 DSH 发现 /super-pm 并加载 Skill
```

插件负责：

- 提供标准的 DSH `package.json` 元数据
- 通过 `cordis.patch.yml` 接入 DSH profile
- 挂载插件自带的 `skills/super-pm/` 目录
- 保留中英文参考资料、验证脚本和触发评测
- 让 Skill 可以从 GitHub、npm 或本地 checkout 安装

当前版本不额外注册自定义 GUI 或未经定义的运行时工具。产品推理由 Skill 负责，插件负责可复现的安装、分发和激活。

## 在 DSH 中安装

### 从 GitHub 安装

```bash
dsh plugin --profile web add github:Lohaslee/dsh-super-pm
```

### 从本地 checkout 安装

```bash
dsh plugin --profile web add /absolute/path/to/dsh-super-pm
```

### 从 npm 安装

```bash
dsh plugin --profile web add dsh-super-pm
```

修改服务端 profile 组合后，需要重启 `dsh web`。启动后可以使用 `/super-pm`，也可以直接描述产品决策、0 到 1 想法、功能定义或产品诊断问题。

## 包含内容

- `skills/super-pm/SKILL.md`：面向模型的完整工作流和行为规则
- `skills/super-pm/references/`：中英文产品视角、路由、验证、决策记忆和 PRD 模板
- `skills/super-pm/scripts/`：上游 Skill 的来源校验脚本
- `skills/super-pm/evals/`：触发行为评测样例
- `cordis.patch.yml`：通过独立的 `skill-filesystem` provider 挂载插件自带 Skill 根目录
- `lib/index.js`：DSH 插件入口和资源信息
- `scripts/validate.mjs`：插件结构与 Skill frontmatter 校验脚本

## 开发与验证

```bash
npm install
npm run check
npm run pack:check
```

`npm run check` 会检查：

- JavaScript 插件入口
- package.json 和 DSH bundle 元数据
- Skill frontmatter
- bundle patch 配置
- 随包 Skill 资源布局

验证上游 Skill 来源资料：

```bash
python3 skills/super-pm/scripts/validate_sources.py
```

## 发布到 GitHub

已有 GitHub 仓库时，提交和推送更新：

```bash
git add .
git commit -m "chore: prepare v0.1.0 release"
git push origin main
```

创建稳定版本 tag：

```bash
git tag v0.1.0
git push origin v0.1.0
```

建议发布前执行：

```bash
npm run check
npm run pack:check
python3 skills/super-pm/scripts/validate_sources.py
```

发布新版本时，请同步更新：

- `package.json` 中的 `version`
- `CHANGELOG.md`
- GitHub tag

发布后，建议在干净的 DSH profile 中安装带 tag 的版本，并确认 `/super-pm` 出现在技能目录中。

## 项目结构

```text
.
├── CHANGELOG.md
├── LICENSE
├── README.md
├── README.zh.md
├── .github/
│   └── workflows/ci.yml
├── cordis.patch.yml
├── lib/
│   └── index.js
├── package.json
├── scripts/
│   └── validate.mjs
└── skills/
    └── super-pm/
        ├── SKILL.md
        ├── agents/
        ├── evals/
        ├── references/
        └── scripts/
```

## 许可证

本插件采用 MIT License。随包的 Super PM Skill 保留上游仓库的许可证和署名背景，详见 [LICENSE](LICENSE) 与上游仓库 [Lohaslee/super-pm](https://github.com/Lohaslee/super-pm)。
