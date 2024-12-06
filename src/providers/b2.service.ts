import { S3 } from '@aws-sdk/client-s3';
import { env } from 'process';

export const s3 = new S3({
  endpoint: `https://${env.ENDPOINT_BACKBLAZE}`,
  region: env.REGION,
  credentials: {
    accessKeyId: env.KEY_ID,
    secretAccessKey: env.APP_KEY,
  },
});
