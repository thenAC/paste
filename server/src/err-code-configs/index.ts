import { IApiErrCodeConfig } from '@server/interfaces';

// @ts-ignore
export const errCodeConfigs: IApiErrCodeConfig = {};

/**
 * 注册错误码配置，可用于抛出 `LogicException` 时根据 ErrCode 枚举返回正确的 msg
 *
 * @param configs 错误码配置
 */
export function registerErrCodeConfigs(configs: IApiErrCodeConfig) {
  // eslint-disable-next-line no-restricted-syntax
  for (const code in configs) {
    // eslint-disable-next-line no-prototype-builtins
    if (configs.hasOwnProperty(code)) {
      errCodeConfigs[code] = configs[code];
    }
  }
}
