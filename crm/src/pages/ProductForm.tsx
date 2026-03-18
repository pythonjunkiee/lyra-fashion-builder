import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi, categoriesApi, uploadApi } from '../lib/api'
import type { NewProduct } from '../lib/api'

const BADGE_OPTIONS = ['', 'NEW', 'BESTSELLER', 'LIMITED', 'SALE'] as const
const SIZE_PRESETS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
const COLOR_PRESETS = ['Desert Rose', 'Midnight Teal', 'Champagne', 'Soft Blush', 'Ocean Blue', 'Emerald Green', 'Ivory White', 'Dusty Mauve', 'Charcoal']

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function ProductForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [form, setForm] = useState<NewProduct>({
    name: '',
    slug: '',
    price: '',
    compareAtPrice: '',
    categoryId: null,
    description: '',
    shortDescription: '',
    fabric: '',
    embroideryType: '',
    colors: [],
    sizes: [],
    badge: null,
    inStock: true,
    stockQuantity: 10,
    featured: false,
    images: [],
  })
  const [customColor, setCustomColor] = useState('')
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [error, setError] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  // Load categories
  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
  })
  const categories = catData?.data ?? []

  // Load existing product for edit
  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.get(Number(id)),
    enabled: isEdit,
  })

  useEffect(() => {
    if (productData?.data) {
      const p = productData.data
      setForm({
        name: p.name,
        slug: p.slug,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? '',
        categoryId: p.categoryId,
        description: p.description ?? '',
        shortDescription: p.shortDescription ?? '',
        fabric: p.fabric ?? '',
        embroideryType: p.embroideryType ?? '',
        colors: p.colors,
        sizes: p.sizes,
        badge: p.badge,
        inStock: p.inStock,
        stockQuantity: p.stockQuantity,
        featured: p.featured,
        images: p.images,
      })
      setSlugManuallyEdited(true) // Don't auto-update slug on edit
    }
  }, [productData])

  const createMutation = useMutation({
    mutationFn: (body: NewProduct) => productsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      navigate('/products')
    },
    onError: (err: Error) => setError(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: (body: Partial<NewProduct>) => productsApi.update(Number(id), body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', id] })
      navigate('/products')
    },
    onError: (err: Error) => setError(err.message),
  })

  const set = (field: keyof NewProduct, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (field === 'name' && !slugManuallyEdited) {
      setForm((prev) => ({ ...prev, name: value as string, slug: slugify(value as string) }))
    }
  }

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes?.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...(prev.sizes ?? []), size],
    }))
  }

  const toggleColor = (color: string) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors?.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...(prev.colors ?? []), color],
    }))
  }

  const addCustomColor = () => {
    const trimmed = customColor.trim()
    if (!trimmed || form.colors?.includes(trimmed)) return
    setForm((prev) => ({ ...prev, colors: [...(prev.colors ?? []), trimmed] }))
    setCustomColor('')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploadingImages(true)
    setUploadError('')
    try {
      const urls: string[] = []
      for (const file of files) {
        const result = await uploadApi.uploadImage(file)
        urls.push(result.url)
      }
      setForm((prev) => ({ ...prev, images: [...(prev.images ?? []), ...urls] }))
    } catch (err) {
      setUploadError((err as Error).message)
    } finally {
      setUploadingImages(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = (url: string) => {
    setForm((prev) => ({ ...prev, images: prev.images?.filter((i) => i !== url) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.slug || !form.price) {
      setError('Name, slug, and price are required.')
      return
    }
    const payload: NewProduct = {
      ...form,
      compareAtPrice: form.compareAtPrice || undefined,
      badge: (form.badge as NewProduct['badge']) || null,
    }
    if (isEdit) {
      updateMutation.mutate(payload)
    } else {
      createMutation.mutate(payload)
    }
  }

  if (isEdit && productLoading) {
    return <div style={{ padding: '3rem', color: 'var(--text-muted)' }}>Loading product...</div>
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div style={{ maxWidth: 860 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="page-subtitle">{isEdit ? 'Update product details and images' : 'Create a new product in the catalogue'}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/products')}>
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Images */}
        <div className="card">
          <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Product Images</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            {form.images?.map((url) => (
              <div key={url} style={{ position: 'relative' }}>
                <img
                  src={url}
                  alt="product"
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  style={{
                    position: 'absolute', top: -6, right: -6, width: 22, height: 22,
                    borderRadius: '50%', background: '#ef4444', color: '#fff',
                    border: 'none', cursor: 'pointer', fontSize: 14, lineHeight: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <label
              style={{
                width: 100, height: 100, borderRadius: 8, border: '2px dashed var(--border)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: uploadingImages ? 'default' : 'pointer', color: 'var(--text-muted)', fontSize: 12,
                background: 'var(--surface-2)',
              }}
            >
              {uploadingImages ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <span style={{ fontSize: 24, marginBottom: 4 }}>+</span>
                  <span>Add Image</span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploadingImages}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          {uploadError && <p style={{ color: '#ef4444', fontSize: 13 }}>{uploadError}</p>}
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Upload JPG, PNG, or WebP images. First image will be the main product photo.
          </p>
        </div>

        {/* Basic Info */}
        <div className="card">
          <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                className="form-input"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Desert Rose Embroidered Mukhawar"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Slug *</label>
              <input
                className="form-input"
                value={form.slug}
                onChange={(e) => { setSlugManuallyEdited(true); set('slug', e.target.value) }}
                placeholder="desert-rose-embroidered-mukhawar"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={form.categoryId ?? ''}
                onChange={(e) => set('categoryId', e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">— No Category —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Badge</label>
              <select
                className="form-input"
                value={form.badge ?? ''}
                onChange={(e) => set('badge', e.target.value || null)}
              >
                {BADGE_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b || '— None —'}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Short Description</label>
            <input
              className="form-input"
              value={form.shortDescription ?? ''}
              onChange={(e) => set('shortDescription', e.target.value)}
              placeholder="One-line description shown on cards"
            />
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Full Description</label>
            <textarea
              className="form-input"
              rows={4}
              value={form.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Full product description..."
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="card">
          <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Pricing & Stock</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Price (AED) *</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="249.00"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Compare-at Price (AED)</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                value={form.compareAtPrice ?? ''}
                onChange={(e) => set('compareAtPrice', e.target.value)}
                placeholder="349.00 (optional, shows as strikethrough)"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input
                className="form-input"
                type="number"
                value={form.stockQuantity ?? 0}
                onChange={(e) => set('stockQuantity', Number(e.target.value))}
              />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Flags</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.inStock ?? true}
                  onChange={(e) => set('inStock', e.target.checked)}
                />
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>In Stock</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.featured ?? false}
                  onChange={(e) => set('featured', e.target.checked)}
                />
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Featured (shows in Best Sellers)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Fabric & Details */}
        <div className="card">
          <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Fabric & Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Fabric</label>
              <input
                className="form-input"
                value={form.fabric ?? ''}
                onChange={(e) => set('fabric', e.target.value)}
                placeholder="100% Premium Cotton"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Embroidery Type</label>
              <input
                className="form-input"
                value={form.embroideryType ?? ''}
                onChange={(e) => set('embroideryType', e.target.value)}
                placeholder="Zari embroidery, Hand-stitched, etc."
              />
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="card">
          <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Sizes</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {SIZE_PRESETS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                style={{
                  padding: '6px 16px', borderRadius: 6, border: '1px solid',
                  borderColor: form.sizes?.includes(size) ? 'var(--gold)' : 'var(--border)',
                  background: form.sizes?.includes(size) ? 'rgba(212,168,83,0.15)' : 'var(--surface-2)',
                  color: form.sizes?.includes(size) ? 'var(--gold)' : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: 14,
                }}
              >
                {size}
              </button>
            ))}
          </div>
          {form.sizes && form.sizes.length > 0 && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Selected: {form.sizes.join(', ')}
            </p>
          )}
        </div>

        {/* Colors */}
        <div className="card">
          <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Colors</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => toggleColor(color)}
                style={{
                  padding: '6px 14px', borderRadius: 20, border: '1px solid',
                  borderColor: form.colors?.includes(color) ? 'var(--gold)' : 'var(--border)',
                  background: form.colors?.includes(color) ? 'rgba(212,168,83,0.15)' : 'var(--surface-2)',
                  color: form.colors?.includes(color) ? 'var(--gold)' : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: 13,
                }}
              >
                {color}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              className="form-input"
              style={{ maxWidth: 200 }}
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
              placeholder="Custom color name..."
            />
            <button type="button" className="btn btn-secondary" onClick={addCustomColor}>
              Add
            </button>
          </div>
          {form.colors && form.colors.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
              {form.colors.map((c) => (
                <span key={c} className="tag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {c}
                  <button
                    type="button"
                    onClick={() => toggleColor(c)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', lineHeight: 1, padding: 0 }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', fontSize: 14 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isPending || uploadingImages}>
            {isPending ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
