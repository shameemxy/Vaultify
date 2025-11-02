import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

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
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ success: false, error: 'No file provided' })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_FILEBASE_BUCKET_NAME!,
      Key: file.name,
      Body: buffer,
      ContentType: file.type,
    })

    await s3.send(command)

    const fileUrl = `https://s3.filebase.com/${process.env.NEXT_PUBLIC_FILEBASE_BUCKET_NAME}/${file.name}`
    console.log('✅ File uploaded successfully:', fileUrl)

    return NextResponse.json({ success: true, fileUrl })
  } catch (error) {
    console.error('❌ Upload failed:', error)
    return NextResponse.json({ success: false, error: String(error) })
  }
}
