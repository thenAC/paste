import type { IBwcxMiddleware, MiddlewareNext, RequestContext } from 'bwcx-ljsm';
import { Middleware } from 'bwcx-ljsm';

@Middleware()
export default class UtilityHeaderMiddleware implements IBwcxMiddleware {
  public async use(ctx: RequestContext, next: MiddlewareNext) {
    try {
      await next();
    } finally {
      ctx.set('X-Execution-Time', `${Date.now() - ctx.startAt.getTime()}`);
      ctx.set('X-Framework-Powered-By', 'bwcx');
    }
  }
}
