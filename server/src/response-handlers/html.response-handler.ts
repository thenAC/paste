import { ResponseHandler, createResponseHandlerDecorator } from 'bwcx-ljsm';
import type { IBwcxResponseHandler, RequestContext } from 'bwcx-ljsm';

@ResponseHandler()
export default class HtmlResponseHandler implements IBwcxResponseHandler {
  public handle(response: string, ctx: RequestContext) {
    ctx.set('Content-Type', 'text/html');
    return response;
  }
}

export function HtmlResponse() {
  return createResponseHandlerDecorator(HtmlResponseHandler);
}
