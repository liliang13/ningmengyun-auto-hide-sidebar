# 自动隐藏柠檬云财务右侧栏

一个用于柠檬云财务（ningmengyun.com）的油猴脚本（Tampermonkey / 篡改猴用户脚本）。

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

## 匹配范围

脚本只匹配：

```
https://jpro6.ningmengyun.com/Default/Default*
```

## License

MIT
