-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table with language preference
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('investor', 'advertiser', 'municipality', 'admin')),
  company_name TEXT,
  phone TEXT,
  language_preference TEXT NOT NULL DEFAULT 'en' CHECK (language_preference IN ('en', 'ar')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billboards Table with multilingual content
CREATE TABLE billboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title JSONB NOT NULL, -- {"en": "English Title", "ar": "Arabic Title"}
  location JSONB NOT NULL, -- {"en": "English Location", "ar": "Arabic Location"}
  description JSONB, -- {"en": "English Description", "ar": "Arabic Description"}
  type TEXT NOT NULL,
  size TEXT NOT NULL,
  price DECIMAL NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'booked', 'maintenance')),
  impressions TEXT,
  images TEXT[] NOT NULL,
  features JSONB, -- {"en": ["Feature1 in English"], "ar": ["Feature1 in Arabic"]}
  map_position JSONB NOT NULL,
  rating DECIMAL,
  nearby_attractions JSONB, -- {"en": ["Attraction1 in English"], "ar": ["Attraction1 in Arabic"]}
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  billboard_id UUID REFERENCES billboards(id) NOT NULL,
  advertiser_id UUID REFERENCES users(id) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  campaign_name JSONB NOT NULL, -- {"en": "English Campaign Name", "ar": "Arabic Campaign Name"}
  campaign_description JSONB, -- {"en": "English Description", "ar": "Arabic Description"}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns Table with multilingual content
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advertiser_id UUID REFERENCES users(id) NOT NULL,
  name JSONB NOT NULL, -- {"en": "English Name", "ar": "Arabic Name"}
  description JSONB, -- {"en": "English Description", "ar": "Arabic Description"}
  budget DECIMAL NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  target_audience JSONB,
  performance_metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table with multilingual content
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  billboard_id UUID REFERENCES billboards(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment JSONB, -- {"en": "English Comment", "ar": "Arabic Comment"}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table with multilingual content
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  title JSONB NOT NULL, -- {"en": "English Title", "ar": "Arabic Title"}
  message JSONB NOT NULL, -- {"en": "English Message", "ar": "Arabic Message"}
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE billboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Billboards table policies
CREATE POLICY "Billboards are viewable by everyone" ON billboards
  FOR SELECT USING (true);
  
CREATE POLICY "Investors can insert their own billboards" ON billboards
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'investor')
  );
  
CREATE POLICY "Investors can update their own billboards" ON billboards
  FOR UPDATE USING (
    auth.uid() = owner_id AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'investor')
  );
  
CREATE POLICY "Investors can delete their own billboards" ON billboards
  FOR DELETE USING (
    auth.uid() = owner_id AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'investor')
  );

-- Bookings table policies
CREATE POLICY "Advertisers can view their own bookings" ON bookings
  FOR SELECT USING (
    auth.uid() = advertiser_id OR
    EXISTS (SELECT 1 FROM billboards WHERE billboards.id = billboard_id AND billboards.owner_id = auth.uid())
  );
  
CREATE POLICY "Advertisers can create bookings" ON bookings
  FOR INSERT WITH CHECK (
    auth.uid() = advertiser_id AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'advertiser')
  );
  
CREATE POLICY "Advertisers can update their own bookings" ON bookings
  FOR UPDATE USING (
    auth.uid() = advertiser_id AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'advertiser')
  );

-- Campaigns table policies
CREATE POLICY "Advertisers can view their own campaigns" ON campaigns
  FOR SELECT USING (auth.uid() = advertiser_id);
  
CREATE POLICY "Advertisers can insert their own campaigns" ON campaigns
  FOR INSERT WITH CHECK (
    auth.uid() = advertiser_id AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'advertiser')
  );
  
CREATE POLICY "Advertisers can update their own campaigns" ON campaigns
  FOR UPDATE USING (
    auth.uid() = advertiser_id AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'advertiser')
  );

-- Reviews table policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);
  
CREATE POLICY "Users can create their own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Transactions table policies
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = booking_id AND 
      (bookings.advertiser_id = auth.uid() OR 
       EXISTS (
         SELECT 1 FROM billboards 
         WHERE billboards.id = bookings.billboard_id AND 
         billboards.owner_id = auth.uid()
       )
      )
    )
  );

