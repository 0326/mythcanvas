# 绘神宇宙 MythCanvas｜网站版产品方案

> **中文名：绘神宇宙**  
> **英文名：MythCanvas**  
> **Slogan：用 AI 重现神话世界**
>
> 文档状态：UX Design Ready  
> 版本：V1.0  
> 产品形态：Web First，后续扩展微信小程序  
> 首发技术栈：Astro + Cloudflare

---

# 0. 产品结论

**绘神宇宙 MythCanvas 是一个以“神话视觉探索 + AI 个性化创作”为核心的内容产品。**

它不是传统壁纸图库，也不是通用 AI 图片生成器。

用户来到这里，核心要完成三件事：

1. **发现**：看到高质量、强视觉冲击的神话人物与神话世界；
2. **沉浸**：围绕角色、神域、场景持续探索，而不是只看一张孤立图片；
3. **创造**：无需学习复杂 Prompt，即可生成属于自己的神话视觉作品。

产品的第一阶段核心价值：

> **把世界神话变成一个可以浏览、收藏、下载和重新创作的视觉宇宙。**

---

# 1. 品牌定义

## 1.1 品牌信息

- 中文名：**绘神宇宙**
- 英文名：**MythCanvas**
- Slogan：**用 AI 重现神话世界**

## 1.2 品牌关键词

- 神秘
- 史诗
- 壮丽
- 神圣
- 幻想
- 沉浸
- 未来感
- 高级视觉

## 1.3 品牌不是

MythCanvas 不应该被设计成：

- AI 工具后台
- Prompt 工作台
- 神话百科网站
- 素材下载站
- 普通图库
- 游戏官网
- 传统二次元社区

## 1.4 品牌应该给用户的第一感受

> **“这个世界真的存在过吗？”**

第二感受：

> **“我想把这张设成壁纸。”**

第三感受：

> **“我能不能创造一个自己的版本？”**

---

# 2. 产品目标

## 2.1 第一阶段目标

验证三个核心假设：

### 假设 A：视觉内容成立

用户愿意持续浏览：

- 神话角色
- 神话场景
- 神兽
- 神殿
- 天空异象
- 神话世界

### 假设 B：角色 / 世界组织方式优于普通图库

用户会从一张图继续进入：

> 作品 → 角色 → 神域 → 相关作品

而不是下载后立即离开。

### 假设 C：AI 个性化能形成第二层需求

用户不只下载已有内容，还愿意：

> 选择角色 / 世界 → 调整风格 → 生成自己的版本

---

# 3. 核心用户

## 3.1 Primary Persona：视觉沉浸型用户

年龄：16～30 岁。

典型兴趣：

- 二次元
- 游戏
- AI Art
- 手机壁纸
- 幻想艺术
- 电影概念设计
- 神话 / 奇幻世界
- 赛博朋克
- 暗黑美学

### 核心诉求

> “我想看到真正有视觉冲击力、能直接作为壁纸使用的作品。”

### 用户痛点

普通搜索：

- 图片质量参差
- 水印多
- 风格不统一
- 比例不适合手机
- 角色来源混乱
- IP 版权不清晰
- 很难围绕喜欢的角色继续探索

## 3.2 Secondary Persona：AI 创作型用户

### 核心诉求

> “我想生成自己的神话角色 / 神话场景，但不想学 Prompt。”

### 用户痛点

通用 AI 生图工具：

- Prompt 学习成本高
- 人物一致性差
- 不懂构图
- 不知道如何写神话设定
- 经常生成不适合作为壁纸的图片

MythCanvas 应该提供：

> **受约束的高质量创作，而不是完全自由的 Prompt 输入框。**

## 3.3 Tertiary Persona：神话兴趣用户

### 核心诉求

> “我喜欢神话，希望通过视觉去了解不同文明的世界。”

这类用户不是第一阶段主要增长来源，但可以提升页面深度、SEO、GEO、世界观可信度与内容留存。

---

# 4. 用户核心任务 Jobs To Be Done

