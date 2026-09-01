// src/components/NoticesView.tsx
import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Search,
  Filter,
  ArrowRight,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Notice } from '../types.ts';

interface NoticesViewProps {
  notices: Notice[];
  setActiveTab: (tab: string) => void;
  openNoticeModal: (notice: Notice) => void;
}

export const NoticesView: React.FC<NoticesViewProps> = ({
  notices,
  setActiveTab,
  openNoticeModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Notices' },
    { id: 'important', label: 'Important' },
    { id: 'exams', label: 'Exams' },
    { id: 'events', label: 'Events' },
    { id: 'holidays', label: 'Holidays' },
  ];

  const filteredNotices = notices.filter((notice) => {
    const matchCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    const matchSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notice.marathiTitle && notice.marathiTitle.includes(searchQuery)) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="w-full space-y-12 pb-16">
      {/* Banner */}
      <section className="bg-[#0f2942] text-white py-12 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-heading">
            Notices / Updates
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            <button onClick={() => setActiveTab('home')} className="hover:text-orange-400">Home</button>
            <span className="mx-2">›</span>
            <span className="text-orange-400">Notices / Updates</span>
          </p>
        </div>
      </section>

      {/* Notices Board (matches reference 07. Notices Page layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Category Sidebar (matches left column in reference 07. Notices Page) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#0f2942] uppercase tracking-wider font-heading">
                Notice Categories
              </h3>
              <div className="space-y-1.5">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const count = notices.filter(
                    (n) => cat.id === 'all' || n.category === cat.id
                  ).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-between ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        isSelected ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick SMS / WhatsApp alerts note */}
            <div className="bg-gradient-to-br from-[#0f2942] to-[#1a3d5e] p-6 rounded-3xl text-white space-y-3">
              <div className="flex items-center gap-2 text-orange-400 text-xs font-bold">
                <Bell className="w-4 h-4" />
                <span>Instant Alerts</span>
              </div>
              <h4 className="text-sm font-bold">Never miss an exam circular!</h4>
              <p className="text-xs text-slate-300">
                All registered students receive WhatsApp and SMS alerts for hall tickets and test schedules.
              </p>
              <a
                href="https://wa.me/917378311900?text=Please%20send%20latest%20coaching%20notices"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-colors"
              >
                <span>Join WhatsApp Updates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Notice List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search circulars, exams, test dates..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 shadow-xs transition-colors"
              />
            </div>

            {/* Notice Cards List */}
            <div className="space-y-3">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => openNoticeModal(notice)}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md uppercase">
                        {notice.category}
                      </span>
                      {notice.isNew === 1 && (
                        <span className="px-2 py-0.5 bg-red-500 text-white font-bold text-[9px] rounded uppercase tracking-wider animate-pulse">
                          NEW
                        </span>
                      )}
                      {notice.priority === 'high' && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[9px] rounded uppercase">
                          Important
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#0f2942] group-hover:text-orange-600 transition-colors font-heading">
                      {notice.title}
                    </h3>
                    {notice.marathiTitle && (
                      <p className="text-xs font-semibold text-orange-600">
                        {notice.marathiTitle}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {notice.content}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{notice.publishDate}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>

            {filteredNotices.length === 0 && (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No notices found.</p>
                <p className="text-xs text-slate-500">Check other categories or reset search.</p>
              </div>
            )}

            {/* Pagination strip (matches reference footer 1 2 3 Next) */}
            <div className="flex items-center justify-center gap-2 pt-6">
              <span className="w-8 h-8 rounded-lg bg-orange-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                1
              </span>
              <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                2
              </span>
              <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                3
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer">
                Next ›
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
