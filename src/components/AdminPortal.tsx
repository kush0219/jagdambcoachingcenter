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
  AlertCircle,
  Image as ImageIcon,
  BookOpen,
  Download,
  Printer,
  ExternalLink,
  Lock,
  Key,
  LogOut,
  X,
  Filter,
  Phone,
  Mail,
  Check,
  Settings,
  Sparkles,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { Admission, Inquiry, Notice, Achiever, GalleryItem, Course } from '../types.ts';

interface AdminPortalProps {
  setActiveTab: (tab: string) => void;
  onRefreshData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ setActiveTab, onRefreshData }) => {
  const { user, isAdmin, adminSession, adminLogin, adminLogout, signInWithGoogle, getIdToken } = useAuth();
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('jagdamb@2026');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active sub-tab in admin panel
  const [activeSubTab, setActiveSubTab] = useState<'admissions' | 'gallery' | 'results' | 'notices' | 'courses' | 'inquiries' | 'settings'>('admissions');

  // Data states
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [achievers, setAchievers] = useState<Achiever[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Search & Filters
  const [admissionFilter, setAdmissionFilter] = useState<string>('all');
  const [admissionSearch, setAdmissionSearch] = useState<string>('');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('all');

  // Modals state
  const [viewingAdmission, setViewingAdmission] = useState<Admission | null>(null);
  const [editingAdmission, setEditingAdmission] = useState<Admission | null>(null);
  
  // Gallery Modals
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryItem | null>(null);
  const [photoForm, setPhotoForm] = useState({
    title: '',
    category: 'events' as GalleryItem['category'],
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    description: '',
    eventDate: 'May 2026',
  });

  // Achiever Modals
  const [achieverModalOpen, setAchieverModalOpen] = useState(false);
  const [editingAchiever, setEditingAchiever] = useState<Achiever | null>(null);
  const [achieverForm, setAchieverForm] = useState({
    studentName: '',
    marathiName: '',
    rank: '1st Rank',
    examName: 'Navodaya Entrance Exam (JNVST)',
    score: '98.5%',
    year: '2025-26',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    citation: 'Continuous practice and mentorship at Jagdamb made me excel in the exam.',
  });

  // Notice Modals
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    marathiTitle: '',
    category: 'important' as Notice['category'],
    publishDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    content: '',
    priority: 'high' as Notice['priority'],
  });

  // Course Modals
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    slug: '',
    title: '',
    marathiTitle: '',
    tagline: '',
    description: '',
    icon: 'abacus',
    ageGroup: '5 to 15 Years',
    batchSize: '15-20 Students',
    duration: '1 Year Program',
    classes: 'Mon, Wed, Fri (2 Hours/Day)',
    features: 'Level 1 to 8 Certified Curriculum\nSpeed Arithmetic Mastery\nVisual Memory Enhancement',
    curriculum: 'Introduction to Abacus tool\nAddition & Subtraction rules\nMental Math techniques',
  });

  // Sample photo presets for quick picking
  const photoPresets = [
    { label: 'Abacus Competition', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80' },
    { label: 'Prize Ceremony', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80' },
    { label: 'Classroom Session', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80' },
    { label: 'Annual Cultural Day', url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80' },
    { label: 'Science & Math Fair', url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80' },
  ];

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [admRes, inqRes, gallRes, achRes, notRes, crsRes] = await Promise.all([
        fetch('/api/admissions'),
        fetch('/api/inquiries'),
        fetch('/api/gallery'),
        fetch('/api/achievers'),
        fetch('/api/notices'),
        fetch('/api/courses'),
      ]);

      const safeJson = async (res: Response) => {
        if (!res.ok) return null;
        try {
          const text = await res.text();
          return JSON.parse(text);
        } catch {
          return null;
        }
      };

      const [admData, inqData, gallData, achData, notData, crsData] = await Promise.all([
        safeJson(admRes),
        safeJson(inqRes),
        safeJson(gallRes),
        safeJson(achRes),
        safeJson(notRes),
        safeJson(crsRes),
      ]);

      if (Array.isArray(admData)) setAdmissions(admData);
      if (Array.isArray(inqData)) setInquiries(inqData);
      if (Array.isArray(gallData)) setGalleryItems(gallData);
      if (Array.isArray(achData)) setAchievers(achData);
      if (Array.isArray(notData)) setNotices(notData);
      if (Array.isArray(crsData)) setCourses(crsData);
    } catch (err) {
      console.warn('Failed to load admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  // Handle Admin Passcode Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const result = await adminLogin(loginUsername, loginPassword);
      if (!result.success) {
        setLoginError(result.error || 'Authentication failed. Invalid administrator credentials.');
      } else {
        showToast('Welcome back, Administrator! Admin panel unlocked.');
        fetchAllData();
        onRefreshData();
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // --- ADMISSION ACTIONS ---
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
        showToast(`Application status successfully updated to "${status.toUpperCase()}".`);
        fetchAllData();
      } else {
        showToast('Failed to update admission status', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating status', 'error');
    }
  };

  const handleSaveAdmissionEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmission) return;
    try {
      const res = await fetch(`/api/admissions/${editingAdmission.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAdmission),
      });
      if (res.ok) {
        showToast('Admission details updated successfully!');
        setEditingAdmission(null);
        fetchAllData();
      } else {
        showToast('Failed to update admission', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving admission', 'error');
    }
  };

  const handleDeleteAdmission = async (id: number, studentName: string) => {
    if (!window.confirm(`Are you sure you want to delete the admission application for "${studentName}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admissions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Admission application for ${studentName} deleted.`);
        fetchAllData();
      } else {
        showToast('Failed to delete admission', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting admission', 'error');
    }
  };

  // --- GALLERY ACTIONS ---
  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title || !photoForm.imageUrl) {
      showToast('Please provide both title and image URL', 'error');
      return;
    }

    try {
      if (editingPhoto) {
        const res = await fetch(`/api/gallery/${editingPhoto.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(photoForm),
        });
        if (res.ok) {
          showToast('Gallery photo updated successfully!');
          setPhotoModalOpen(false);
          setEditingPhoto(null);
          fetchAllData();
          onRefreshData();
        }
      } else {
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(photoForm),
        });
        if (res.ok) {
          showToast('New photo added to the gallery successfully!');
          setPhotoModalOpen(false);
          setPhotoForm({
            title: '',
            category: 'events',
            imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
            description: '',
            eventDate: 'May 2026',
          });
          fetchAllData();
          onRefreshData();
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save gallery photo', 'error');
    }
  };

  const handleDeletePhoto = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete photo "${title}" from the gallery?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Photo "${title}" removed from gallery.`);
        fetchAllData();
        onRefreshData();
      } else {
        showToast('Failed to delete photo', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting photo', 'error');
    }
  };

  // --- RESULTS / ACHIEVER ACTIONS ---
  const handleSaveAchiever = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achieverForm.studentName || !achieverForm.rank || !achieverForm.examName) {
      showToast('Please fill student name, rank, and exam name', 'error');
      return;
    }

    try {
      if (editingAchiever) {
        const res = await fetch(`/api/achievers/${editingAchiever.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(achieverForm),
        });
        if (res.ok) {
          showToast('Achiever record updated successfully!');
          setAchieverModalOpen(false);
          setEditingAchiever(null);
          fetchAllData();
          onRefreshData();
        }
      } else {
        const res = await fetch('/api/achievers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(achieverForm),
        });
        if (res.ok) {
          showToast('New achiever added to the results section!');
          setAchieverModalOpen(false);
          setAchieverForm({
            studentName: '',
            marathiName: '',
            rank: '1st Rank',
            examName: 'Navodaya Entrance Exam (JNVST)',
            score: '98.5%',
            year: '2025-26',
            photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
            citation: 'Continuous practice and mentorship at Jagdamb made me excel in the exam.',
          });
          fetchAllData();
          onRefreshData();
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save achiever', 'error');
    }
  };

  const handleDeleteAchiever = async (id: number, studentName: string) => {
    if (!window.confirm(`Are you sure you want to delete achiever "${studentName}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/achievers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Achiever "${studentName}" deleted.`);
        fetchAllData();
        onRefreshData();
      } else {
        showToast('Failed to delete achiever', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting achiever', 'error');
    }
  };

  // --- NOTICE ACTIONS ---
  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.content) {
      showToast('Please provide notice title and content', 'error');
      return;
    }

    try {
      if (editingNotice) {
        const res = await fetch(`/api/notices/${editingNotice.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noticeForm),
        });
        if (res.ok) {
          showToast('Notice updated successfully!');
          setNoticeModalOpen(false);
          setEditingNotice(null);
          fetchAllData();
          onRefreshData();
        }
      } else {
        const res = await fetch('/api/notices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noticeForm),
        });
        if (res.ok) {
          showToast('New notice published successfully!');
          setNoticeModalOpen(false);
          setNoticeForm({
            title: '',
            marathiTitle: '',
            category: 'important',
            publishDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            content: '',
            priority: 'high',
          });
          fetchAllData();
          onRefreshData();
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save notice', 'error');
    }
  };

  const handleDeleteNotice = async (id: number, title: string) => {
    if (!window.confirm(`Delete circular/notice "${title}"?`)) return;
    try {
      const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Notice "${title}" deleted.`);
        fetchAllData();
        onRefreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete notice', 'error');
    }
  };

  // --- COURSE ACTIONS ---
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title || !courseForm.tagline || !courseForm.description) {
      showToast('Please fill all required course fields', 'error');
      return;
    }

    const payload = {
      ...courseForm,
      slug: courseForm.slug || courseForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      features: JSON.stringify(courseForm.features.split('\n').filter(Boolean)),
      curriculum: JSON.stringify(courseForm.curriculum.split('\n').filter(Boolean)),
    };

    try {
      if (editingCourse) {
        const res = await fetch(`/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast('Course curriculum & details updated!');
          setCourseModalOpen(false);
          setEditingCourse(null);
          fetchAllData();
          onRefreshData();
        }
      } else {
        const res = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast('New course added to syllabus!');
          setCourseModalOpen(false);
          fetchAllData();
          onRefreshData();
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save course', 'error');
    }
  };

  // --- INQUIRY ACTIONS ---
  const handleUpdateInquiryStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast(`Inquiry marked as ${status}.`);
        fetchAllData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating inquiry', 'error');
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Inquiry deleted.');
        fetchAllData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting inquiry', 'error');
    }
  };

  // Filter admissions
  const filteredAdmissions = admissions.filter((adm) => {
    const matchesFilter = admissionFilter === 'all' || adm.status === admissionFilter;
    const query = admissionSearch.toLowerCase();
    const matchesSearch =
      !query ||
      adm.studentName.toLowerCase().includes(query) ||
      adm.parentName.toLowerCase().includes(query) ||
      adm.applicationNumber.toLowerCase().includes(query) ||
      adm.phone.includes(query) ||
      adm.course.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  // Export admissions to CSV
  const exportToCSV = () => {
    if (admissions.length === 0) {
      showToast('No admissions data to export', 'error');
      return;
    }
    const headers = ['Application Number,Student Name,Parent Name,Phone,Email,Grade,Course,Status,Submitted Date'];
    const rows = admissions.map(a => 
      `"${a.applicationNumber}","${a.studentName}","${a.parentName}","${a.phone}","${a.email || ''}","${a.grade}","${a.course}","${a.status}","${new Date(a.createdAt).toLocaleDateString()}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jagdamb_admissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Admissions exported to CSV successfully!');
  };

  // -------------------------------------------------------------
  // 1. UNPROTECTED / LOGIN SCREEN (WHEN NOT LOGGED IN AS ADMIN)
  // -------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] bg-gradient-to-b from-slate-100 via-slate-50 to-orange-50/40 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
          {/* Lock Icon & Title */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-[#0f2942] to-orange-600 rounded-2xl text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7 text-orange-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0f2942] font-heading">
              Admin Portal Login
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Authorized coaching faculty & administrators only.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Admin Passcode Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin or kushbhusareiit@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Security Passcode / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
            >
              <Key className="w-4 h-4" />
              <span>{isLoggingIn ? 'Verifying Admin Access...' : 'Unlock Admin Portal'}</span>
            </button>
          </form>

          {/* Quick Auto-fill for convenience */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Admin credentials:</span>
            <button
              type="button"
              onClick={() => {
                setLoginUsername('admin');
                setLoginPassword('jagdamb@2026');
              }}
              className="text-orange-600 font-bold hover:underline"
            >
              Fill Default Admin (admin / jagdamb@2026)
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-slate-400 text-xs font-semibold uppercase">Or</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          {/* Google Sign In Option */}
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Authorized Google Account</span>
          </button>

          <div className="text-center pt-2">
            <button
              onClick={() => setActiveTab('home')}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. AUTHENTICATED ADMIN PORTAL
  // -------------------------------------------------------------
  const pendingCount = admissions.filter(a => a.status === 'pending').length;
  const enrolledCount = admissions.filter(a => a.status === 'enrolled').length;
  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16">
      {/* Top Admin Banner */}
      <div className="bg-[#0f2942] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold font-heading">
                  Jagdamb Coaching Admin Center
                </h1>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase rounded-md border border-emerald-500/30">
                  Live Admin
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Logged in as: <strong className="text-white">{adminSession?.displayName || user?.displayName || user?.email || 'Administrator'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchAllData();
                onRefreshData();
                showToast('Data refreshed successfully');
              }}
              disabled={loading}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setActiveTab('home')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public View</span>
            </button>

            <button
              onClick={() => {
                adminLogout();
                showToast('Admin session logged out.');
              }}
              className="px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Toast Alert */}
      {statusMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
          <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in ${
            statusMessage.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="p-1 hover:bg-white/20 rounded">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* KPI / Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Admissions</span>
              <Users className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{admissions.length}</p>
            <p className="text-[11px] text-amber-600 font-semibold">{pendingCount} Pending Action</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Enrolled</span>
              <GraduationCap className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{enrolledCount}</p>
            <p className="text-[11px] text-emerald-600 font-semibold">Active Students</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Gallery</span>
              <ImageIcon className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{galleryItems.length}</p>
            <p className="text-[11px] text-slate-500">Live Photos</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Achievers</span>
              <Trophy className="w-4 h-4 text-yellow-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{achievers.length}</p>
            <p className="text-[11px] text-slate-500">Rankers Showcase</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Notices</span>
              <Bell className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{notices.length}</p>
            <p className="text-[11px] text-slate-500">Circulars Active</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Inquiries</span>
              <MessageSquare className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{inquiries.length}</p>
            <p className="text-[11px] text-rose-600 font-semibold">{newInquiriesCount} New Messages</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-1.5 flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveSubTab('admissions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'admissions'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Admissions Track ({admissions.length})</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-white text-orange-600 rounded-full text-[10px] font-black">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'gallery'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery Photos ({galleryItems.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('results')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'results'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Results & Rankers ({achievers.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('notices')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'notices'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notices ({notices.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('courses')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'courses'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Courses & Batches ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('inquiries')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'inquiries'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: ADMISSIONS MANAGEMENT & TRACKING */}
        {/* ------------------------------------------------------------- */}
        {activeSubTab === 'admissions' && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden space-y-4 p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                  <span>Student Admission Applications</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                    {filteredAdmissions.length} of {admissions.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Review submitted forms, verify applicant details, approve or enroll candidates, and print application slips.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportToCSV}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Search & Status Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by student name, parent, phone, course or ref no..."
                  value={admissionSearch}
                  onChange={(e) => setAdmissionSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['all', 'pending', 'under_review', 'approved', 'enrolled', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setAdmissionFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap capitalize transition-colors ${
                      admissionFilter === status
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Admissions Table */}
            {filteredAdmissions.length === 0 ? (
              <div className="py-16 text-center text-slate-500 space-y-2">
                <Users className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-700">No applications found</p>
                <p className="text-xs text-slate-400">Try adjusting your search query or status filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Ref Number</th>
                      <th className="px-4 py-3">Student & Parent</th>
                      <th className="px-4 py-3">Course & Grade</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAdmissions.map((adm) => {
                      const getStatusBadge = (st: string) => {
                        switch (st) {
                          case 'enrolled':
                            return 'bg-emerald-100 text-emerald-800 border-emerald-200';
                          case 'approved':
                            return 'bg-blue-100 text-blue-800 border-blue-200';
                          case 'under_review':
                            return 'bg-purple-100 text-purple-800 border-purple-200';
                          case 'rejected':
                            return 'bg-red-100 text-red-800 border-red-200';
                          default:
                            return 'bg-amber-100 text-amber-800 border-amber-200';
                        }
                      };

                      return (
                        <tr key={adm.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                            {adm.applicationNumber}
                            <div className="text-[10px] text-slate-400 font-sans">
                              {new Date(adm.createdAt).toLocaleDateString('en-GB')}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-slate-900 text-sm">{adm.studentName}</p>
                            <p className="text-slate-500 text-[11px]">Parent: {adm.parentName}</p>
                            {adm.schoolName && (
                              <p className="text-slate-400 text-[10px] truncate max-w-[160px]">{adm.schoolName}</p>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-semibold text-orange-600">{adm.course}</p>
                            <p className="text-slate-500 text-[11px]">Class: {adm.grade}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${adm.phone}`}
                                className="font-semibold text-slate-800 hover:text-orange-600 flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{adm.phone}</span>
                              </a>
                              <a
                                href={`https://wa.me/91${adm.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Send WhatsApp Message"
                                className="w-5 h-5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-[10px]"
                              >
                                WA
                              </a>
                            </div>
                            {adm.email && (
                              <p className="text-slate-400 text-[10px] truncate max-w-[140px]">{adm.email}</p>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <select
                              value={adm.status}
                              onChange={(e) => handleUpdateAdmissionStatus(adm.id, e.target.value as Admission['status'])}
                              className={`px-2.5 py-1 rounded-md text-xs font-bold border cursor-pointer focus:outline-hidden ${getStatusBadge(
                                adm.status
                              )}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="under_review">Under Review</option>
                              <option value="approved">Approved</option>
                              <option value="enrolled">Enrolled</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="px-4 py-3.5 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => setViewingAdmission(adm)}
                              title="View & Print Application Details"
                              className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingAdmission({ ...adm })}
                              title="Edit Application Data"
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAdmission(adm.id, adm.studentName)}
                              title="Delete Application"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: GALLERY PHOTOS MANAGER */}
        {/* ------------------------------------------------------------- */}
        {activeSubTab === 'gallery' && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-orange-600" />
                  <span>Gallery Photos & Event Memories</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                    {galleryItems.length} photos
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Add new coaching event photos, update captions, or remove outdated pictures instantly.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingPhoto(null);
                  setPhotoForm({
                    title: '',
                    category: 'events',
                    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
                    description: '',
                    eventDate: 'May 2026',
                  });
                  setPhotoModalOpen(true);
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Photo</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-500">Category:</span>
              {['all', 'events', 'competitions', 'prize_distribution', 'classroom', 'annual_day'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGalleryCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    galleryCategoryFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems
                .filter(item => galleryCategoryFilter === 'all' || item.category === galleryCategoryFilter)
                .map((photo) => (
                  <div
                    key={photo.id}
                    className="group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-4/3 bg-slate-200 overflow-hidden">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold uppercase rounded">
                        {photo.category.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{photo.title}</h4>
                        {photo.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{photo.description}</p>
                        )}
                        {photo.eventDate && (
                          <p className="text-[11px] font-semibold text-orange-600 mt-1">📅 {photo.eventDate}</p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingPhoto(photo);
                            setPhotoForm({
                              title: photo.title,
                              category: photo.category,
                              imageUrl: photo.imageUrl,
                              description: photo.description || '',
                              eventDate: photo.eventDate || 'May 2026',
                            });
                            setPhotoModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo.id, photo.title)}
                          className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: RESULTS & ACHIEVERS MANAGER */}
        {/* ------------------------------------------------------------- */}
        {activeSubTab === 'results' && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Exam Achievers & Merit Rankers Section</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                    {achievers.length} Rankers
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Update student exam results, high scores, ranks, awards, and citation testimonials shown on the public results wall.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingAchiever(null);
                  setAchieverForm({
                    studentName: '',
                    marathiName: '',
                    rank: '1st Rank',
                    examName: 'Navodaya Entrance Exam (JNVST)',
                    score: '98.5%',
                    year: '2025-26',
                    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
                    citation: 'Continuous practice and mentorship at Jagdamb made me excel in the exam.',
                  });
                  setAchieverModalOpen(true);
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Achiever</span>
              </button>
            </div>

            {/* Achievers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievers.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-4.5 flex flex-col justify-between hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={ach.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
                      alt={ach.studentName}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-orange-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-black uppercase rounded-md border border-yellow-300">
                        🏆 {ach.rank}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm">{ach.studentName}</h4>
                      {ach.marathiName && (
                        <p className="text-xs text-slate-500 font-medium">{ach.marathiName}</p>
                      )}
                      <p className="text-xs font-bold text-orange-600">{ach.examName}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-semibold">Score / Marks:</span>
                      <span className="font-bold text-emerald-600">{ach.score || 'Selected'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-semibold">Academic Year:</span>
                      <span className="font-bold text-slate-900">{ach.year}</span>
                    </div>
                    {ach.citation && (
                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                        "{ach.citation}"
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingAchiever(ach);
                        setAchieverForm({
                          studentName: ach.studentName,
                          marathiName: ach.marathiName || '',
                          rank: ach.rank,
                          examName: ach.examName,
                          score: ach.score || '',
                          year: ach.year,
                          photoUrl: ach.photoUrl || '',
                          citation: ach.citation || '',
                        });
                        setAchieverModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteAchiever(ach.id, ach.studentName)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: NOTICES & CIRCULARS */}
        {/* ------------------------------------------------------------- */}
        {activeSubTab === 'notices' && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-600" />
                  <span>Notices & Exam Schedules</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                    {notices.length} Published
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Publish test dates, holiday notifications, and batch announcements directly to the public website.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingNotice(null);
                  setNoticeForm({
                    title: '',
                    marathiTitle: '',
                    category: 'important',
                    publishDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                    content: '',
                    priority: 'high',
                  });
                  setNoticeModalOpen(true);
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Notice</span>
              </button>
            </div>

            <div className="space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-slate-100/60 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-800 font-bold text-[10px] uppercase rounded">
                        {notice.category}
                      </span>
                      {notice.priority === 'high' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold text-[10px] uppercase rounded">
                          High Priority
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">📅 {notice.publishDate}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{notice.title}</h4>
                    {notice.marathiTitle && (
                      <p className="text-xs text-slate-600 font-medium">{notice.marathiTitle}</p>
                    )}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{notice.content}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingNotice(notice);
                        setNoticeForm({
                          title: notice.title,
                          marathiTitle: notice.marathiTitle || '',
                          category: notice.category,
                          publishDate: notice.publishDate,
                          content: notice.content,
                          priority: notice.priority,
                        });
                        setNoticeModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-blue-600 border border-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteNotice(notice.id, notice.title)}
                      className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: COURSES CATALOG MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeSubTab === 'courses' && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <span>Coaching Courses & Batches Syllabus</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Update program descriptions, batch timings, age brackets, and key curriculum features.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCourse(null);
                  setCourseForm({
                    slug: '',
                    title: '',
                    marathiTitle: '',
                    tagline: '',
                    description: '',
                    icon: 'abacus',
                    ageGroup: '5 to 15 Years',
                    batchSize: '15-20 Students',
                    duration: '1 Year Program',
                    classes: 'Mon, Wed, Fri (2 Hours/Day)',
                    features: 'Certified Faculty\nWeekly Mock Tests\nStudy Materials Included',
                    curriculum: 'Fundamental Concepts\nSpeed Training\nExamination Strategy',
                  });
                  setCourseModalOpen(true);
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Course</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((crs) => (
                <div key={crs.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold uppercase rounded">
                        {crs.slug}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{crs.ageGroup}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{crs.title}</h4>
                    {crs.marathiTitle && (
                      <p className="text-xs text-orange-600 font-medium">{crs.marathiTitle}</p>
                    )}
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">{crs.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Duration</span>
                      <span className="font-bold text-slate-800">{crs.duration}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Batch Size</span>
                      <span className="font-bold text-slate-800">{crs.batchSize}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingCourse(crs);
                        let featuresText = '';
                        let currText = '';
                        try {
                          const parsed = JSON.parse(crs.features);
                          featuresText = Array.isArray(parsed) ? parsed.join('\n') : crs.features;
                        } catch {
                          featuresText = crs.features;
                        }
                        try {
                          const parsed = JSON.parse(crs.curriculum);
                          currText = Array.isArray(parsed) ? parsed.join('\n') : crs.curriculum;
                        } catch {
                          currText = crs.curriculum;
                        }

                        setCourseForm({
                          slug: crs.slug,
                          title: crs.title,
                          marathiTitle: crs.marathiTitle || '',
                          tagline: crs.tagline,
                          description: crs.description,
                          icon: crs.icon,
                          ageGroup: crs.ageGroup,
                          batchSize: crs.batchSize,
                          duration: crs.duration,
                          classes: crs.classes,
                          features: featuresText,
                          curriculum: currText,
                        });
                        setCourseModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Syllabus & Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: CONTACT INQUIRIES */}
        {/* ------------------------------------------------------------- */}
        {activeSubTab === 'inquiries' && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 sm:p-6 space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-600" />
              <span>Website Parent & Student Inquiries</span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                {inquiries.length} Total
              </span>
            </h3>

            {inquiries.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs mt-2 font-medium">No contact form inquiries yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inq.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                          inq.status === 'contacted' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {inq.status}
                        </span>
                        <span className="text-[11px] text-slate-400">{new Date(inq.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{inq.fullName}</h4>
                      <p className="text-xs font-semibold text-orange-600">Subject: {inq.subject}</p>
                      <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/80">
                        "{inq.message}"
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
                      <a
                        href={`tel:${inq.phone}`}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/91${inq.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                      >
                        <span>WhatsApp</span>
                      </a>
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                      >
                        <option value="new">Mark as New</option>
                        <option value="contacted">Mark Contacted</option>
                        <option value="resolved">Mark Resolved</option>
                      </select>
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: VIEW & PRINT ADMISSION SLIP */}
      {/* ------------------------------------------------------------- */}
      {viewingAdmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-xs font-bold rounded-md uppercase font-mono">
                  {viewingAdmission.applicationNumber}
                </span>
                <h3 className="text-xl font-extrabold text-[#0f2942] font-heading mt-1">
                  Jagdamb Coaching Center - Admission Form
                </h3>
                <p className="text-xs text-slate-500">
                  Submitted on {new Date(viewingAdmission.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setViewingAdmission(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 uppercase font-bold text-[10px]">Student Full Name</span>
                <p className="text-sm font-bold text-slate-900">{viewingAdmission.studentName}</p>
              </div>
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 uppercase font-bold text-[10px]">Parent / Guardian Name</span>
                <p className="text-sm font-bold text-slate-900">{viewingAdmission.parentName}</p>
              </div>
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 uppercase font-bold text-[10px]">Applied Course</span>
                <p className="text-sm font-bold text-orange-600">{viewingAdmission.course}</p>
              </div>
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 uppercase font-bold text-[10px]">Current Class / Grade</span>
                <p className="text-sm font-bold text-slate-900">{viewingAdmission.grade}</p>
              </div>
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 uppercase font-bold text-[10px]">Phone Number</span>
                <p className="text-sm font-bold text-slate-900">{viewingAdmission.phone}</p>
              </div>
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 uppercase font-bold text-[10px]">WhatsApp Number</span>
                <p className="text-sm font-bold text-slate-900">{viewingAdmission.whatsapp || viewingAdmission.phone}</p>
              </div>
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 uppercase font-bold text-[10px]">Previous Exam Marks / Grade</span>
                <p className="text-sm font-bold text-slate-900">{viewingAdmission.previousScore || 'Not specified'}</p>
              </div>
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 uppercase font-bold text-[10px]">School Name</span>
                <p className="text-sm font-bold text-slate-900">{viewingAdmission.schoolName || 'Not specified'}</p>
              </div>
            </div>

            <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl text-xs">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Residential Address</span>
              <p className="text-xs font-semibold text-slate-800">{viewingAdmission.address}</p>
            </div>

            {viewingAdmission.notes && (
              <div className="space-y-1 bg-amber-50/70 border border-amber-200 p-3 rounded-xl text-xs">
                <span className="text-amber-800 uppercase font-bold text-[10px]">Student Goals & Notes</span>
                <p className="text-xs text-amber-900">{viewingAdmission.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status:</span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-orange-100 text-orange-800">
                  {viewingAdmission.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setViewingAdmission(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT ADMISSION APPLICATION */}
      {/* ------------------------------------------------------------- */}
      {editingAdmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Edit Admission Details</h3>
              <button onClick={() => setEditingAdmission(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdmissionEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={editingAdmission.studentName}
                    onChange={(e) => setEditingAdmission({ ...editingAdmission, studentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent Name</label>
                  <input
                    type="text"
                    required
                    value={editingAdmission.parentName}
                    onChange={(e) => setEditingAdmission({ ...editingAdmission, parentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editingAdmission.phone}
                    onChange={(e) => setEditingAdmission({ ...editingAdmission, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={editingAdmission.whatsapp || ''}
                    onChange={(e) => setEditingAdmission({ ...editingAdmission, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course</label>
                  <input
                    type="text"
                    required
                    value={editingAdmission.course}
                    onChange={(e) => setEditingAdmission({ ...editingAdmission, course: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade</label>
                  <input
                    type="text"
                    required
                    value={editingAdmission.grade}
                    onChange={(e) => setEditingAdmission({ ...editingAdmission, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  value={editingAdmission.address}
                  onChange={(e) => setEditingAdmission({ ...editingAdmission, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Batch Preference / Notes</label>
                <input
                  type="text"
                  value={editingAdmission.batchPreference || ''}
                  onChange={(e) => setEditingAdmission({ ...editingAdmission, batchPreference: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingAdmission(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT GALLERY PHOTO */}
      {/* ------------------------------------------------------------- */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingPhoto ? 'Edit Gallery Photo' : 'Add New Photo to Gallery'}
              </h3>
              <button onClick={() => setPhotoModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Photo Title / Caption</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Abacus Speed Champions 2026"
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={photoForm.category}
                    onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value as GalleryItem['category'] })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
                  >
                    <option value="events">Events & Workshops</option>
                    <option value="competitions">Competitions & Olympiads</option>
                    <option value="prize_distribution">Prize Distribution</option>
                    <option value="classroom">Classroom Sessions</option>
                    <option value="annual_day">Annual Gathering</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Event Date / Month</label>
                  <input
                    type="text"
                    placeholder="e.g. May 2026"
                    value={photoForm.eventDate}
                    onChange={(e) => setPhotoForm({ ...photoForm, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={photoForm.imageUrl}
                  onChange={(e) => setPhotoForm({ ...photoForm, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              {/* Sample Preset Buttons */}
              <div>
                <span className="block font-bold text-slate-500 text-[11px] mb-1.5">Or Pick High-Quality Preset:</span>
                <div className="flex flex-wrap gap-1.5">
                  {photoPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setPhotoForm({ ...photoForm, imageUrl: preset.url })}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-orange-100 hover:text-orange-800 rounded-lg text-[11px] font-semibold border transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Preview */}
              {photoForm.imageUrl && (
                <div className="aspect-16/9 bg-slate-100 rounded-xl overflow-hidden border">
                  <img
                    src={photoForm.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the ceremony, venue, or students..."
                  value={photoForm.description}
                  onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingPhoto ? 'Save Changes' : 'Add Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT RESULTS & ACHIEVER */}
      {/* ------------------------------------------------------------- */}
      {achieverModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {editingAchiever ? 'Edit Result / Achiever' : 'Add Top Achiever to Results Wall'}
              </h3>
              <button onClick={() => setAchieverModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAchiever} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Name (English)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swara Rajesh Patil"
                    value={achieverForm.studentName}
                    onChange={(e) => setAchieverForm({ ...achieverForm, studentName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Name (Marathi)</label>
                  <input
                    type="text"
                    placeholder="उदा. स्वरा राजेश पाटील"
                    value={achieverForm.marathiName}
                    onChange={(e) => setAchieverForm({ ...achieverForm, marathiName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rank / Distinction</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1st Rank (Taluka Level)"
                    value={achieverForm.rank}
                    onChange={(e) => setAchieverForm({ ...achieverForm, rank: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Navodaya Entrance Exam"
                    value={achieverForm.examName}
                    onChange={(e) => setAchieverForm({ ...achieverForm, examName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Score / Percentage / Marks</label>
                  <input
                    type="text"
                    placeholder="e.g. 98.75% / 288/300"
                    value={achieverForm.score}
                    onChange={(e) => setAchieverForm({ ...achieverForm, score: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2025-26"
                    value={achieverForm.year}
                    onChange={(e) => setAchieverForm({ ...achieverForm, year: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Photo URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={achieverForm.photoUrl}
                  onChange={(e) => setAchieverForm({ ...achieverForm, photoUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Citation / Testimonial Quote</label>
                <textarea
                  rows={2}
                  placeholder="Quote from student or parent about coaching experience..."
                  value={achieverForm.citation}
                  onChange={(e) => setAchieverForm({ ...achieverForm, citation: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setAchieverModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingAchiever ? 'Update Achiever' : 'Save Achiever'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT NOTICE */}
      {/* ------------------------------------------------------------- */}
      {noticeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {editingNotice ? 'Edit Notice' : 'Publish Circular Notice'}
              </h3>
              <button onClick={() => setNoticeModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Title (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navodaya Entrance Mock Test Schedule Announced"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Title (Marathi)</label>
                <input
                  type="text"
                  placeholder="उदा. नवोदय प्रवेश परीक्षा सराव वेळापत्रक जाहीर"
                  value={noticeForm.marathiTitle}
                  onChange={(e) => setNoticeForm({ ...noticeForm, marathiTitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={noticeForm.category}
                    onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value as Notice['category'] })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
                  >
                    <option value="important">Important Notification</option>
                    <option value="exams">Exam & Test Dates</option>
                    <option value="events">Events & Gathering</option>
                    <option value="holidays">Holiday Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={noticeForm.priority}
                    onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value as Notice['priority'] })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
                  >
                    <option value="high">High Priority</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide comprehensive details about the timetable, venue, rules, or instructions..."
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setNoticeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingNotice ? 'Update Notice' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT COURSE */}
      {/* ------------------------------------------------------------- */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {editingCourse ? 'Edit Course Details & Curriculum' : 'Add New Course'}
              </h3>
              <button onClick={() => setCourseModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jagdamb Proactive Abacus"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marathi Title</label>
                  <input
                    type="text"
                    placeholder="उदा. अबॅकस व वैदिक गणित"
                    value={courseForm.marathiTitle}
                    onChange={(e) => setCourseForm({ ...courseForm, marathiTitle: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 34 Formulas, Master Mental Arithmetic"
                  value={courseForm.tagline}
                  onChange={(e) => setCourseForm({ ...courseForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age Group</label>
                  <input
                    type="text"
                    value={courseForm.ageGroup}
                    onChange={(e) => setCourseForm({ ...courseForm, ageGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batch Size</label>
                  <input
                    type="text"
                    value={courseForm.batchSize}
                    onChange={(e) => setCourseForm({ ...courseForm, batchSize: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Description</label>
                <textarea
                  rows={2}
                  required
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Key Features (One per line)</label>
                <textarea
                  rows={3}
                  value={courseForm.features}
                  onChange={(e) => setCourseForm({ ...courseForm, features: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Curriculum Highlights (One per line)</label>
                <textarea
                  rows={3}
                  value={courseForm.curriculum}
                  onChange={(e) => setCourseForm({ ...courseForm, curriculum: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
