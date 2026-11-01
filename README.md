# 柠檬云财务自动隐藏右侧栏

一个用于柠檬云财务（jpro6.ningmengyun.com）的油猴脚本（Tampermonkey / 篡改猴用户脚本）。

打开首页后自动收起右侧悬浮栏，并在你手动展开 / 收起时保持侧栏原来的位置，不会跑回页面顶部。

## 功能

- 页面加载完成后自动点击「隐藏侧边」按钮收起右侧悬浮栏
- 点击展开或再次收起时，记录收起前的 `top` 并强制恢复，防止侧栏回到顶部
- 支持篡改猴自动更新

## 安装

1. 浏览器安装 [Tampermonkey（篡改猴）](https://www.tampermonkey.net/) 扩展
2. 打开脚本的 Raw 地址：

   <https://raw.githubusercontent.com/liliang13/ningmengyun-auto-hide-sidebar/main/ningmengyun-auto-hide-sidebar.user.js>

3. 篡改猴会弹出安装页面，点击「安装」即可

## 自动更新

脚本内置了 `@updateURL` 和 `@downloadURL`，指向本仓库的 Raw 地址。篡改猴会按自己设置里的「检查更新」周期自动拉取新版本。

> 注意：GitHub Raw 有 CDN 缓存，推送后通常需要几分钟才能在 Raw 地址看到最新版本，所以不是保存后立刻生效。

## 本地开发（自动推送工作流）

本仓库附带了一个 PowerShell 监听脚本，实现本地编辑 → 自动推送到 GitHub → 篡改猴自动更新。

### 文件说明

| 文件 | 作用 |
| --- | --- |
| `ningmengyun-auto-hide-sidebar.user.js` | 主脚本 |
| `watch-and-push.ps1` | 监听脚本，检测到 `.user.js` 变化后自动 bump patch 版本并推送 |
| `register-task.ps1` | 注册 Windows 计划任务，登录时自动启动监听脚本 |
| `watcher.log` | 监听日志 |

### 工作原理

1. 编辑并保存 `ningmengyun-auto-hide-sidebar.user.js`
2. `watch-and-push.ps1` 检测到文件变化
3. 自动递增 `// @version` 的 patch 号
4. 执行 `node --check` 语法检查
5. `git commit` 并通过 SSH 推送到 `origin/main`
6. 篡改猴按自身周期从 Raw 地址拉取更新

### 设置

以管理员或当前用户运行：

```powershell
.\register-task.ps1
```

会创建计划任务 `NingmengyunUserscriptAutoPush`，登录时自动启动 `watch-and-push.ps1`。

也可以手动启动监听：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File .\watch-and-push.ps1
```

## 环境要求

- Windows
- PowerShell 5.1+
- Node.js（用于 `node --check` 语法检查）
- Git（使用 SSH 推送到 GitHub）

## 匹配范围

脚本只匹配：

```
https://jpro6.ningmengyun.com/Default/Default*
```

## License

MIT
