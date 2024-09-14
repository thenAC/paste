import { Config } from 'bwcx-ljsm';
import MongoConfig from './mongo.config';

@Config(MongoConfig, { when: 'production', override: true })
export default class MongoProdConfig extends MongoConfig {
  public static readonly url = `mongodb://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASS)}@${
    process.env.MONGO_HOST || '127.0.0.1'
  }:${process.env.MONGO_PORT || 27017}/${process.env.MONGO_DB || 'thenac_paste'}`;
}
