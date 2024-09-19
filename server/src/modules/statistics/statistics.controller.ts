import { Contract, InjectCtx, Get, RequestContext } from 'bwcx-ljsm';
import { Inject } from 'bwcx-core';
import { ApiController } from '@server/decorators';
import { Statistics } from '@server/models/statistics.model';
import { GetStatisticsRespDTO } from './statistics.dto';
import CacheUtils from '@server/utils/cache.util';

@ApiController()
export default class StatisticsController {
  public constructor(
    @InjectCtx()
    private readonly ctx: RequestContext,

    @Inject()
    private readonly cacheUtils: CacheUtils,
  ) {}

  @Get()
  @Contract(null, GetStatisticsRespDTO)
  async getStatistics(): Promise<GetStatisticsRespDTO> {
    const cached = this.cacheUtils.getStatisticsCache();
    if (cached) {
      return cached;
    }
    const statisticsRes = await Statistics.findOne({ key: 'main'});
    const statistics = {
      totalCount: (statisticsRes?.totalCount || 0).toString(),
      totalBytes: (statisticsRes?.totalBytes || 0).toString(),
    };
    this.cacheUtils.setStatisticsCache(statistics);
    return statistics;
  }
}
