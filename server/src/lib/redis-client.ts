import { Inject, Provide } from 'bwcx-core';
import Redis from 'ioredis';
import fs from 'fs-extra';
import path from 'path';
import RedisConfig from '@server/configs/redis/redis.config';

@Provide()
export default class RedisClient {
  private scriptHashMap: Map<string, string> = new Map();
  private scripts = {
    rateLimitIp: 'rate-limit-ip.lua',
  };

  public client: Redis;

  public constructor(
    @Inject()
    redisConfig: RedisConfig,
  ) {
    this.client = new Redis(redisConfig);
  }

  public async init() {
    for (const script of Object.keys(this.scripts)) {
      const scriptContent = await fs.readFile(path.join(__dirname, `./redis-scripts/${this.scripts[script]}`), 'utf8');
      const hash = (await this.client.script('LOAD', scriptContent)) as string;
      this.scriptHashMap.set(script, hash);
      console.log(`[RedisClient] Loaded script ${script}: ${hash}`);
    }
  }

  public getScriptHash(script: keyof typeof RedisClient.prototype.scripts) {
    return this.scriptHashMap.get(script);
  }
}
