# 🚀 OGame Clone

一个经典的太空策略MMO游戏复刻版。

## 🛠️ 技术栈

- **前端**: React 18 + TypeScript + Vite
- **后端**: Express + Socket.io
- **实时**: WebSocket

## 📦 安装

```bash
# 安装依赖
pnpm install
```

## ▶️ 运行

```bash
# 开发模式 (前端 + 后端)
pnpm dev
```

- 前端: http://localhost:3000
- 后端: http://localhost:4000

## 🎮 功能

### 核心玩法
- ⛏️ 资源采集 (金属、晶体、重氢、能源)
- 🏗️ 建筑系统 (资源建筑、功能建筑、防御)
- 🚀 舰船系统 (运输舰、战斗机、巡洋舰、战列舰等)
- 🔬 科技研究
- ⚔️ 战斗系统
- 🛡️ 防御系统

### 社交
- 🤝 联盟系统
- 📧 消息系统
- 🗺️ 银河地图

## 📁 项目结构

```
ogame/
├── src/
│   ├── client/          # 前端代码
│   │   ├── components/ # React 组件
│   │   ├── pages/      # 页面组件
│   │   ├── stores/     # 状态管理
│   │   ├── types/      # TypeScript 类型
│   │   └── utils/      # 工具函数
│   └── server/         # 后端代码
│       ├── routes/     # API 路由
│       ├── models/     # 数据模型
│       └── services/   # 业务逻辑
├── public/             # 静态资源
└── package.json
```

## 🎨 UI 设计

- 深色太空主题
- 蓝色/紫色渐变配色
- 科幻风格字体 (Orbitron, Rajdhani)
- 流畅的动画效果

## 📜 许可证

MIT License