## Job 1：找到一张让我惊艳的壁纸

当我想换手机壁纸时，我希望快速看到高质量、适合手机比例的神话视觉作品，这样我不用在搜索引擎里筛选大量低质量图片。

## Job 2：继续探索喜欢的世界

当我喜欢某个角色或场景时，我希望继续看到同角色、同神域、同风格的作品，而不是重新搜索。

## Job 3：创造自己的版本

当我看到喜欢的作品时，我希望基于它修改人物、场景、色调和风格，快速生成一个属于自己的版本。

## Job 4：收藏我的审美宇宙

当我持续使用 MythCanvas 时，我希望收藏自己喜欢的角色、世界、风格和作品，并让系统越来越懂我的审美。

---

# 5. 产品核心对象模型

MythCanvas 的核心内容不是“图片”，而是五类对象：

```text
神话体系 Mythology
      ↓
神域 / 世界 Realm
      ↓
角色 Character
      ↓
场景 Scene
      ↓
视觉作品 Artwork
```

以及跨对象标签：

```text
风格 Style
情绪 Mood
设备 Device
视觉主题 Theme
```

示例：

```text
希腊神话
└── 奥林匹斯
    ├── 雅典娜
    │   ├── 战争神殿
    │   ├── 云海圣殿
    │   └── Athena Cyber
    ├── 宙斯
    └── 阿尔忒弥斯
```

---

# 6. MVP 内容范围

## 6.1 首发神话体系

1. 中国神话
2. 希腊神话
3. 北欧神话
4. 日本神话
5. 埃及神话

## 6.2 首发角色数量

目标：**30～40 个角色**。

重点角色包括：嫦娥、九尾狐、哪吒、孙悟空、白蛇、龙女、凤凰、西王母；Athena、Aphrodite、Artemis、Hades、Medusa、Zeus、Apollo；Odin、Loki、Thor、Freyja、Valkyrie、Fenrir；辉夜姬、雪女、天狗、酒吞童子、雷神、风神；Anubis、Ra、Isis、Bastet、Horus。

## 6.3 首发场景数量

目标：**20～30 个核心场景**，包括云海天宫、奥林匹斯天空神殿、阿斯加德、世界树、月宫、高天原、太阳神殿、冥界之门、神谕圣殿、浮空神城、失落遗迹、天空巨像、诸神黄昏、深渊神殿、星海神域等。

## 6.4 首发视觉作品数量

目标：**300～500 张高质量精选作品**。

建议比例：

- 40% 神话场景
- 30% 人物角色
- 15% 神兽 / 巨物
- 15% 建筑 / 遗迹

原则：**首页禁止沦为“AI 美女瀑布流”。**

---

# 7. 网站一级信息架构

桌面端主导航：

```text
MythCanvas
├── 探索 Explore
├── 神话 Mythologies
├── 神域 Realms
├── 角色 Characters
├── 绘神 Create
└── 我的 My
```

右侧功能：Search、语言、主题切换、登录 / Avatar。

移动 Web：探索、神域、绘神、收藏、我的。

---

# 8. URL / SEO 信息架构

```text
/
├── explore/
├── mythology/{chinese|greek|norse|japanese|egyptian}/
├── realm/{slug}/
├── character/{slug}/
├── wallpaper/{slug}/
├── style/{slug}/
└── create/
```

所有核心实体使用可读、稳定、可索引的 slug。

---

# 9. 页面清单与优先级

| 页面 | 优先级 | MVP |
|---|---:|---|
| 首页 / Explore | P0 | 是 |
| 搜索结果 | P0 | 是 |
| 神话体系页 | P0 | 是 |
| 神域 / 世界页 | P0 | 是 |
| 角色详情页 | P0 | 是 |
| 壁纸详情页 | P0 | 是 |
| AI 绘神页 | P0 | 是 |
| 收藏页 | P0 | 是 |
| 登录 | P0 | 是 |
| 我的 | P0 | 是 |
| 风格聚合页 | P1 | 可延后 |
| 神话图鉴 | P1 | 否 |
| AI 生成历史 | P1 | 可简化 |
| 创作者主页 / 投稿社区 | P2 | 否 |

