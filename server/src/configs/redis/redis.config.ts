import { Config } from 'bwcx-ljsm';

@Config()
export default class RedisConfig {
  public readonly host: string = '127.0.0.1';
  public readonly port: number = 6379;
  public readonly username: string | undefined;
  public readonly password: string | undefined;
  public readonly db: number | undefined;
}
