# 大象问卷 — 技术文档

## 1. 技术栈

| 层级 | 技术 | 版本 | 说明 |
|:--|:--|:--|:--|
| 构建工具 | Vite | 8.x | 快速开发服务器与构建 |
| 框架 | React | 19.x | UI 框架 |
| 语言 | TypeScript | 6.x | 类型安全 |
| 样式 | Tailwind CSS | 4.x | 原子化 CSS |
| 图表 | Recharts | 3.x | 雷达图 |
| 图片生成 | html-to-image | 1.x | DOM 转图片 |
| 二维码 | qrcode | 1.x | 生成二维码 |
| 部署 | Vercel | - | 主部署平台 |
| 备选部署 | 腾讯云 COS | - | 国内加速 |

## 2. 项目结构

```
survey/
├── api/                    # Vercel Serverless Functions（预留）
├── docs/                   # 项目文档
│   ├── PRD.md
│   ├── TECH.md
│   └── DESIGN.md
├── public/                 # 静态资源
│   ├── elephant.png        # 大象插画（透明背景）
│   └── favicon.svg
├── src/
│   ├── components/         # React 组件
│   │   ├── InstructionPage.tsx   # 开始说明页
│   │   ├── LandingPage.tsx       # 首页
│   │   ├── Poster.tsx            # 分享海报
│   │   ├── QuestionPage.tsx      # 问答页
│   │   ├── ResultPage.tsx        # 结果页
│   │   └── ScoreSelector.tsx     # 评分组件
│   ├── data/
│   │   └── questions.ts          # 36道题目数据
│   ├── types/
│   │   └── qrcode.d.ts           # qrcode 类型声明
│   ├── App.tsx                   # 应用主组件
│   ├── index.css                 # 全局样式 + Tailwind
│   └── main.tsx                  # 入口文件
├── deploy.js               # 腾讯云 COS 部署脚本
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js（已删除，v4 用 CSS 配置）
├── tsconfig.json
└── vite.config.ts
```

## 3. 核心数据流

### 3.1 状态管理

使用 React 原生 hooks：`useState` + `useCallback` + `useEffect`

```
App.tsx
  ├── page: 'landing' | 'instruction' | 'question' | 'result'
  ├── currentDimension: number (0-11)
  └── answers: Record<questionId, score>
```

### 3.2 本地存储

Key: `elephant_survey_v1`

```json
{
  "answers": { "1": 5, "2": 4, ... },
  "currentPage": 5,
  "completedAt": "2026-06-10T15:30:00Z"
}
```

### 3.3 分数计算

```typescript
// 单维度分数
const dimensionScore = sum(questionScores); // 3-15

// 总分
const totalScore = sum(allDimensionScores); // 36-180

// 百分比
const percentage = (score / maxScore) * 100;
```

## 4. 页面路由

使用 React 条件渲染管理页面状态，无路由库。

```typescript
type Page = 'landing' | 'instruction' | 'question' | 'result';
```

## 5. 部署

### 5.1 Vercel 部署

1. 访问 https://vercel.com/new
2. 导入 GitHub 仓库 `axf954632-rgb/elephant-survey`
3. 保持默认配置，点击 Deploy
4. 绑定自定义域名（Settings → Domains）

### 5.2 腾讯云 COS 部署

```bash
# 先配置 deploy.js 中的 SecretId/SecretKey/Bucket/Region
npm run deploy
```

等价于：
```bash
npm run build && node deploy.js
```

### 5.3 环境变量配置

腾讯云 COS 支持环境变量：

```bash
COS_SECRET_ID=xxx
COS_SECRET_KEY=xxx
COS_BUCKET=xxx
COS_REGION=xxx
```

## 6. 开发命令

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建
npm run build

# 预览构建产物
npm run preview

# 部署到腾讯云 COS
npm run deploy
```

## 7. AI 解读功能技术方案（待实现）

### 7.1 推荐方案

使用 **Vercel Serverless Functions**：

```
api/
└── interpret.js
```

前端调用：
```typescript
POST /api/interpret
Body: { dimensions: [{ name, score }, ...] }
Response: { interpretation: string }
```

### 7.2 AI 服务选择

| 服务 | 优势 | 成本 |
|:--|:--|:--|
| DeepSeek | 中文好，便宜 | 低 |
| 月之暗面 Kimi | 中文强 | 低 |
| OpenAI GPT-4o | 通用能力强 | 高 |

### 7.3 Prompt 示例

```
用户完成了"个人能力12维度评估"，各维度满分15分，得分如下：
- 敏锐学习：14
- 自律自洽：11
...

请作为个人成长顾问，给出：
1. 一句话能力画像
2. 3个核心优势及具体表现
3. 3个待提升能力及原因
4. 3条30天内可执行的行动建议
语言风格：真诚、有洞察力、不过度吹捧
```

## 8. 常见问题

### 8.1 Tailwind CSS v4 配置

Tailwind v4 使用 `@import "tailwindcss"` 和 `@theme` 指令，不再使用 `tailwind.config.js`。

### 8.2 html-to-image 使用限制

生成海报时避免捕获复杂 SVG（如 Recharts），否则可能失败。当前 Poster.tsx 使用纯 DOM 布局，避免此问题。

### 8.3 微信内置浏览器

- 确保不使用微信不支持的新特性
- 二维码图片需可长按识别
- 分享海报需可长按保存
