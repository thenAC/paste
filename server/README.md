# paste-server

使用 bwcx 的服务端项目模板创建。

包含技术栈：
- TypeScript

## 准备

1. 安装并使用 Node.js 16（推荐使用 fnm 自动切换版本）
2. 安装并使用 pnpm v8
3. 运行 `pnpm run init` 安装依赖

## 开发

1. 运行 `npm run dev`
2. 在浏览器中打开 <http://127.0.0.1:3031/>

## 构建

1. 运行 `npm run build`

## 部署

模板使用 PM2 作为生产环境部署工具，运行 `npm run deploy` 或 `npm run deploy:foreground`。

## 开发指南

### 后端开发

服务端使用 bwcx，提供简洁的 OOP 开发体验，参考 [bwcx 文档](https://bwcxjs.github.io/bwcx/)。
