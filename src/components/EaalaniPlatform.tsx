import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BillboardListingComponent from './BillboardListingComponent';
import MapPreviewComponent from './MapPreviewComponent';
import { Globe, Menu, X } from 'lucide-react';

export const EaalaniPlatform = () => {
  const [activeTab, setActiveTab] = useState<'billboards' | 'map'>('billboards');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, language, isRTL, setLanguage, logout } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleViewDetails = (id: string) => {
    console.log('View details for billboard:', id);
    // Navigate to details page
  };

  const handleShowOnMap = (id: string) => {
    console.log('Show billboard on map:', id);
    setActiveTab('map');
    // Highlight the billboard on the map
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                  alt="EAALANI"
                />
                <span className="ml-2 rtl:mr-2 rtl:ml-0 text-xl font-bold text-gray-900">
                  {isRTL ? 'إيلاني' : 'EAALANI'}
                </span>
              </div>
              <nav className="hidden md:ml-6 md:flex md:space-x-8 rtl:space-x-reverse">
                <button
                  onClick={() => setActiveTab('billboards')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'billboards'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {isRTL ? 'اللوحات الإعلانية' : 'Billboards'}
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'map'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {isRTL ? 'الخريطة' : 'Map'}
                </button>
              </nav>
            </div>
            <div className="hidden md:flex items-center">
              <button
                onClick={toggleLanguage}
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">
                  {isRTL ? 'Switch to English' : 'التبديل إلى العربية'}
                </span>
                <Globe className="h-6 w-6" />
              </button>
              {user ? (
                <div className="ml-3 rtl:mr-3 rtl:ml-0 relative">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <button
                      onClick={() => logout()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      {isRTL ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2 rtl:ml-2 rtl:mr-0">
                        {user.name}
                      </span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=random`
                        }
                        alt={user.name}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4 rtl:space-x-reverse ml-4 rtl:mr-4 rtl:ml-0">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50">
                    {isRTL ? 'تسجيل الدخول' : 'Login'}
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    {isRTL ? 'إنشاء حساب' : 'Sign Up'}
                  </button>
                </div>
              )}
            </div>
            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  setActiveTab('billboards');
                  setMobileMenuOpen(false);
                }}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  activeTab === 'billboards'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } ${isRTL ? 'border-r-4 border-l-0 pr-3 pl-4' : ''}`}
              >
                {isRTL ? 'اللوحات الإعلانية' : 'Billboards'}
              </button>
              <button
                onClick={() => {
                  setActiveTab('map');
                  setMobileMenuOpen(false);
                }}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  activeTab === 'map'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } ${isRTL ? 'border-r-4 border-l-0 pr-3 pl-4' : ''}`}
              >
                {isRTL ? 'الخريطة' : 'Map'}
              </button>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <div>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=random`
                        }
                        alt={user.name}
                      />
                    </div>
                    <div className="ml-3 rtl:mr-3 rtl:ml-0">
                      <div className="text-base font-medium text-gray-800">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left rtl:text-right"
                    >
                      {isRTL ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 px-4">
                  <button className="block text-left rtl:text-right w-full px-4 py-2 text-base font-medium text-indigo-600 hover:bg-gray-100">
                    {isRTL ? 'تسجيل الدخول' : 'Login'}
                  </button>
                  <button className="block text-left rtl:text-right w-full px-4 py-2 text-base font-medium text-indigo-600 hover:bg-gray-100">
                    {isRTL ? 'إنشاء حساب' : 'Sign Up'}
                  </button>
                </div>
              )}
              <div className="mt-3 px-4">
                <button
                  onClick={() => {
                    toggleLanguage();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  <Globe className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
                  {isRTL ? 'Switch to English' : 'التبديل إلى العربية'}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {activeTab === 'billboards' ? (
            <BillboardListingComponent
              onViewDetails={handleViewDetails}
              onShowOnMap={handleShowOnMap}
            />
          ) : (
            <MapPreviewComponent onViewDetails={handleViewDetails} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {isRTL
                ? '© 2025 إيلاني. جميع الحقوق محفوظة.'
                : '© 2025 EAALANI. All rights reserved.'}
            </div>
            <div className="flex space-x-6 rtl:space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                {isRTL ? 'شروط الخدمة' : 'Terms of Service'}
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                {isRTL ? 'اتصل بنا' : 'Contact Us'}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
