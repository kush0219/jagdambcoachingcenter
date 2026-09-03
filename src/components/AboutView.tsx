// src/components/AboutView.tsx
import React from 'react';
import {
  Sparkles,
  Target,
  Eye,
  Heart,
  Users,
  BookOpen,
  Trophy,
  Award,
  GraduationCap,
  CheckCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';

interface AboutViewProps {
  setActiveTab: (tab: string) => void;
  openAdmissionModal: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setActiveTab, openAdmissionModal }) => {
  return (
    <div className="w-full space-y-12 pb-16">
      {/* Banner matching reference "About Us" page header */}
      <section className="bg-[#0f2942] text-white py-12 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-2 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-heading">
            About Us
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            <button onClick={() => setActiveTab('home')} className="hover:text-orange-400">Home</button>
            <span className="mx-2">›</span>
            <span className="text-orange-400">About Us</span>
          </p>
        </div>
      </section>

      {/* Main Welcome Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Coaching Center Photo Container */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80"
                alt="Jagdamb Coaching Center Campus"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#0f2942]/95 backdrop-blur-md text-white p-3.5 rounded-2xl border border-white/20">
                <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Our Center</p>
                <p className="text-xs text-white">Toki, Ambelohal, Gangapur, Chhatrapati Sambhajinagar</p>
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome to Jagdamb Coaching Center</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2942] tracking-tight leading-tight font-heading">
              Shaping Young Minds with Passion, Discipline & Innovation
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>Jagdamb Coaching Center</strong> is committed to provide quality education and build a strong foundation for students. Our goal is to bring out the best in every student.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              We believe in <em>'Knowledge, Skills & Success'</em>. Our experienced teachers, regular tests, and personal attention help students to achieve their dreams in competitive scholarship examinations and mental arithmetic mastery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Dedicated Faculty Team</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Weekly Parent Feedback</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Formulas Abacus Lab</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Navodaya Test Center</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars: Mission, Vision, Values (matches reference image 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mission */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-orange-300 transition-all text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#0f2942] mb-2 font-heading">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To provide quality education and help students to achieve their academic goals through structured concept mastery, individual mentoring, and practical drills.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-orange-300 transition-all text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Eye className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#0f2942] mb-2 font-heading">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To be the most trusted coaching institute in Maharashtra and create a bright future for every child by cultivating confidence and sharp mathematical thinking.
            </p>
          </div>

          {/* Values */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-orange-300 transition-all text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#0f2942] mb-2 font-heading">Our Values</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Discipline, Dedication, Hard Work, and Honesty. We instill lifelong curiosity and ethical principles alongside academic excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Blue Metric Band (matches reference 02. About Us page) */}
      <section className="bg-gradient-to-r from-[#0f2942] via-[#163758] to-[#0f2942] text-white py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Users className="w-6 h-6 text-orange-400" />
              <span className="text-3xl sm:text-4xl font-black font-heading">500+</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">Happy Students</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <GraduationCap className="w-6 h-6 text-sky-400" />
              <span className="text-3xl sm:text-4xl font-black font-heading">10+</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">Expert Teachers</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-6 h-6 text-yellow-400" />
              <span className="text-3xl sm:text-4xl font-black font-heading">10+</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">Courses</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-emerald-400" />
              <span className="text-3xl sm:text-4xl font-black font-heading">100+</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">Achievements</p>
          </div>
        </div>
      </section>

      {/* "Have Questions?" Callout Band (matches reference 02. About Us footer banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#0f2942] rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold font-heading">
              Have Questions? We are here to help you!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Call us now or visit our center for personalized consultation and batch timing details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="tel:7378311900"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-orange-400" />
              <span>7378311900</span>
            </a>
            <button
              onClick={() => setActiveTab('contact')}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md flex items-center gap-2 transition-all duration-200"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
