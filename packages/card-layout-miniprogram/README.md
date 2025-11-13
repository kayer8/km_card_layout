# TDesign Miniprogram Starter

本仓库只保留了 TDesign 小程序组件库的**编译、发布与 Demo 骨架**，方便你快速复用发布流程，再按需补充自己的组件代码。

## 包含内容

- `src/`：干净的组件源码目录，当前自带一个 `demo-card` 示例组件。
- `script/gulpfile.js`：精简版构建流程，负责编译 `src`、同步到 `miniprogram_dist`，并把结果拷贝到 Demo。
- `example/`：最小可运行示例，会自动依赖 `miniprogram_dist` 中的组件。

## 快速开始

```bash
npm install
npm run dev      # 实时监听 src/ 与 example/，输出到 miniprogram_dist / example_dist
npm run build    # 进行一次完整的编译与 Demo 同步
```

> 首次或执行 `npm run build` 之后，将 `example_dist` 目录导入微信开发者工具即可预览。

## 开发自己的组件

1. 在 `src/components` 下复制 `demo-card`，调整文件名与实现代码。
2. 在 `example/pages/home/index.json`（或你自己的页面）里通过 `usingComponents` 引入新的组件。
3. 运行 `npm run dev`，组件改动会实时同步到 Demo。

## 发布流程

1. `npm run build`
2. 检查 `miniprogram_dist`（产物）与 `example_dist`（示例）是否符合预期。
3. `miniprogram_dist` 可直接发布到 npm / 私有仓库，`example_dist` 可作为 WeChat Demo。

## 下一步可以做什么？

- 增加更多组件文件夹并在 `example` 中编写页面示例。
- 根据项目需要扩展 `script/gulpfile.js`（如压缩、Less、单测等）。
- 接入你自己的发布脚本或 CI。
