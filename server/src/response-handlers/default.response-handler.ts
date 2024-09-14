import { ResponseHandler } from 'bwcx-ljsm';
import type { IBwcxResponseHandler, RequestContext } from 'bwcx-ljsm';

@ResponseHandler()
export default class DefaultResponseHandler implements IBwcxResponseHandler {
  public handle(response: any, _ctx: RequestContext) {
    return {
      success: true,
      code: 0,
      data: response,
    };
  }
}
