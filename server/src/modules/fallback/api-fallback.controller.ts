import { Get } from 'bwcx-ljsm';
import { ApiController } from '@server/decorators';
import HttpException from '@server/exceptions/http.exception';

@ApiController(undefined, { priority: -1 })
export default class FallbackController {
  @Get('*')
  public fallback() {
    throw new HttpException(404);
  }
}
