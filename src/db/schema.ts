import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (links with Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').notNull().default('student'), // 'admin' | 'teacher' | 'student' | 'parent'
  phone: text('phone'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Admissions / Enrollments
export const admissions = pgTable('admissions', {
  id: serial('id').primaryKey(),
  applicationNumber: text('application_number').notNull().unique(),
  studentName: text('student_name').notNull(),
  parentName: text('parent_name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  whatsapp: text('whatsapp'),
  grade: text('grade').notNull(),
  course: text('course').notNull(),
  schoolName: text('school_name'),
  previousScore: text('previous_score'),
  address: text('address').notNull(),
  batchPreference: text('batch_preference').default('Morning Batch (8:00 AM - 10:00 AM)'),
  notes: text('notes'),
  status: text('status').notNull().default('pending'), // 'pending' | 'approved' | 'enrolled' | 'rejected'
  userUid: text('user_uid'), // optional link to registered user
  createdAt: timestamp('created_at').defaultNow(),
});

// Contact / Inquiry Submissions
export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'), // 'new' | 'contacted' | 'resolved'
  createdAt: timestamp('created_at').defaultNow(),
});

// Courses Information
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  marathiTitle: text('marathi_title'),
  tagline: text('tagline').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(), // 'abacus' | 'target' | 'award' | 'brain' | 'calculator' | 'book'
  ageGroup: text('age_group').notNull(),
  batchSize: text('batch_size').notNull(),
  duration: text('duration').notNull(),
  classes: text('classes').notNull(),
  features: text('features').notNull(), // JSON string
  curriculum: text('curriculum').notNull(), // JSON string
  orderIndex: integer('order_index').default(0),
  isPopular: integer('is_popular').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});

// Notices & Circulars
export const notices = pgTable('notices', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  marathiTitle: text('marathi_title'),
  category: text('category').notNull(), // 'important' | 'exams' | 'events' | 'holidays'
  publishDate: text('publish_date').notNull(),
  content: text('content').notNull(),
  isNew: integer('is_new').default(1),
  priority: text('priority').default('normal'),
  attachmentUrl: text('attachment_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Results & Achievers
export const achievers = pgTable('achievers', {
  id: serial('id').primaryKey(),
  studentName: text('student_name').notNull(),
  marathiName: text('marathi_name'),
  rank: text('rank').notNull(),
  examName: text('exam_name').notNull(),
  score: text('score'),
  year: text('year').notNull(),
  photoUrl: text('photo_url'),
  citation: text('citation'),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Gallery Items
export const galleryItems = pgTable('gallery_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(), // 'events' | 'competitions' | 'prize_distribution' | 'classroom' | 'annual_day'
  imageUrl: text('image_url').notNull(),
  description: text('description'),
  eventDate: text('event_date'),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Testimonials & Reviews
export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  parentName: text('parent_name').notNull(),
  studentName: text('student_name').notNull(),
  course: text('course').notNull(),
  rating: integer('rating').default(5),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  admissions: many(admissions),
}));

export const admissionsRelations = relations(admissions, ({ one }) => ({
  user: one(users, {
    fields: [admissions.userUid],
    references: [users.uid],
  }),
}));
