// src/components/Footer.tsx
import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Target,
  BookOpen,
  TrendingUp,
  Trophy,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  openAdmissionModal: (courseName?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, openAdmissionModal }) => {
  const handleNav = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0d233a] text-white">
      {/* 4 Pillars & Commitment Bar (matches the bottom ribbon in reference images) */}
      <div className="bg-[#0b1c2e] border-t border-b border-slate-800 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-6">
          {/* Commitment Text */}
          <div className="flex items-center gap-3 text-center xl:text-left max-w-md">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 hidden sm:flex">
              <Trophy className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              <strong className="text-white font-bold">Jagdamb Coaching Center</strong> is committed to provide quality education and bring out the best in every student.
            </p>
          </div>

          {/* 4 Core Marathi Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full xl:w-auto">
            <div className="flex items-center gap-2.5 bg-slate-900/60 px-3.5 py-2.5 rounded-xl border border-slate-800">
              <Target className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white tracking-wide">ध्येय निश्चिती</p>
                <p className="text-[10px] text-slate-400">Goal Setting</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-900/60 px-3.5 py-2.5 rounded-xl border border-slate-800">
              <BookOpen className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white tracking-wide">अभ्यास</p>
                <p className="text-[10px] text-slate-400">Dedication</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-900/60 px-3.5 py-2.5 rounded-xl border border-slate-800">
              <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white tracking-wide">सातत्य</p>
                <p className="text-[10px] text-slate-400">Consistency</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-900/60 px-3.5 py-2.5 rounded-xl border border-slate-800">
              <Trophy className="w-5 h-5 text-yellow-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white tracking-wide">यश</p>
                <p className="text-[10px] text-slate-400">Success</p>
              </div>
            </div>
          </div>

          {/* Call Us Quick Button */}
          <a
            href="tel:7378311900"
            className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-semibold tracking-wider text-orange-100">Call Us Now</p>
              <p className="text-base font-extrabold tracking-wide">7378311900</p>
            </div>
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold shadow-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-heading">
                Jagdamb Coaching
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Empowering students with foundation education, Abacus mental arithmetic, Jawahar Navodaya Vidyalaya selection, and State Scholarship exam mastery.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-orange-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Govt. Recognized & ISO Certified Standards</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-orange-500" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-orange-500" />
                  <span>About Institute & Faculty</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('courses')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-orange-500" />
                  <span>All Courses & Batches</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('results')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-orange-500" />
                  <span>Results & Top Achievers</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('notices')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-orange-500" />
                  <span>Notice Board & Exam Dates</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('gallery')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-orange-500" />
                  <span>Photo Gallery</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Courses */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Our Core Courses
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => openAdmissionModal('Jagdamb Proactive Abacus')}
                  className="hover:text-orange-400 transition-colors text-left"
                >
                  • Jagdamb Proactive Abacus (34 Formulas)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openAdmissionModal('Navodaya Entrance Exam')}
                  className="hover:text-orange-400 transition-colors text-left"
                >
                  • Navodaya Entrance Exam (5th Std)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openAdmissionModal('Scholarship Exam (4th & 7th)')}
                  className="hover:text-orange-400 transition-colors text-left"
                >
                  • Scholarship Exam (4th & 7th Std)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openAdmissionModal('Mental Math Program')}
                  className="hover:text-orange-400 transition-colors text-left"
                >
                  • Mental Math Speed Program
                </button>
              </li>
              <li>
                <button
                  onClick={() => openAdmissionModal('Vedic Maths Masterclass')}
                  className="hover:text-orange-400 transition-colors text-left"
                >
                  • Vedic Maths Shortcuts
                </button>
              </li>
            </ul>
          </div>

          {/* Center Address & Working Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Contact & Center Address
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>
                  Toki, Ambelohal, Taluka Gangapur, District Chhatrapati Sambhajinagar, Maharashtra - 431109
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="font-semibold text-white">7378311900 / 9822456789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>jagdambcoachingcenter@gmail.com</span>
              </div>
              <div className="pt-2">
                <p className="text-[11px] text-slate-400">Class Hours:</p>
                <p className="text-xs font-semibold text-white">Mon - Sat: 7:00 AM - 7:00 PM</p>
                <p className="text-xs font-semibold text-orange-400">Sunday: 8:00 AM - 1:00 PM (Mock Tests)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Jagdamb Coaching Center. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>Building Bright Futures with Quality Education</span>
            <span>•</span>
            <button onClick={() => handleNav('portal')} className="hover:text-orange-400">
              Staff / Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
