import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '../lib/api'
import type { Product } from '../lib/api'

export default function Products() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.list(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setConfirmDelete(null)
    },
  })

  const products = (data?.data ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{data?.data.length ?? 0} products in catalogue</p>
        </div>
        <Link to="/products/new" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <input
          className="form-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            {search ? 'No products match your search.' : 'No products yet. Add your first product!'}
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Badge</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
                        />
                      ) : (
                        <div style={{
                          width: 48, height: 48, borderRadius: 8, background: 'var(--surface-2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 12
                        }}>
                          IMG
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{product.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{product.categoryId ?? '—'}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--gold)' }}>AED {product.price}</span>
                    {product.compareAtPrice && (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 6 }}>
                        AED {product.compareAtPrice}
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{
                      fontSize: 12, padding: '2px 8px', borderRadius: 20,
                      background: product.inStock ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: product.inStock ? '#22c55e' : '#ef4444',
                    }}>
                      {product.inStock ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    {product.badge ? (
                      <span className="tag">{product.badge}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>—</span>
                    )}
                  </td>
                  <td>
                    <span style={{ color: product.featured ? 'var(--gold)' : 'var(--text-muted)', fontSize: 18 }}>
                      {product.featured ? '★' : '☆'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 12px', fontSize: 13 }}
                        onClick={() => navigate(`/products/${product.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '4px 12px', fontSize: 13 }}
                        onClick={() => setConfirmDelete(product)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Delete Product</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{confirmDelete.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(confirmDelete.id)}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
