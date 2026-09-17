export interface Artwork {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  thumbnail_url?: string | null;
  category: 'photos' | 'crafts' | 'paintings' | 'projects';
  price: number | null;
  is_for_sale: boolean;
  status: 'available' | 'sold';
  dimensions: string | null;
  materials: string | null;
  is_private: boolean;
  created_at: string;
}