import { Config } from 'bwcx-ljsm';

@Config()
export default class QCloudConfig {
  public cos: {
    secretId: string;
    secretKey: string;
    bucket: string;
    region: string;
    basePath: string;
  } = {
    secretId: 'your_secret_id',
    secretKey: 'your_secret_key',
    bucket: 'your_bucket',
    region: 'your_region',
    basePath: 'paste/',
  };
}
