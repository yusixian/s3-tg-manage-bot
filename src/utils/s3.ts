import { ITEMS_PER_PAGE, S3_ENDPOINT, S3_REGION } from '@/constants';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
// 配置 S3
const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
});

// 获取文件列表分页
export async function getFileListPage(bucketName: string, page: number) {
  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: bucketName,
    MaxKeys: ITEMS_PER_PAGE,
    ContinuationToken: page === 1 ? undefined : String(page),
  });
  const s3Response = await s3.send(listObjectsCommand);
  return s3Response;
}

export default s3;
