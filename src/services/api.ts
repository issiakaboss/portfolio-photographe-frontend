// src/services/api.ts

const API_URL = import.meta.env.PUBLIC_API_URL;

export async function getArtworks() {
  try {
    const response = await fetch(`${API_URL}/artworks`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des œuvres');
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur API:", error);
    return [];
  }
}