---
outline: deep
---

# Statistics API

## 获取统计信息

`GET /getStatistics`

### 请求参数

无。

### 响应结构

| 字段名       | 类型                | 字段存在 | 描述             |
| ------------ | ------------------- | -------- | ---------------- |
| `totalCount` | string (from int64) | 是       | 代码片段总计数量 |
| `totalBytes` | string (from int64) | 是       | 代码片段总计长度 |
