import { ExceptionHandler, GuardNotPassException } from 'bwcx-ljsm';
import type { IBwcxExceptionHandler, RequestContext } from 'bwcx-ljsm';
import { ErrCode } from '@server/enums/err-code.enum';
import { errCodeConfigs } from '@server/err-code-configs';

@ExceptionHandler(GuardNotPassException)
export default class GuardNotPassExceptionHandler implements IBwcxExceptionHandler {
  public catch(e: GuardNotPassException, ctx: RequestContext) {
    ctx.error(`GuardNotPassException caught: url: ${ctx.url}, ua: ${ctx.request.headers['user-agent']}, err:`, e);
    ctx.body = {
      success: false,
      code: ErrCode.IllegalRequest,
      msg: errCodeConfigs[ErrCode.IllegalRequest],
    };
  }
}
