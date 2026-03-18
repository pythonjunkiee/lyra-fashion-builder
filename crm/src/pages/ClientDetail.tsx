import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Edit2, Plus, Ruler } from 'lucide-react'
import { clientsApi, type NewPurchase } from '../lib/api'
import { format } from 'date-fns'

const STATUS_COLORS: Record<string, string> = {
  completed: 'tag-green',
  pending: 'tag-blue',
  refunded: 'tag-neutral',
  cancelled: 'tag-red',
}

function AddPurchaseModal({ clientId, onClose }: { clientId: number; onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState<NewPurchase>({ quantity: 1, status: 'completed' })

  const mutation = useMutation({
    mutationFn: (data: NewPurchase) => clientsApi.addPurchase(clientId ?? 0, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client', clientId] })
      onClose()
    },
  })

  const set = (k: keyof NewPurchase, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Log Purchase</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label>Product Name *</label>
          <input placeholder="e.g. Desert Rose FG 1905" onChange={(e) => set('productName', e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Unit Price (AED)</label>
            <input type="number" placeholder="295.00" onChange={(e) => set('unitPrice', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input type="number" min={1} defaultValue={1} onChange={(e) => set('quantity', Number(e.target.value))} />
          </div>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select defaultValue="completed" onChange={(e) => set('status', e.target.value as 'pending' | 'completed' | 'refunded' | 'cancelled')}>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="form-group">
          <label>Notes (e.g. custom stitching details)</label>
          <textarea placeholder="Any special instructions..." onChange={(e) => set('notes', e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(form)}
          >
            {mutation.isPending ? 'Saving...' : 'Log Purchase'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  const { data: client, isLoading, isError } = useQuery({
    queryKey: ['client', Number(id)],
    queryFn: () => clientsApi.get(Number(id)),
    select: (r) => r.data,
    enabled: !!id,
  })

  if (isLoading) return <p style={{ padding: 32, color: '#7a7570' }}>Loading...</p>
  if (isError || !client) return (
    <div>
      <a href="/clients" className="back-link"><ArrowLeft size={16} /> Back to Clients</a>
      <p style={{ color: '#dc2626' }}>Client not found.</p>
    </div>
  )

  const measurements = client.measurements as Record<string, string | number>
  const totalSpent = client.purchases
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.totalAmount ?? '0'), 0)

  return (
    <div>
      <a className="back-link" onClick={(e) => { e.preventDefault(); navigate('/clients') }} href="/clients">
        <ArrowLeft size={16} /> Back to Clients
      </a>

      {/* Header */}
      <div className="page-header">
        <div>
          <h2>{client.firstName} {client.lastName}</h2>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            {client.tags.map((t) => (
              <span key={t} className={`tag ${t === 'VIP' ? 'tag-gold' : 'tag-neutral'}`}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => navigate(`/clients/${id}/edit`)}>
            <Edit2 size={14} /> Edit
          </button>
          <button className="btn btn-primary" onClick={() => setShowPurchaseModal(true)}>
            <Plus size={14} /> Log Purchase
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Contact Info */}
        <div className="card">
          <div className="detail-section">
            <h4>Contact</h4>
            <div className="detail-row">
              <span className="key">Email</span>
              <span className="val">{client.email ?? '—'}</span>
            </div>
            <div className="detail-row">
              <span className="key">Phone</span>
              <span className="val">{client.phone ?? '—'}</span>
            </div>
            <div className="detail-row">
              <span className="key">Source</span>
              <span className="val">{client.source ?? '—'}</span>
            </div>
            <div className="detail-row">
              <span className="key">Client since</span>
              <span className="val">{format(new Date(client.createdAt), 'd MMM yyyy')}</span>
            </div>
          </div>

          {client.stylePreferences.length > 0 && (
            <div className="detail-section">
              <h4>Style Preferences</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {client.stylePreferences.map((p) => (
                  <span key={p} className="tag tag-neutral">{p}</span>
                ))}
              </div>
            </div>
          )}

          {client.notes && (
            <div className="detail-section">
              <h4>Notes</h4>
              <p style={{ fontSize: 14, color: '#5a5653', lineHeight: 1.6 }}>{client.notes}</p>
            </div>
          )}
        </div>

        {/* Measurements */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Ruler size={16} color="#d4a853" />
            <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#7a7570' }}>
              Measurements
            </h4>
          </div>
          {Object.keys(measurements).length === 0 ? (
            <p style={{ fontSize: 14, color: '#7a7570' }}>No measurements recorded yet.</p>
          ) : (
            <div className="measurements-grid">
              {Object.entries(measurements).map(([key, val]) => (
                key !== 'unit' && (
                  <div key={key} style={{ padding: '8px 12px', background: '#faf9f7', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#7a7570', textTransform: 'capitalize', marginBottom: 2 }}>{key}</div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>
                      {val} <span style={{ fontSize: 11, color: '#7a7570' }}>{measurements.unit ?? 'in'}</span>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Purchase History */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>
            Purchase History
            <span style={{ marginLeft: 8, fontSize: 13, color: '#7a7570', fontWeight: 400 }}>
              Total spent: <strong style={{ color: '#d4a853' }}>AED {totalSpent.toFixed(2)}</strong>
            </span>
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowPurchaseModal(true)}>
            <Plus size={14} /> Add
          </button>
        </div>

        {client.purchases.length === 0 ? (
          <p className="empty" style={{ padding: 24 }}>No purchases logged yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {client.purchases.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.productName ?? '—'}</td>
                    <td>{p.quantity}</td>
                    <td>AED {p.unitPrice ?? '—'}</td>
                    <td style={{ fontWeight: 600 }}>AED {p.totalAmount ?? '—'}</td>
                    <td><span className={`tag ${STATUS_COLORS[p.status] ?? 'tag-neutral'}`}>{p.status}</span></td>
                    <td style={{ color: '#7a7570', fontSize: 13 }}>{p.notes ?? '—'}</td>
                    <td style={{ color: '#7a7570', fontSize: 13 }}>{format(new Date(p.purchaseDate), 'd MMM yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPurchaseModal && (
        <AddPurchaseModal clientId={Number(id)} onClose={() => setShowPurchaseModal(false)} />
      )}
    </div>
  )
}
