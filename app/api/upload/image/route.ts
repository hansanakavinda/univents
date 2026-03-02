import { requireAuth } from '@/lib/api/api-auth'
import { uploadImage, MAX_FILE_SIZE } from '@/lib/cloudinary'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const session = await requireAuth()

        if (!session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `File size must be under ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
                { status: 400 }
            )
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const result = await uploadImage(buffer)

        return NextResponse.json({
            url: result.url,
            publicId: result.publicId,
        })
    } catch (error) {
        console.error('Image upload error:', error)
        const message = error instanceof Error ? error.message : 'Upload failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
