import { ResponseHandler, createResponseHandlerDecorator } from 'bwcx-ljsm';
import type { IBwcxResponseHandler, RequestContext } from 'bwcx-ljsm';

@ResponseHandler()
export default class CustomResponseHandler implements IBwcxResponseHandler {
  public handle(response: string, _ctx: RequestContext) {
    return response;
  }
}

export function CustomResponse() {
  return createResponseHandlerDecorator(CustomResponseHandler);
}
