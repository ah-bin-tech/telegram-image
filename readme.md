# Telegram Image

基于 Telegram Bot API 的纯前端图床应用。零构建步骤，浏览器打开即用。

---

## 项目结构

```
telegram-image/
├── index.html          # 主页面 — 语义化 HTML5
├── style.css           # 样式 — CSS @layer + 自定义属性主题
├── script.js           # 逻辑 — ES Module + JSDoc 类型标注
├── jsconfig.json       # VS Code 类型检查配置
├── plan.md             # 原始设计规划
├── readme.md           # 项目文档（本文件）
├── *.png / *.ico       # Favicon 与 PWA 图标
```

扁平结构，无构建目录。`index.html` 通过 `<link>` 和 `<script type="module">` 直接引用同级 CSS/JS 文件。

## 技术栈

| 层面 | 技术 |
|---|---|
| 结构 | HTML5 语义标签（`<dialog>`、`<section>`、`<nav>`） |
| 样式 | CSS3 `@layer` 分层、`var()` 主题变量、`backdrop-filter` 毛玻璃、Grid/Flexbox |
| 逻辑 | ES Module + Import Map、`fetch` API、Web Crypto API（SHA-256）、`crypto.randomUUID()` |
| 外部依赖 | [dayjs](https://day.js.org/)（esm.sh CDN，通过 import map 引入） |
| 动画 | CSS `@keyframes`、ViewTransition API（主题切换） |
| 存储 | `localStorage`（配置 + 上传历史，两个独立 key） |
| 类型 | JSDoc 注释 + `jsconfig.json` |

## 架构概览

```
script.js （单文件，约 780 行）
├── I18N_DICT          # 三语言字典（zh-CN / en / ja，各 27 个 key）
├── I18n               # 多语言切换，自动更新 [data-i18n] 元素
├── ConfigManager      # localStorage（key: tg_image_config）读写
├── ThemeManager       # 浅色/深色切换，ViewTransition 平滑过渡
├── TemplateEngine     # 文件名模板引擎（日期/哈希/UUID/时间戳）
├── TelegramClient     # Bot API 封装（sendPhoto / sendVideo / sendDocument / getFile）
├── HistoryManager     # 上传历史（key: tg_image_history，最多 200 条）
├── Toast              # 轻量通知组件（success / error / info，3s 自动移除）
└── App                # 主控制器 — 事件绑定、UI 渲染、上传编排
```

## 数据流

```
用户选择文件（拖拽/点击/粘贴）
  → App.#handleFiles()
    → 校验文件大小（≤ 50 MB）
    → TemplateEngine.process() 生成文件名
    → TelegramClient.upload()
      → fetch POST → api.telegram.org/bot<token>/<method>
      → 解析响应提取 file_id
      → getFileUrl() → https://api.telegram.org/file/bot<token>/<path>
    → HistoryManager.add() 写入 localStorage
    → #renderGallery() 刷新卡片列表
```

## 配置项

所有配置存储在 `localStorage` 键 `tg_image_config` 下：

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `token` | string | `""` | Bot Token（`@BotFather` 获取） |
| `chatId` | string | `""` | 频道 username 或数字 ID（Bot 需为管理员） |
| `lang` | `"zh-CN"` \| `"en"` \| `"ja"` | `"zh-CN"` | 界面语言 |
| `theme` | `"light"` \| `"dark"` | `"light"` | 主题 |
| `template` | string | `"[name]_[hash:6].[ext]"` | 上传文件名模板 |

## 文件名模板变量

| 变量 | 示例输入 | 示例输出 | 说明 |
|---|---|---|---|
| `[name]` | `photo.jpg` | `photo` | 原文件名（不含扩展名） |
| `[ext]` | `photo.jpg` | `jpg` | 文件扩展名（小写） |
| `[date:YYYY-MM-DD]` | — | `2025-05-03` | dayjs 格式化的当前日期 |
| `[hash:8]` | — | `a1b2c3d4` | 文件 SHA-256 前 8 位（Web Crypto） |
| `[timestamp]` | — | `1714748400` | 10 位 Unix 时间戳 |
| `[uuid]` | — | `550e8400-e29b-...` | 随机 UUID v4（`crypto.randomUUID()`） |

`/` 可在模板中表达目录层级，仅作标识用途（Telegram 服务端不保留目录结构）：
`images/[date:YYYY/MM]/[name]_[hash:6].[ext]` → `images/2025/05/photo_a1b2c3.jpg`

## 设计系统

### 色彩

| CSS 变量 | 浅色值 | 深色值 | 用途 |
|---|---|---|---|
| `--color-accent` | `#0088cc` | `#2aabee` | Telegram 蓝 — 唯一强调色 |
| `--color-bg` | `#fff` | `#1c1c1e` | 页面背景 |
| `--color-bg-secondary` | `#f5f5f7` | `#2c2c2e` | 次级背景（卡片、输入框） |
| `--color-bg-tertiary` | `#e8e8ed` | `#3a3a3c` | 三级背景（占位图、进度条轨道） |
| `--color-text` | `#1d1d1f` | `#f5f5f7` | 主文字 |
| `--color-text-secondary` | `#86868b` | `#98989d` | 辅助文字、提示 |
| `--color-text-tertiary` | `#aeaeb2` | `#636366` | 占位 icon 等弱化元素 |
| `--color-glass-bg` | `rgba(255,255,255,0.72)` | `rgba(44,44,46,0.72)` | 毛玻璃（Header、Dialog） |
| `--color-glass-border` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` | 毛玻璃边框 |

### 圆角

| 变量 | 值 | 适用元素 |
|---|---|---|
| `--radius-sm` | `6px` | 标签、语言选择 |
| `--radius-md` | `10px` | 按钮、输入框、卡片 |
| `--radius-lg` | `16px` | 对话框、上传区、Hero 区 |
| `--radius-full` | `9999px` | 进度条 |

### 字体

- **正文**：系统字体栈（`-apple-system`, `SF Pro Display`, `Segoe UI` 等）
- **等宽**：`SF Mono`, `Cascadia Code`, `Fira Code` 等（模板输入框、`<code>` 标签）

### CSS 架构

```css
@layer base        /* 重置、CSS 变量、排版、[hidden] 保护 */
@layer components  /* 按钮、输入框、卡片、对话框、进度条、Toast、毛玻璃 */
@layer utilities   /* .sr-only、.text-center、.text-mono */
```

主题切换：`[data-theme="dark"]` 选择器覆盖 `:root` 变量 + `document.startViewTransition()` 动画。

### 动效

| 元素 | 动画 | 时长 |
|---|---|---|
| 按钮按下 | `scale(0.97)` | — |
| 按钮 hover | 背景色过渡 | 150ms |
| 上传区 drag-over | `scale(1.01)` + 边框色 | 250ms |
| 进度条（indeterminate） | `translateX` 往复滑动 | 1.2s 循环 |
| 对话框打开 | `scale(0.96)→scale(1)` + `translateY` + 透明度 | 250ms |
| Toast 入场 | `translateX(24px)→0` + 透明度 | 300ms |
| Toast 退场 | `translateX(20px)` + 透明度 | 200ms |
| 主题切换 | ViewTransition 淡入淡出 | 300ms |
| 画廊卡片 hover | `translateY(-2px)` + 阴影 | 150ms |

## 上传策略

`getUploadMethod()` 按 MIME 类型和文件大小自动选择 Telegram API 方法：

| 条件 | API 方法 | 大小限制 |
|---|---|---|
| `image/*`（非 SVG）| `sendPhoto` | ≤ 10 MB |
| `video/*` | `sendVideo` | ≤ 50 MB |
| 其他类型 / 超限图片 | `sendDocument` | ≤ 50 MB |

超过 50 MB 的文件在前端直接拦截，不会发送到 API。

## 界面状态

由 `ConfigManager.isConfigured`（token 和 chatId 均非空时返回 `true`）驱动：

| 状态 | Hero | 上传区 | 上传记录 |
|---|---|---|---|
| 未配置 | 可见 | 隐藏 | 隐藏 |
| 已配置 | 隐藏 | 可见 | 可见 |
| 上传中 | 隐藏 | 可见 + 进度条动画 | 可见 |

## HTML 结构

```
<header>           # sticky 毛玻璃导航栏
<main>
  <section#hero>        # 未配置时展示
  <section#upload>      # 拖拽上传 + 进度条
  <section#gallery>     # CSS Grid 自适应卡片列表
</main>
<dialog#settings>  # 表单模态框（token、chatId、模板）
<dialog#preview>   # 图片/视频预览 + 复制链接
<div#toast>        # fixed 通知容器
```

## 浏览器 API 使用

| API | 调用位置 | 用途 |
|---|---|---|
| `fetch` | `TelegramClient` | Bot API 通信 |
| `crypto.subtle.digest('SHA-256')` | `TemplateEngine` | `[hash:N]` 文件哈希 |
| `crypto.randomUUID()` | `TemplateEngine`、`App.#uploadFile` | UUID 生成 |
| `document.startViewTransition()` | `ThemeManager.#apply` | 主题切换动画 |
| `<dialog>.showModal()` | `App` | 原生模态框 |
| `navigator.clipboard.writeText()` | `App` | 复制 URL |
| `localStorage` | `ConfigManager`、`HistoryManager` | 持久化 |
| `dayjs`（esm.sh） | `TemplateEngine`、`App` | 日期格式化 |
| `importmap` | `index.html` | ES Module 依赖映射 |

## 本地使用

直接用浏览器打开 `index.html`。上传前需：

1. 通过 [@BotFather](https://t.me/BotFather) 创建 Bot，获取 Token
2. 创建公开频道，将 Bot 设为管理员
3. 在页面 **Settings** 中填入 Token 和 Chat ID

---

*纯 HTML5 + CSS3 + ES6+，零构建步骤，单文件部署。*

项目使用 DeepSeek-V4-Pro 模型 Vibe Coding 完成，需求到实现纯手工提示词驱动。初始架构和开发设计的提示词可以参考 [plan.md](./plan.md)。