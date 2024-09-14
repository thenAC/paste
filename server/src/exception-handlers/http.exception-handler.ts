import { Inject } from 'bwcx-core';
import { ExceptionHandler } from 'bwcx-ljsm';
import type { IBwcxExceptionHandler, RequestContext } from 'bwcx-ljsm';
import statuses from 'statuses';
import HttpException from '@server/exceptions/http.exception';

@ExceptionHandler(HttpException)
export default class HttpExceptionHandler implements IBwcxExceptionHandler {
  public catch(e: HttpException, ctx: RequestContext) {
    ctx.error(`HTTP exception ${e.code}:\n
          url: ${ctx.url}\n
          err: ${e.message}`);

    ctx.status = e.code;
    if (ctx.url.indexOf('/api/') !== -1) {
      if (e.code === 404) {
        ctx.body = {
          success: false,
          code: e.code,
          msg: '请求地址不存在',
        };
      } else {
        ctx.body = {
          success: false,
          code: e.code,
          msg: statuses[e.code] || 'Unknown Error',
        };
      }
    }
  }
}
