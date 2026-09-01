// src/components/Header.tsx
import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  User as UserIcon,
  LogOut,
  ClipboardList,
  Search,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAdmissionModal: (courseName?: string) => void;
  openTrackModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openAdmissionModal,
  openTrackModal,
}) => {
  const { user, userProfile, signInWithGoogle, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'courses', label: 'Courses' },
    { id: 'results', label: 'Results' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'notices', label: 'Notices' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full bg-white shadow-xs sticky top-0 z-40">
      {/* Top Notification / Contact Bar (matches reference header exactly) */}
      <div className="bg-[#f97316] text-white text-xs font-medium py-1.5 px-4 sm:px-8 border-b border-orange-600/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
          {/* Left contact info */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <a
              href="tel:7378311900"
              className="flex items-center gap-1.5 hover:text-orange-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="font-semibold tracking-wide">7378311900</span>
            </a>
            <a
              href="mailto:jagdambcoachingcenter@gmail.com"
              className="hidden md:flex items-center gap-1.5 hover:text-orange-100 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>jagdambcoachingcenter@gmail.com</span>
            </a>
            <div className="hidden xl:flex items-center gap-1.5 text-orange-100">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Toki, Ambelohal, Tal. Gangapur, Dist. Chhatrapati Sambhajinagar</span>
            </div>
          </div>

          {/* Right info / social */}
          <div className="flex items-center gap-3 ml-auto text-xs">
            <span className="hidden sm:inline-block font-normal text-orange-100">
              Follow Us :
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-5 h-5 rounded-full bg-white/20 hover:bg-white hover:text-orange-600 flex items-center justify-center transition-all text-[11px] font-bold"
              >
                f
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-5 h-5 rounded-full bg-white/20 hover:bg-white hover:text-orange-600 flex items-center justify-center transition-all text-[11px] font-bold"
              >
                ig
              </a>
              <a
                href="https://wa.me/917378311900"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-5 h-5 rounded-full bg-white/20 hover:bg-white hover:text-orange-600 flex items-center justify-center transition-all text-[11px] font-bold"
              >
                wa
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-5 h-5 rounded-full bg-white/20 hover:bg-white hover:text-orange-600 flex items-center justify-center transition-all text-[11px] font-bold"
              >
                yt
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group focus:outline-hidden"
          id="brand-logo-btn"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f2942] to-[#1e3a8a] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200 shrink-0 border border-slate-700/30">
            <GraduationCap className="w-7 h-7 text-orange-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl sm:text-2xl text-[#0f2942] tracking-tight font-heading">
                Jagdamb Coaching Center
              </span>
            </div>
            <p className="text-xs sm:text-[13px] font-medium text-orange-600 tracking-wide mt-0.5">
              “ज्ञानातून यशाकडे, विद्यार्थ्यांच्या उज्ज्वल भविष्यासाठी!”
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'text-orange-600 bg-orange-50 font-bold'
                    : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons (Admission Open + Application Tracker / User Profile) */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            id="track-application-btn"
            onClick={openTrackModal}
            title="Track submitted admission form"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Track Form</span>
          </button>

          {/* User Auth or Admin Portal Access */}
          {user ? (
            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors border border-slate-200"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-6 h-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="max-w-[80px] truncate">{user.displayName || 'Student'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900 truncate">{user.displayName || 'Account'}</p>
                    <p className="text-slate-500 truncate text-[11px]">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-800 font-semibold rounded text-[10px] uppercase">
                      {userProfile?.role || 'Student / Parent'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('portal');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2"
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>Student / Staff Portal</span>
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="google-signin-btn"
              onClick={() => signInWithGoogle()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#0f2942] hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <UserIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Login</span>
            </button>
          )}

          {/* Admission Open CTA (High-contrast orange pill as in reference) */}
          <button
            id="admission-open-cta-btn"
            onClick={() => openAdmissionModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold text-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-yellow-200 animate-pulse" />
            <span>Admission Open</span>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => openAdmissionModal()}
            className="px-3 py-1.5 bg-orange-600 text-white font-bold text-xs rounded-lg sm:hidden"
          >
            Admission
          </button>
          <button
            id="mobile-nav-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (matches reference mobile preview) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                  isActive
                    ? 'text-orange-600 bg-orange-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-orange-600"></span>}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                openTrackModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              Track Application Status
            </button>
            <button
              onClick={() => {
                openAdmissionModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-sm font-bold text-white bg-orange-600 rounded-lg shadow-sm"
            >
              Online Admission Form
            </button>
            {user ? (
              <button
                onClick={() => {
                  setActiveTab('portal');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-orange-600"
              >
                Go to Student Portal ({user.displayName || user.email})
              </button>
            ) : (
              <button
                onClick={() => {
                  signInWithGoogle();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs font-semibold text-slate-600"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
