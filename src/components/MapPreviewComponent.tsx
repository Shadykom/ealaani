import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, parseJsonField } from '../lib/supabase';

interface Billboard {
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

interface MapPreviewComponentProps {
  onViewDetails?: (id: string) => void;
}

const MapPreviewComponent: React.FC<MapPreviewComponentProps> = ({ 
  onViewDetails
}) => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  
  const { language, isRTL } = useAuth();

  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        setLoading(true);
        
        // Fetch billboards from Supabase
        const { data, error } = await supabase
          .from('billboards')
          .select('*');
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data && data.length > 0) {
          // Parse JSONB fields from Supabase
          const parsedBillboards = data.map(billboard => ({
            ...billboard,
            title: parseJsonField(billboard.title) || { en: '', ar: '' },
            location: parseJsonField(billboard.location) || { en: '', ar: '' },
            description: parseJsonField(billboard.description) || { en: '', ar: '' },
            features: parseJsonField(billboard.features) || { en: [], ar: [] },
            map_position: parseJsonField(billboard.map_position) || { x: 0, y: 0 },
            nearby_attractions: parseJsonField(billboard.nearby_attractions) || { en: [], ar: [] }
          }));
          
          setBillboards(parsedBillboards);
          console.log('Fetched billboards for map:', parsedBillboards);
        } else {
          // Fallback to static data if Supabase fetch returns no data
          setBillboards([
            {
              id: "1",
              title: { 
                en: "Premium Digital Billboard - King Fahd Road", 
                ar: "لوحة إعلانية رقمية متميزة - طريق الملك فهد" 
              },
              location: { 
                en: "King Fahd Road, Al Olaya District, Riyadh", 
                ar: "طريق الملك فهد، حي العليا، الرياض" 
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
                ar: "شارع التحلية، السليمانية، الرياض" 
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
                ar: "غرناطة مول، الطريق الدائري الشرقي، الرياض" 
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
                ar: "طريق مطار الملك خالد الدولي، الرياض" 
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
            },
            {
              id: "5",
              title: { 
                en: "Wall-mounted Billboard - Diplomatic Quarter", 
                ar: "لوحة إعلانية مثبتة على الحائط - الحي الدبلوماسي" 
              },
              location: { 
                en: "Diplomatic Quarter, Riyadh", 
                ar: "الحي الدبلوماسي، الرياض" 
              },
              description: { 
                en: "Exclusive wall-mounted billboard in the prestigious Diplomatic Quarter, targeting high-income residents and diplomats.", 
                ar: "لوحة إعلانية حصرية مثبتة على الحائط في الحي الدبلوماسي المرموق، تستهدف السكان ذوي الدخل المرتفع والدبلوماسيين." 
              },
              type: "Static",
              size: "10x30 ft",
              price: 6000,
              status: "available",
              impressions: "45,000+ daily",
              images: ["https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"],
              features: { 
                en: ["Premium Location", "Exclusive Audience", "Illuminated", "High-End Design"], 
                ar: ["موقع متميز", "جمهور حصري", "مضاءة", "تصميم راقي"] 
              },
              map_position: { x: 28, y: 55 },
              rating: 4.9,
              nearby_attractions: { 
                en: ["Diplomatic Quarter", "Embassies", "Diplomatic Club", "Wadi Hanifah"], 
                ar: ["الحي الدبلوماسي", "السفارات", "النادي الدبلوماسي", "وادي حنيفة"] 
              }
            },
            {
              id: "6",
              title: { 
                en: "Digital Billboard - King Abdullah Financial District", 
                ar: "لوحة إعلانية رقمية - مركز الملك عبدالله المالي" 
              },
              location: { 
                en: "King Abdullah Financial District, Riyadh", 
                ar: "مركز الملك عبدالله المالي، الرياض" 
              },
              description: { 
                en: "Modern digital billboard in the heart of Riyadh's new financial hub, targeting business professionals.", 
                ar: "لوحة إعلانية رقمية حديثة في قلب المركز المالي الجديد بالرياض، تستهدف المهنيين في مجال الأعمال." 
              },
              type: "Digital",
              size: "12x36 ft",
              price: 5500,
              status: "booked",
              impressions: "100,000+ daily",
              images: ["https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"],
              features: { 
                en: ["Business District", "High-Resolution Display", "Multiple Ad Rotations", "Analytics Dashboard"], 
                ar: ["منطقة أعمال", "شاشة عالية الدقة", "تناوب إعلانات متعددة", "لوحة تحليلات"] 
              },
              map_position: { x: 48, y: 60 },
              rating: 4.7,
              nearby_attractions: { 
                en: ["KAFD", "KAFD Conference Center", "Financial Academy", "KAFD Grand Mosque"], 
                ar: ["مركز الملك عبدالله المالي", "مركز مؤتمرات كافد", "الأكاديمية المالية", "جامع كافد الكبير"] 
              }
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching billboards for map:', err);
        setError(isRTL ? 'فشل في تحميل بيانات الخريطة. يرجى المحاولة مرة أخرى لاحقًا.' : 'Failed to load map data. Please try again later.');
        
        // Fallback to static data if Supabase fetch fails
        setBillboards([
          {
            id: "1",
            title: { 
              en: "Premium Digital Billboard - King Fahd Road", 
              ar: "لوحة إعلانية رقمية متميزة - طريق الملك فهد" 
            },
            location: { 
              en: "King Fahd Road, Al Olaya District, Riyadh", 
              ar: "طريق الملك فهد، حي العليا، الرياض" 
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
              ar: "شارع التحلية، السليمانية، الرياض" 
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
              ar: "غرناطة مول، الطريق الدائري الشرقي، الرياض" 
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
              ar: "طريق مطار الملك خالد الدولي، الرياض" 
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
          },
          {
            id: "5",
            title: { 
              en: "Wall-mounted Billboard - Diplomatic Quarter", 
              ar: "لوحة إعلانية مثبتة على الحائط - الحي الدبلوماسي" 
            },
            location: { 
              en: "Diplomatic Quarter, Riyadh", 
              ar: "الحي الدبلوماسي، الرياض" 
            },
            description: { 
              en: "Exclusive wall-mounted billboard in the prestigious Diplomatic Quarter, targeting high-income residents and diplomats.", 
              ar: "لوحة إعلانية حصرية مثبتة على الحائط في الحي الدبلوماسي المرموق، تستهدف السكان ذوي الدخل المرتفع والدبلوماسيين." 
            },
            type: "Static",
            size: "10x30 ft",
            price: 6000,
            status: "available",
            impressions: "45,000+ daily",
            images: ["https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"],
            features: { 
              en: ["Premium Location", "Exclusive Audience", "Illuminated", "High-End Design"], 
              ar: ["موقع متميز", "جمهور حصري", "مضاءة", "تصميم راقي"] 
            },
            map_position: { x: 28, y: 55 },
            rating: 4.9,
            nearby_attractions: { 
              en: ["Diplomatic Quarter", "Embassies", "Diplomatic Club", "Wadi Hanifah"], 
              ar: ["الحي الدبلوماسي", "السفارات", "النادي الدبلوماسي", "وادي حنيفة"] 
            }
          },
          {
            id: "6",
            title: { 
              en: "Digital Billboard - King Abdullah Financial District", 
              ar: "لوحة إعلانية رقمية - مركز الملك عبدالله المالي" 
            },
            location: { 
              en: "King Abdullah Financial District, Riyadh", 
              ar: "مركز الملك عبدالله المالي، الرياض" 
            },
            description: { 
              en: "Modern digital billboard in the heart of Riyadh's new financial hub, targeting business professionals.", 
              ar: "لوحة إعلانية رقمية حديثة في قلب المركز المالي الجديد بالرياض، تستهدف المهنيين في مجال الأعمال." 
            },
            type: "Digital",
            size: "12x36 ft",
            price: 5500,
            status: "booked",
            impressions: "100,000+ daily",
            images: ["https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"],
            features: { 
              en: ["Business District", "High-Resolution Display", "Multiple Ad Rotations", "Analytics Dashboard"], 
              ar: ["منطقة أعمال", "شاشة عالية الدقة", "تناوب إعلانات متعددة", "لوحة تحليلات"] 
            },
            map_position: { x: 48, y: 60 },
            rating: 4.7,
            nearby_attractions: { 
              en: ["KAFD", "KAFD Conference Center", "Financial Academy", "KAFD Grand Mosque"], 
              ar: ["مركز الملك عبدالله المالي", "مركز مؤتمرات كافد", "الأكاديمية المالية", "جامع كافد الكبير"] 
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBillboards();
  }, [isRTL]);

  const getLocalizedTitle = (billboard: Billboard) => {
    return billboard.title[language] || billboard.title.en;
  };

  const handleMarkerClick = (id: string) => {
    setSelectedMarker(id);
  };

  const handleViewDetails = (id: string) => {
    if (onViewDetails) {
      onViewDetails(id);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg font-medium text-center">
          {isRTL ? 'جاري تحميل الخريطة...' : 'Loading map...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">{isRTL ? 'خطأ!' : 'Error!'}</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          onClick={() => window.location.reload()}
        >
          {isRTL ? 'إعادة المحاولة' : 'Try Again'}
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="relative bg-gray-200 rounded-lg overflow-hidden" style={{ height: '500px' }}>
        {/* Map background */}
        <div className="absolute inset-0 bg-[url('/map-background.jpg')] bg-cover bg-center opacity-80"></div>
        
        {/* Map markers */}
        {billboards.map((billboard) => (
          <div 
            key={billboard.id}
            className={`absolute cursor-pointer transition-all duration-300 ${selectedMarker === billboard.id ? 'z-20 scale-125' : 'z-10 hover:scale-110'}`}
            style={{ 
              left: `${billboard.map_position.x}%`, 
              top: `${billboard.map_position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleMarkerClick(billboard.id)}
          >
            <div className={`flex flex-col items-center ${selectedMarker === billboard.id ? 'scale-110' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                billboard.status === 'available' ? 'bg-green-500' : 
                billboard.status === 'booked' ? 'bg-red-500' : 'bg-yellow-500'
              }`}>
                <MapPin size={20} className="text-white" />
              </div>
              <div className="w-2 h-2 bg-black rounded-full mt-1"></div>
            </div>
            
            {/* Popup when marker is selected */}
            {selectedMarker === billboard.id && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg p-3 w-64 z-30">
                <div className="relative">
                  <img 
                    src={billboard.images[0]} 
                    alt={getLocalizedTitle(billboard)} 
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                    billboard.status === 'available' ? 'bg-green-500 text-white' : 
                    billboard.status === 'booked' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                  }`}>
                    {billboard.status === 'available' ? (isRTL ? 'متاح' : 'Available') : 
                     billboard.status === 'booked' ? (isRTL ? 'محجوز' : 'Booked') : 
                     (isRTL ? 'صيانة' : 'Maintenance')}
                  </div>
                </div>
                <div className="p-2">
                  <h3 className="font-bold text-sm mb-1">{getLocalizedTitle(billboard)}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin size={14} className="mr-1 rtl:ml-1 rtl:mr-0" />
                    <span className="text-xs">{billboard.location[language] || billboard.location.en}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-bold text-primary">${billboard.price}</div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <span className="ml-1 rtl:mr-1 rtl:ml-0 text-xs">{billboard.rating}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleViewDetails(billboard.id)}
                    className="w-full bg-primary text-white py-1.5 rounded text-sm hover:bg-primary/90 transition-colors"
                  >
                    {isRTL ? 'عرض التفاصيل' : 'View Details'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Map controls */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
          <div className="flex flex-col space-y-2">
            <button className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Map legend */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg shadow-md p-3">
          <h4 className="font-medium text-sm mb-2">{isRTL ? 'مفتاح الخريطة' : 'Map Legend'}</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2 rtl:ml-2 rtl:mr-0"></div>
              <span className="text-xs">{isRTL ? 'متاح' : 'Available'}</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2 rtl:ml-2 rtl:mr-0"></div>
              <span className="text-xs">{isRTL ? 'محجوز' : 'Booked'}</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2 rtl:ml-2 rtl:mr-0"></div>
              <span className="text-xs">{isRTL ? 'صيانة' : 'Maintenance'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPreviewComponent;
