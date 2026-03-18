/**
 * Typed API client for the Lyra backend.
 * All requests go to /api/... — Vite proxies them to http://localhost:3001 in dev.
 */

const BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface ApiProduct {
  id: number;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  price: string;
  compareAtPrice: string | null;
  images: string[];
  category: string | null;
  categoryName: string | null;
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

export interface ProductFilters {
  category?: string;
  featured?: boolean;
  inStock?: boolean;
  limit?: number;
  offset?: number;
}

export const productsApi = {
  list: (filters?: ProductFilters) => {
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.featured) params.set('featured', 'true');
    if (filters?.inStock) params.set('inStock', 'true');
    if (filters?.limit) params.set('limit', String(filters.limit));
    if (filters?.offset) params.set('offset', String(filters.offset));
    const qs = params.toString();
    return request<{ data: ApiProduct[] }>(`/products${qs ? `?${qs}` : ''}`);
  },

  get: (slug: string) =>
    request<{ data: ApiProduct }>(`/products/${slug}`),

  search: (q: string) =>
    request<{ data: ApiProduct[] }>(`/products/search?q=${encodeURIComponent(q)}`),
};

// ─── Categories ───────────────────────────────────────────────────────────────

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

export const categoriesApi = {
  list: () => request<{ data: ApiCategory[] }>('/categories'),
  getWithProducts: (slug: string) =>
    request<{ data: { category: ApiCategory; products: ApiProduct[] } }>(`/categories/${slug}/products`),
};
