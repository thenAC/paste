import { ExceptionHandler } from 'bwcx-ljsm';
import type { IBwcxExceptionHandler, RequestContext } from 'bwcx-ljsm';
import LogicException from '@server/exceptions/logic.exception';
import { errCodeConfigs } from '@server/err-code-configs';

@ExceptionHandler(LogicException)
export default class LogicExceptionHandler implements IBwcxExceptionHandler {
  public catch(e: LogicException, ctx: RequestContext) {
    const msg = `LogicException caught: ${e.code}\n
            url: ${ctx.url}\n
            err: ${e.message}\n
            stack: ${e.stack}`;
    ctx.warn(msg);
    if (!errCodeConfigs[e.code]) {
      ctx.warn(`No err code config for LogicException. url: ${ctx.url}, code: ${e.code}`);
    }
    ctx.body = {
      success: false,
      code: e.code,
      msg: errCodeConfigs[e.code] || '系统异常，请稍后再试',
    };
  }
}
