import { useQuery } from '@tanstack/react-query'
import { Users, ShoppingBag, TrendingUp, Star } from 'lucide-react'
import { clientsApi, type Client } from '../lib/api'
import { format } from 'date-fns'

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.list({ limit: 100 }),
    select: (r) => r.data,
  })

  const clients: Client[] = data ?? []

  const totalRevenue = 0 // will populate once purchases are fetched
  const vipCount = clients.filter((c) => c.tags.includes('VIP')).length
  const recentClients = [...clients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <span style={{ fontSize: 13, color: '#7a7570' }}>
          {format(new Date(), 'EEEE, d MMMM yyyy')}
        </span>
      </div>

      {/* Stats */}
      <div className="grid-stats">
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Users size={18} color="#d4a853" />
            <span className="label">Total Clients</span>
          </div>
          <div className="value">{isLoading ? '—' : clients.length}</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Star size={18} color="#d4a853" />
            <span className="label">VIP Clients</span>
          </div>
          <div className="value">{isLoading ? '—' : vipCount}</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <ShoppingBag size={18} color="#d4a853" />
            <span className="label">Purchases</span>
          </div>
          <div className="value">—</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <TrendingUp size={18} color="#d4a853" />
            <span className="label">Revenue</span>
          </div>
          <div className="value">AED {totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Recent Clients */}
      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Recently Added Clients</h3>
        {isLoading ? (
          <p style={{ color: '#7a7570', fontSize: 14 }}>Loading...</p>
        ) : recentClients.length === 0 ? (
          <p className="empty">No clients yet. <a href="/clients/new" style={{ color: '#d4a853' }}>Add your first client →</a></p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Tags</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {recentClients.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <a href={`/clients/${c.id}`} style={{ color: '#1c1a18', fontWeight: 500, textDecoration: 'none' }}>
                        {c.firstName} {c.lastName}
                      </a>
                    </td>
                    <td style={{ color: '#7a7570' }}>{c.email ?? '—'}</td>
                    <td style={{ color: '#7a7570' }}>{c.phone ?? '—'}</td>
                    <td>
                      {c.tags.map((t) => (
                        <span key={t} className={`tag ${t === 'VIP' ? 'tag-gold' : 'tag-neutral'}`} style={{ marginRight: 4 }}>
                          {t}
                        </span>
                      ))}
                    </td>
                    <td style={{ color: '#7a7570' }}>{format(new Date(c.createdAt), 'd MMM yyyy')}</td>
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
