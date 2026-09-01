// src/components/ResultsView.tsx
import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Users,
  Medal,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  GraduationCap
} from 'lucide-react';
import { Achiever } from '../types.ts';

interface ResultsViewProps {
  achievers: Achiever[];
  setActiveTab: (tab: string) => void;
  openAdmissionModal: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  achievers,
  setActiveTab,
  openAdmissionModal,
}) => {
  const [filterYear, setFilterYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAchievers = achievers.filter((achiever) => {
    const matchYear = filterYear === 'all' || achiever.year.includes(filterYear);
    const matchSearch =
      achiever.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (achiever.marathiName && achiever.marathiName.includes(searchQuery)) ||
      achiever.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achiever.rank.toLowerCase().includes(searchQuery.toLowerCase());
    return matchYear && matchSearch;
  });

  return (
    <div className="w-full space-y-12 pb-16">
      {/* Banner */}
      <section className="bg-[#0f2942] text-white py-12 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-heading">
            Results & Achievements
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            <button onClick={() => setActiveTab('home')} className="hover:text-orange-400">Home</button>
            <span className="mx-2">›</span>
            <span className="text-orange-400">Results & Achievements</span>
          </p>
        </div>
      </section>

      {/* Top Achievers Showcase & Achievements Metrics (matches reference 05. Results Page) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Main: Top Achievers Grid */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header & Filter Controls */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0f2942] font-heading">
                    Top Achievers & Meritorious Students
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    We are proud of our students and their outstanding performance!
                  </p>
                </div>

                {/* Year Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Year:</span>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden"
                  >
                    <option value="all">All Batches</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2024-25">2024-25</option>
                  </select>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name, exam, or rank..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Achiever Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredAchievers.map((achiever) => (
                <div
                  key={achiever.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex items-start gap-4 group"
                >
                  <div className="relative shrink-0">
                    <img
                      src={achiever.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
                      alt={achiever.studentName}
                      className="w-20 h-20 rounded-2xl object-cover object-top border-2 border-orange-400 shadow-xs"
                    />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs">
                      <Trophy className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded-md">
                        {achiever.rank}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {achiever.year}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#0f2942] truncate font-heading group-hover:text-orange-600 transition-colors">
                      {achiever.studentName}
                    </h3>
                    {achiever.marathiName && (
                      <p className="text-xs font-semibold text-orange-600 truncate">
                        {achiever.marathiName}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                      {achiever.examName}
                    </p>

                    {achiever.score && (
                      <p className="text-xs font-black text-emerald-600 pt-1">
                        Score: {achiever.score}
                      </p>
                    )}

                    {achiever.citation && (
                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100 mt-2">
                        "{achiever.citation}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredAchievers.length === 0 && (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
                <p className="text-sm font-bold text-slate-700">No achievers found matching your search.</p>
                <p className="text-xs text-slate-500">Try clearing filters or search terms.</p>
              </div>
            )}
          </div>

          {/* Right: Our Achievements Metric Counter Block (matches reference Results Page sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  INSTITUTE STATS
                </span>
                <h3 className="text-xl font-bold text-[#0f2942] font-heading">
                  Our Achievements
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-blue-950 font-heading">500+</h4>
                    <p className="text-xs font-semibold text-blue-700">Happy Students Enrolled</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-orange-50/70 border border-orange-100">
                  <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-orange-950 font-heading">100+</h4>
                    <p className="text-xs font-semibold text-orange-700">State & District Rankers</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Medal className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-emerald-950 font-heading">20+</h4>
                    <p className="text-xs font-semibold text-emerald-700">Competitions Won</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <div className="w-12 h-12 rounded-xl bg-purple-500 text-white flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-purple-950 font-heading">10+</h4>
                    <p className="text-xs font-semibold text-purple-700">Excellence Awards</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={() => openAdmissionModal()}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                >
                  Join Our Next Batch of Achievers →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
