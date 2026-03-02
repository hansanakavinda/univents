import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB

interface UploadResult {
    url: string
    publicId: string
}

/**
 * Upload an image buffer to Cloudinary.
 * - Validates file size (max 3MB)
 * - Optimizes quality automatically (no cropping)
 * - Stores in the specified folder
 */
export async function uploadImage(
    buffer: Buffer,
    options: { folder?: string } = {}
): Promise<UploadResult> {
    const { folder = 'univents/events' } = options

    if (buffer.length > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`)
    }

    const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                quality: 'auto',
                fetch_format: 'auto',
            },
            (error, result) => {
                if (error) reject(error)
                else resolve(result)
            }
        )
        uploadStream.end(buffer)
    })

    return {
        url: result.secure_url,
        publicId: result.public_id,
    }
}

/**
 * Delete an image from Cloudinary by its public ID.
 */
export async function deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId)
}

export { MAX_FILE_SIZE }
