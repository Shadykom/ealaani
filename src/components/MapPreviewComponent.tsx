import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// Define the Billboard interface
interface Billboard {
  id: string;
  title: { en: string; ar: string };
  location: { 
    lat?: number; 
    lng?: number;
    address?: { en: string; ar: string };
    en: string; 
    ar: string 
  };
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

interface MapPreviewComponentProps {
  onViewDetails?: (id: string) => void;
}

// Google Maps API key - already set with your provided key
const GOOGLE_MAPS_API_KEY = "AIzaSyD-UsOX5bpGjlJSfj9Q8ejVQjNFEbGFfA4";

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.5rem'
};

// Default center (Riyadh)
const defaultCenter = {
  lat: 24.7136,
  lng: 46.6753
};

const MapPreviewComponent: React.FC<MapPreviewComponentProps> = ({ 
  onViewDetails
}) => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  
  const { language, isRTL } = useAuth();

  // Function to set fallback data
  const setFallbackData = () => {
    const fallbackData: Billboard[] = [
      {
        id: "1",
        title: { 
          en: "Premium Digital Billboard - King Fahd Road", 
          ar: "لوحة إعلانية رقمية متميزة - طريق الملك فهد" 
        },
        location: { 
          en: "King Fahd Road, Al Olaya District, Riyadh", 
          ar: "طريق الملك فهد، حي العليا، الرياض",
          lat: 24.7136,
          lng: 46.6753,
          address: {
            en: "King Fahd Road, Al Olaya District, Riyadh",
            ar: "طريق الملك فهد، حي العليا، الرياض"
          }
        },
        description: { 
          en: "High-visibility digital billboard located on the busiest road in Riyadh's business district.", 
          ar: "لوحة إعلانية رقمية عالية الوضوح تقع على أكثر الطرق ازدحامًا في منطقة الأعمال بالرياض." 
        },
        type: "Digital",
        size: "14x48 ft",
        price: 5000,
        status: "available",
        impressions: "150,000+ daily",
        images: ["https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"],
        features: { 
          en: ["LED Display", "High Resolution", "24/7 Operation", "Real-time Content Updates"], 
          ar: ["شاشة LED", "دقة عالية", "تشغيل على مدار الساعة", "تحديثات محتوى في الوقت الفعلي"] 
        },
        map_position: { x: 35, y: 45 },
        rating: 4.8,
        nearby_attractions: { 
          en: ["Kingdom Centre", "Al Faisaliah Tower", "Olaya Towers"], 
          ar: ["مركز المملكة", "برج الفيصلية", "أبراج العليا"] 
        }
      },
      {
        id: "2",
        title: { 
          en: "Rooftop Static Billboard - Tahlia Street", 
          ar: "لوحة إعلانية ثابتة على السطح - شارع التحلية" 
        },
        location: { 
          en: "Tahlia Street, Al Sulaimaniyah, Riyadh", 
          ar: "شارع التحلية، السليمانية، الرياض",
          lat: 24.7000,
          lng: 46.6800,
          address: {
            en: "Tahlia Street, Al Sulaimaniyah, Riyadh",
            ar: "شارع التحلية، السليمانية، الرياض"
          }
        },
        description: { 
          en: "Large static billboard overlooking the popular shopping and dining district of Tahlia Street.", 
          ar: "لوحة إعلانية ثابتة كبيرة تطل على منطقة التسوق والمطاعم الشهيرة في شارع التحلية." 
        },
        type: "Static",
        size: "12x36 ft",
        price: 3500,
        status: "available",
        impressions: "120,000+ daily",
        images: ["https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"],
        features: { 
          en: ["Premium Location", "Illuminated", "High Visibility", "Weather Resistant"], 
          ar: ["موقع متميز", "مضاءة", "رؤية عالية", "مقاومة للعوامل الجوية"] 
        },
        map_position: { x: 42, y: 38 },
        rating: 4.5,
        nearby_attractions: { 
          en: ["Centria Mall", "Mode Al Faisaliah", "Tahlia Street Restaurants"], 
          ar: ["سنتريا مول", "مود الفيصلية", "مطاعم شارع التحلية"] 
        }
      },
      {
        id: "3",
        title: { 
          en: "LED Video Wall - Granada Mall", 
          ar: "جدار فيديو LED - غرناطة مول" 
        },
        location: { 
          en: "Granada Mall, Eastern Ring Road, Riyadh", 
          ar: "غرناطة مول، الطريق الدائري الشرقي، الرياض",
          lat: 24.7300,
          lng: 46.7100,
          address: {
            en: "Granada Mall, Eastern Ring Road, Riyadh",
            ar: "غرناطة مول، الطريق الدائري الشرقي، الرياض"
          }
        },
        description: { 
          en: "Indoor LED video wall located at the main entrance of Granada Mall, perfect for retail advertising.", 
          ar: "جدار فيديو LED داخلي يقع عند المدخل الرئيسي لغرناطة مول، مثالي للإعلانات التجارية." 
        },
        type: "LED",
        size: "8x12 ft",
        price: 2800,
        status: "booked",
        impressions: "85,000+ daily",
        images: ["https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"],
        features: { 
          en: ["High Foot Traffic", "Premium Mall Location", "Video Capability", "Sound Options Available"], 
          ar: ["حركة مشاة عالية", "موقع متميز في المول", "إمكانية عرض الفيديو", "خيارات صوتية متاحة"] 
        },
        map_position: { x: 55, y: 32 },
        rating: 4.2,
        nearby_attractions: { 
          en: ["Granada Mall", "Granada Business Park", "Eastern Ring Road"], 
          ar: ["غرناطة مول", "غرناطة بزنس بارك", "الطريق الدائري الشرقي"] 
        }
      },
      {
        id: "4",
        title: { 
          en: "Highway Digital Billboard - Airport Road", 
          ar: "لوحة إعلانية رقمية على الطريق السريع - طريق المطار" 
        },
        location: { 
          en: "King Khalid International Airport Road, Riyadh", 
          ar: "طريق مطار الملك خالد الدولي، الرياض",
          lat: 24.7500,
          lng: 46.7400,
          address: {
            en: "King Khalid International Airport Road, Riyadh",
            ar: "طريق مطار الملك خالد الدولي، الرياض"
          }
        },
        description: { 
          en: "Strategic digital billboard on the main route to King Khalid International Airport.", 
          ar: "لوحة إعلانية رقمية استراتيجية على الطريق الرئيسي لمطار الملك خالد الدولي." 
        },
        type: "Digital",
        size: "14x48 ft",
        price: 4500,
        status: "available",
        impressions: "130,000+ daily",
        images: ["https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"],
        features: { 
          en: ["Airport Traffic", "Digital Display", "24/7 Operation", "Multiple Ad Slots"], 
          ar: ["حركة المطار", "عرض رقمي", "تشغيل على مدار الساعة", "فتحات إعلانية متعددة"] 
        },
        map_position: { x: 65, y: 25 },
        rating: 4.6,
        nearby_attractions: { 
          en: ["King Khalid International Airport", "IKEA", "Riyadh Front"], 
          ar: ["مطار الملك خالد الدولي", "ايكيا", "واجهة الرياض"] 
        }
      }
    ];
    
    setBillboards(fallbackData);
  };

  // Fetch billboards on component mount
  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Skip Supabase fetch and use fallback data directly
        setFallbackData();
        
      } catch (err) {
        console.error('Error fetching billboards for map:', err);
        setError(isRTL ? 'فشل في تحميل بيانات الخريطة. يرجى المحاولة مرة أخرى لاحقًا.' : 'Failed to load map data. Please try again later.');
        
        // Use fallback data when there's an error
        setFallbackData();
      } finally {
        setLoading(false);
      }
    };

    fetchBillboards();
  }, [language, isRTL]);

  // Get selected billboard
  const getSelectedBillboard = () => {
    return billboards.find(b => b.id === selectedMarker);
  };

  return (
    <div className="w-full h-[500px] relative rounded-lg overflow-hidden shadow-md">
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setFallbackData();
              }}
              className="mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150"
            >
              {isRTL ? 'حاول مرة أخرى' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
      
      {/* Google Map */}
      {!loading && !error && billboards.length > 0 && (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={12}
            options={{
              fullscreenControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              zoomControl: true
            }}
          >
            {/* Billboard markers */}
            {billboards.map(billboard => (
              <Marker
                key={billboard.id}
                position={{
                  lat: billboard.location.lat || defaultCenter.lat + (Math.random() * 0.05 - 0.025),
                  lng: billboard.location.lng || defaultCenter.lng + (Math.random() * 0.05 - 0.025)
                }}
                onClick={() => setSelectedMarker(billboard.id)}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  scaledSize: new window.google.maps.Size(40, 40)
                }}
              />
            ))}
            
            {/* Info window for selected billboard */}
            {selectedMarker && getSelectedBillboard() && (
              <InfoWindow
                position={{
                  lat: getSelectedBillboard()?.location.lat || defaultCenter.lat,
                  lng: getSelectedBillboard()?.location.lng || defaultCenter.lng
                }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className={`p-2 max-w-xs ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h3 className="font-bold text-lg mb-1">
                    {language === 'ar' 
                      ? getSelectedBillboard()?.title.ar 
                      : getSelectedBillboard()?.title.en}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {language === 'ar' 
                      ? getSelectedBillboard()?.location.ar 
                      : getSelectedBillboard()?.location.en}
                  </p>
                  <p className="text-sm mb-2">
                    {language === 'ar' 
                      ? getSelectedBillboard()?.description.ar 
                      : getSelectedBillboard()?.description.en}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm font-semibold">
                      ${getSelectedBillboard()?.price}/month
                    </span>
                    {onViewDetails && (
                      <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded transition duration-150"
                        onClick={() => onViewDetails(selectedMarker)}
                      >
                        {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                      </button>
                    )}
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
};

export default MapPreviewComponent;
