import { ExceptionHandler, ValidationException } from 'bwcx-ljsm';
import type { IBwcxExceptionHandler, RequestContext } from 'bwcx-ljsm';
import { ErrCode } from '@server/enums/err-code.enum';
import { errCodeConfigs } from '@server/err-code-configs';

@ExceptionHandler(ValidationException)
export default class ValidationExceptionHandler implements IBwcxExceptionHandler {
  public catch(error: ValidationException, ctx: RequestContext) {
    ctx.error(
      `ValidationException caught: ${error.message}\n
      ua: ${ctx.request.headers['user-agent']}\n
      errors:`,
      JSON.stringify(error.errors, null, 2),
    );
    ctx.status = 422;
    ctx.body = {
      success: false,
      code: ErrCode.IllegalParameters,
      msg: error.source === 'req' ? errCodeConfigs[ErrCode.IllegalParameters] : '响应数据校验失败',
      data: error.errors,
    };
  }
}
