# OGame Clone - 项目规格说明书

## 项目概述
- **项目名称**: OGame Classic
- **类型**: 太空策略 MMORPG 网页游戏
- **核心功能**: 行星建设、舰队指挥、资源管理、联盟系统、战斗系统
- **目标用户**: 策略游戏爱好者

## 技术栈
- **前端**: React 18 + TypeScript + Vite
- **后端**: Express + Socket.io
- **数据库**: PostgreSQL (生产环境) / 内存存储 (开发环境)
- **实时**: WebSocket

---

## 核心系统

### 1. 资源系统
| 资源 | 用途 | 产出建筑 |
|------|------|----------|
| 金属 (Metal) | 建筑/舰船/防御基础材料 | 金属矿场 |
| 晶体 (Crystal) | 高级建筑/电子设备 | 晶体矿场 |
| 重氢 (Deuterium) | 能源/推进剂 | 重氢合成器 |
| 能量 (Energy) | 建筑运转 | 太阳能电站/核聚变电站 |

### 2. 建筑系统

#### 资源建筑
- 金属矿场 (Metal Mine) - Level 1-50
- 晶体矿场 (Crystal Mine) - Level 1-50
- 重氢合成器 (Deuterium Synthesizer) - Level 1-50
- 太阳能电站 (Solar Plant) - Level 1-50
- 核聚变电站 (Fusion Reactor) - Level 1-50

#### 功能建筑
- 机器人工厂 (Robot Factory) - 影响建造速度
- 造船厂 (Shipyard) - 建造舰船
- 研究实验室 (Research Lab) - 研究科技
- 纳米工厂 (Nanite Factory) - 极速建造
- 地形改造器 (Terraformer) - 增加行星格数
- 太空船坞 (Space Dock) - 大型舰船建造

#### 防御建筑
- 火箭发射井 (Rocket Launcher)
- 激光炮塔 (Light/Heavy Laser)
- 离子炮塔 (Ion Turret)
- 高斯炮 (Gauss Cannon)
- 等离子炮 (Plasma Turret)
- 护盾圆顶 (Shield Dome)
- 反弹道防御 (Missile Defense)

### 3. 舰船系统

| 舰船 | 造价 (M/C/D) | 载货量 | 速度 | 攻击 |
|------|--------------|--------|------|------|
| 运输舰 | 2K/2K/0 | 5000 | 5000 | 5 |
| 轻型战斗机 | 3K/1K/0 | 50 | 12500 | 100 |
| 重型战斗机 | 6K/4K/0 | 100 | 10000 | 250 |
| 巡洋舰 | 20K/7K/2K | 800 | 15000 | 400 |
| 战列舰 | 45K/15K/5K | 1500 | 10000 | 1000 |
| 拦截机 | 60K/50K/15K | 750 | 20000 | 700 |
| 轰炸机 | 50K/25K/15K | 1000 | 7000 | 700 |
| 驱逐舰 | 100K/60K/40K | 2000 | 5000 | 2000 |
| 死星 | 5M/4M/1M | 1M | 200 | 200K |
| 殖民船 | 10K/20K/10K | 7500 | 2500 | 50 |
| 回收舰 | 10K/6K/2K | 20000 | 4000 | 1 |
| 间谍探测器 | 0/1K/0 | 5 | 100M | 0 |
| 太阳能卫星 | 2K/500/0 | 0 | 0 | 0 |

### 4. 任务系统
- 攻击 (Attack) - 掠夺资源
- 联合攻击 (Federation) - 联盟联合出击
- 运输 (Transport) - 运输资源
- 部署 (Deploy) - 调遣舰队
- 间谍 (Spy) - 侦察目标
- 殖民 (Colonize) - 建立新殖民星
- 回收 (Recycle) - 回收残骸
- 毁灭 (Destroy) - 毁灭月球

### 5. 科技研究
- 能量科技 (Energy Technology)
- 激光科技 (Laser Technology)
- 离子科技 (Ion Technology)
- 超空间科技 (Hyperspace Technology)
- 等离子科技 (Plasma Technology)
- 燃烧驱动 (Combustion Drive)
- 脉冲驱动 (Impulse Drive)
- 超空间驱动 (Hyperspace Drive)
- 间谍科技 (Espionage Technology)
- 计算机科技 (Computer Technology)
- 天体物理 (Astrophysics)
- 网络技术 (Network Technology)
- 重力科技 (Graviton Technology)

### 6. 战斗系统
- 回合制模拟战斗
- 护盾和装甲系统
- 资源掠夺机制
- 残骸场生成
- 战斗报告生成

### 7. 联盟系统
- 创建/加入联盟
- 联盟外交
- 联盟邮件
- 联合舰队

---

## 页面结构

1. **Overview** - 行星总览
2. **Buildings** - 建筑建造
3. **Fleet** - 舰队管理
4. **Defense** - 防御建造
5. **Research** - 科技研究
6. **Galaxy** - 银河地图
7. **Alliance** - 联盟系统
8. **Messages** - 消息中心
9. **Settings** - 设置

---

## 开发阶段

### Phase 1: MVP (1-2周)
- [x] 项目骨架搭建
- [x] 基础UI布局
- [x] 资源显示系统
- [x] 行星选择
- [ ] 建筑系统(建造/升级)
- [ ] 用户认证(注册/登录)

### Phase 2: 核心玩法 (2-3周)
- [ ] 舰队系统
- [ ] 任务派遣
- [ ] 战斗系统
- [ ] 研究系统
- [ ] 实时资源更新

### Phase 3: 社交功能 (2周)
- [ ] 联盟系统
- [ ] 银河地图
- [ ] 消息系统
- [ ] 排行榜

### Phase 4: 优化 (1周)
- [ ] 性能优化
- [ ] UI/UX改进
- [ ] 移动端适配
- [ ] 测试和Bug修复

---

## API 端点

### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录

### 用户
- `GET /api/user` - 获取用户信息

### 行星
- `GET /api/planets` - 获取用户所有行星
- `GET /api/planets/:id` - 获取单个行星
- `POST /api/planets/:id/buildings/:building` - 建造/升级建筑

### 舰队
- `GET /api/fleet` - 获取舰队
- `POST /api/fleet/mission` - 派遣任务

### 研究
- `POST /api/research/:tech` - 研究科技

---

## WebSocket 事件

- `resources:update` - 资源更新
- `fleet:return` - 舰队返回
- `combat:report` - 战斗报告
- `message:new` - 新消息
