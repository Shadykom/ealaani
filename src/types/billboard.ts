export interface Billboard {
  id: string;
  title: string;
  location: string;
  description: string;
  type: string;
  size: string;
  price: number;
  status: string;
  impressions: string;
  images: string[];
  features: string[];
  mapPosition: { x: number; y: number };
  availability?: string;
  traffic?: string;
  rating?: number;
  nearbyAttractions?: string[];
  owner?: string;
}
