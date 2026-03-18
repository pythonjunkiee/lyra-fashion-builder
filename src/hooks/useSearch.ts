import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';

/**
 * Debounced product search hook.
 * Waits until the query is at least 2 characters before hitting the API.
 *
 * Usage:
 *   const { data: results, isLoading } = useSearch(query);
 */
export function useSearch(query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ['search', trimmed],
    queryFn: () => productsApi.search(trimmed),
    select: (res) => res.data,
    enabled: trimmed.length >= 2,
    staleTime: 1000 * 30, // 30 seconds — search results refresh faster
  });
}
