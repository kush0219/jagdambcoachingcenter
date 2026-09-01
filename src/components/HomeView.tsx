// src/components/HomeView.tsx
import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Trophy,
  Users,
  Target,
  Brain,
  Award,
  GraduationCap,
  Calculator,
  CheckCircle2,
  Calendar,
  Bell,
  Clock,
  ChevronRight,
  Star,
  Zap,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { Course, Notice, Achiever, Testimonial } from '../types.ts';

interface HomeViewProps {
  courses: Course[];
  notices: Notice[];
  achievers: Achiever[];
  testimonials: Testimonial[];
  setActiveTab: (tab: string) => void;
  openAdmissionModal: (courseName?: string) => void;
  openNoticeModal: (notice: Notice) => void;
  openCourseModal: (course: Course) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  courses,
  notices,
  achievers,
  testimonials,
  setActiveTab,
  openAdmissionModal,
  openNoticeModal,
  openCourseModal,
}) => {
  // Speed math mini challenge state
  const [mathNum1, setMathNum1] = useState(38);
  const [mathNum2, setMathNum2] = useState(47);
  const [userMathAnswer, setUserMathAnswer] = useState('');
  const [mathFeedback, setMathFeedback] = useState<string | null>(null);
  const [scoreStreak, setScoreStreak] = useState(0);

  const handleMathCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const correct = mathNum1 + mathNum2;
    if (parseInt(userMathAnswer, 10) === correct) {
      setMathFeedback('Correct! Mental Math Formula Applied! ⚡');
      setScoreStreak(prev => prev + 1);
      setTimeout(() => {
        setMathNum1(Math.floor(20 + Math.random() * 70));
        setMathNum2(Math.floor(15 + Math.random() * 65));
        setUserMathAnswer('');
        setMathFeedback(null);
      }, 1200);
    } else {
      setMathFeedback(`Almost! Correct answer was ${correct}. Keep practicing!`);
      setScoreStreak(0);
    }
  };

  const courseIcons: Record<string, React.ReactNode> = {
    abacus: <Calculator className="w-8 h-8 text-orange-500" />,
    target: <Target className="w-8 h-8 text-red-500" />,
    award: <Award className="w-8 h-8 text-blue-500" />,
    brain: <Brain className="w-8 h-8 text-purple-500" />,
    calculator: <Calculator className="w-8 h-8 text-emerald-500" />,
  };

  return (
    <div className="w-full space-y-12 pb-16">
      {/* 1. HERO SECTION (matches reference layout precisely) */}
      <section className="relative bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Admissions Open for Academic Year 2026 - 2027</span>
              </div>

              {/* Main Headline (High Contrast Display Typography) */}
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black text-[#0f2942] tracking-tight leading-[1.1] font-heading">
                KNOWLEDGE, <br />
                <span className="text-[#0f2942]">SKILLS & </span>
                <span className="text-orange-600">SUCCESS </span>
                <span>IS HERE</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                We provide quality education and build a strong foundation for students. Our goal is to bring out the best in every student.
              </p>

              {/* CTAs matching reference buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  id="hero-explore-courses-btn"
                  onClick={() => setActiveTab('courses')}
                  className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <span>Explore Courses</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-contact-us-btn"
                  onClick={() => setActiveTab('contact')}
                  className="px-6 py-3.5 bg-[#0f2942] hover:bg-[#1a3d5e] text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <span>Contact Us</span>
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>34 Abacus Formulas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>50+ Navodaya Mocks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Special Scholarship Batches</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card (matches reference visual banner) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Yellow/Orange Accent Background Shape */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-orange-400 to-amber-300 rounded-3xl transform rotate-2 opacity-80 blur-xs"></div>
                
                {/* Main Hero Card Container */}
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  {/* Real high-res photo representing enthusiastic student in coaching */}
                  <img
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80"
                    alt="Jagdamb Coaching Center Student"
                    className="w-full h-80 sm:h-96 object-cover object-top"
                  />

                  {/* Overlay Center Banner (matches image badge) */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#0f2942]/95 backdrop-blur-md text-white p-3.5 rounded-2xl border border-white/20 shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white text-xs">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-orange-300 font-bold">Center of Excellence</p>
                        <p className="text-xs font-bold text-white">JAGDAMB COACHING CENTER</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-md">
                      100% Results
                    </span>
                  </div>
                </div>

                {/* 3 Dots Slider Indicator (matches reference) */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE 4 COURSES GRID (matches 4-card row in reference image) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
            Our Popular Programs
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2942] tracking-tight font-heading">
            Specialized Coaching Programs
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 4).map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-orange-300 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-2xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center mb-4 transition-colors">
                  {courseIcons[course.icon] || <BookOpen className="w-8 h-8 text-orange-500" />}
                </div>

                {/* Course Title */}
                <h3 className="text-lg font-bold text-[#0f2942] mb-1.5 font-heading">
                  {course.title}
                </h3>
                {course.marathiTitle && (
                  <p className="text-xs font-semibold text-orange-600 mb-2">
                    {course.marathiTitle}
                  </p>
                )}

                {/* Tagline */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {course.tagline}
                </p>
              </div>

              {/* Learn More Action Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => openCourseModal(course)}
                  className="text-xs font-bold text-orange-600 group-hover:text-orange-700 flex items-center gap-1.5 transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => openAdmissionModal(course.title)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-orange-50 text-[11px] font-semibold text-slate-700 hover:text-orange-600 rounded-md transition-colors"
                >
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BLUE STATS BAR & WHY CHOOSE US (matches 2-panel layout in reference image 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Deep Navy Blue Metric Stats Card */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#0f2942] to-[#163758] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-orange-400 tracking-wider mb-2">
                Proven Track Record
              </p>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-6 font-heading">
                Excellence in Numbers
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  <span className="text-2xl sm:text-3xl font-black text-white font-heading">500+</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Happy Students</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-sky-400" />
                  <span className="text-2xl sm:text-3xl font-black text-white font-heading">10+</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Courses</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl sm:text-3xl font-black text-white font-heading">100+</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Achievements</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-400" />
                  <span className="text-2xl sm:text-3xl font-black text-white font-heading">5+</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Years Experience</p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
              <span>Center: Gangapur, Sambhajinagar</span>
              <span className="text-orange-400 font-bold">100% Focused</span>
            </div>
          </div>

          {/* Center/Right: WHY CHOOSE US 4 Badges */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-center sm:text-left mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  WHY CHOOSE US
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0f2942] tracking-tight mt-1 font-heading">
                  We Provide The Best For Your Child
                </h3>
              </div>

              {/* 4 Feature Items with Circular Badges (matches reference UI) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2942] font-heading">Experienced Teachers</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Well qualified and experienced teachers with proven result records.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2942] font-heading">Individual Attention</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Personal attention to every student with limited batch sizes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2942] font-heading">Regular Tests</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Weekly practice mock tests and in-depth performance analysis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2942] font-heading">Bright Future</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Building solid cognitive foundation for competitive school exams.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-slate-500 font-medium">
                Want to schedule a free counseling and demo class?
              </span>
              <button
                onClick={() => openAdmissionModal()}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5"
              >
                <span>Book Free Demo Class</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LATEST NOTICES & SPEED MATH WIDGET SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Latest Notices Panel (matches the notices card in reference image 1) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0f2942] font-heading">
                  Latest Notices & Circulars
                </h3>
              </div>
              <button
                id="view-all-notices-btn"
                onClick={() => setActiveTab('notices')}
                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {notices.slice(0, 4).map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => openNoticeModal(notice)}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-100 hover:border-orange-200 transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                        {notice.title}
                      </p>
                      {notice.isNew === 1 && (
                        <span className="px-1.5 py-0.5 bg-red-500 text-white font-bold text-[9px] rounded uppercase tracking-wider animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                    {notice.marathiTitle && (
                      <p className="text-xs font-medium text-orange-600">
                        {notice.marathiTitle}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 text-xs shrink-0 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{notice.publishDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Speed Math / Abacus Mini-Challenge */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-200" />
                  <span>Abacus Speed Drill</span>
                </span>
                {scoreStreak > 0 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-yellow-200 bg-white/10 px-2 py-0.5 rounded-md">
                    <Flame className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                    Streak: {scoreStreak}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 font-heading">
                Mental Math Live Challenge
              </h3>
              <p className="text-xs text-orange-100 leading-relaxed mb-6">
                Experience the calculation speed our Abacus students achieve in 30 days!
              </p>

              {/* The Math Quiz Problem */}
              <div className="bg-white/15 backdrop-blur-xs p-5 rounded-2xl border border-white/20 text-center mb-4">
                <p className="text-xs text-orange-200 uppercase font-semibold">Calculate mentally:</p>
                <div className="text-4xl sm:text-5xl font-black text-white my-2 tracking-wider font-heading">
                  {mathNum1} + {mathNum2} = ?
                </div>
                <form onSubmit={handleMathCheck} className="flex items-center gap-2 mt-4">
                  <input
                    type="number"
                    value={userMathAnswer}
                    onChange={(e) => setUserMathAnswer(e.target.value)}
                    placeholder="Enter answer"
                    className="w-full px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-center placeholder-slate-400 focus:outline-hidden text-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#0f2942] hover:bg-[#1a3d5e] text-white text-xs font-bold rounded-xl shrink-0 transition-colors"
                  >
                    Submit
                  </button>
                </form>
                {mathFeedback && (
                  <p className="text-xs font-bold text-yellow-200 mt-2 animate-in fade-in">
                    {mathFeedback}
                  </p>
                )}
              </div>
            </div>

            <div className="text-center pt-2">
              <p className="text-[11px] text-orange-100">
                Want your child to solve 100 questions in 3 minutes?
              </p>
              <button
                onClick={() => openAdmissionModal('Jagdamb Proactive Abacus')}
                className="mt-2 text-xs font-bold text-white underline hover:text-yellow-200 transition-colors"
              >
                Join Abacus Proactive Batch →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOP ACHIEVERS TEASER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-slate-100/80 rounded-3xl p-6 sm:p-10 border border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                OUR PRIDE & INSPIRATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2942] tracking-tight font-heading">
                Top Achievers & Rankers
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('results')}
              className="px-4 py-2 bg-white hover:bg-orange-50 text-orange-600 text-xs font-bold rounded-xl border border-orange-200 transition-colors"
            >
              View All Results →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievers.slice(0, 3).map((achiever) => (
              <div
                key={achiever.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4"
              >
                <img
                  src={achiever.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
                  alt={achiever.studentName}
                  className="w-16 h-16 rounded-xl object-cover object-top border-2 border-orange-500 shrink-0"
                />
                <div className="space-y-1">
                  <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded-md">
                    {achiever.rank}
                  </span>
                  <h4 className="text-sm font-bold text-[#0f2942] font-heading">
                    {achiever.studentName}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium line-clamp-1">
                    {achiever.examName}
                  </p>
                  <p className="text-[11px] font-bold text-emerald-600">
                    Score: {achiever.score || 'Distinction'} ({achiever.year})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PARENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
            Parent Feedback
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2942] tracking-tight font-heading">
            What Parents Say About Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{test.content}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-[#0f2942]">{test.parentName}</p>
                <p className="text-[11px] text-orange-600 font-medium">
                  Parent of {test.studentName} • {test.course}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
