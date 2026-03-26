# Frontend Development Standards

> **目的**: 记录前端开发历史、OKX 设计细节和演进过程
> **设计系统规则**: 参见 `DESIGN_SYSTEM.md`
> **Token 定义**: 参见 `DESIGN_SYSTEM_TOKENS.md`

## ⚠️ 重要：AI Agents 必读

**所有 AI agents（包括 Claude、Kimi、Gemini 等）在修改前端代码后，必须：**

1. ✅ **更新本文档的"组件开发历史"部分**
   - 记录新增的组件/页面
   - 记录重要的设计决策
   - 记录架构变更

2. ✅ **遵循 DESIGN_SYSTEM.md 的规则**
   - 使用语义化 Tailwind token
   - 复用 `src/components/ui/*` 组件
   - 不创建重复的样式系统

3. ✅ **在 PR/Commit 中说明**
   - 说明是否更新了本文档
   - 说明是否遵循了设计系统

**如果你是 AI agent，现在正在修改前端代码，请在完成后立即更新本文档！**

---

## OKX 设计规范细节

### 字体 (Typography)
- **基准字号**: `html { font-size: 17px }` - 所有 rem 单位基于此等比例缩放
- **默认字号**: 14px (0.875rem)，与 OKX 保持一致
- **行高**: 1.5
- **字重**:
  - Regular (400) - 常规文本
  - Medium (500) - 按钮、标签
  - Semibold (600) - 标题、强调

**字体缩放机制**:
- 使用 rem 单位实现等比例缩放
- 调整 `html { font-size }` 即可全局缩放所有字体
- 当前设置为 17px（相比标准 16px 放大约 6.25%）

### 间距 (Spacing)
OKX 使用紧凑的间距系统：
- **组件内边距**: 8px, 12px, 16px
- **组件间距**: 8px, 12px, 16px, 24px
- **卡片内边距**: 16px, 20px, 24px
- **页面边距**: 16px (mobile), 24px (desktop)

### 圆角 (Border Radius)
- **按钮/输入框**: 4px (`--radius-sm`)
- **卡片**: 8px (`--radius-lg`)
- **Modal**: 12px (`--radius-xl`)

### 阴影 (Shadows)
OKX Modal 阴影效果：
```css
--shadow-modal: 0 20px 40px rgba(0, 0, 0, 0.3);
--shadow-dropdown: 0 10px 20px rgba(0, 0, 0, 0.2);
--shadow-card: 0 4px 6px rgba(0, 0, 0, 0.15);
```

### 过渡动画 (Transitions)
- **快速交互**: 150ms (hover, focus)
- **标准动画**: 200ms (展开/收起)
- **慢速动画**: 300ms (页面切换)

---

## 组件开发历史

### 2026-03-26: 初始化设计系统
**创建的组件**:
- `Button.tsx` - 按钮组件 (primary, secondary, buy, sell 变体)
- `Input.tsx` - 输入框组件
- `Card.tsx` - 卡片容器
- `Modal.tsx` - 弹窗组件 (使用 OKX 阴影效果)
- `Tabs.tsx` - 标签页组件

**页面组件**:
- `Header.tsx` - 顶部导航
- `SpotTradingPage.tsx` - 现货交易页面
- `TradePage.tsx` - 合约交易页面 (lazy loaded)
- `PoolsPage.tsx` - 流动性池页面 (lazy loaded)

**交易组件** (`src/components/spot/`):
- `TradingViewChart.tsx` - TradingView 图表集成
- `SpotTradingForm.tsx` - 现货交易表单
- `TradingPairModal.tsx` - 交易对选择弹窗

**设计决策**:
- 采用系统字体栈，零外部依赖
- 使用 CSS 变量 + Tailwind 语义化 token
- 深色主题为默认，支持浅色主题切换
- 懒加载重型页面 (recharts 依赖)

### 2026-03-26: 字体缩放优化 (by Kimi)
**改动**:
- 调整 `html { font-size: 17px }` (从默认 16px 放大 6.25%)
- 实现等比例字体缩放机制

**影响**:
- 所有 rem 单位自动放大约 6.25%
- 提升整体可读性
- 保持字体比例关系不变

**技术方案**:
- 使用 rem 单位 + html font-size 基准
- 符合现代前端最佳实践
- 一处修改，全局生效
