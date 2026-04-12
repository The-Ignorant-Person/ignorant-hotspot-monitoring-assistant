# 🔥 热点监测助手 - Hotspot Monitoring Assistant

一个 **AI 驱动的热点新闻监测系统**，帮助你第一时间获取指定领域（如 AI 大模型）的最新热点资讯，并通过实时通知让你走在信息的最前沿。

## ✨ 核心功能

- 🔍 **关键词监控** - 自定义关键词，监控相关热点变化
- 🤖 **AI 识别** - 利用 AI 技术智能识别真实热点（避免虚假信息）
- 📡 **多源采集** - 从 RSS、HackerNews、Firecrawl 等多个源自动采集
- 📊 **趋势分析** - 可视化展示热点趋势和关键词统计
- 🔔 **实时通知** - 发现新热点时立即推送邮件通知
- ⚡ **自动定时扫描** - 后台自动周期性扫描和更新数据

## 🛠️ 技术栈

### 前端
- **框架**: React + Vite
- **UI 库**: Tailwind CSS
- **状态管理**: React Hooks
- **通信**: WebSocket（实时更新）
- **构建**: TypeScript + ESLint

### 后端
- **运行时**: Node.js + Express
- **数据库**: SQLite
- **API 接口**: 
  - OpenRouter（AI 接入）
  - Firecrawl（网页抓取）
  - TwitterAPI.io（预留）
- **邮件通知**: SMTP（QQ 邮箱）
- **定时任务**: node-schedule

### 主要依赖
- `express` - Web 框架
- `ws` - WebSocket 服务
- `better-sqlite3` - 数据库
- `dotenv` - 环境配置
- `openrouter-ai` - AI 服务

## 📁 项目结构

```
├── backend/
│   ├── src/
│   │   ├── index.ts                # 入口文件
│   │   ├── lib/
│   │   │   ├── ai.ts              # AI 调用封装
│   │   │   ├── db.ts              # 数据库管理
│   │   │   ├── notifier.ts        # 邮件通知
│   │   │   ├── scanner.ts         # 热点扫描
│   │   │   ├── scheduler.ts       # 定时任务
│   │   │   └── types.ts           # 类型定义
│   │   ├── routes/
│   │   │   ├── keywords.ts        # 关键词 API
│   │   │   ├── hotspots.ts        # 热点 API
│   │   │   ├── trends.ts          # 趋势 API
│   │   │   ├── settings.ts        # 设置 API
│   │   │   └── scan.ts            # 扫描 API
│   │   └── sources/
│   │       ├── rss.ts             # RSS 源
│   │       ├── hackernews.ts      # HackerNews API
│   │       └── firecrawl.ts       # Firecrawl 接入
│   ├── data/
│   │   └── hotspots.db           # SQLite 数据库
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HotspotFeed.tsx    # 热点列表
│   │   │   ├── KeywordManager.tsx  # 关键词管理
│   │   │   ├── TrendRadar.tsx      # 趋势雷达图
│   │   │   ├── NotificationPanel.tsx # 通知面板
│   │   │   └── ...其他组件
│   │   ├── hooks/
│   │   │   ├── useApi.ts          # API 调用
│   │   │   └── useWebSocket.ts    # WebSocket 连接
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
│   ├── 需求分析.md
│   ├── 技术选型.md
│   └── 技术方案.md
│
├── .env.example              # 环境变量示例
├── .gitignore
├── package.json              # 根目录配置
└── README.md                 # 本文件
```

## 🚀 快速开始

