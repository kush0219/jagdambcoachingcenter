// src/db/portal.ts
import { db } from './index.ts';
import { courses, notices, achievers, galleryItems, testimonials } from './schema.ts';
import { desc, eq, asc } from 'drizzle-orm';

export async function getCourses() {
  try {
    return await db.select().from(courses).orderBy(asc(courses.orderIndex));
  } catch (error) {
    console.error('Failed to get courses:', error);
    throw new Error('Failed to fetch courses', { cause: error });
  }
}

export async function getCourseBySlug(slug: string) {
  try {
    const result = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Failed to get course by slug:', error);
    throw new Error('Failed to fetch course details', { cause: error });
  }
}

export async function getNotices(category?: string) {
  try {
    if (category && category !== 'all') {
      return await db.select().from(notices).where(eq(notices.category, category)).orderBy(desc(notices.id));
    }
    return await db.select().from(notices).orderBy(desc(notices.id));
  } catch (error) {
    console.error('Failed to get notices:', error);
    throw new Error('Failed to fetch notices', { cause: error });
  }
}

export async function createNotice(data: {
  title: string;
  marathiTitle?: string;
  category: string;
  publishDate: string;
  content: string;
  isNew?: number;
  priority?: string;
}) {
  try {
    const inserted = await db.insert(notices).values({
      title: data.title,
      marathiTitle: data.marathiTitle || '',
      category: data.category,
      publishDate: data.publishDate,
      content: data.content,
      isNew: data.isNew ?? 1,
      priority: data.priority || 'normal',
    }).returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to create notice:', error);
    throw new Error('Failed to create notice', { cause: error });
  }
}

export async function deleteNotice(id: number) {
  try {
    return await db.delete(notices).where(eq(notices.id, id)).returning();
  } catch (error) {
    console.error('Failed to delete notice:', error);
    throw new Error('Failed to delete notice', { cause: error });
  }
}

export async function getAchievers() {
  try {
    return await db.select().from(achievers).orderBy(asc(achievers.orderIndex));
  } catch (error) {
    console.error('Failed to get achievers:', error);
    throw new Error('Failed to fetch achievers', { cause: error });
  }
}

export async function createAchiever(data: {
  studentName: string;
  marathiName?: string;
  rank: string;
  examName: string;
  score?: string;
  year: string;
  photoUrl?: string;
  citation?: string;
}) {
  try {
    const inserted = await db.insert(achievers).values(data).returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to create achiever:', error);
    throw new Error('Failed to create achiever', { cause: error });
  }
}

export async function getGalleryItems(category?: string) {
  try {
    if (category && category !== 'all') {
      return await db.select().from(galleryItems).where(eq(galleryItems.category, category)).orderBy(asc(galleryItems.orderIndex));
    }
    return await db.select().from(galleryItems).orderBy(asc(galleryItems.orderIndex));
  } catch (error) {
    console.error('Failed to get gallery items:', error);
    throw new Error('Failed to fetch gallery items', { cause: error });
  }
}

export async function getTestimonials() {
  try {
    return await db.select().from(testimonials).orderBy(desc(testimonials.id));
  } catch (error) {
    console.error('Failed to get testimonials:', error);
    throw new Error('Failed to fetch testimonials', { cause: error });
  }
}
