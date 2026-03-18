import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Trash2, Eye } from 'lucide-react'
import { clientsApi } from '../lib/api'
import { format } from 'date-fns'

export default function ClientList() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.list({ limit: 200 }),
    select: (r) => r.data,
  })

  const deleteMutation = useMutation({
    mutationFn: clientsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })

  const clients = (data ?? []).filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    )
  })

  return (
    <div>
      <div className="page-header">
        <h2>Clients ({isLoading ? '…' : clients.length})</h2>
        <button className="btn btn-primary" onClick={() => navigate('/clients/new')}>
          <Plus size={16} /> Add Client
        </button>
      </div>

      <div className="search-bar">
        <Search size={16} color="#7a7570" />
        <input
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card" style={{ padding: 0 }}>
        {isLoading ? (
          <p style={{ padding: 32, textAlign: 'center', color: '#7a7570' }}>Loading clients...</p>
        ) : clients.length === 0 ? (
          <p className="empty">
            {search ? `No clients match "${search}"` : 'No clients yet. Add your first one!'}
          </p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Source</th>
                  <th>Style Preferences</th>
                  <th>Tags</th>
                  <th>Added</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} style={{ cursor: 'pointer' }}>
                    <td onClick={() => navigate(`/clients/${c.id}`)}>
                      <div style={{ fontWeight: 600 }}>{c.firstName} {c.lastName}</div>
                    </td>
                    <td onClick={() => navigate(`/clients/${c.id}`)}>
                      <div style={{ fontSize: 13 }}>{c.email ?? '—'}</div>
                      <div style={{ fontSize: 12, color: '#7a7570' }}>{c.phone ?? ''}</div>
                    </td>
                    <td onClick={() => navigate(`/clients/${c.id}`)}>
                      <span style={{ fontSize: 13, color: '#7a7570' }}>{c.source ?? '—'}</span>
                    </td>
                    <td onClick={() => navigate(`/clients/${c.id}`)}>
                      <div style={{ fontSize: 13, color: '#7a7570', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.stylePreferences.join(', ') || '—'}
                      </div>
                    </td>
                    <td onClick={() => navigate(`/clients/${c.id}`)}>
                      {c.tags.map((t) => (
                        <span key={t} className={`tag ${t === 'VIP' ? 'tag-gold' : 'tag-neutral'}`} style={{ marginRight: 4 }}>
                          {t}
                        </span>
                      ))}
                    </td>
                    <td onClick={() => navigate(`/clients/${c.id}`)}>
                      <span style={{ fontSize: 13, color: '#7a7570' }}>
                        {format(new Date(c.createdAt), 'd MMM yyyy')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/clients/${c.id}`)}>
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm(`Delete ${c.firstName} ${c.lastName}?`)) {
                              deleteMutation.mutate(c.id)
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
