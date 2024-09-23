---
outline: deep
---

# Piece API

## 添加代码片段

`POST /addPiece`

### 请求参数

| 参数名 | 类型   | 必填 | 描述         | 校验规则                                                                                     |
| ------ | ------ | ---- | ------------ | -------------------------------------------------------------------------------------------- |
| `code` | string | 是   | 代码片段内容 | 长度 1-1048576                                                                               |
| `lang` | string | 是   | 代码语言     | [可用枚举值](https://github.com/thenAC/paste/blob/master/client/src/lib/configs/language.ts) |
| `ttl`  | number | 是   | 有效期       | [可用枚举值](https://github.com/thenAC/paste/blob/master/common/configs/piece.json)          |
| `rel`  | string | 否   | 相关链接     |                                                                                              |

### 响应结构

| 字段名 | 类型   | 字段一定存在 | 描述                 |
| ------ | ------ | ------------ | -------------------- |
| `key`  | string | 是           | 获得的代码片段 key   |
| `url`  | string | 是           | 获得的代码片段短链接 |

### 频率限制

- IP 粒度：`10 次 / 分钟`

## 获取代码片段

:::tip
代码片段存储在 CDN 并在多个加速节点上发布，需要从特定 URL 获取，而非 API 接口。
:::

`GET https://thenac.cdn.blueverse.cc/paste/{key}.json`

### 请求参数

| 参数名 | 类型           | 必填 | 描述         | 校验规则 |
| ------ | -------------- | ---- | ------------ | -------- |
| `key`  | string (param) | 是   | 代码片段 key |          |

### 响应结构

| 字段名      | 类型   | 字段一定存在 | 描述                                 |
| ----------- | ------ | ------------ | ------------------------------------ |
| `key`       | string | 是           | 代码片段 key                         |
| `code`      | string | 是           | 代码片段内容                         |
| `lang`      | string | 是           | 代码语言                             |
| `rel`       | string | 否           | 相关链接                             |
| `author`    | number | 是           | 作者，游客为 0                       |
| `createdAt` | number | 是           | 创建时间戳                           |
| `expireAt`  | number | 否           | 过期时间戳，永久有效期时不存在此字段 |