---

# 10. 首页 UX 规格

## 页面目标

第一屏完成：**品牌认知 + 视觉震撼 + 探索入口**。

用户 5 秒内理解：这是一个 AI 神话视觉世界。

## Hero

视觉：巨型神话场景、低频动态、云层 / 光线 / 粒子轻微运动，主体保留标题安全区。

主标题：**绘神宇宙 MythCanvas**

副标题：**用 AI 重现神话世界**

辅助文案：探索诸神、神域与传说中的世界，创造属于你的神话视觉。

CTA：**探索神境** / **开始绘神**。

## 首页内容顺序

1. 今日神境
2. 热门角色
3. 探索神话
4. 精选壁纸
5. 开始绘神

---

# 11. Explore 页 UX

提供无限探索感，但避免完全无结构的瀑布流。

筛选维度：推荐 / 最新 / 热门、神话文明、内容类型、Style、设备。

卡片默认只展示图片、标题、Character / Realm 和收藏按钮；避免堆积点赞数、作者、日期和复杂标签。

---

# 12. 神话体系页 UX

页面结构：Hero、Featured Realms、Featured Characters、Featured Scenes、150～300 字 Brief Story、Explore More。

目标是“进入一个文明的视觉体系”，而不是阅读百科长文。

---

# 13. 神域 / 世界页 UX

这是 MythCanvas 的核心差异化页面。

页面结构：Immersive Hero、World Overview、Landmarks、Characters、Visual Interpretations、Wallpapers、重新绘制 CTA。

用户应该产生：**“我正在探索一个世界，而不是浏览图片。”**

---

# 14. 角色详情页 UX

角色是长期视觉资产。

页面结构：Hero、Character Facts、Visual Forms、Wallpapers、Related Realm、Related Characters、AI 绘制入口。

Visual Forms 支持 Canonical、Sacred、Warrior、Dark、Cyber、Anime 等变体。

---

# 15. 壁纸详情页 UX

核心路径：**欣赏 → 预览 → 下载 / 收藏 → 继续探索 / 创作**。

桌面端大图约 65%，右侧 Sticky Panel 提供标题、Character / Realm、Resolution、Ratio、收藏、下载、AI 重绘。

下载最多两次主要点击；提供 Phone / Desktop、Ratio 和 HD / 2K / 4K 选择，并支持真实设备预览。

相关推荐优先级：Same Character → Same Realm → Same Style。

---

# 16. AI「绘神」UX

不要将产品做成“Prompt 输入框 + Generate”。默认应比 Prompt 更聪明。

入口来自顶部导航、角色页、神域页、壁纸详情和首页 CTA，并自动继承上下文。

采用单页面 Progressive Builder：

1. 我要绘制：角色 / 世界 / 神兽 / 自由描述
2. 选择对象
3. 选择 Style（必须图片预览）
4. 调整场景
5. 选择构图
6. 折叠高级调整
7. 开始绘神

生成过程使用品牌化进度文案，例如“正在构筑云海”“正在点亮神殿”，不显示虚假精确百分比。

成功后：下载、收藏、再绘一次、微调、创建变体；Quick Action 可包括更史诗、更梦幻、更写实、拉远镜头、强化神光。

---

# 17. 收藏与“我的宇宙”

页面名称使用 **我的宇宙**。

Tab：壁纸、角色、神域、我的绘神。

空状态：**你的宇宙还没有第一道神迹。**

---

# 18. 搜索 UX

统一搜索 Character、Realm、Mythology、Scene、Style，并按实体类型分组展示建议。

---

# 19. 登录策略

MVP 不强制注册。浏览、搜索、下载均可匿名；收藏、AI 生成、保存历史时再触发登录。

原则：**先获得价值，再要求登录。**

---

# 20. SEO / GEO UX 要求

