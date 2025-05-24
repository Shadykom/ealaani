import { useState, useEffect } from 'react';
import { MapPin, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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

interface BillboardDetailsPageProps {
  billboardId: string;
  onBack?: () => void;
}

const BillboardDetailsPage: React.FC<BillboardDetailsPageProps> = ({ 
  billboardId,
  onBack 
}) => {
  const [billboard, setBillboard] = useState<Billboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { language, isRTL } = useAuth();

  useEffect(() => {
    const fetchBillboardDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch billboard details from Supabase
        const { data, error } = await supabase
          .from('billboards')
          .select('*')
          .eq('id', billboardId)
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data) {
          setBillboard(data as Billboard);
        } else {
          // Fallback to static data if Supabase fetch fails or returns no data
          const staticBillboards = [
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
          ];
          
          const foundBillboard = staticBillboards.find(b => b.id === billboardId);
          if (foundBillboard) {
            setBillboard(foundBillboard);
          } else {
            setError(isRTL ? 'لم يتم العثور على اللوحة الإعلانية' : 'Billboard not found');
          }
        }
      } catch (err) {
        console.error('Error fetching billboard details:', err);
        setError(isRTL ? 'فشل في تحميل تفاصيل اللوحة الإعلانية. يرجى المحاولة مرة أخرى لاحقًا.' : 'Failed to load billboard details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (billboardId) {
      fetchBillboardDetails();
    }
  }, [billboardId, isRTL]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Navigate back without using react-router-dom
      window.history.back();
    }
  };

  const handleBookNow = () => {
    // Implement booking functionality
    alert(isRTL ? 'سيتم تنفيذ وظيفة الحجز قريبًا' : 'Booking functionality will be implemented soon');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-2 text-gray-600">{isRTL ? 'جاري تحميل تفاصيل اللوحة الإعلانية...' : 'Loading billboard details...'}</p>
      </div>
    );
  }

  if (error || !billboard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-800 font-medium">{isRTL ? 'حدث خطأ' : 'Error'}</p>
        <p className="text-gray-600">{error || (isRTL ? 'لم يتم العثور على اللوحة الإعلانية' : 'Billboard not found')}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleBack}
        >
          {isRTL ? 'العودة' : 'Go Back'}
        </button>
      </div>
    );
  }

  return (
    <div className={`container mx-auto py-8 px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <button
        onClick={handleBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>{isRTL ? 'العودة إلى اللوحات الإعلانية' : 'Back to Billboards'}</span>
      </button>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="h-64 md:h-full overflow-hidden relative">
              <img 
                src={billboard.images[0]} 
                alt={language === 'en' ? billboard.title.en : billboard.title.ar} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                {billboard.type}
              </div>
              {billboard.status === 'booked' && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {isRTL ? 'محجوز' : 'BOOKED'}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 md:w-1/2">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'en' ? billboard.title.en : billboard.title.ar}
              </h1>
              <div className="text-2xl font-bold text-blue-600">
                ${billboard.price.toLocaleString()}
                <span className="text-sm text-gray-500 font-normal">/mo</span>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-600 ml-2">
                {language === 'en' ? billboard.location.en : billboard.location.ar}
              </p>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                {language === 'en' ? billboard.description.en : billboard.description.ar}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {isRTL ? 'النوع' : 'Type'}
                </h3>
                <p className="text-gray-900">{billboard.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {isRTL ? 'الحجم' : 'Size'}
                </h3>
                <p className="text-gray-900">{billboard.size}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {isRTL ? 'المشاهدات' : 'Impressions'}
                </h3>
                <p className="text-gray-900">{billboard.impressions}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {isRTL ? 'التقييم' : 'Rating'}
                </h3>
                <p className="text-gray-900">{billboard.rating}/5</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {isRTL ? 'المميزات' : 'Features'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(language === 'en' ? billboard.features.en : billboard.features.ar).map((feature, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {isRTL ? 'المعالم القريبة' : 'Nearby Attractions'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(language === 'en' ? billboard.nearby_attractions.en : billboard.nearby_attractions.ar).map((attraction, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {attraction}
                  </span>
                ))}
              </div>
            </div>
            
            {billboard.status !== 'booked' && (
              <button
                onClick={handleBookNow}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                {isRTL ? 'احجز الآن' : 'Book Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillboardDetailsPage;
