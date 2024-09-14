/* eslint-disable @typescript-eslint/no-require-imports */

const isProd = process.env.NODE_ENV === 'production';
const moduleAlias = require('module-alias');

moduleAlias.addAlias('@server', require('path').join(__dirname, '../'));
moduleAlias.addAlias('@root', require('path').join(__dirname, '../../../'));

import { getDependency } from 'bwcx-core';
import { App } from 'bwcx-ljsm';
import path from 'path';
import PQueue from 'p-queue';
import MongoClient from '@server/lib/mongo-client';
import { Piece } from '@server/models/piece.model';
import QCloudCosUtils from '@server/utils/qcloud-cos.util';

const EXEC_INTERVAL = (parseInt(process.env.EXEC_INTERVAL, 10) || 60) * 1000;

class JobVirtualApp extends App {
  protected baseDir = path.join(__dirname, '../');

  protected scanGlobs = ['./{configs,models,utils}/**/*.(j|t)s', '!./**/*.d.ts', '!./jobs/**/*'];

  protected hostname = '127.0.0.1';

  protected port = 0;

  protected exitTimeout = 5000;

  public constructor() {
    super();
  }
}

let interval: NodeJS.Timer;
const queue = new PQueue({ concurrency: 1 });

async function clearDeleted() {
  console.log('Clearing deleted pieces...');
  try {
    const qcloudCosUtils = getDependency<QCloudCosUtils>(QCloudCosUtils);
    // find all expired pieces (where expireAt > current Date, at max 1000)
    const pieces = await Piece.find({ expireAt: { $lte: new Date() }, deleted: false }).limit(1000);
    console.log(`Found ${pieces.length} pieces to delete`);
    if (pieces.length === 0) {
      return;
    }
    for (const piece of pieces) {
      console.log(`Deleting ${piece.key} (_id: ${piece._id})...`);
      try {
        await qcloudCosUtils.deleteFile(`${piece.key}.json`);
      } catch (e) {
        console.error(`Failed to delete ${piece.key}.json on remote:`, e);
        throw new Error(`Failed to delete file ${piece.key}.json on remote`);
      }
      await Piece.updateOne({ _id: piece._id }, { $set: { deleted: true } });
    }
    console.log(`Deleted ${pieces.length} pieces`);
  } catch (e) {
    console.error(`Failed to clear:`, e);
  }
}

async function addClearJob() {
  await queue.add(clearDeleted);
}

async function main() {
  const app = new JobVirtualApp();
  app.scan();
  const mongoClient = getDependency<MongoClient>(MongoClient);
  await mongoClient.init();
  interval = setInterval(addClearJob, EXEC_INTERVAL);
  addClearJob();
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
