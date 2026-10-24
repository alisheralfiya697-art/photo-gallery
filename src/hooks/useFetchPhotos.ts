import { useState, useEffect, useCallback } from 'react';
import { Photo } from '../types';

const API_URL = 'https://picsum.photos/v2/list?limit=30';

/**
 * Custom hook to fetch photos from Picsum API.
 * Returns:
 * - photos: Array of Photo objects
 * - loading: Boolean indicating request in-flight
 * - error: Error message string or null
 * - refetch: Function to manually retry fetching
 */
export function useFetchPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, { signal });

      if (!response.ok) {
        throw new Error(`Failed to fetch photos (HTTP status ${response.status})`);
      }

      const data: Photo[] = await response.json();
      setPhotos(data);
    } catch (err: unknown) {
      // Don't treat intentional aborts as errors
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred while fetching photos.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchPhotos(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchPhotos]);

  const refetch = useCallback(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return { photos, loading, error, refetch };
}
