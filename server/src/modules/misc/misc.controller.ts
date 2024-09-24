import { Contract, Data, Get } from 'bwcx-ljsm';
import { Inject } from 'bwcx-core';
import { ApiController } from '@server/decorators';
import { GetRelMetaReqDTO, GetRelMetaRespDTO } from './misc.dto';
import { RateLimitIp } from '@server/middlewares/rate-limit.middleware';
import RelMetaUtils from '@server/utils/rel-meta/rel-meta.util';
import { IRelMeta } from '@server/interfaces/rel-meta';
import LogicException from '@server/exceptions/logic.exception';
import { ErrCode } from '@server/enums/err-code.enum';

@ApiController()
export default class MiscController {
  public constructor(

    @Inject()
    private readonly relMetaUtils: RelMetaUtils,
  ) {}

  @Get()
  @Contract(GetRelMetaReqDTO, GetRelMetaRespDTO)
  @RateLimitIp(30, 60)
  async getRelMeta(@Data() data: GetRelMetaReqDTO): Promise<GetRelMetaRespDTO> {
    const relLinks = data.relLinks.split(',');
    const res: (IRelMeta | null)[] = [];
    for (const relLink of relLinks) {
      let urlObject: URL;
      try {
        urlObject = new URL(relLink);
      } catch (e) {
        throw new LogicException(ErrCode.IllegalParameters);
      }
      res.push(await this.relMetaUtils.autoDetect(relLink, urlObject));
    }
    return {
      relMetaList: res,
    };
  }

  @Get()
  @Contract(null, null)
  async checkHealth(): Promise<void> {
  }
}
