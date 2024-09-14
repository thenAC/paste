import { combineDecorators } from 'bwcx-common';
import { Inject, Optional } from 'bwcx-core';
import {
  Middleware,
  IBwcxMiddleware,
  RequestContext,
  MiddlewareNext,
  InjectReflector,
  Reflector,
  SetMetadata,
  UseMiddlewares,
} from 'bwcx-ljsm';
import { isPrivate as isPrivateIp } from 'ip';
import RedisKeyConfig from '@server/configs/redis-key/redis-key.config';
import RedisClient from '@server/lib/redis-client';
import FrequencyLimitExceededException from '@server/exceptions/frequency-limit-exceeded.exception';

@Middleware()
export default class RateLimitIpMiddleware implements IBwcxMiddleware {
  @InjectReflector()
  @Optional()
  reflector?: Reflector;

  @Inject()
  redisKeyConfig: RedisKeyConfig;

  @Inject()
  redis: RedisClient;

  public async use(ctx: RequestContext, next: MiddlewareNext) {
    const limit = this.reflector?.getMetadata<number>('middleware:RateLimitMiddleware:limit');
    const duration = this.reflector?.getMetadata<number>('middleware:RateLimitMiddleware:duration');
    const ip = ctx.ip;
    if (isPrivateIp(ip)) {
      return next();
    }
    if (!(limit > 0 && duration > 0)) {
      ctx.warn('[RateLimitMiddleware] Limit or duration is not set');
      return next();
    }
    const isLimited = await this.isRateLimited(ip, limit, duration);
    if (isLimited) {
      throw new FrequencyLimitExceededException(limit, duration);
    }
    return next();
  }

  async isRateLimited(ip: string, limit: number, duration: number): Promise<boolean> {
    const key = this.redisKeyConfig.rateLimitIp(ip);
    const currentTime = Math.floor(Date.now() / 1000);

    const result = await this.redis.client.evalsha(
      this.redis.getScriptHash('rateLimitIp'),
      1,
      key,
      limit,
      duration,
      currentTime,
    );
    if (result === 0) {
      return true;
    } else {
      return false;
    }
  }
}

/**
 * 限制单位时间内请求次数。
 * @param limit 单位时间内最大请求次数
 * @param duration 单位时间，单位为 s
 */
export function RateLimitIp(limit: number, duration: number) {
  return combineDecorators([
    SetMetadata('middleware:RateLimitMiddleware:limit', limit),
    SetMetadata('middleware:RateLimitMiddleware:duration', duration),
    UseMiddlewares(RateLimitIpMiddleware),
  ]);
}
