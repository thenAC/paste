import { Config } from 'bwcx-ljsm';

@Config()
export default class RedisKeyConfig {
  private readonly prefix = 'thenac_paste';

  public rateLimitIp(ip: string) {
    return `${this.prefix}:count:rate_limit_ip:${ip}`;
  }
}
