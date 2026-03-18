import { Hono } from 'hono';
import { v2 as cloudinary } from 'cloudinary';
import { adminAuth } from '../middleware/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = new Hono();

// All upload routes require admin auth
router.use('*', adminAuth);

// ─── Upload validation constants ──────────────────────────────────────────────

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Validate the first bytes of a file against known image magic bytes.
 * This prevents MIME-type spoofing (e.g. a PHP file renamed to image.jpg).
 */
function isAllowedImageBytes(header: Uint8Array): boolean {
  // JPEG: FF D8 FF
  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) return true;
  // PNG: 89 50 4E 47
  if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47) return true;
  // GIF: 47 49 46 38
  if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x38) return true;
  // WebP: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP) at bytes 8–11
  if (header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46 &&
      header[8] === 0x57 && header[9] === 0x45 && header[10] === 0x42 && header[11] === 0x50) return true;
  return false;
}

// ─── POST /api/upload ─────────────────────────────────────────────────────────
// Accepts multipart/form-data with a "file" field.
// Returns the Cloudinary URL and public_id to use when creating a product.
router.post('/', async (c) => {
  const body = await c.req.parseBody();
  const file = body['file'];

  if (!file || typeof file === 'string') {
    return c.json({ error: 'No file provided. Send a multipart/form-data request with a "file" field.' }, 400);
  }

  // 1. Validate declared MIME type
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return c.json({ error: 'File type not allowed. Accepted: JPEG, PNG, WebP, GIF.' }, 415);
  }

  // 2. Validate file size before reading into memory
  if (file.size > MAX_FILE_SIZE) {
    return c.json({ error: 'File exceeds the 10 MB size limit.' }, 413);
  }

  // 3. Read bytes and validate magic bytes — prevents MIME spoofing
  const arrayBuffer = await file.arrayBuffer();
  const header = new Uint8Array(arrayBuffer.slice(0, 12));

  if (!isAllowedImageBytes(header)) {
    return c.json({ error: 'File content does not match an allowed image format.' }, 415);
  }

  // 4. Upload to Cloudinary via base64 data URI
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const dataUri = `data:${file.type};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'lyra-fashion/products',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });

  return c.json({
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    },
  });
});

// ─── DELETE /api/upload/:publicId ────────────────────────────────────────────
// Pass the publicId encoded as a URL-safe string to remove an image.
router.delete('/:publicId', async (c) => {
  const publicId = decodeURIComponent(c.req.param('publicId'));

  // Ensure the publicId belongs to our folder — prevents deleting arbitrary Cloudinary assets
  if (!publicId.startsWith('lyra-fashion/')) {
    return c.json({ error: 'Invalid public ID.' }, 400);
  }

  await cloudinary.uploader.destroy(publicId);
  return c.json({ success: true });
});

export default router;
