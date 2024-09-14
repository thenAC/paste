import { ExceptionHandler } from 'bwcx-ljsm';
import type { IBwcxExceptionHandler, RequestContext } from 'bwcx-ljsm';
import { ErrCode } from '@server/enums/err-code.enum';
import { errCodeConfigs } from '@server/err-code-configs';
import FrequencyLimitExceededException from '@server/exceptions/frequency-limit-exceeded.exception';

@ExceptionHandler(FrequencyLimitExceededException)
export default class FrequencyLimitExceededExceptionHandler implements IBwcxExceptionHandler {
  public catch(e: FrequencyLimitExceededException, ctx: RequestContext) {
    ctx.error(
      `FrequencyLimitExceededException caught: ip: ${ctx.ip}, url: ${ctx.url}, ua: ${ctx.request.headers['user-agent']}, err:`,
      e,
    );
    ctx.status = 429;
    ctx.body = {
      success: false,
      code: ErrCode.FrequencyLimitExceeded,
      msg: errCodeConfigs[ErrCode.FrequencyLimitExceeded],
      data: {
        limit: e.limit,
        duration: e.duration,
      },
    };
  }
}
