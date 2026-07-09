import useSWR from 'swr';
import { InstagramRepository } from '../repositories/InstagramRepository';

/**
 * Custom hook to fetch Instagram feed using the InstagramRepository.
 * Configured with optimized caching to control API costs and rate limits.
 */
export function useInstagramFeed() {
  const { data, error, isLoading } = useSWR('instagram/feed', () => InstagramRepository.getFeeds(), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // Cache results for 5 minutes
  });

  return {
    data: data || [],
    isLoading,
    error
  };
}
