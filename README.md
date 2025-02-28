# ProWords | 专业化英语学习平台

<p align="center">
  <img src="https://img.shields.io/badge/AI%20Powered-GPT-blue?style=for-the-badge&logo=openai" alt="AI Powered" />
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</p>

<p align="center">🇨🇳 <a href="#chinese">中文</a> | 🇺🇸 <a href="#english">English</a></p>

---

<h2 id="chinese">中文介绍</h2>

## ProWords - AI驱动的专业化英语学习平台

ProWords 是一个基于人工智能的专业化英语学习平台，为不同职业的人群提供量身定制的英语学习体验。通过整合先进的AI技术，为用户创建职业相关的例句和学习内容。

### 🌟 特色

- 🤖 **AI驱动学习**: 使用先进的AI模型生成与职业相关的自然、专业的例句
- 👨‍💻 **职业化定制**: 根据不同职业背景智能生成专业相关的例句
- 🎯 **智能重生成**: 不满意的例句可一键重新生成多种替代选项
- 🎨 **美观界面**: 采用现代化的UI设计，提供流畅的用户体验
- 📝 **进度跟踪**: 自动保存学习进度，随时可以继续学习
- 🔊 **语音支持**: 支持单词和例句的语音播放功能

### 💻 技术栈

- **前端框架**: Next.js 14
- **UI 组件**: Tailwind CSS + Shadcn/ui
- **动画效果**: Framer Motion
- **AI 集成**: 集成先进大语言模型API
- **状态管理**: React Hooks
- **本地存储**: localStorage

### 📚 功能特点

#### 职业选择
- 预设职业类型（程序员、设计师、医生等）
- 支持自定义职业描述
- 可多选职业组合，获得多样化的例句

#### AI学习系统
- CET-4/6 词库支持
- 按章节学习
- 自动保存进度
- AI智能例句生成
- 例句重生成功能

#### 界面功能
- 深色模式支持
- 响应式设计
- 流畅的过渡动画
- 直观的进度展示

### 📍 开始使用

1. 克隆项目
```bash
git clone <repository-url>
cd prowords
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm run dev
```

4. 访问应用
```
http://localhost:3000
```

### 💯 使用流程

1. 选择职业身份
2. 选择词库类型（CET-4/6）
3. 选择学习章节
4. 开始学习单词
5. 查看AI生成的职业相关例句
6. 不满意可一键重新生成例句

---

<h2 id="english">English Introduction</h2>

## ProWords - AI-Powered Professional English Learning Platform

ProWords is an AI-powered English learning platform that provides tailored learning experiences for professionals across various industries. By integrating advanced AI technology, it creates career-relevant example sentences and learning content for users.

### 🌟 Features

- 🤖 **AI-Driven Learning**: Uses advanced AI models to generate natural, profession-specific example sentences
- 👨‍💻 **Professional Customization**: Intelligently generates examples relevant to different career backgrounds
- 🎯 **Smart Regeneration**: One-click regeneration of alternative example sentences
- 🎨 **Beautiful Interface**: Modern UI design providing a smooth user experience
- 📝 **Progress Tracking**: Automatically saves learning progress for continuous learning
- 🔊 **Voice Support**: Text-to-speech functionality for words and example sentences

### 💻 Tech Stack

- **Frontend Framework**: Next.js 14
- **UI Components**: Tailwind CSS + Shadcn/ui
- **Animation**: Framer Motion
- **AI Integration**: Advanced language model API integration
- **State Management**: React Hooks
- **Local Storage**: localStorage

### 📚 Key Features

#### Career Selection
- Preset professional types (programmer, designer, doctor, etc.)
- Support for custom profession descriptions
- Multiple profession selection for diverse example sentences

#### AI Learning System
- CET-4/6 vocabulary support
- Chapter-based learning
- Automatic progress saving
- AI-powered example sentence generation
- Sentence regeneration functionality

#### Interface Features
- Dark mode support
- Responsive design
- Smooth transition animations
- Intuitive progress visualization

### 📍 Getting Started

1. Clone the project
```bash
git clone <repository-url>
cd prowords
```

2. Install dependencies
```bash
pnpm install
```

3. Start development server
```bash
pnpm run dev
```

4. Access the application
```
http://localhost:3000
```

### 💯 Usage Flow

1. Select professional identity
2. Choose vocabulary type (CET-4/6)
3. Select learning chapter
4. Start learning words
5. View AI-generated profession-relevant example sentences
6. One-click regeneration if not satisfied with examples

## 📜 License

MIT License

# ProWords Project

## Getting Started

### Environment Setup

1. Create a `.env.local` file in the project root:

```bash
# Create .env.local file
touch .env.local
```

2. Add the following required environment variables to the `.env.local` file:

```bash
NEXT_PUBLIC_BASE_URL=your_api_base_url
NEXT_PUBLIC_OPENAI_API_KEY=your_api_key
```

Example:
```bash
NEXT_PUBLIC_BASE_URL=https://api.rdsec.trendmicro.com/prod/aiendpoint/v1/
NEXT_PUBLIC_OPENAI_API_KEY=your_jwt_token_here
```

These environment variables are essential for the application to connect to the required APIs.

### Running the Project

[Additional setup instructions will go here]
