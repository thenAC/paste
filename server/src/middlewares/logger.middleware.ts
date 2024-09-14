import { Inject } from 'bwcx-core';
import type { IBwcxMiddleware, MiddlewareNext, RequestContext } from 'bwcx-ljsm';
import { Middleware } from 'bwcx-ljsm';
import MiscUtils from '@server/utils/misc.util';

@Middleware()
export default class LoggerMiddleware implements IBwcxMiddleware {
  @Inject()
  private readonly miscUtils: MiscUtils;

  public async use(ctx: RequestContext, next: MiddlewareNext) {
    ctx.info = (...messages: any[]) => console.info(...this.wrapMessages(ctx, ...messages));
    ctx.warn = (...messages: any[]) => console.warn(...this.wrapMessages(ctx, ...messages));
    ctx.error = (...messages: any[]) => console.error(...this.wrapMessages(ctx, ...messages));
    return next();
  }

  private wrapMessages(ctx: RequestContext, ...messages: any[]) {
    const { method, url } = ctx;
    return [`[${this.miscUtils.getIp(ctx)} ${method.toUpperCase()} ${url}]`, ...messages];
  }
}
