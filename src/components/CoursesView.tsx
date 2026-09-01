// src/components/CoursesView.tsx
import React, { useState } from 'react';
import {
  BookOpen,
  Target,
  Award,
  Brain,
  Calculator,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Layers
} from 'lucide-react';
import { Course } from '../types.ts';

interface CoursesViewProps {
  courses: Course[];
  setActiveTab: (tab: string) => void;
  openAdmissionModal: (courseName?: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  setActiveTab,
  openAdmissionModal,
}) => {
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>(
    courses[0]?.slug || 'abacus'
  );

  const selectedCourse = courses.find((c) => c.slug === selectedCourseSlug) || courses[0];

  const courseIcons: Record<string, React.ReactNode> = {
    abacus: <Calculator className="w-6 h-6 text-orange-500" />,
    target: <Target className="w-6 h-6 text-red-500" />,
    award: <Award className="w-6 h-6 text-blue-500" />,
    brain: <Brain className="w-6 h-6 text-purple-500" />,
    calculator: <Calculator className="w-6 h-6 text-emerald-500" />,
  };

  const parseFeatures = (json: string): string[] => {
    try {
      return JSON.parse(json);
    } catch {
      return [
        'Structured step-by-step guidance',
        'Experienced faculty mentorship',
        'Regular topic tests and mock series',
      ];
    }
  };

  const parseCurriculum = (json: string): string[] => {
    try {
      return JSON.parse(json);
    } catch {
      return [
        'Module 1: Fundamental Concept Mastery',
        'Module 2: Advanced Problem Solving Techniques',
        'Module 3: Speed & Accuracy Drills',
      ];
    }
  };

  return (
    <div className="w-full space-y-12 pb-16">
      {/* Banner */}
      <section className="bg-[#0f2942] text-white py-12 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-heading">
            Our Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            <button onClick={() => setActiveTab('home')} className="hover:text-orange-400">Home</button>
            <span className="mx-2">›</span>
            <span className="text-orange-400">Our Courses</span>
          </p>
        </div>
      </section>

      {/* Courses Explorer & In-depth Details (matches reference 03. Courses Page & Detailed view) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Course Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-4">
              <h3 className="text-sm font-bold text-[#0f2942] uppercase tracking-wider mb-2 font-heading">
                All Coaching Programs
              </h3>
              <p className="text-xs text-slate-500">
                Select a course to view detailed syllabus, batch timings, and age eligibility.
              </p>
            </div>

            <div className="space-y-2.5">
              {courses.map((course) => {
                const isSelected = course.slug === selectedCourseSlug;
                return (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourseSlug(course.slug)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center justify-between border ${
                      isSelected
                        ? 'bg-orange-50 border-orange-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-orange-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100'
                      }`}>
                        {courseIcons[course.icon] || <BookOpen className="w-5 h-5 text-orange-500" />}
                      </div>
                      <div>
                        <h4 className={`text-xs sm:text-sm font-bold font-heading ${
                          isSelected ? 'text-orange-950' : 'text-slate-900'
                        }`}>
                          {course.title}
                        </h4>
                        {course.marathiTitle && (
                          <p className="text-[11px] text-orange-600 font-medium">
                            {course.marathiTitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-orange-600 translate-x-0.5' : 'text-slate-400'
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Helpline Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0f2942] to-[#1a3d5e] text-white space-y-3 mt-6">
              <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Course Guidance</p>
              <h4 className="text-sm font-bold">Confused which course suits your child?</h4>
              <p className="text-xs text-slate-300">
                Call our academic coordinator for free aptitude guidance and level testing.
              </p>
              <a
                href="tel:7378311900"
                className="inline-flex items-center gap-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 px-3.5 py-2 rounded-xl transition-colors"
              >
                <span>Call 7378311900</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Selected Course Detailed View (matches reference course detail layout) */}
          {selectedCourse && (
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
              {/* Header */}
              <div className="border-b border-slate-100 pb-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full uppercase">
                    Academic Year 2026-27
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Certified Curriculum</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#0f2942] tracking-tight font-heading">
                  {selectedCourse.title}
                </h2>
                {selectedCourse.marathiTitle && (
                  <p className="text-sm font-bold text-orange-600 mt-0.5">
                    {selectedCourse.marathiTitle}
                  </p>
                )}
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              {/* 4 Key Parameter Badges (Age Group, Batch Size, Duration, Classes) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <Users className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Age Group</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedCourse.ageGroup}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Batch Size</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedCourse.batchSize}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <Clock className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Duration</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedCourse.duration}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <Calendar className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Classes</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedCourse.classes}</p>
                </div>
              </div>

              {/* What You Will Learn (Bullet points matching reference layout) */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-[#0f2942] flex items-center gap-2 font-heading">
                  <Layers className="w-5 h-5 text-orange-500" />
                  <span>What You Will Learn</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {parseFeatures(selectedCourse.features).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/50 border border-orange-100">
                      <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-slate-800">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curriculum Breakdown */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-[#0f2942] font-heading">
                  Curriculum & Level Breakdown
                </h3>
                <div className="space-y-2">
                  {parseCurriculum(selectedCourse.curriculum).map((curr, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs text-slate-700 font-medium"
                    >
                      <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <span>{curr}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admission Banner Bar inside card (matches reference: "Admission Open for Abacus Batch - Enroll Now!") */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0f2942] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-orange-300 font-bold uppercase">Limited Seats Available</p>
                  <h4 className="text-sm sm:text-base font-bold">
                    Admission Open for {selectedCourse.title}
                  </h4>
                </div>
                <button
                  id="enroll-course-cta-btn"
                  onClick={() => openAdmissionModal(selectedCourse.title)}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-200 shrink-0"
                >
                  Enroll Now →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
