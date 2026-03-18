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

// ─── POST /api/upload ─────────────────────────────────────────────────────────
// Accepts multipart/form-data with a "file" field.
// Returns the Cloudinary URL and public_id to use when creating a product.
router.post('/', async (c) => {
  const body = await c.req.parseBody();
  const file = body['file'];

  if (!file || typeof file === 'string') {
    return c.json({ error: 'No file provided. Send a multipart/form-data request with a "file" field.' }, 400);
  }

  // Convert the uploaded File to a base64 data URI for Cloudinary
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const dataUri = `data:${file.type};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'lyra-fashion/products',
    // Auto-generate optimised WebP versions and create thumbnails
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
  await cloudinary.uploader.destroy(publicId);
  return c.json({ success: true });
});

export default router;
