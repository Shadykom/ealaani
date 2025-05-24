export interface Billboard {
  id: string;
  title: { en: string; ar: string };
  location: { en: string; ar: string };
  description: { en: string; ar: string };
  type: string;
  size: string;
  price: number;
  status: string;
  impressions: string;
  images: string[];
  features: { en: string[]; ar: string[] };
  map_position: { x: number; y: number };
  rating: number;
  nearby_attractions: { en: string[]; ar: string[] };
}
