import { Config } from 'bwcx-ljsm';

@Config()
export default class MongoConfig {
  public readonly url: string = 'mongodb://127.0.0.1:27017/thenac_paste';
}
