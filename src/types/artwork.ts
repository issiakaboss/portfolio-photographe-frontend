export interface Artwork {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  is_private: boolean;
  created_at: string;
}