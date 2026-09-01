// src/components/AdminPortal.tsx
import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Bell,
  Trophy,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { Admission, Inquiry, Notice, Achiever } from '../types.ts';

interface AdminPortalProps {
  setActiveTab: (tab: string) => void;
  onRefreshData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ setActiveTab, onRefreshData }) => {
  const { user, userProfile, signInWithGoogle, getIdToken } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'admissions' | 'inquiries' | 'add_notice' | 'add_achiever'>('admissions');

  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Notice form state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMarathiTitle, setNoticeMarathiTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'important' | 'exams' | 'events' | 'holidays' | 'general'>('important');
  const [noticeDate, setNoticeDate] = useState('30 May 2026');
  const [noticeContent, setNoticeContent] = useState('');

  // New Achiever form state
  const [achieverName, setAchieverName] = useState('');
  const [achieverRank, setAchieverRank] = useState('First Rank');
  const [achieverExam, setAchieverExam] = useState('Navodaya Entrance Exam (JNVST)');
  const [achieverScore, setAchieverScore] = useState('98.5%');
  const [achieverYear, setAchieverYear] = useState('2025-26');
  const [achieverPhoto, setAchieverPhoto] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [admRes, inqRes] = await Promise.all([
        fetch('/api/admissions'),
        fetch('/api/inquiries'),
      ]);
      if (admRes.ok) {
        const admData = await admRes.json();
        setAdmissions(admData);
      }
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiries(inqData);
      }
    } catch (err) {
      console.error('Failed to load portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateAdmissionStatus = async (id: number, status: Admission['status']) => {
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admissions/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setStatusMessage(`Application status updated to "${status.toUpperCase()}".`);
        fetchData();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;

    try {
      const token = await getIdToken();
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: noticeTitle,
          marathiTitle: noticeMarathiTitle,
          category: noticeCategory,
          publishDate: noticeDate,
          content: noticeContent,
          isNew: 1,
          priority: noticeCategory === 'important' ? 'high' : 'normal',
        }),
      });

      if (res.ok) {
        setStatusMessage('Notice published successfully to PostgreSQL database!');
        setNoticeTitle('');
        setNoticeMarathiTitle('');
        setNoticeContent('');
        onRefreshData();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAchiever = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achieverName || !achieverExam) return;

    try {
      const token = await getIdToken();
      const res = await fetch('/api/achievers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          studentName: achieverName,
          rank: achieverRank,
          examName: achieverExam,
          score: achieverScore,
          year: achieverYear,
          photoUrl: achieverPhoto,
        }),
      });

      if (res.ok) {
        setStatusMessage('New achiever saved to database successfully!');
        setAchieverName('');
        onRefreshData();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAdmissions = admissions.filter((adm) => {
    return (
      adm.studentName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      adm.applicationNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      adm.phone.includes(searchFilter) ||
      adm.course.toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  return (
    <div className="w-full space-y-8 pb-16">
      {/* Banner */}
      <section className="bg-[#0f2942] text-white py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-orange-400" />
              <h1 className="text-2xl sm:text-3xl font-black font-heading">
                Jagdamb Staff & Admin Portal
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Cloud SQL PostgreSQL Real-time Management Center
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Records</span>
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Back to Website
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        {statusMessage && (
          <div className="p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveSubTab('admissions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
              activeSubTab === 'admissions'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Online Admissions ({admissions.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
              activeSubTab === 'inquiries'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Inquiries ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('add_notice')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
              activeSubTab === 'add_notice'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Post New Notice</span>
          </button>

          <button
            onClick={() => setActiveSubTab('add_achiever')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
              activeSubTab === 'add_achiever'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Add Achiever</span>
          </button>
        </div>

        {/* 1. ADMISSIONS TAB */}
        {activeSubTab === 'admissions' && (
          <div className="space-y-4">
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search student, app number, phone..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Total Admissions Stored: <strong>{admissions.length}</strong>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3.5">App No</th>
                      <th className="px-4 py-3.5">Student & Parent</th>
                      <th className="px-4 py-3.5">Course & Grade</th>
                      <th className="px-4 py-3.5">Contact</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredAdmissions.map((adm) => (
                      <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-[#0f2942]">
                          {adm.applicationNumber}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900">{adm.studentName}</p>
                          <p className="text-[11px] text-slate-500">Parent: {adm.parentName}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-orange-600">{adm.course}</p>
                          <p className="text-[11px] text-slate-500">{adm.grade}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{adm.phone}</p>
                          <p className="text-[11px] text-slate-400">{adm.address}</p>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={adm.status}
                            onChange={(e) =>
                              handleUpdateAdmissionStatus(
                                adm.id,
                                e.target.value as Admission['status']
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-hidden ${
                              adm.status === 'enrolled'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : adm.status === 'approved'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : adm.status === 'under_review'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : 'bg-orange-50 text-orange-800 border-orange-200'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="under_review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="enrolled">Enrolled</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <a
                            href={`https://wa.me/91${adm.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                              adm.parentName
                            )}%2C%20regarding%20${encodeURIComponent(
                              adm.studentName
                            )}%20admission%20at%20Jagdamb%20Coaching%20Center...`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold inline-flex items-center gap-1"
                          >
                            WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. INQUIRIES TAB */}
        {activeSubTab === 'inquiries' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3.5">Name</th>
                    <th className="px-4 py-3.5">Contact</th>
                    <th className="px-4 py-3.5">Subject</th>
                    <th className="px-4 py-3.5">Message</th>
                    <th className="px-4 py-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-bold text-slate-900">{inq.fullName}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{inq.phone}</p>
                        <p className="text-[11px] text-slate-500">{inq.email}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-orange-600">{inq.subject}</td>
                      <td className="px-4 py-3 max-w-xs">{inq.message}</td>
                      <td className="px-4 py-3 text-slate-400">
                        {new Date(inq.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. POST NEW NOTICE TAB */}
        {activeSubTab === 'add_notice' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-2xl">
            <h3 className="text-lg font-bold text-[#0f2942] mb-4 font-heading">
              Publish Circular / Notice
            </h3>
            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notice Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Navodaya Entrance Mock Test 04 Schedule"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notice Title (Marathi Translation)
                </label>
                <input
                  type="text"
                  value={noticeMarathiTitle}
                  onChange={(e) => setNoticeMarathiTitle(e.target.value)}
                  placeholder="e.g. नवोदय प्रवेश पूर्व परीक्षा सराव पेपर ४ चे वेळापत्रक"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e: any) => setNoticeCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden"
                  >
                    <option value="important">Important</option>
                    <option value="exams">Exams</option>
                    <option value="events">Events</option>
                    <option value="holidays">Holidays</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Date
                  </label>
                  <input
                    type="text"
                    value={noticeDate}
                    onChange={(e) => setNoticeDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notice Content Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Full circular details, test timings, venue, instructions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Publish Notice to Database
              </button>
            </form>
          </div>
        )}

        {/* 4. ADD ACHIEVER TAB */}
        {activeSubTab === 'add_achiever' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-2xl">
            <h3 className="text-lg font-bold text-[#0f2942] mb-4 font-heading">
              Add New Ranker / Achiever
            </h3>
            <form onSubmit={handleCreateAchiever} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={achieverName}
                  onChange={(e) => setAchieverName(e.target.value)}
                  placeholder="e.g. Tanvi Deshmukh"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rank / Badge</label>
                  <input
                    type="text"
                    value={achieverRank}
                    onChange={(e) => setAchieverRank(e.target.value)}
                    placeholder="e.g. First Rank (तालुका प्रथम)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Score / Marks
                  </label>
                  <input
                    type="text"
                    value={achieverScore}
                    onChange={(e) => setAchieverScore(e.target.value)}
                    placeholder="e.g. 96.5% / 288/300"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Exam Title</label>
                  <input
                    type="text"
                    value={achieverExam}
                    onChange={(e) => setAchieverExam(e.target.value)}
                    placeholder="e.g. 4th Standard State Scholarship"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch Year</label>
                  <input
                    type="text"
                    value={achieverYear}
                    onChange={(e) => setAchieverYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Save Achiever to Records
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};
