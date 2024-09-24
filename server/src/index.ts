/* eslint-disable @typescript-eslint/no-require-imports */

const isProd = process.env.NODE_ENV === 'production';
const moduleAlias = require('module-alias');

moduleAlias.addAlias('@server', __dirname);
moduleAlias.addAlias('@root', require('path').join(__dirname, '../../'));

import { getDependency } from 'bwcx-core';
import type { IAppConfig } from 'bwcx-ljsm';
import { App } from 'bwcx-ljsm';
import path from 'path';
import cors from '@koa/cors';
import UtilityHeaderMiddleware from './middlewares/utility-header.middleware';
import LoggerMiddleware from './middlewares/logger.middleware';
import DefaultResponseHandler from '@server/response-handlers/default.response-handler';
import MongoClient from './lib/mongo-client';
import RedisClient from './lib/redis-client';

export default class OurApp extends App {
  protected baseDir = path.join(__dirname, '.');

  protected scanGlobs = ['./**/*.(j|t)s', '!./**/*.d.ts', '!./jobs/**/*'];

  protected hostname = process.env.HOST || '127.0.0.1';

  protected port = parseInt(process.env.PORT) || 3031;

  protected exitTimeout = 5000;

  protected globalMiddlewares = [UtilityHeaderMiddleware, LoggerMiddleware];

  protected responseHandler = DefaultResponseHandler;

  protected validation: IAppConfig['validation'] = isProd
    ? {
        skipRespValidation: true,
      }
    : {};

  protected bodyParserOptions: IAppConfig['bodyParserOptions'] = {
    formLimit: '5mb',
    jsonLimit: '5mb',
  };

  protected multerOptions: IAppConfig['multerOptions'] = {
    limits: {
      fileSize: 8 * 1024 * 1024,
    },
  };

  public constructor() {
    super();
  }

  protected async beforeWire() {
    this.instance.use(cors());
    this.instance.use(async (ctx, next) => {
      ctx.startAt = new Date();
      try {
        await next();
      } finally {
        const logger = ctx.info || console.log;
        !ctx.path.endsWith('/api/checkHealth') &&
          logger(`${ctx.status} - ua: ${ctx.get('User-Agent')} - referer: ${ctx.get('Referer')}`);
      }
    });
  }

  protected async afterWire() {
    this.instance.on('error', (error, ctx) => {
      try {
        console.error('server error', error, ctx);
      } catch (e) {
        console.error(e);
      }
    });

    const mongoClient = getDependency<MongoClient>(MongoClient, this.container);
    await mongoClient.init();
    const redisClient = getDependency<RedisClient>(RedisClient, this.container);
    await redisClient.init();
  }

  protected async afterStart() {
    console.log(`🚀 A bwcx app is listening on http://${this.hostname || '0.0.0.0'}:${this.port}`);
  }

  protected async beforeExit() {}
}

const app = new OurApp();
app.scan();
app.bootstrap().then(() => {
  app.start();
});
