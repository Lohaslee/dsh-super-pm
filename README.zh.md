# dsh-super-pm

中文说明请查看主文档：[README.md](README.md)。主文档包含 Super PM 的产品定位、DSH 插件说明、安装方式、开发验证和发布流程。

`dsh-super-pm` 是一个面向 **DeepSeek Harness（DSH）** 的标准插件，用于打包和分发 [Super PM](https://github.com/Lohaslee/super-pm) 产品思考 Skill。

它把 Super PM 的产品分析方法、七套产品视角、双语参考资料和工作流，以 DSH 可安装的插件形式提供给模型使用。

快速安装：

```bash
dsh plugin --profile web add github:Lohaslee/dsh-super-pm
```

安装后重启 `dsh web`，直接发送产品请求即可触发，例如：`使用 super-pm，帮我判断首个版本该服务谁`。不要把 `/super-pm` 当成直接命令，因为 DSH Slash Command 不会创建模型回合。完整介绍、能力说明、开发命令和发布流程请阅读 [README.md](README.md)。
