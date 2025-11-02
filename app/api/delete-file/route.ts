import { NextResponse } from 'next/server'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: 'https://s3.filebase.com',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_FILEBASE_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_FILEBASE_SECRET_KEY!,
  },
})

export async function POST(req: Request) {
  try {
    const { key } = await req.json()
    if (!key) return NextResponse.json({ success: false, error: 'Missing file key' })

    const command = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_FILEBASE_BUCKET_NAME!,
      Key: key,
    })
    await s3.send(command)

    console.log(`🗑️ Deleted file: ${key}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Delete failed:', error)
    return NextResponse.json({ success: false, error: String(error) })
  }
}