核心页面结构保留 H1、Intro、Core Content、Related Entities、Brief Knowledge 和可选 FAQ。

角色页必须明确中文名、英文名、Mythology、Realm、Symbols。

所有核心图片必须使用真实 `<img>` / Astro Image 语义，提供 alt、width、height、srcset，禁止只用 CSS Background 承载核心内容图。

---

# 21. 无障碍基础要求

- 图片 alt
- 键盘操作与 Focus State
- 足够文字对比度
- 状态不只依赖颜色
- `prefers-reduced-motion`
- Dialog 可 ESC 关闭
- 图片卡具有可访问名称

---

# 22. 推荐逻辑

MVP 不做复杂算法，基于 Mythology + Character + Realm + Style + 收藏 + 下载即可。

---

# 23. 商业化预留

Free：浏览、HD 下载、收藏、有限 AI 生成。

未来 Premium：4K / 8K、无损、动态壁纸、高级模型、更多生成、私有作品、批量适配。

广告不能占 Hero、不能干扰内容流、不能诱导误触下载；可用于免费 AI 额度激励或下载完成页轻展示。

---

# 24. 数据指标

核心埋点：artwork_impression、artwork_click、filter_change、search、favorite、download、similar_click、character_click、realm_click、create_entry、style_select、generate、generate_success、generate_fail、regenerate、refine、download_generation。

MVP 关注 Artwork CTR、平均浏览作品数、下载率、收藏率、Artwork → Character、Character → Realm、Create Entry CTR、Generate Completion、生成后下载率、D1 / D7。

---

# 25. 技术架构

Frontend：**Astro**；复杂交互使用 React Islands，不将整站改造成 SPA。

```text
Browser
   ↓
Cloudflare CDN
   ↓
Astro Web
   ↓
Workers API
 ├── D1
 ├── R2
 ├── KV
 └── AI Generation API
```

R2 存原图、缩略图、生成图、分享图与 OG Image；D1 存 mythology、realm、character、scene、artwork、style、user、collection、generation。

---

# 26. 版权与内容边界

核心原则：**神话原型可用，现代 IP 的具体视觉设计不可直接复刻。**

允许使用 Athena、孙悟空、美杜莎、雪女、嫦娥等神话/传说原型，但视觉必须重新设计。

禁止直接使用游戏截图、影视截图、动漫角色具体造型、现代游戏神话角色服饰复制、不明版权壁纸搬运。

每个 Artwork 记录 source_type、creator、ai_model、prompt_meta、license、created_at、review_status。

---

# 27. UX Design Brief

核心用户：16～30 岁二次元、游戏、AI Art、壁纸和幻想视觉爱好者。

核心行为：**发现 → 沉浸探索 → 下载 / 收藏 → AI 重绘**。

核心差异：用户探索的是 **角色 + 神域 + 神话世界**，而不是孤立图片。

第一批页面：Home、Explore、Realm、Character、Artwork、Create、Generation Result、My Universe。

最终设计目标：第一次进入产生“这个世界真的存在过吗？”，然后“我要这张壁纸”，最后“我要创造自己的版本”。

---

# 28. 全站主题与 Visual DNA 体系

## 28.1 总原则

MythCanvas 只维护一套统一的网站结构与组件体系，不因神话文明切换整站 UI。全站品牌视觉以中国神话的东方仙侠、天宫、云海、玉石、月华与鎏金为基调，通过亮/暗两套主题承载不同环境偏好。

主题只改变视觉 Token，不改变页面结构、信息架构、组件层级、交互模型与内容模型。

> **网站只有一个 MythCanvas Theme；每个神话文明拥有自己的 Cultural Visual DNA；每个角色与世界拥有多种 Style Variant。**

```text
MythCanvas Theme
  ├── Light: 天宫鎏金
  └── Dark: 月渺仙阙
        ↓
Civilization Visual DNA
        ↓
Character / Realm Canonical Design
        ↓
Style Variant
```

