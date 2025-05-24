import { Billboard } from '../types/billboard';

const mockBillboardData: Billboard[] = [
  {
    id: "bb-001",
    title: "Premium Digital Billboard - King Fahd Road",
    location: "King Fahd Road, Al Olaya District, Riyadh",
    description: "High-visibility digital billboard located on the busiest road in Riyadh's business district.",
    type: "Digital",
    size: "14x48 ft",
    price: 5000,
    status: "available",
    impressions: "150,000+ daily",
    images: [
      "https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
    ],
    features: ["LED Display", "High Resolution", "24/7 Operation", "Real-time Content Updates"],
    mapPosition: { x: 35, y: 45 },
    rating: 4.8,
    nearbyAttractions: ["Kingdom Centre", "Al Faisaliah Tower", "Olaya Towers"],
    owner: "Riyadh Media Group"
  },
  {
    id: "bb-002",
    title: "Rooftop Static Billboard - Tahlia Street",
    location: "Tahlia Street, Al Sulaimaniyah, Riyadh",
    description: "Large static billboard overlooking the popular shopping and dining district of Tahlia Street.",
    type: "Static",
    size: "12x36 ft",
    price: 3500,
    status: "available",
    impressions: "120,000+ daily",
    images: [
      "https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
    ],
    features: ["Premium Location", "Illuminated", "High Visibility", "Weather Resistant"],
    mapPosition: { x: 42, y: 38 },
    rating: 4.5,
    nearbyAttractions: ["Centria Mall", "Mode Al Faisaliah", "Tahlia Street Restaurants"],
    owner: "Saudi Outdoor Media"
  },
  {
    id: "bb-003",
    title: "LED Video Wall - Granada Mall",
    location: "Granada Mall, Eastern Ring Road, Riyadh",
    description: "Indoor LED video wall located at the main entrance of Granada Mall, perfect for retail advertising.",
    type: "LED",
    size: "8x12 ft",
    price: 2800,
    status: "booked",
    impressions: "85,000+ daily",
    images: [
      "https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
    ],
    features: ["High Foot Traffic", "Premium Mall Location", "Video Capability", "Sound Options Available"],
    mapPosition: { x: 55, y: 32 },
    rating: 4.2,
    nearbyAttractions: ["Granada Mall", "Granada Business Park", "Eastern Ring Road"],
    owner: "Mall Media Networks"
  },
  {
    id: "bb-004",
    title: "Highway Digital Billboard - Airport Road",
    location: "King Khalid International Airport Road, Riyadh",
    description: "Strategic digital billboard on the main route to King Khalid International Airport.",
    type: "Digital",
    size: "14x48 ft",
    price: 4500,
    status: "available",
    impressions: "130,000+ daily",
    images: [
      "https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
    ],
    features: ["Airport Traffic", "Digital Display", "24/7 Operation", "Multiple Ad Slots"],
    mapPosition: { x: 65, y: 25 },
    rating: 4.6,
    nearbyAttractions: ["King Khalid International Airport", "IKEA", "Riyadh Front"],
    owner: "Airport Media Solutions"
  },
  {
    id: "bb-005",
    title: "Wall-mounted Billboard - Diplomatic Quarter",
    location: "Diplomatic Quarter, Riyadh",
    description: "Exclusive wall-mounted billboard in the prestigious Diplomatic Quarter, targeting high-income residents and diplomats.",
    type: "Static",
    size: "10x30 ft",
    price: 6000,
    status: "available",
    impressions: "45,000+ daily",
    images: [
      "https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
    ],
    features: ["Premium Location", "Exclusive Audience", "Illuminated", "High-End Design"],
    mapPosition: { x: 28, y: 55 },
    rating: 4.9,
    nearbyAttractions: ["Diplomatic Quarter", "Embassies", "Diplomatic Club", "Wadi Hanifah"],
    owner: "Elite Media Group"
  },
  {
    id: "bb-006",
    title: "Digital Billboard - King Abdullah Financial District",
    location: "King Abdullah Financial District, Riyadh",
    description: "Modern digital billboard in the heart of Riyadh's new financial hub, targeting business professionals.",
    type: "Digital",
    size: "12x36 ft",
    price: 5500,
    status: "booked",
    impressions: "100,000+ daily",
    images: [
      "https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
    ],
    features: ["Business District", "High-Resolution Display", "Multiple Ad Rotations", "Analytics Dashboard"],
    mapPosition: { x: 48, y: 60 },
    rating: 4.7,
    nearbyAttractions: ["KAFD", "KAFD Conference Center", "Financial Academy", "KAFD Grand Mosque"],
    owner: "Digital Outdoor Media"
  }
];

export default mockBillboardData;
