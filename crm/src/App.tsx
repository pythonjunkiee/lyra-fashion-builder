import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { Users, LayoutDashboard, ShoppingBag, UserPlus, Package, PackagePlus } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import ClientList from './pages/ClientList'
import ClientDetail from './pages/ClientDetail'
import NewClientPage from './pages/NewClient'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>LYRA</h1>
        <p>CRM Dashboard</p>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>

        <div style={{ padding: '0.5rem 1rem 0.25rem', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem' }}>
          Clients
        </div>
        <NavLink to="/clients" end className={({ isActive }) => isActive ? 'active' : ''}>
          <Users size={16} /> All Clients
        </NavLink>
        <NavLink to="/clients/new" className={({ isActive }) => isActive ? 'active' : ''}>
          <UserPlus size={16} /> Add Client
        </NavLink>
        <NavLink to="/purchases" className={({ isActive }) => isActive ? 'active' : ''}>
          <ShoppingBag size={16} /> Purchases
        </NavLink>

        <div style={{ padding: '0.5rem 1rem 0.25rem', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem' }}>
          Catalogue
        </div>
        <NavLink to="/products" end className={({ isActive }) => isActive ? 'active' : ''}>
          <Package size={16} /> All Products
        </NavLink>
        <NavLink to="/products/new" className={({ isActive }) => isActive ? 'active' : ''}>
          <PackagePlus size={16} /> Add Product
        </NavLink>
      </nav>
    </aside>
  )
}

export default function App() {
  return (
    <div className="crm-layout">
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/new" element={<NewClientPage />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/:id/edit" element={<ProductForm />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}
