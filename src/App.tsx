// src/App.tsx
import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { HomeView } from './components/HomeView.tsx';
import { AboutView } from './components/AboutView.tsx';
import { CoursesView } from './components/CoursesView.tsx';
import { ResultsView } from './components/ResultsView.tsx';
import { GalleryView } from './components/GalleryView.tsx';
import { NoticesView } from './components/NoticesView.tsx';
import { ContactView } from './components/ContactView.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { AdmissionModal } from './components/AdmissionModal.tsx';
import { TrackAdmissionModal } from './components/TrackAdmissionModal.tsx';
import { NoticeModal } from './components/NoticeModal.tsx';
import { CourseModal } from './components/CourseModal.tsx';
import { Course, Notice, Achiever, GalleryItem, Testimonial } from './types.ts';
import { Loader2 } from 'lucide-react';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [courses, setCourses] = useState<Course[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [achievers, setAchievers] = useState<Achiever[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);
  const [admissionSelectedCourse, setAdmissionSelectedCourse] = useState<string | undefined>(undefined);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedCourseModal, setSelectedCourseModal] = useState<Course | null>(null);

  const fetchAppData = async () => {
    try {
      const [coursesRes, noticesRes, achieversRes, galleryRes, testRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/notices'),
        fetch('/api/achievers'),
        fetch('/api/gallery'),
        fetch('/api/testimonials'),
      ]);

      if (coursesRes.ok) setCourses(await coursesRes.json());
      if (noticesRes.ok) setNotices(await noticesRes.json());
      if (achieversRes.ok) setAchievers(await achieversRes.json());
      if (galleryRes.ok) setGalleryItems(await galleryRes.json());
      if (testRes.ok) setTestimonials(await testRes.json());
    } catch (error) {
      console.error('Error loading coaching center data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppData();
  }, []);

  const openAdmissionModal = (courseName?: string) => {
    setAdmissionSelectedCourse(courseName);
    setAdmissionModalOpen(true);
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg animate-bounce">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-sm font-bold text-slate-700 font-heading">
          Loading Jagdamb Coaching Center...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAdmissionModal={openAdmissionModal}
        openTrackModal={() => setTrackModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            courses={courses}
            notices={notices}
            achievers={achievers}
            testimonials={testimonials}
            setActiveTab={setActiveTab}
            openAdmissionModal={openAdmissionModal}
            openNoticeModal={(notice) => setSelectedNotice(notice)}
            openCourseModal={(course) => setSelectedCourseModal(course)}
          />
        )}

        {activeTab === 'about' && (
          <AboutView
            setActiveTab={setActiveTab}
            openAdmissionModal={() => openAdmissionModal()}
          />
        )}

        {activeTab === 'courses' && (
          <CoursesView
            courses={courses}
            setActiveTab={setActiveTab}
            openAdmissionModal={openAdmissionModal}
          />
        )}

        {activeTab === 'results' && (
          <ResultsView
            achievers={achievers}
            setActiveTab={setActiveTab}
            openAdmissionModal={() => openAdmissionModal()}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryView
            galleryItems={galleryItems}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'notices' && (
          <NoticesView
            notices={notices}
            setActiveTab={setActiveTab}
            openNoticeModal={(notice) => setSelectedNotice(notice)}
          />
        )}

        {activeTab === 'contact' && (
          <ContactView setActiveTab={setActiveTab} />
        )}

        {activeTab === 'portal' && (
          <AdminPortal
            setActiveTab={setActiveTab}
            onRefreshData={fetchAppData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        openAdmissionModal={openAdmissionModal}
      />

      {/* Modals */}
      <AdmissionModal
        isOpen={admissionModalOpen}
        onClose={() => setAdmissionModalOpen(false)}
        initialCourse={admissionSelectedCourse}
      />

      <TrackAdmissionModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
      />

      <NoticeModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
      />

      <CourseModal
        course={selectedCourseModal}
        onClose={() => setSelectedCourseModal(null)}
        openAdmissionModal={openAdmissionModal}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
