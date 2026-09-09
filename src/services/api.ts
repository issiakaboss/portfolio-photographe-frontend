import type { Artwork } from '../types/artwork';

export interface Testimonial {
  id: number;
  author: string;
  role: string | null;
  quote: string;
  avatar: string | null;
  created_at: string;
}

const API_URL = import.meta.env.SSR
  ? (import.meta.env.SERVER_API_URL || 'http://127.0.0.1:8000/api')
  : (import.meta.env.PUBLIC_API_URL || '/api');

const requestHeaders = {
  Accept: 'application/json',
  'ngrok-skip-browser-warning': 'true',
};

const requestCache = new Map<string, Promise<unknown>>();
const requestTimeout = import.meta.env.SSR ? 30000 : 8000;

async function fetchJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { ...requestHeaders, ...init.headers },
    signal: AbortSignal.timeout(requestTimeout),
  });

  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

function fetchCached<T>(url: string, init: RequestInit = {}): Promise<T> {
  const cached = requestCache.get(url);
  if (cached) return cached as Promise<T>;

  const request = fetchJson<T>(url, init).catch((error) => {
    requestCache.delete(url);
    throw error;
  });
  requestCache.set(url, request);
  return request;
}

export async function getArtworks(limit?: number): Promise<Artwork[]> {
  try {
    const query = limit ? `?limit=${limit}` : '';
    const result = await fetchCached<{ data: Artwork[] }>(`${API_URL}/artworks${query}`);
    return result.data; // Retourne le tableau typé d'Artwork
  } catch (error) {
    console.error("Erreur API:", error);
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const result = await fetchCached<{ data?: Testimonial[] }>(`${API_URL}/testimonials`);
    return result.data ?? [];
  } catch (error) {
    console.error('Erreur API:', error);
    return [];
  }
}

export async function createTestimonial(payload: Pick<Testimonial, 'author' | 'role' | 'quote'>) {
  const result = await fetchJson(`${API_URL}/testimonials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return result;
}

export interface SiteContent {
  [key: string]: unknown;
}

export async function getSiteContent<T extends SiteContent>(section: 'about' | 'contact', locale: string): Promise<T | null> {
  try {
    const result = await fetchCached<{ data?: T }>(`${API_URL}/content/${section}?locale=${locale}`);
    return result.data ?? null;
  } catch (error) {
    console.error('Erreur API:', error);
    return null;
  }
}

export async function getArtwork(id: string): Promise<Artwork | null> {
  try {
    const result = await fetchCached<{ data: Artwork }>(`${API_URL}/artworks/${encodeURIComponent(id)}`);
    return result.data;
  } catch (error) {
    console.error('Erreur API:', error);
    return null;
  }
}