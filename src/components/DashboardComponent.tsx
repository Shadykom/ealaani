import { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Building2, 
  DollarSign, 
  BarChart3, 
  Settings,
  Bell,
  CreditCard,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Filter,
  Search,
  List,
  Map as MapIcon,
  ArrowRight,
  Globe,
  Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import BillboardListingComponent from './BillboardListingComponent';
import MapPreviewComponent from './MapPreviewComponent';
import { useNavigate } from 'react-router-dom';

interface DashboardComponentProps {
  onViewBillboardDetails?: (id: string) => void;
}

const DashboardComponent: React.FC<DashboardComponentProps> = ({ 
  onViewBillboardDetails 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSidebarItem, setActiveSidebarItem] = useState(0);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  
  const { user, signOut, language, isRTL } = useAuth();
  const navigate = useNavigate();
  
  // Function to toggle language (will be implemented in AuthContext)
  const toggleLanguage = (lang: string) => {
    console.log('Toggle language to:', lang);
    // This is a placeholder - the actual implementation will be in AuthContext
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  const handleViewDetails = (id: string) => {
    if (onViewBillboardDetails) {
      onViewBillboardDetails(id);
    }
  };
  
  // Dashboard content based on user role
  const renderDashboardContent = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'investor':
        return renderInvestorDashboard();
      case 'advertiser':
        return renderAdvertiserDashboard();
      case 'municipality':
        return renderMunicipalityDashboard();
      case 'admin':
        return renderAdminDashboard();
      default:
        return renderDefaultDashboard();
    }
  };
  
  const renderInvestorDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'لوحة تحكم المستثمر' : 'Investor Dashboard'}
            </h1>
            <p className="text-gray-600">
              {isRTL ? 'إدارة اللوحات الإعلانية وتتبع الإيرادات' : 'Manage your billboards and track revenue'}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
              <span>{isRTL ? 'إضافة لوحة إعلانية' : 'Add Billboard'}</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'إجمالي اللوحات الإعلانية' : 'Total Billboards'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">24</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +8%
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'اللوحات المحجوزة' : 'Booked Billboards'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">18</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +12%
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'إيرادات هذا الشهر' : 'Monthly Revenue'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">$86,400</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +16%
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'متوسط التقييم' : 'Average Rating'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">4.8/5</h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +0.3
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Billboard Management */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {isRTL ? 'إدارة اللوحات الإعلانية' : 'Billboard Management'}
              </h2>
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={isRTL ? 'بحث...' : 'Search...'}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>{isRTL ? 'تصفية' : 'Filter'}</span>
                </button>
                <div className="flex rounded-md overflow-hidden border border-gray-300">
                  <button 
                    className={`px-3 py-2 flex items-center justify-center ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button 
                    className={`px-3 py-2 flex items-center justify-center ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setViewMode('map')}
                  >
                    <MapIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {viewMode === 'list' ? (
            <BillboardListingComponent onViewDetails={handleViewDetails} />
          ) : (
            <MapPreviewComponent onViewDetails={handleViewDetails} />
          )}
        </div>
      </div>
    );
  };
  
  const renderAdvertiserDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'لوحة تحكم المعلن' : 'Advertiser Dashboard'}
            </h1>
            <p className="text-gray-600">
              {isRTL ? 'إدارة حملاتك الإعلانية وحجز اللوحات الإعلانية' : 'Manage your campaigns and book billboards'}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
              <span>{isRTL ? 'إنشاء حملة جديدة' : 'Create Campaign'}</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'الحملات النشطة' : 'Active Campaigns'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">5</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +2
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'اللوحات المحجوزة' : 'Booked Billboards'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +4
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'الميزانية المستخدمة' : 'Budget Spent'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">$42,800</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +28%
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'إجمالي المشاهدات' : 'Total Impressions'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">1.2M</h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +18%
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Billboard Browsing */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {isRTL ? 'تصفح اللوحات الإعلانية' : 'Browse Billboards'}
              </h2>
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={isRTL ? 'بحث...' : 'Search...'}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>{isRTL ? 'تصفية' : 'Filter'}</span>
                </button>
                <div className="flex rounded-md overflow-hidden border border-gray-300">
                  <button 
                    className={`px-3 py-2 flex items-center justify-center ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button 
                    className={`px-3 py-2 flex items-center justify-center ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setViewMode('map')}
                  >
                    <MapIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {viewMode === 'list' ? (
            <BillboardListingComponent onViewDetails={handleViewDetails} />
          ) : (
            <MapPreviewComponent onViewDetails={handleViewDetails} />
          )}
        </div>
      </div>
    );
  };
  
  const renderMunicipalityDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'لوحة تحكم البلدية' : 'Municipality Dashboard'}
            </h1>
            <p className="text-gray-600">
              {isRTL ? 'إدارة التصاريح والامتثال للوحات الإعلانية' : 'Manage billboard permits and compliance'}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
              <span>{isRTL ? 'تقارير الامتثال' : 'Compliance Reports'}</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'إجمالي اللوحات الإعلانية' : 'Total Billboards'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">156</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +12
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'طلبات التصاريح الجديدة' : 'New Permit Requests'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">28</h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +8
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'مخالفات الامتثال' : 'Compliance Violations'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">7</h3>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-red-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
                +2
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'إيرادات الرسوم' : 'Fee Revenue'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">$124,500</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +15%
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Billboard Management */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {isRTL ? 'إدارة اللوحات الإعلانية' : 'Billboard Management'}
              </h2>
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={isRTL ? 'بحث...' : 'Search...'}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>{isRTL ? 'تصفية' : 'Filter'}</span>
                </button>
                <div className="flex rounded-md overflow-hidden border border-gray-300">
                  <button 
                    className={`px-3 py-2 flex items-center justify-center ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button 
                    className={`px-3 py-2 flex items-center justify-center ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setViewMode('map')}
                  >
                    <MapIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {viewMode === 'list' ? (
            <BillboardListingComponent onViewDetails={handleViewDetails} />
          ) : (
            <MapPreviewComponent onViewDetails={handleViewDetails} />
          )}
        </div>
      </div>
    );
  };
  
  const renderAdminDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'لوحة تحكم المسؤول' : 'Admin Dashboard'}
            </h1>
            <p className="text-gray-600">
              {isRTL ? 'إدارة النظام بالكامل' : 'Manage the entire system'}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
              <span>{isRTL ? 'تقارير النظام' : 'System Reports'}</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'إجمالي المستخدمين' : 'Total Users'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">1,248</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +86
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'إجمالي اللوحات الإعلانية' : 'Total Billboards'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">542</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +32
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">$1.2M</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +24%
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'تذاكر الدعم' : 'Support Tickets'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">18</h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <MessageCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-red-500 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
                +5
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {isRTL ? 'منذ الشهر الماضي' : 'vs last month'}
              </span>
            </div>
          </div>
        </div>
        
        {/* System Management */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {isRTL ? 'إدارة النظام' : 'System Management'}
              </h2>
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={isRTL ? 'بحث...' : 'Search...'}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>{isRTL ? 'تصفية' : 'Filter'}</span>
                </button>
                <div className="flex rounded-md overflow-hidden border border-gray-300">
                  <button 
                    className={`px-3 py-2 flex items-center justify-center ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button 
                    className={`px-3 py-2 flex items-center justify-center ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setViewMode('map')}
                  >
                    <MapIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {viewMode === 'list' ? (
            <BillboardListingComponent onViewDetails={handleViewDetails} />
          ) : (
            <MapPreviewComponent onViewDetails={handleViewDetails} />
          )}
        </div>
      </div>
    );
  };
  
  const renderDefaultDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'لوحة التحكم' : 'Dashboard'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'مرحبًا بك في منصة EAALANI' : 'Welcome to the EAALANI platform'}
          </p>
        </div>
        
        {/* Billboard Browsing */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {isRTL ? 'تصفح اللوحات الإعلانية' : 'Browse Billboards'}
              </h2>
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={isRTL ? 'بحث...' : 'Search...'}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>{isRTL ? 'تصفية' : 'Filter'}</span>
                </button>
                <div className="flex rounded-md overflow-hidden border border-gray-300">
                  <button 
                    className={`px-3 py-2 flex items-center justify-center ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button 
                    className={`px-3 py-2 flex items-center justify-center ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setViewMode('map')}
                  >
                    <MapIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {viewMode === 'list' ? (
            <BillboardListingComponent onViewDetails={handleViewDetails} />
          ) : (
            <MapPreviewComponent onViewDetails={handleViewDetails} />
          )}
        </div>
      </div>
    );
  };
  
  // Sidebar items based on user role
  const getSidebarItems = () => {
    if (!user) return [];
    
    const commonItems = [
      { icon: MapPin, label: isRTL ? 'اللوحات الإعلانية' : 'Billboards' },
      { icon: MessageCircle, label: isRTL ? 'الرسائل' : 'Messages' },
      { icon: Settings, label: isRTL ? 'الإعدادات' : 'Settings' },
      { icon: HelpCircle, label: isRTL ? 'المساعدة' : 'Help' },
    ];
    
    switch (user.role) {
      case 'investor':
        return [
          { icon: BarChart3, label: isRTL ? 'لوحة التحكم' : 'Dashboard' },
          ...commonItems,
          { icon: DollarSign, label: isRTL ? 'الإيرادات' : 'Revenue' },
          { icon: Building2, label: isRTL ? 'الشركة' : 'Company' },
        ];
      case 'advertiser':
        return [
          { icon: BarChart3, label: isRTL ? 'لوحة التحكم' : 'Dashboard' },
          ...commonItems,
          { icon: Calendar, label: isRTL ? 'الحملات' : 'Campaigns' },
          { icon: CreditCard, label: isRTL ? 'المدفوعات' : 'Payments' },
        ];
      case 'municipality':
        return [
          { icon: BarChart3, label: isRTL ? 'لوحة التحكم' : 'Dashboard' },
          ...commonItems,
          { icon: CheckCircle, label: isRTL ? 'التصاريح' : 'Permits' },
          { icon: Users, label: isRTL ? 'المستثمرون' : 'Investors' },
        ];
      case 'admin':
        return [
          { icon: BarChart3, label: isRTL ? 'لوحة التحكم' : 'Dashboard' },
          ...commonItems,
          { icon: Users, label: isRTL ? 'المستخدمون' : 'Users' },
          { icon: Building2, label: isRTL ? 'الشركات' : 'Companies' },
          { icon: Globe, label: isRTL ? 'النظام' : 'System' },
        ];
      default:
        return commonItems;
    }
  };
  
  // Tabs based on user role
  const getTabs = () => {
    if (!user) return [];
    
    const commonTabs = [
      isRTL ? 'نظرة عامة' : 'Overview',
      isRTL ? 'اللوحات الإعلانية' : 'Billboards',
      isRTL ? 'الرسائل' : 'Messages',
      isRTL ? 'الملف الشخصي' : 'Profile',
    ];
    
    switch (user.role) {
      case 'investor':
        return [
          ...commonTabs,
          isRTL ? 'الإيرادات' : 'Revenue',
          isRTL ? 'التقارير' : 'Reports',
        ];
      case 'advertiser':
        return [
          ...commonTabs,
          isRTL ? 'الحملات' : 'Campaigns',
          isRTL ? 'المدفوعات' : 'Payments',
        ];
      case 'municipality':
        return [
          ...commonTabs,
          isRTL ? 'التصاريح' : 'Permits',
          isRTL ? 'الامتثال' : 'Compliance',
        ];
      case 'admin':
        return [
          ...commonTabs,
          isRTL ? 'المستخدمون' : 'Users',
          isRTL ? 'النظام' : 'System',
        ];
      default:
        return commonTabs;
    }
  };
  
  // Profile settings content
  const renderProfileSettings = () => {
    if (!user) return null;
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'إعدادات الملف الشخصي' : 'Profile Settings'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'إدارة معلومات حسابك وتفضيلاتك' : 'Manage your account information and preferences'}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  defaultValue={user.full_name || 'John Doe'} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'اسم الشركة' : 'Company Name'}
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  defaultValue={user.company_name || 'ACME Corporation'} 
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100" 
                  defaultValue={user.email} 
                  disabled 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <input 
                  type="tel" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  defaultValue={user.phone || '+1 (555) 123-4567'} 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isRTL ? 'الدور' : 'Role'}
              </label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100" 
                defaultValue={
                  user.role === 'investor' ? (isRTL ? 'مستثمر' : 'Investor') :
                  user.role === 'advertiser' ? (isRTL ? 'معلن' : 'Advertiser') :
                  user.role === 'municipality' ? (isRTL ? 'بلدية' : 'Municipality') :
                  user.role === 'admin' ? (isRTL ? 'مسؤول' : 'Administrator') :
                  user.role
                } 
                disabled 
              />
            </div>
            
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {isRTL ? 'تفضيلات اللغة' : 'Language Preferences'}
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">
                  {isRTL ? 'اللغة' : 'Language'}
                </h3>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'اختر لغة العرض المفضلة لديك' : 'Choose your preferred display language'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className={`px-3 py-1.5 rounded-md ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => toggleLanguage('en')}
                >
                  English
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-md ${language === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => toggleLanguage('ar')}
                >
                  العربية
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">
                  {isRTL ? 'اتجاه النص' : 'Text Direction'}
                </h3>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'يتم تعيين اتجاه النص تلقائيًا بناءً على اللغة المحددة' : 'Text direction is set automatically based on selected language'}
                </p>
              </div>
              <div className="text-gray-700">
                {isRTL ? 'من اليمين إلى اليسار (RTL)' : 'Left to Right (LTR)'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {isRTL ? 'الأمان' : 'Security'}
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">
                {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'كلمة المرور الحالية' : 'Current Password'}
                  </label>
                  <input 
                    type="password" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder={isRTL ? '••••••••' : '••••••••'} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                  </label>
                  <input 
                    type="password" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder={isRTL ? '••••••••' : '••••••••'} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                  </label>
                  <input 
                    type="password" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder={isRTL ? '••••••••' : '••••••••'} 
                  />
                </div>
                
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    {isRTL ? 'تحديث كلمة المرور' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">
                {isRTL ? 'تسجيل الخروج من جميع الأجهزة' : 'Sign Out from All Devices'}
              </h3>
              
              <p className="text-sm text-gray-500 mb-4">
                {isRTL ? 'سيؤدي هذا إلى تسجيل خروجك من جميع الأجهزة الأخرى التي قمت بتسجيل الدخول إليها.' : 'This will sign you out from all other devices you have logged in to.'}
              </p>
              
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                {isRTL ? 'تسجيل الخروج من جميع الأجهزة' : 'Sign Out from All Devices'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Tab content
  const renderTabContent = () => {
    if (activeTab === 0) {
      return renderDashboardContent();
    } else if (activeTab === 3) {
      return renderProfileSettings();
    } else {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {isRTL ? 'قيد التطوير' : 'Under Development'}
          </h3>
          <p className="text-gray-500">
            {isRTL ? 'هذه الميزة قيد التطوير وستكون متاحة قريبًا.' : 'This feature is under development and will be available soon.'}
          </p>
        </div>
      );
    }
  };
  
  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xl">E</div>
                <span className="ml-2 text-xl font-bold text-blue-600">EAALANI</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button 
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => toggleLanguage(language === 'en' ? 'ar' : 'en')}
              >
                <Globe className="h-5 w-5 text-gray-500" />
              </button>
              
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 relative"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <Bell className="h-5 w-5 text-gray-500" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">
                        {isRTL ? 'الإشعارات' : 'Notifications'}
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 p-1 rounded-full bg-blue-100">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {isRTL ? 'تم تأكيد الحجز' : 'Booking Confirmed'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {isRTL ? 'تم تأكيد حجز اللوحة الإعلانية "طريق الملك فهد".' : 'Your booking for "King Fahd Road Billboard" has been confirmed.'}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {isRTL ? 'منذ 5 دقائق' : '5 minutes ago'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 p-1 rounded-full bg-green-100">
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {isRTL ? 'تم استلام الدفعة' : 'Payment Received'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {isRTL ? 'تم استلام دفعة بقيمة $3,500 من شركة أكمي.' : 'Payment of $3,500 received from ACME Corp.'}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {isRTL ? 'منذ ساعتين' : '2 hours ago'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 p-1 rounded-full bg-yellow-100">
                            <Bell className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {isRTL ? 'تذكير بالصيانة' : 'Maintenance Reminder'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {isRTL ? 'الصيانة الدورية للوحة إعلانية "شارع التحلية" مقررة غدًا.' : 'Scheduled maintenance for "Tahlia Street Billboard" is tomorrow.'}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {isRTL ? 'منذ يوم واحد' : '1 day ago'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        {isRTL ? 'عرض جميع الإشعارات' : 'View all notifications'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Settings */}
              <div className="relative" ref={settingsRef}>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                >
                  <Settings className="h-5 w-5 text-gray-500" />
                </button>
                
                {isSettingsOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {isRTL ? 'الإعدادات' : 'Settings'}
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {isRTL ? 'المساعدة والدعم' : 'Help & Support'}
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={handleSignOut}
                      >
                        {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Menu */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {user && user.full_name ? user.full_name.charAt(0) : 'U'}
                  </div>
                  <div className="hidden md:flex md:flex-col md:items-start">
                    <span className="text-sm font-medium text-gray-900">
                      {user && user.full_name || 'John Doe'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user && user.role === 'investor' ? (isRTL ? 'مستثمر' : 'Investor') :
                       user && user.role === 'advertiser' ? (isRTL ? 'معلن' : 'Advertiser') :
                       user && user.role === 'municipality' ? (isRTL ? 'بلدية' : 'Municipality') :
                       user && user.role === 'admin' ? (isRTL ? 'مسؤول' : 'Administrator') :
                       (isRTL ? 'مستخدم' : 'User')}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {isRTL ? 'الملف الشخصي' : 'Profile'}
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {isRTL ? 'الإعدادات' : 'Settings'}
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={handleSignOut}
                      >
                        {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-8 overflow-x-auto">
            {getTabs().map((tab, index) => (
              <button
                key={index}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === index
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 md:flex-shrink-0 mb-8 md:mb-0 md:mr-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isRTL ? 'القائمة' : 'Menu'}
                </h2>
              </div>
              <div className="p-4">
                <nav className="space-y-1">
                  {getSidebarItems().map((item, index) => (
                    <button
                      key={index}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        activeSidebarItem === index
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveSidebarItem(index)}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            
            {/* Help Box */}
            <div className="mt-6 bg-blue-50 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  {isRTL ? 'بحاجة إلى مساعدة؟' : 'Need Help?'}
                </h3>
                <p className="text-sm text-blue-800 mb-4">
                  {isRTL ? 'فريق الدعم لدينا متاح على مدار الساعة طوال أيام الأسبوع للإجابة على أسئلتك.' : 'Our support team is available 24/7 to answer your questions.'}
                </p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                  {isRTL ? 'تواصل مع الدعم' : 'Contact Support'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardComponent;
