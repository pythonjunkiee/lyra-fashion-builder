const BASE = import.meta.env.VITE_API_URL as string;
const API_KEY = import.meta.env.VITE_ADMIN_API_KEY as string;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...init?.headers,
    },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  measurements: Record<string, number | string>;
  stylePreferences: string[];
  notes: string | null;
  tags: string[];
  source: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase {
  id: number;
  clientId: number;
  productId: number | null;
  productName: string | null;
  unitPrice: string | null;
  quantity: number;
  totalAmount: string | null;
  status: 'pending' | 'completed' | 'refunded' | 'cancelled';
  notes: string | null;
  purchaseDate: string;
}

export interface ClientWithPurchases extends Client {
  purchases: Purchase[];
}

export interface NewClient {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  measurements?: Record<string, number | string>;
  stylePreferences?: string[];
  notes?: string;
  tags?: string[];
  source?: string;
}

export interface NewPurchase {
  productId?: number;
  productName?: string;
  unitPrice?: string;
  quantity: number;
  totalAmount?: string;
  status?: 'pending' | 'completed' | 'refunded' | 'cancelled';
  notes?: string;
}

// ─── Product types ────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  categoryId: number | null;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: string;
  compareAtPrice: string | null;
  images: string[];
  fabric: string | null;
  embroideryType: string | null;
  colors: string[];
  sizes: string[];
  badge: 'NEW' | 'BESTSELLER' | 'LIMITED' | 'SALE' | null;
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface NewProduct {
  categoryId?: number | null;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: string;
  compareAtPrice?: string;
  images?: string[];
  fabric?: string;
  embroideryType?: string;
  colors?: string[];
  sizes?: string[];
  badge?: 'NEW' | 'BESTSELLER' | 'LIMITED' | 'SALE' | null;
  inStock?: boolean;
  stockQuantity?: number;
  featured?: boolean;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const productsApi = {
  list: () => request<{ data: Product[] }>('/admin/products'),
  get: (id: number) => request<{ data: Product }>(`/admin/products/${id}`),
  create: (body: NewProduct) =>
    request<{ data: Product }>('/admin/products', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: number, body: Partial<NewProduct>) =>
    request<{ data: Product }>(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: number) =>
    request<{ success: boolean }>(`/admin/products/${id}`, { method: 'DELETE' }),
};

export const categoriesApi = {
  list: () => request<{ data: Category[] }>('/admin/categories'),
};

export const uploadApi = {
  uploadImage: async (file: File): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE}/upload`, {
      method: 'POST',
      headers: { 'x-api-key': API_KEY },
      body: formData,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
    }
    const data = await res.json() as { url: string; publicId: string };
    return data;
  },
  deleteImage: (publicId: string) =>
    request<{ success: boolean }>(`/upload/${encodeURIComponent(publicId)}`, { method: 'DELETE' }),
};

export const clientsApi = {
  list: (params?: { limit?: number; offset?: number }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<{ data: Client[] }>(`/admin/clients${qs ? `?${qs}` : ''}`);
  },
  get: (id: number) =>
    request<{ data: ClientWithPurchases }>(`/admin/clients/${id}`),
  create: (body: NewClient) =>
    request<{ data: Client }>('/admin/clients', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: number, body: Partial<NewClient>) =>
    request<{ data: Client }>(`/admin/clients/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: number) =>
    request<{ success: boolean }>(`/admin/clients/${id}`, { method: 'DELETE' }),
  addPurchase: (clientId: number, body: NewPurchase) =>
    request<{ data: Purchase }>(`/admin/clients/${clientId}/purchases`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
