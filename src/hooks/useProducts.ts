import { useQuery } from '@tanstack/react-query';
import { productsApi, type ProductFilters } from '@/lib/api';

/**
 * Fetch a list of products with optional filters.
 *
 * Usage:
 *   const { data, isLoading } = useProducts({ category: 'mukhawar', inStock: true });
 */
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.list(filters),
    select: (res) => res.data,
    staleTime: 0, // always refetch fresh — ensures CRM deletions/edits appear immediately
  });
}

/**
 * Fetch a single product by slug.
 *
 * Usage:
 *   const { data: product } = useProduct('desert-rose-fg-1905');
 */
export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['products', slug],
    queryFn: () => productsApi.get(slug),
    select: (res) => res.data,
    enabled: !!slug,
    staleTime: 0,
  });
}
