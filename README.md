# 🎮 遊戲作品集 Game Portfolio

一個精美的遊戲作品集網站，包含三款經典遊戲：2048、俄羅斯方塊和皮卡丘排球。

## 🌐 線上試玩

**網站連結**: [https://robinkct.github.io/game-portfolio/](https://robinkct.github.io/game-portfolio/)

## ✨ 特色功能

### 🎯 三款經典遊戲
- **2048** - 數字合併益智遊戲
- **Tetris (俄羅斯方塊)** - 經典方塊堆疊遊戲
- **Pikachu Volleyball** - 1997 年經典皮卡丘排球

### 📱 全平台支援
- **響應式設計** - 完美適配桌面與手機
- **觸控手勢** - 手機版支援滑動與點擊操作
- **鍵盤操作** - 電腦版完整鍵盤控制

### 🎨 精美視覺
- Gaming 風格深色主題
- 霓虹光暈特效
- 流暢動畫過渡
- 專屬遊戲封面

## 🎮 遊戲操作說明

### 2048
**電腦版**
- `↑ ↓ ← →` 方向鍵移動方塊

**手機版**
- 上下左右滑動螢幕

### Tetris (俄羅斯方塊)
**電腦版**
- `←` `→` 左右移動
- `↑` 旋轉方塊
- `↓` 加速下落
- `Space` 直接落到底部 (Hard Drop)

**手機版**
- 左右滑動移動方塊
- 上滑旋轉
- 下滑加速
- **雙擊螢幕** 直接落到底部

### Pikachu Volleyball
**電腦版 - Player 1**
- `↑ ↓ ← →` 方向鍵移動
- `Enter` 扣球

**電腦版 - Player 2**
- `D` `F` `G` `R` 移動
- `Z` 扣球

**手機版**
- 滑動螢幕移動皮卡丘
- **點擊螢幕** 扣球/跳躍

## 🛠️ 技術棧

- **框架**: React 18 + Vite
- **樣式**: Tailwind CSS
- **動畫**: Framer Motion
- **路由**: React Router (HashRouter)
- **部署**: GitHub Pages

## 🚀 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build
```

## 📦 專案結構

```
game-portfolio/
├── public/
│   ├── images/              # 遊戲封面圖片
│   └── pikachu-volleyball/  # 皮卡丘排球遊戲資源
├── src/
│   ├── components/          # React 元件
│   ├── data/               # 遊戲資料配置
│   ├── games/              # 各遊戲實作
│   │   ├── game-2048/
│   │   ├── tetris/
│   │   └── pikachu/
│   ├── pages/              # 頁面元件
│   └── utils/              # 工具函數
└── .github/workflows/      # GitHub Actions 部署
```

## 🎯 核心功能實作

### 手機觸控支援
- 2048 與 Tetris 使用 `touchstart`/`touchmove`/`touchend` 事件
- 皮卡丘排球透過 `postMessage` 與 iframe 通訊
- 防止滾動衝突 (`touch-action: none`)

### 路徑處理
- 使用 `getAssetUrl` 工具函數處理資源路徑
- 支援本地開發與 GitHub Pages 部署

### 響應式佈局
- Flexbox 動態佈局避免元素重疊
- `100dvh` 確保手機版完整視窗高度
- 桌面與手機版不同的 UI 配置

## 📝 授權

本專案僅供學習與展示用途。

---

Made with ❤️ by Robin
