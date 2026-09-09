export interface Artwork {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  thumbnail_url?: string | null;
  category: string;
  is_private: boolean;
  created_at: string;
}