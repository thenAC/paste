const fs = require('fs').promises;
const path = require('path');
const COS = require('cos-nodejs-sdk-v5');

const REMOTE_PATH = process.env.COS_BASE_PATH || 'dist/paste/';
const baseDir = path.join(__dirname, '../build');

async function listFiles(dir) {
  let files = await fs.readdir(dir, { withFileTypes: true });
  let fileNames = [];

  for (let file of files) {
    let fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      fileNames = fileNames.concat(await listFiles(fullPath));
    } else {
      fileNames.push(path.relative(baseDir, fullPath));
    }
  }

  return fileNames;
}

async function main() {
  if (!process.env.COS_SECRET_ID || !process.env.COS_SECRET_KEY || !process.env.COS_BUCKET || !process.env.COS_REGION) {
    throw new Error('COS_SECRET_ID, COS_SECRET_KEY, COS_BUCKET, COS_REGION must be set');
  }
  const cos = new COS({
    SecretId: process.env.COS_SECRET_ID,
    SecretKey: process.env.COS_SECRET_KEY,
  });
  const files = await listFiles(baseDir);
  for (const file of files) {
    const remotePath = `${REMOTE_PATH}${file}`;
    console.log(`Uploading ${file} -> ${remotePath}`);
    await cos.uploadFile({
      Bucket: process.env.COS_BUCKET,
      Region: process.env.COS_REGION,
      Key: remotePath,
      FilePath: path.join(baseDir, file),
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
