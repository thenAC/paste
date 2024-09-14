import { Inject, Provide } from 'bwcx-core';
import mongoose from 'mongoose';
import MongoConfig from '@server/configs/mongo/mongo.config';

@Provide()
export default class MongoClient {
  public db: mongoose.Mongoose
  public conn: mongoose.Connection;

  public constructor(
    @Inject()
    private readonly mongoConfig: MongoConfig,
  ) {}

  async init() {
    this.db = await mongoose.connect(this.mongoConfig.url, {
      autoCreate: true,
      autoIndex: true,
    });
    this.conn = this.db.connection;
  }
}
