import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { clientsApi, type NewClient } from '../lib/api'

const MEASUREMENT_FIELDS = [
  { key: 'bust', label: 'Bust' },
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hips' },
  { key: 'height', label: 'Height' },
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'sleeve', label: 'Sleeve Length' },
  { key: 'length', label: 'Dress Length' },
]

const STYLE_OPTIONS = [
  'Everyday casual', 'Special occasions', 'Wedding guest',
  'Minimalist', 'Embroidered', 'Premium fabrics', 'Bright colours',
  'Neutral tones', 'Kids matching sets',
]

const SOURCE_OPTIONS = ['Instagram', 'Referral', 'Walk-in', 'WhatsApp', 'Website', 'Exhibition']
const TAG_OPTIONS = ['VIP', 'Wholesale', 'Bride', 'Regular', 'New']

export default function NewClientPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [form, setForm] = useState<NewClient>({
    firstName: '', lastName: '', email: '', phone: '',
    stylePreferences: [], tags: [], measurements: {}, notes: '', source: '',
  })
  const [measurementUnit, setMeasurementUnit] = useState<'inches' | 'cm'>('inches')
  const [measurements, setMeasurements] = useState<Record<string, string>>({})
  const [tagInput, setTagInput] = useState('')

  const mutation = useMutation({
    mutationFn: clientsApi.create,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['clients'] })
      navigate(`/clients/${res.data.id}`)
    },
  })

  const set = (k: keyof NewClient, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  const toggleStyle = (s: string) => {
    const prefs = form.stylePreferences ?? []
    set('stylePreferences', prefs.includes(s) ? prefs.filter((x) => x !== s) : [...prefs, s])
  }

  const toggleTag = (t: string) => {
    const tags = form.tags ?? []
    set('tags', tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t])
  }

  const addCustomTag = () => {
    const t = tagInput.trim()
    if (t && !(form.tags ?? []).includes(t)) {
      set('tags', [...(form.tags ?? []), t])
      setTagInput('')
    }
  }

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName) {
      alert('First and last name are required.')
      return
    }
    const meas: Record<string, string | number> = { unit: measurementUnit }
    Object.entries(measurements).forEach(([k, v]) => { if (v) meas[k] = parseFloat(v) || v })
    mutation.mutate({ ...form, measurements: meas })
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <a className="back-link" onClick={(e) => { e.preventDefault(); navigate('/clients') }} href="/clients">
        <ArrowLeft size={16} /> Back to Clients
      </a>

      <div className="page-header">
        <h2>Add New Client</h2>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Basic Info
        </h3>
        <div className="form-row">
          <div className="form-group">
            <label>First Name *</label>
            <input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} placeholder="Aisha" />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} placeholder="Al Mansouri" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} placeholder="aisha@example.com" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} placeholder="+971 50 123 4567" />
          </div>
        </div>
        <div className="form-group" style={{ maxWidth: 200 }}>
          <label>How did they find us?</label>
          <select value={form.source ?? ''} onChange={(e) => set('source', e.target.value)}>
            <option value="">Select source...</option>
            {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Tags
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {TAG_OPTIONS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              className={`tag ${(form.tags ?? []).includes(t) ? 'tag-gold' : 'tag-neutral'}`}
              style={{ cursor: 'pointer', border: 'none', padding: '4px 12px' }}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="Add custom tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
            style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #d8d4cf', fontSize: 13, flex: 1 }}
          />
          <button className="btn btn-secondary btn-sm" onClick={addCustomTag}><Plus size={14} /></button>
        </div>
        {(form.tags ?? []).filter((t) => !TAG_OPTIONS.includes(t)).length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {(form.tags ?? []).filter((t) => !TAG_OPTIONS.includes(t)).map((t) => (
              <span key={t} className="tag tag-neutral" style={{ cursor: 'pointer' }} onClick={() => toggleTag(t)}>
                {t} <X size={10} style={{ marginLeft: 4 }} />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Style Preferences */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Style Preferences
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {STYLE_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleStyle(s)}
              className={`tag ${(form.stylePreferences ?? []).includes(s) ? 'tag-gold' : 'tag-neutral'}`}
              style={{ cursor: 'pointer', border: 'none', padding: '5px 14px' }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Measurements */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Measurements
          </h3>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['inches', 'cm'] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setMeasurementUnit(u)}
                className={`btn btn-sm ${measurementUnit === u ? 'btn-primary' : 'btn-secondary'}`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        <div className="measurements-grid">
          {MEASUREMENT_FIELDS.map(({ key, label }) => (
            <div className="form-group" key={key} style={{ marginBottom: 10 }}>
              <label>{label} ({measurementUnit})</label>
              <input
                type="number"
                step="0.5"
                placeholder="0"
                value={measurements[key] ?? ''}
                onChange={(e) => setMeasurements((m) => ({ ...m, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Notes
        </h3>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <textarea
            value={form.notes ?? ''}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Any additional details, preferences, or important notes about this client..."
            style={{ minHeight: 100 }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/clients')}>Cancel</button>
        <button className="btn btn-primary" disabled={mutation.isPending} onClick={handleSubmit}>
          {mutation.isPending ? 'Saving...' : 'Save Client'}
        </button>
      </div>
    </div>
  )
}
