# Image Style Transfer

AI 服装风格转换工具 - MVP 版本

## 功能特性

- 📤 图片上传（拖拽/点击）
- 🎨 5 种预设风格（复古蕾丝、赛博朋克、汉服古风、商务正装、波西米亚）
- 🤖 AI 智能生成
- 📥 一键下载结果
- 📱 响应式设计

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- 豆包大模型 API

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Bobo1204/image-style-transfer.git
cd image-style-transfer
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
# 复制示例文件
cp .env.example .env.local

# 编辑 .env.local，填入你的 API 配置
NEXT_PUBLIC_API_URL=your_api_url_here
NEXT_PUBLIC_API_KEY=your_api_key_here
NEXT_PUBLIC_MODEL=doubao-seedance-1-5-pro-251215
```

⚠️ **重要**: `.env.local` 文件包含敏感信息，**不要**提交到 Git！

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署

### 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

部署时需要在 Vercel Dashboard 中设置环境变量。

## 项目结构

```
├── app/                 # Next.js 页面
├── components/          # React 组件
├── hooks/               # 自定义 Hooks
├── lib/                 # 工具函数
├── types/               # TypeScript 类型
└── .env.example         # 环境变量示例
```

## 安全说明

- API Key 等敏感信息通过环境变量管理
- `.env.local` 已添加到 `.gitignore`，不会提交
- 生产环境请在部署平台设置环境变量

## License

MIT
