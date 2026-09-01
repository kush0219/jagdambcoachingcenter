// src/types.ts

export interface Course {
  id: number;
  slug: string;
  title: string;
  marathiTitle?: string | null;
  tagline: string;
  description: string;
  icon: string;
  ageGroup: string;
  batchSize: string;
  duration: string;
  classes: string;
  features: string; // JSON parsed as string[]
  curriculum: string; // JSON parsed as string[]
  orderIndex: number;
  isPopular: number;
  createdAt: string;
}

export interface Notice {
  id: number;
  title: string;
  marathiTitle?: string | null;
  category: 'important' | 'exams' | 'events' | 'holidays' | 'general';
  publishDate: string;
  content: string;
  isNew: number;
  priority: 'high' | 'normal';
  attachmentUrl?: string | null;
  createdAt: string;
}

export interface Achiever {
  id: number;
  studentName: string;
  marathiName?: string | null;
  rank: string;
  examName: string;
  score?: string | null;
  year: string;
  photoUrl?: string | null;
  citation?: string | null;
  orderIndex: number;
  createdAt: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: 'events' | 'competitions' | 'prize_distribution' | 'classroom' | 'annual_day';
  imageUrl: string;
  description?: string | null;
  eventDate?: string | null;
  orderIndex: number;
  createdAt: string;
}

export interface Testimonial {
  id: number;
  parentName: string;
  studentName: string;
  course: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface Admission {
  id: number;
  applicationNumber: string;
  studentName: string;
  parentName: string;
  email?: string | null;
  phone: string;
  whatsapp?: string | null;
  grade: string;
  course: string;
  schoolName?: string | null;
  previousScore?: string | null;
  address: string;
  batchPreference?: string | null;
  notes?: string | null;
  status: 'pending' | 'under_review' | 'approved' | 'enrolled' | 'rejected';
  userUid?: string | null;
  createdAt: string;
}

export interface Inquiry {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface UserProfile {
  id: number;
  uid: string;
  email: string;
  displayName?: string | null;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  phone?: string | null;
  photoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}
