export enum ErrCode {
  /** 未捕获异常 */
  SystemError = -1,
  /** 非法请求 */
  IllegalRequest = -2,
  /** 非法参数 */
  IllegalParameters = -3,
  /** 频率超出限制 */
  FrequencyLimitExceeded = -4,

  // 自定义逻辑异常错误码
  // ...
}
