# MythCanvas 字体使用规范

> 目标：用字体建立「神圣秩序 / 神话叙事 / 现代交互」三层视觉角色，同时避免全站古风化和字体滥用。

## 1. 字体角色

### Display — 思源宋体 / Source Han Serif SC

CSS Token：`--font-display`

用于承担品牌、页面结构和实体身份：

- 首页主标题「绘世神话」
- Logo 中文品牌名
- 页面 H1 / H2 / H3 / H4
- 神话、神域、角色等实体名称
- 大型栏目标题

视觉语义：**神圣、宏大、秩序、碑铭感**。

建议字重：

- Hero / H1：600–700
- H2 / H3：600
- 小型实体标题：500–600

禁止：正文、表单、按钮、导航、小字号元数据大面积使用。

---

### Literary — 霞鹜文楷 / LXGW WenKai

CSS Token：`--font-literary`

只用于短篇神话叙事和文化氛围文字：

- Hero Slogan / 氛围副标题
- 神话体系 1–3 行简介
- 角色 / 神域短介绍
- 诗句、典籍引用、题记
- 少量有叙事感的 Section Description

视觉语义：**人文、故事、东方、温度**。

默认字重：400；建议行高 `1.75–1.9`，字距 `0.02–0.04em`。

禁止：

- 长篇 SEO 正文
- 导航、按钮、筛选器、表单
- 英文名称 / 数字元数据
- 连续多个信息密集卡片的全部文字

原则：**霞鹜文楷是调味，不是基础字体。**

---

### UI — Inter / 系统无衬线

CSS Token：`--font-ui`

用于所有功能性和高密度信息：

- 导航
- Button / CTA
- 输入框 / Select / Filter
- Chip / Tag / Badge
- 数字、时间、分辨率、设备、Style 等 Metadata
- 英文辅助信息
- 长正文与 SEO 内容

视觉语义：**现代、清晰、克制、可操作**。

---

## 2. CSS API

```css
--font-display: "Source Han Serif SC VF", "Source Han Serif SC", ...;
--font-literary: "LXGW WenKai", ...;
--font-ui: Inter, "PingFang SC", ...;
```

推荐语义类：

```html
<h1 class="display-type">绘世神话</h1>
<p class="literary">用 AI 重现神话世界</p>
<p class="entity-summary">云海、天宫与山海异兽……</p>
<span class="ui-type">4K · 16:9</span>
```

`h1`–`h4`、`.brand-serif` 默认已经使用 Display 字体；按钮、表单、`.btn`、`.chip`、`.small-caps`、`.eyebrow` 默认使用 UI 字体。

---

## 3. 页面应用规则

### 首页

- 「绘世神话」：思源宋体，600–700，可叠加鎏金流光效果。
- 「用 AI 重现神话世界」：霞鹜文楷 Regular。
- CTA：UI 字体。
- 「文明与神话」及卡片名称：思源宋体。
- 文明说明 / 氛围描述：霞鹜文楷。

### 神话 / 神域 / 角色详情

- H1 与实体名称：思源宋体。
- 1–3 行世界观简介：霞鹜文楷。
- Facts、属性、按钮、标签：UI 字体。
- 长篇背景故事：默认 UI 字体；诗句或引文局部使用霞鹜文楷。

### Explore / 壁纸 / AI Creator

这些页面首先是内容浏览或工具界面：

- 栏目标题：思源宋体。
- 卡片主要实体名：按视觉密度决定，核心实体可用思源宋体。
- 筛选、风格、设备、分辨率、按钮、Prompt 相关控件：统一 UI 字体。
- 不为了“古风”给操作控件使用文楷。

---

## 4. 性能与加载

当前 Web 交付通过 `src/styles/fonts.css` 集中接入：

- Source Han Serif SC VF：浏览器分片 Webfont，字体来源为 Adobe Source Han Serif。
- LXGW WenKai：Webfont 构建，字体来源为 LXGW WenKai。

字体资源仅从 `cdn.jsdelivr.net` 加载，CSP 已限制到该可信来源。

后续若切换为 R2 / 本地静态字体，只修改 `fonts.css`，组件不得直接引用字体 URL。

### 加载原则

1. 不在组件中新增 `@font-face` 或远程字体 URL。
2. 不新增第三套装饰性中文字体，除非通过设计评审。
3. 首屏标题必须有系统字体 fallback，字体未加载时不能产生不可读内容。
4. 文楷只用于少量文案，避免为了字体效果增加首屏不必要的阻塞。

---

## 5. Do / Don't

**Do**

- 思源宋体建立结构和品牌识别。
- 霞鹜文楷增强神话叙事氛围。
- UI 字体保证功能清晰。
- 同一信息层级全站保持一致。

**Don't**

- 全站正文都用霞鹜文楷。
- 导航、按钮使用宋体 / 文楷。
- 一个卡片同时出现三种字体。
- 为每个文明切换不同字体。
- 用字体代替真正的 Civilization Visual DNA。

---

## 6. 设计判断口诀

```text
这是“名字 / 标题”吗？ → 思源宋体
这是“故事 / 氛围”吗？ → 霞鹜文楷
这是“操作 / 信息”吗？ → UI 无衬线
```

如果判断不确定，默认使用 UI 字体。