-- Notifications table policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (admins can do everything)
CREATE POLICY "Admins have full access to users" ON users
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
  
CREATE POLICY "Admins have full access to billboards" ON billboards
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
  
CREATE POLICY "Admins have full access to bookings" ON bookings
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
  
CREATE POLICY "Admins have full access to campaigns" ON campaigns
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
  
CREATE POLICY "Admins have full access to reviews" ON reviews
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
  
CREATE POLICY "Admins have full access to transactions" ON transactions
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
  
CREATE POLICY "Admins have full access to notifications" ON notifications
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Municipality policies
CREATE POLICY "Municipality users can view and update billboards in their jurisdiction" ON billboards
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'municipality'));

-- Create initial sample data for billboards with bilingual content
INSERT INTO billboards (
  title, 
  location, 
  description, 
  type, 
  size, 
  price, 
  status, 
  impressions, 
  images, 
  features, 
  map_position, 
  rating, 
  nearby_attractions
) VALUES 
(
  '{"en": "Premium Digital Billboard - King Fahd Road", "ar": "لوحة إعلانية رقمية متميزة - طريق الملك فهد"}',
  '{"en": "King Fahd Road, Al Olaya District, Riyadh", "ar": "طريق الملك فهد، حي العليا، الرياض"}',
  '{"en": "High-visibility digital billboard located on the busiest road in Riyadh''s business district.", "ar": "لوحة إعلانية رقمية عالية الوضوح تقع على أكثر الطرق ازدحامًا في منطقة الأعمال بالرياض."}',
  'Digital',
  '14x48 ft',
  5000,
  'available',
  '150,000+ daily',
  ARRAY['https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'],
  '{"en": ["LED Display", "High Resolution", "24/7 Operation", "Real-time Content Updates"], "ar": ["شاشة LED", "دقة عالية", "تشغيل على مدار الساعة", "تحديثات محتوى في الوقت الفعلي"]}',
  '{"x": 35, "y": 45}',
  4.8,
  '{"en": ["Kingdom Centre", "Al Faisaliah Tower", "Olaya Towers"], "ar": ["مركز المملكة", "برج الفيصلية", "أبراج العليا"]}'
),
(
  '{"en": "Rooftop Static Billboard - Tahlia Street", "ar": "لوحة إعلانية ثابتة على السطح - شارع التحلية"}',
  '{"en": "Tahlia Street, Al Sulaimaniyah, Riyadh", "ar": "شارع التحلية، السليمانية، الرياض"}',
  '{"en": "Large static billboard overlooking the popular shopping and dining district of Tahlia Street.", "ar": "لوحة إعلانية ثابتة كبيرة تطل على منطقة التسوق والمطاعم الشهيرة في شارع التحلية."}',
  'Static',
  '12x36 ft',
  3500,
  'available',
  '120,000+ daily',
  ARRAY['https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'],
  '{"en": ["Premium Location", "Illuminated", "High Visibility", "Weather Resistant"], "ar": ["موقع متميز", "مضاءة", "رؤية عالية", "مقاومة للعوامل الجوية"]}',
  '{"x": 42, "y": 38}',
  4.5,
  '{"en": ["Centria Mall", "Mode Al Faisaliah", "Tahlia Street Restaurants"], "ar": ["سنتريا مول", "مود الفيصلية", "مطاعم شارع التحلية"]}'
),
(
  '{"en": "LED Video Wall - Granada Mall", "ar": "جدار فيديو LED - غرناطة مول"}',
  '{"en": "Granada Mall, Eastern Ring Road, Riyadh", "ar": "غرناطة مول، الطريق الدائري الشرقي، الرياض"}',
  '{"en": "Indoor LED video wall located at the main entrance of Granada Mall, perfect for retail advertising.", "ar": "جدار فيديو LED داخلي يقع عند المدخل الرئيسي لغرناطة مول، مثالي للإعلانات التجارية."}',
  'LED',
  '8x12 ft',
  2800,
  'booked',
  '85,000+ daily',
  ARRAY['https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'],
  '{"en": ["High Foot Traffic", "Premium Mall Location", "Video Capability", "Sound Options Available"], "ar": ["حركة مشاة عالية", "موقع متميز في المول", "إمكانية عرض الفيديو", "خيارات صوتية متاحة"]}',
  '{"x": 55, "y": 32}',
  4.2,
  '{"en": ["Granada Mall", "Granada Business Park", "Eastern Ring Road"], "ar": ["غرناطة مول", "غرناطة بزنس بارك", "الطريق الدائري الشرقي"]}'
),
(
  '{"en": "Highway Digital Billboard - Airport Road", "ar": "لوحة إعلانية رقمية على الطريق السريع - طريق المطار"}',
  '{"en": "King Khalid International Airport Road, Riyadh", "ar": "طريق مطار الملك خالد الدولي، الرياض"}',
  '{"en": "Strategic digital billboard on the main route to King Khalid International Airport.", "ar": "لوحة إعلانية رقمية استراتيجية على الطريق الرئيسي لمطار الملك خالد الدولي."}',
  'Digital',
  '14x48 ft',
  4500,
  'available',
  '130,000+ daily',
  ARRAY['https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'],
  '{"en": ["Airport Traffic", "Digital Display", "24/7 Operation", "Multiple Ad Slots"], "ar": ["حركة المطار", "عرض رقمي", "تشغيل على مدار الساعة", "فتحات إعلانية متعددة"]}',
  '{"x": 65, "y": 25}',
  4.6,
  '{"en": ["King Khalid International Airport", "IKEA", "Riyadh Front"], "ar": ["مطار الملك خالد الدولي", "ايكيا", "واجهة الرياض"]}'
),
(
  '{"en": "Wall-mounted Billboard - Diplomatic Quarter", "ar": "لوحة إعلانية مثبتة على الحائط - الحي الدبلوماسي"}',
  '{"en": "Diplomatic Quarter, Riyadh", "ar": "الحي الدبلوماسي، الرياض"}',
  '{"en": "Exclusive wall-mounted billboard in the prestigious Diplomatic Quarter, targeting high-income residents and diplomats.", "ar": "لوحة إعلانية حصرية مثبتة على الحائط في الحي الدبلوماسي المرموق، تستهدف السكان ذوي الدخل المرتفع والدبلوماسيين."}',
  'Static',
  '10x30 ft',
  6000,
  'available',
  '45,000+ daily',
  ARRAY['https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'],
  '{"en": ["Premium Location", "Exclusive Audience", "Illuminated", "High-End Design"], "ar": ["موقع متميز", "جمهور حصري", "مضاءة", "تصميم راقي"]}',
  '{"x": 28, "y": 55}',
  4.9,
  '{"en": ["Diplomatic Quarter", "Embassies", "Diplomatic Club", "Wadi Hanifah"], "ar": ["الحي الدبلوماسي", "السفارات", "النادي الدبلوماسي", "وادي حنيفة"]}'
),
(
  '{"en": "Digital Billboard - King Abdullah Financial District", "ar": "لوحة إعلانية رقمية - مركز الملك عبدالله المالي"}',
  '{"en": "King Abdullah Financial District, Riyadh", "ar": "مركز الملك عبدالله المالي، الرياض"}',
  '{"en": "Modern digital billboard in the heart of Riyadh''s new financial hub, targeting business professionals.", "ar": "لوحة إعلانية رقمية حديثة في قلب المركز المالي الجديد بالرياض، تستهدف المهنيين في مجال الأعمال."}',
  'Digital',
  '12x36 ft',
  5500,
  'booked',
  '100,000+ daily',
  ARRAY['https://images.unsplash.com/photo-1617550523898-b3e8dadf8dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'],
  '{"en": ["Business District", "High-Resolution Display", "Multiple Ad Rotations", "Analytics Dashboard"], "ar": ["منطقة أعمال", "شاشة عالية الدقة", "تناوب إعلانات متعددة", "لوحة تحليلات"]}',
  '{"x": 48, "y": 60}',
  4.7,
  '{"en": ["KAFD", "KAFD Conference Center", "Financial Academy", "KAFD Grand Mosque"], "ar": ["مركز الملك عبدالله المالي", "مركز مؤتمرات كافد", "الأكاديمية المالية", "جامع كافد الكبير"]}'
);
