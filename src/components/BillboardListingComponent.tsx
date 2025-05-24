import { useState, useEffect } from 'react';
import { MapPin, List } from 'lucide-react';
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

interface BillboardListingComponentProps {
  onViewDetails?: (id: string) => void;
  onShowOnMap?: (id: string) => void;
}

const BillboardListingComponent: React.FC<BillboardListingComponentProps> = ({ 
  onViewDetails,
  onShowOnMap
}) => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
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
          console.log('Fetched billboards:', parsedBillboards);
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
        console.error('Error fetching billboards:', err);
        setError(isRTL ? 'فشل في تحميل اللوحات الإعلانية. يرجى المحاولة مرة أخرى لاحقًا.' : 'Failed to load billboards. Please try again later.');
        
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

  const getLocalizedLocation = (billboard: Billboard) => {
    return billboard.location[language] || billboard.location.en;
  };

  const getLocalizedDescription = (billboard: Billboard) => {
    return billboard.description[language] || billboard.description.en;
  };

  const getLocalizedFeatures = (billboard: Billboard) => {
    return billboard.features[language] || billboard.features.en;
  };

  const handleViewDetails = (id: string) => {
    if (onViewDetails) {
      onViewDetails(id);
    }
  };

  const handleShowOnMap = (id: string) => {
    if (onShowOnMap) {
      onShowOnMap(id);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg font-medium text-center">
          {isRTL ? 'جاري تحميل اللوحات الإعلانية...' : 'Loading billboard listings...'}
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {isRTL ? 'اللوحات الإعلانية المتاحة' : 'Available Billboards'}
        </h2>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button 
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setViewMode('grid')}
            aria-label={isRTL ? 'عرض شبكي' : 'Grid view'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
          <button 
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setViewMode('list')}
            aria-label={isRTL ? 'عرض قائمة' : 'List view'}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {billboards.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-lg text-gray-600">
            {isRTL ? 'لا توجد لوحات إعلانية متاحة حاليًا.' : 'No billboards available at the moment.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {billboards.map((billboard) => (
            <div key={billboard.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={billboard.images[0]} 
                  alt={getLocalizedTitle(billboard)} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium">
                  {billboard.type}
                </div>
                <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-sm font-medium ${
                  billboard.status === 'available' ? 'bg-green-500 text-white' : 
                  billboard.status === 'booked' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                }`}>
                  {billboard.status === 'available' ? (isRTL ? 'متاح' : 'Available') : 
                   billboard.status === 'booked' ? (isRTL ? 'محجوز' : 'Booked') : 
                   (isRTL ? 'صيانة' : 'Maintenance')}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{getLocalizedTitle(billboard)}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-1 rtl:ml-1 rtl:mr-0" />
                  <span className="text-sm">{getLocalizedLocation(billboard)}</span>
                </div>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{getLocalizedDescription(billboard)}</p>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{isRTL ? 'التقييم:' : 'Rating:'}</span>
                    <div className="flex items-center ml-1 rtl:mr-1 rtl:ml-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <span className="ml-1 rtl:mr-1 rtl:ml-0 text-sm">{billboard.rating}</span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-primary">${billboard.price}</div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {getLocalizedFeatures(billboard).slice(0, 2).map((feature, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                  {getLocalizedFeatures(billboard).length > 2 && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      +{getLocalizedFeatures(billboard).length - 2}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button 
                    onClick={() => handleViewDetails(billboard.id)}
                    className="flex-1 bg-primary text-white py-2 rounded hover:bg-primary/90 transition-colors"
                  >
                    {isRTL ? 'عرض التفاصيل' : 'View Details'}
                  </button>
                  <button 
                    onClick={() => handleShowOnMap(billboard.id)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors"
                  >
                    {isRTL ? 'عرض على الخريطة' : 'Show on Map'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {billboards.map((billboard) => (
            <div key={billboard.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
              <div className="relative md:w-1/4 h-48 md:h-auto overflow-hidden">
                <img 
                  src={billboard.images[0]} 
                  alt={getLocalizedTitle(billboard)} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium">
                  {billboard.type}
                </div>
                <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-sm font-medium ${
                  billboard.status === 'available' ? 'bg-green-500 text-white' : 
                  billboard.status === 'booked' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                }`}>
                  {billboard.status === 'available' ? (isRTL ? 'متاح' : 'Available') : 
                   billboard.status === 'booked' ? (isRTL ? 'محجوز' : 'Booked') : 
                   (isRTL ? 'صيانة' : 'Maintenance')}
                </div>
              </div>
              <div className="p-4 md:w-3/4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{getLocalizedTitle(billboard)}</h3>
                  <div className="text-lg font-bold text-primary">${billboard.price}</div>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-1 rtl:ml-1 rtl:mr-0" />
                  <span className="text-sm">{getLocalizedLocation(billboard)}</span>
                </div>
                <p className="text-gray-700 text-sm mb-3">{getLocalizedDescription(billboard)}</p>
                <div className="flex items-center mb-3">
                  <span className="text-sm font-medium mr-2 rtl:ml-2 rtl:mr-0">{isRTL ? 'التقييم:' : 'Rating:'}</span>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span className="ml-1 rtl:mr-1 rtl:ml-0 text-sm">{billboard.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {getLocalizedFeatures(billboard).map((feature, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button 
                    onClick={() => handleViewDetails(billboard.id)}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                  >
                    {isRTL ? 'عرض التفاصيل' : 'View Details'}
                  </button>
                  <button 
                    onClick={() => handleShowOnMap(billboard.id)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                  >
                    {isRTL ? 'عرض على الخريطة' : 'Show on Map'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillboardListingComponent;
