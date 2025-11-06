## 名片自由布局工具（Vue + TDesign + TypeScript）

此工具用于搭建一个“所见即所得”的名片设计器，可以拖拽画布元素、配置文本样式、绑定数据字段并导出跨端通用的 JSON 布局数据。

### 功能概览
- 画布尺寸、背景、网格可调，提供缩放预览。
- 网格支持自定义横纵间距（如 12 × 50）并启用吸附，元素边界自动对齐网格。
- 元素支持自由拖拽、四角缩放、层级调整。
- 预置姓名、职位、公司、电话、邮箱、Logo、二维码等常用组件，一键加入布局。
- 属性面板按内容、布局、样式分组，实时同步到画布。
- 支持 JSON 导入/导出，保持跨平台一致的渲染结构。

### 目录结构
```
├── docs/layout-system.md      # 系统设计与 JSON Schema
├── src
│   ├── App.vue                # 编辑器整体布局
│   ├── main.ts                # Vue + Pinia + TDesign 初始化
│   ├── assets/main.css        # 全局基础样式
│   ├── components
│   │   ├── canvas             # 画布与元素渲染
│   │   ├── editor             # 顶部工具栏
│   │   ├── inspector          # 属性面板
│   │   ├── layers             # 图层列表
│   │   └── palette            # 元素库
│   ├── stores/layoutStore.ts  # 布局状态、历史、操作命令
│   └── types/layout.ts        # 布局/元素类型约束
└── vite.config.ts             # Vite + alias 配置
```

### 启动开发环境
1. 确保已安装 Node.js 18+。
2. 在项目根目录执行：
   ```bash
   npm install
   npm run dev
   ```
   > 如遇到 `node_modules` 权限问题，可删除旧的 `node_modules` 后重新安装，或手动清理只读属性。

3. 浏览器打开 `http://localhost:5173`。

### JSON 输出
- 通过工具栏「导出 JSON」按钮下载当前布局，结构定义见 `docs/layout-system.md`。
- 下游小程序/H5 端可直接解析 `CardLayout` 中的 `elements`、`meta.canvas` 与 `dataBindings` 渲染一致布局。

### 下一步迭代建议
1. **数据绑定表单**：允许用户自定义字段值，预览多语言/多角色名片。
2. **资源管理**：接入上传接口，处理 Logo/QrCode 的真实图片/链接。
3. **对齐辅助**：增加参考线、对齐吸附、分布对齐等交互细节。
4. **模板中心**：定义模板 JSON，快速替换背景与元素组合。
5. **渲染 SDK**：基于 JSON 在目标端实现渲染组件，保障跨端还原度。
