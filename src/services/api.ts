import type { Artwork } from '../types/artwork';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function getArtworks(): Promise<Artwork[]> {
  try {
    const response = await fetch(`${API_URL}/artworks`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des œuvres');
    }
    const result = await response.json();
    return result.data; // Retourne le tableau typé d'Artwork
  } catch (error) {
    console.error("Erreur API:", error);
    return [];
  }
}