import { Config } from 'bwcx-ljsm';
import RedisConfig from './redis.config';

@Config(RedisConfig, { when: 'production', override: true })
export default class RedisProdConfig extends RedisConfig {
  public readonly host = process.env.REDIS_HOST || '127.0.0.1';
  public readonly port = parseInt(process.env.REDIS_PORT) || 6379;
  public readonly username = process.env.REDIS_USER;
  public readonly password = process.env.REDIS_PASS;
  public readonly db = parseInt(process.env.REDIS_DB) || 0;
}
