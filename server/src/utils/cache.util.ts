import { Inject, Provide } from 'bwcx-core';
import { LRUCache } from 'lru-cache';

@Provide()
export default class CacheUtils {
  public cacheMap = {
    statistics: new LRUCache<
      string,
      {
        totalCount: string;
        totalBytes: string;
      }
    >({
      max: 1,
      ttl: 5 * 1000,
    }),
  };

  public getStatisticsCache() {
    return this.cacheMap.statistics.get('main');
  }

  public setStatisticsCache(data: { totalCount: string; totalBytes: string }) {
    this.cacheMap.statistics.set('main', data);
  }

  public clearStatisticsCache() {
    this.cacheMap.statistics.delete('main');
  }
}
