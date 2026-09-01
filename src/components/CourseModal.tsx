// src/components/CourseModal.tsx
import React from 'react';
import { X, Clock, Users, Calendar, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Course } from '../types.ts';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  openAdmissionModal: (courseName?: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  onClose,
  openAdmissionModal,
}) => {
  if (!course) return null;

  const parseFeatures = (json: string): string[] => {
    try {
      return JSON.parse(json);
    } catch {
      return ['Concept clarity drills', 'Weekly mock tests', 'Personal faculty mentoring'];
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-[#0f2942] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
              Course Details
            </span>
            <h3 className="text-base sm:text-lg font-bold font-heading">{course.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {course.marathiTitle && (
            <p className="text-sm font-semibold text-orange-600">{course.marathiTitle}</p>
          )}

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {course.description}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Age Group</span>
              <span className="font-bold text-slate-800">{course.ageGroup}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
              <span className="font-bold text-slate-800">{course.duration}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Batch Size</span>
              <span className="font-bold text-slate-800">{course.batchSize}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Class Schedule</span>
              <span className="font-bold text-slate-800">{course.classes}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Highlights
            </h4>
            <div className="space-y-1.5">
              {parseFeatures(course.features).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                openAdmissionModal(course.title);
              }}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