设计语义：**文化决定“是谁”，画风决定“怎么画”，主题决定“怎么展示”。**

## 28.2 Civilization Visual DNA

不同文明不得通过整站换肤表达，而通过内容区的纹样、材质、场景符号、局部色彩和图标语言体现。

| 文明 | 核心 Visual DNA | 推荐视觉元素 |
|---|---|---|
| 中国神话 | 云海、宫阙、玉石、月华、仙鹤、龙纹 | 祥云、山水、飞檐、玉器、朱砂印、鎏金 |
| 希腊神话 | 大理石、黄金、爱琴海、圣光 | 柱式、月桂、雕塑、神庙、白金材质 |
| 北欧神话 | 冰川、巨石、世界树、符文 | Rune、木石、极光、雪原、冷金属 |
| 日本神话 | 月、鸟居、樱、神社、妖异 | 和纹、纸灯、山林、朱红、月白 |
| 埃及神话 | 沙漠、太阳、黑曜石、黄金 | 象形纹、太阳圆盘、石碑、砂岩、青金石 |

Civilization Visual DNA 只作为内容表现约束，不限制 Style Variant。希腊神话可以使用 Anime，东方神话可以使用 Cyber Myth，但核心文明识别符号仍应保留。

## 28.3 Character / Realm Canonical Design

每个核心角色和神域都需要一个 MythCanvas 官方主形象（Canonical Design），保证不同画风下仍可识别。

角色稳定保留：核心身份符号、代表性武器 / 器物、神职 / 能力视觉符号、关键服饰或轮廓、核心气质。

世界稳定保留：核心地标、空间结构、代表材质、天气 / 光照母题、文明符号。

## 28.4 Style Variant

支持 Classical / Canonical、Cinematic、Anime、Sacred、Dark Fantasy、Cyber Myth、Ink、Oil Painting、Statue、Surreal。

Style Variant 可以改变材质、色彩、镜头、时代与氛围，但不能抹掉文明和角色的核心 Visual DNA。

---

# 29. 双主题 UX 设计语言

## 29.1 Light Theme：天宫鎏金

### 定位

MythCanvas 默认亮色主题。以东方天宫美学为核心，将“仙气、云海、玉石、月白、鎏金”转译为现代内容网站语言。

核心感受：**轻、仙、净、贵、梦幻。**

避免厚重红金、仿古木纹和大面积传统装饰，保持现代、高级、轻盈。

### 推荐 Token

```text
--bg-primary:        #FFF8EF   月白暖底
--bg-secondary:      #FFFDF8   云白
--surface:           #FFFFFFCC 玉白半透
--text-primary:      #4A3524   深茶褐
--text-secondary:    #806A55   暖灰褐
--brand-gold:        #E2A64D   鎏金
--brand-gold-deep:   #B9822F   古金
--cloud-blue:        #CEE6F6   云海蓝
--jade:              #9BCFC3   玉石青
--border:            #EBD9B6   淡金边
```

实现时需按可访问性校准对比度，不把效果图色值视为绝对值。

### 背景与材质

- 主背景月白 / 暖白，不用纯白大面积刺眼底。
- Surface 使用玉石感半透明白与轻微 Backdrop Blur。
- Hero 可让云雾、仙山、飞檐、金色光线突破容器边缘。
- 分割线使用低对比度淡金。
- 装饰纹样存在感控制在 5%～10%。

### Typography

Hero / H1 可使用思源宋体 / Noto Serif SC 等现代宋体；正文、Filter、按钮和表单使用现代 Sans Serif。英文品牌可使用高对比 Serif。禁止全站书法字体。

### 组件语言

- Card：8～12px radius，白玉 Surface，淡金边，Hover 轻微上浮 + 金色微光。
- Primary Button：鎏金底 / 深茶文字，不使用高饱和黄色。
- Secondary：半透明玉白 + 淡金描边。
- Tabs / Filter：金色细线或浅金 Surface，避免过度胶囊化。
- Icon：细线、几何化祥云 / 莲纹 / 仙鹤 / 玉佩，避免直接套传统剪纸图标。

