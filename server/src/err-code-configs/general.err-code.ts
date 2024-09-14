import { registerErrCodeConfigs } from '@server/err-code-configs';
import { ErrCode } from '@server/enums/err-code.enum';

registerErrCodeConfigs({
  [ErrCode.SystemError]: '系统异常，请稍后再试',
  [ErrCode.IllegalRequest]: '非法请求',
  [ErrCode.IllegalParameters]: '非法参数',
  [ErrCode.FrequencyLimitExceeded]: '请求频率超出限制',
});