### 前置要求
- Node.js >= 16
- npm 或 yarn
- 已配置的 API Key：
  - OpenRouter API Key（[获取](https://openrouter.ai/)）
  - Firecrawl API Key（[获取](https://firecrawl.dev/)）

### 1. 克隆项目
```bash
git clone https://github.com/The-Ignorant-Person/ignorant-hotspot-monitoring-assistant.git
cd ignorant-hotspot-monitoring-assistant
```

### 2. 配置环境变量
```bash
# 复制示例配置
cp .env.example backend/.env

# 编辑 backend/.env，填入你的 API Key
# OPENROUTER_API_KEY=your_key_here
# FIRECRAWL_API_KEY=your_key_here
# SMTP_HOST=smtp.qq.com
# SMTP_PORT=465
# SMTP_USER=your_email@qq.com
# SMTP_PASS=your_password
```

### 3. 安装依赖

**后端：**
```bash
cd backend
npm install
```

**前端：**
```bash
cd frontend
npm install
```

### 4. 启动服务

**后端**（在 `backend` 目录）：
```bash
npm run dev
# 启动在 http://localhost:3001
```

**前端**（在 `frontend` 目录，新终端）：
```bash
npm run dev
# 启动在 http://localhost:5173
```

### 5. 访问应用
打开浏览器访问 `http://localhost:5173`

## 📝 使用说明

### 1. 添加监控关键词
1. 进入"关键词管理"面板
2. 输入要监控的关键词（如"Claude 3.5"）
3. 点击"添加"
4. 系统会自动定时扫描相关热点

### 2. 查看热点列表
- "热点 Feed" 展示最新发现的热点
- 按时间倒序排列
- 点击可查看详情

### 3. 分析趋势
- "趋势雷达"展示关键词热度变化
- 支持按时间范围筛选
- 可视化展示数据

### 4. 配置通知
- 进入"设置"面板
- 填入邮箱地址
- 配置 SMTP 邮件服务
- 选择通知频率

## 🔧 API 文档

### 后端 API 端口

**基础 URL**: `http://localhost:3001/api`

#### 关键词管理
- `GET /keywords` - 获取关键词列表
- `POST /keywords` - 创建关键词
- `PUT /keywords/:id` - 更新关键词
- `DELETE /keywords/:id` - 删除关键词

#### 热点查询
- `GET /hotspots` - 获取热点列表（支持分页和过滤）
- `GET /hotspots/:id` - 获取热点详情
- `GET /hotspots/keyword/:keyword` - 按关键词查询

#### 趋势分析
- `GET /trends` - 获取趋势数据
- `GET /trends/keyword/:keyword` - 特定关键词趋势

#### 设置
- `GET /settings` - 获取设置
- `POST /settings` - 更新设置

#### 扫描控制
- `POST /scan` - 触发手动扫描
- `GET /scan/status` - 获取扫描状态
- `GET /status` - 获取服务健康状态

### WebSocket 连接
- URL: `ws://localhost:3001/ws`
- 实时推送最新热点和系统状态

## 💡 开发指南

### 后端开发

**添加新的数据源：**
```typescript
// 在 src/sources/my-source.ts
export async function fetchFromMySource(keyword: string) {
  // 实现数据采集逻辑
  return articles;
}
```

**修改 AI 识别逻辑：**
```typescript
// 在 src/lib/ai.ts
export async function identifyHotspot(article: Article) {
  // 使用 OpenRouter API 识别热点
}
```

### 前端开发

**添加新组件：**
```bash
cd frontend/src/components
# 创建新组件文件
```

**连接新的 API：**
```typescript
// 在 src/hooks/useApi.ts 添加新的 hook
export function useNewFeature() {
  return useQuery(...);
}
```

## 🐛 常见问题

### Q: 为什么没有收到邮件通知？
A: 检查：
1. `.env` 中的 SMTP 配置是否正确
2. 邮箱是否开启了 SMTP 服务
3. 后端日志中是否有错误信息

### Q: 如何修改扫描频率？
A: 在 `backend/src/lib/scheduler.ts` 中修改 `initScheduler()` 的 cron 表达式

### Q: 怎样导出数据？
A: 数据存储在 `backend/data/hotspots.db` 中，可以使用 SQLite 工具直接查询

## 📦 部署到生产环境

### 使用 Docker（推荐）
```bash
docker-compose up -d
```

### 或手动部署
1. 编译后端：`cd backend && npm run build`
2. 编译前端：`cd frontend && npm run build`
3. 使用 PM2 运行后端：`pm2 start dist/index.js`
4. 配置 Nginx 反向代理前端

## 📄 许可证

MIT License - 自由使用和修改

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件

## 🙏 致谢

感谢以下开源项目的支持：
- React & Vite
- Express.js
- OpenRouter API
- Firecrawl

---

**Happy monitoring! 🚀**
