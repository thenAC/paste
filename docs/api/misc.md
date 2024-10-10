---
outline: deep
---

# Misc API

## 查询相关链接元信息

`GET /getRelMeta`

### 请求参数

| 参数名     | 类型   | 必填 | 描述                          | 校验规则          |
| ---------- | ------ | ---- | ----------------------------- | ----------------- |
| `relLinks` | string | 是   | 相关链接（英文逗号 `,` 分隔） | 总长度不超过 2048 |

### 响应结构

| 字段名        | 类型      | 字段一定存在 | 描述                                                            |
| ------------- | --------- | ------------ | --------------------------------------------------------------- |
| `relMetaList` | Array<`RelMeta` \| null> | 是           | 链接解析的结果，与提交数组顺序对应。如无法解析，则对应项返回 null |

对于 `RelMeta` 响应结构，请参见 [此链接](https://github.com/thenAC/paste/blob/master/server/src/interfaces/rel-meta.ts)。

### 说明

当前支持解析的链接来源：

- [SDUTOJ](https://acm.sdut.edu.cn/onlinejudge3/)

### 频率限制

- IP 粒度：`30 次 / 分钟`
