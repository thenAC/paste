import { Inject, Provide } from 'bwcx-core';
import COS from 'cos-nodejs-sdk-v5';
import fs from 'fs-extra';
import QCloudConfig from '@server/configs/qcloud/qcloud.config';

@Provide()
export default class QCloudCosUtils {
  public cos: COS;

  public constructor(
    @Inject()
    private readonly config: QCloudConfig,
  ) {
    this.cos = new COS({
      SecretId: config.cos.secretId,
      SecretKey: config.cos.secretKey,
      Timeout: 60000,
    });
  }

  public uploadFile(key: string, file: Buffer | fs.ReadStream) {
    return this.cos.putObject({
      Bucket: this.config.cos.bucket,
      Region: this.config.cos.region,
      Key: `${this.config.cos.basePath}/${key}`,
      Body: file,
    });
  }

  public deleteFile(key: string) {
    if (!key) {
      return Promise.reject(new Error('Key is required'));
    }
    return this.cos.deleteObject({
      Bucket: this.config.cos.bucket,
      Region: this.config.cos.region,
      Key: `${this.config.cos.basePath}/${key}`,
    });
  }
}
