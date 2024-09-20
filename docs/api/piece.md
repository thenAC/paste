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

| 字段名 | 类型   | 字段存在 | 描述                 |
| ------ | ------ | ------------ | -------------------- |
| `key`  | string | 是           | 获得的代码片段 key   |
| `url`  | string | 是           | 获得的代码片段短链接 |

### 频率限制

- IP 粒度：`10 次 / 分钟`
