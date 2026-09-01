# dsh-super-pm

这是一个标准的 DeepSeek Harness 插件，用于打包 [Super PM](https://github.com/Lohaslee/super-pm) 产品思考 Skill。

插件将原始 Skill 做成自包含的 DSH bundle。安装后，DSH 会从插件自带的 `skills/` 目录发现 `super-pm`，同时保留项目和用户原有的 Skill 根目录。

## 在 DSH 中安装

从本地 checkout 安装：

```bash
dsh plugin --profile web add /absolute/path/to/dsh-super-pm
```

发布到 GitHub 后安装：

```bash
dsh plugin --profile web add github:Lohaslee/dsh-super-pm
```

发布到 npm 后安装：

```bash
dsh plugin --profile web add dsh-super-pm
```

修改服务端 profile 组合后，需要重启 `dsh web`。启动后可以使用 `/super-pm`，也可以直接描述产品决策、0 到 1 想法、功能定义或产品诊断问题。

## 包含内容

- `skills/super-pm/SKILL.md`：面向模型的工作流和行为规则
- `skills/super-pm/references/`：中英文产品视角、路由、验证、决策记忆和 PRD 模板
- `skills/super-pm/scripts/`：上游 Skill 的来源校验脚本
- `cordis.patch.yml`：通过独立的 `skill-filesystem` provider 挂载插件自带 Skill 根目录
- `lib/index.js`：插件入口和资源信息

插件暂不增加未经定义的运行时工具或自定义 GUI。产品推理仍由 Skill 负责，插件负责可复现的分发和激活。

## 开发

```bash
npm install
npm run check
npm run pack:check
```

`npm run check` 会检查 JavaScript 入口、package.json 元数据、Skill frontmatter 和随包资源布局。

## 发布检查清单

1. 执行 `npm run check`。
2. 执行 `npm run pack:check`，确认 `skills/`、`lib/` 和 `cordis.patch.yml` 被打入包中。
3. 更新 `CHANGELOG.md` 和 package version。
4. 将仓库推送到 GitHub 并创建版本 tag。
5. 在干净的 DSH profile 中安装带 tag 的版本，确认 Skill 目录出现 `/super-pm`。

## 许可证

MIT。随包 Skill 保留上游仓库的许可证和署名背景，详见 [LICENSE](LICENSE)。