### 图像风格

亮色 Hero 优先晨曦、云海、月白、金色神光、高亮仙宫、玉石 / 白金材质。进入其他文明时 UI Surface 仍保持天宫鎏金，仅内容图片与局部文明装饰体现 Visual DNA。

---

## 29.2 Dark Theme：月渺仙阙

### 定位

与天宫鎏金使用完全相同的信息结构、Grid、组件尺寸和交互逻辑，只切换视觉 Token 与氛围元素。

暗色主题不是“暗黑神话”，而是：**东方夜空中的仙宫。**

核心感受：**夜、月、云、星、静、贵。**

禁止走恐怖、哥特、血红、重黑、末日风。

### 推荐 Token

```text
--bg-primary:        #08101A   玄夜
--bg-secondary:      #111B28   星晦
--surface:           #122238CC 云深蓝
--surface-raised:    #182A45   云深层
--text-primary:      #F3E9D4   月白
--text-secondary:    #A9B7C7   雾灰蓝
--brand-gold:        #D4AF37   月下金
--brand-gold-soft:   #C79A55   古铜金
--cloud-blue:        #728AA5   云深蓝
--moonlight:         #E6E1FF   月华
--border:            #5E4C32   暗金边
```

### 背景与材质

- 主背景不用纯黑，以玄青、墨蓝、夜空蓝建立层次。
- Surface 保持半透明云雾感。
- 金色仅用于品牌、重点 CTA、Focus 和关键数据。
- 月华蓝白用于 Hover、选中和视觉焦点。
- Hero 可用月宫、星海、夜云、灯火仙阙增强沉浸感。

### Typography

字体系统、字号、行高与亮色完全一致。主题只修改色彩、阴影、光晕、背景纹理、图片 Overlay，禁止改变 Typography Metric 和组件几何结构。

### 组件语言

- Card：玄青 Surface + 暗金 1px Border + 微弱月华 / 金色边缘光。
- Primary：月下金或克制金色渐变 + 深色文字。
- Secondary：深蓝透明 Surface + 暗金边。
- Input / Search：深蓝玉石质感，Focus 使用月华 + 金色 Ring。

### 图像处理

暗色主题禁止简单给亮图加黑蒙层。同一普通 Artwork 可以共用原图，但 Hero / Campaign Artwork 可提供 Light / Dark Art Direction 两套裁切或调色版本；暗色 Hero 优先夜月、星海、灯火、冷云与金色建筑高光。

---

## 29.3 Light / Dark 切换规范

首次访问优先尊重 `prefers-color-scheme`；用户主动选择后持久化到 Local Storage / Cookie，登录后可同步 Profile。

使用 Semantic Design Token，业务组件禁止写死主题色：

```css
background: var(--surface);
color: var(--text-primary);
border-color: var(--border);
```

主题选择需在首屏渲染前执行，避免闪屏。

主题切换不得改变页面 IA、DOM 语义层级、Card 尺寸、Grid、Typography Metric、Navigation 和 CTA 位置。

---

# 30. UX 视觉验收标准

1. 第一眼是否仍属于 MythCanvas，而不是某个单独文明的网站？
2. Light 是否体现“天宫鎏金”的仙气、梦幻、轻盈，而非普通米白网页？
3. Dark 是否体现“月渺仙阙”的东方夜空与月华，而非通用黑金 Dashboard？
4. 同一组件在 Light / Dark 下是否保持完全相同的尺寸和交互？
5. 文明 Visual DNA 是否来自内容和局部装饰，而不是整站换皮？
6. Character / Realm 是否保持 Canonical Design 的关键识别符号？
7. Style Variant 是否改变画法但不破坏角色身份和文明语义？
8. 图片是否始终比 UI 更突出？
9. 页面是否避免过度国风装饰、游戏 UI、SaaS Dashboard 感？
10. 移动端主题效果是否仍具备足够对比度和阅读效率？
