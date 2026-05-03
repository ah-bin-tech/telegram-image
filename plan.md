# telegram-image

在当前目录下，使用纯 HTML 5、CSS 3、ES6+ 实现基于 `Telegram Bot API` 图床。

用户需要提供 `TG_Bot_Token` 和 `TG_Chat_ID`。

用户上传图片时，TG_Bot 将图片发送到公开的 TG 频道。

## 基础功能

- 本地配置：浏览器本地存储 `TG_Bot_Token` 和 `TG_Chat_ID`。
- 文件上传：支持图片/视频文件上传，并限制文件大小（Telegram Bot API 限制）。
- 文件预览：支持图片/视频文件的预览。

## 配置内容

- 基本信息：`TG_Bot_Token` 和 `TG_Chat_ID`。
- 偏好设置：默认语言（EN/CN/JP）、主题（浅色/深色）。
- 上传设置：支持文件名上传模版，需要支持：
  - `[name]` 和 `[ext]` 分别表示原文件名和扩展名。
  - `[date:format]`, 使用 `dayjs` 来格式化当前日期，format 是格式字符串，例如 `YYYY-MM-DD`。
  - `[hash:N]`, 其中 N 是一个数字，表示使用文件内容的前 N 位哈希值。
  - `[timestamp]`, 10 位的 Unix 时间戳。
  - `[uuid]`, 唯一的 UUID 值。
  - `/` 任意位置的斜杠都表示目录层级，例如 `images/[date:YYYY/MM/DD]/[name]_[hash:6].[ext]`。
  - 默认使用 `[name]_[hash:6].[ext]` 作为上传模版。

## UI 要求

- 未配置时首页显示 Hero 区：项目名称、简要介绍和快速操作入口。
- 使用 Telegram 的品牌颜色作为唯一强调色，突出重要元素。
- Apple 风格：简洁、优雅、注重细节的设计风格。
- 表单信息清晰，可选项明确，操作流程简单直观。
- 合适的高斯模糊、半透明、毛玻璃效果，提升界面层次感和视觉效果。
- 微动画、CSS 过渡、合适的 SVG icon 提升用户体验。
- 黑白灰、小圆角、扁平化、无阴影、紧凑小边距。
- select、popover 等使用原生元素，但适当主题化，保持系统一致性和性能。
- 支持 EN/CN/JP 多语言切换，满足不同用户的语言需求。
- 界面适应不同屏幕尺寸，包括桌面和移动设备。
- 清晰的导航结构，方便用户浏览和管理文件。
- 提供上传进度、操作成功或失败的反馈信息。
- 提供浅色和深色模式，满足用户的视觉偏好。

## 技术要求

- 维护一套 CSS 主题，使用 css var 方式，放在 style.css 文件中，通过不同的 layer 等封装常见的 UI 组件，如按钮、输入框、模态框等，确保代码的复用性和样式一致性。
- 使用 import map 从 esm.sh 引入模块，代码放在 script.js 文件中，使用模块化方式组织代码。
- 使用原生 fetch、现代 CSS 属性和现代 JavaScript，减少对第三方库或框架的依赖，确保代码轻量高效。
- 使用 JSDoc + jsonconfig.json 来提供类型安全和开发提示，提升开发效率和代码质量。
- 语义化的 HTML 结构，使用 CSS Flexbox 或 Grid 来布局，确保响应式设计。
- 使用最新的 HTML5、CSS3 和 ES6+ 技术，确保性能和体验优先，不考虑兼容性问题。
- 合适的 prefetch、preconnect 和 lazy loading 技术来优化性能，尤其是在目录预览和文件预览功能中。
- 使用 ES6 特性来编写代码，确保代码的可读性和维护性，包括但不限于 const、箭头函数、toSorted、Object.groupBy、async/await、Promise.all、模块化等。
- 尝试 ViewTransition API 等现代化的 Web API 来实现流畅的界面过渡和动画效果，提升用户体验。
