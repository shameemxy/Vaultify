import { NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: 'https://s3.filebase.com',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_FILEBASE_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_FILEBASE_SECRET_KEY!,
  },
})

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.NEXT_PUBLIC_FILEBASE_BUCKET_NAME!,
    })
    const response = await s3.send(command)

    const files = (response.Contents || []).map((item) => ({
      id: item.Key,
      name: item.Key,
      size: item.Size,
      type: 'application/octet-stream',
      date: item.LastModified,
      url: `https://s3.filebase.com/${process.env.NEXT_PUBLIC_FILEBASE_BUCKET_NAME}/${item.Key}`,
    }))

    return NextResponse.json({ success: true, files })
  } catch (error) {
    console.error('❌ Error listing files:', error)
    return NextResponse.json({ success: false, error: String(error) })
  }
}
