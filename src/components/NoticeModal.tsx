// src/components/NoticeModal.tsx
import React from 'react';
import { X, Calendar, Bell, Sparkles, CheckCircle2, Share2 } from 'lucide-react';
import { Notice } from '../types.ts';

interface NoticeModalProps {
  notice: Notice | null;
  onClose: () => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({ notice, onClose }) => {
  if (!notice) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-[#0f2942] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-orange-300">
              {notice.category} Notice
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded-md uppercase">
              {notice.category}
            </span>
            {notice.isNew === 1 && (
              <span className="px-2 py-0.5 bg-red-500 text-white font-bold text-[9px] rounded uppercase animate-pulse">
                NEW
              </span>
            )}
            <span className="text-xs text-slate-400 ml-auto flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {notice.publishDate}
            </span>
          </div>

          <h2 className="text-xl font-bold text-[#0f2942] font-heading leading-tight">
            {notice.title}
          </h2>

          {notice.marathiTitle && (
            <p className="text-sm font-semibold text-orange-600">
              {notice.marathiTitle}
            </p>
          )}

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {notice.content}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Jagdamb Coaching Center Administration</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
