import { Config } from 'bwcx-ljsm';
import QCloudConfig from './qcloud.config';

@Config(QCloudConfig, { when: 'production', override: true })
export default class QCloudConfigProd extends QCloudConfig {
  public cos = {
    secretId: process.env.COS_SECRET_ID,
    secretKey: process.env.COS_SECRET_KEY,
    bucket: process.env.COS_BUCKET,
    region: process.env.COS_REGION,
    basePath: process.env.COS_BASE_PATH || 'paste/',
  };
}
