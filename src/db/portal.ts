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

export async function updateNotice(id: number, data: Partial<{
  title: string;
  marathiTitle: string;
  category: string;
  publishDate: string;
  content: string;
  isNew: number;
  priority: string;
  attachmentUrl: string;
}>) {
  try {
    const updated = await db.update(notices).set(data).where(eq(notices.id, id)).returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update notice:', error);
    throw new Error('Failed to update notice', { cause: error });
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
  orderIndex?: number;
}) {
  try {
    const inserted = await db.insert(achievers).values(data).returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to create achiever:', error);
    throw new Error('Failed to create achiever', { cause: error });
  }
}

export async function updateAchiever(id: number, data: Partial<{
  studentName: string;
  marathiName: string;
  rank: string;
  examName: string;
  score: string;
  year: string;
  photoUrl: string;
  citation: string;
  orderIndex: number;
}>) {
  try {
    const updated = await db.update(achievers).set(data).where(eq(achievers.id, id)).returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update achiever:', error);
    throw new Error('Failed to update achiever', { cause: error });
  }
}

export async function deleteAchiever(id: number) {
  try {
    return await db.delete(achievers).where(eq(achievers.id, id)).returning();
  } catch (error) {
    console.error('Failed to delete achiever:', error);
    throw new Error('Failed to delete achiever', { cause: error });
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

export async function createGalleryItem(data: {
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  eventDate?: string;
  orderIndex?: number;
}) {
  try {
    const inserted = await db.insert(galleryItems).values(data).returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to create gallery item:', error);
    throw new Error('Failed to create gallery item', { cause: error });
  }
}

export async function updateGalleryItem(id: number, data: Partial<{
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  eventDate: string;
  orderIndex: number;
}>) {
  try {
    const updated = await db.update(galleryItems).set(data).where(eq(galleryItems.id, id)).returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update gallery item:', error);
    throw new Error('Failed to update gallery item', { cause: error });
  }
}

export async function deleteGalleryItem(id: number) {
  try {
    return await db.delete(galleryItems).where(eq(galleryItems.id, id)).returning();
  } catch (error) {
    console.error('Failed to delete gallery item:', error);
    throw new Error('Failed to delete gallery item', { cause: error });
  }
}

export async function updateCourse(id: number, data: Partial<{
  title: string;
  marathiTitle: string;
  tagline: string;
  description: string;
  icon: string;
  ageGroup: string;
  batchSize: string;
  duration: string;
  classes: string;
  features: string;
  curriculum: string;
  orderIndex: number;
  isPopular: number;
}>) {
  try {
    const updated = await db.update(courses).set(data).where(eq(courses.id, id)).returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update course:', error);
    throw new Error('Failed to update course', { cause: error });
  }
}

export async function createCourse(data: {
  slug: string;
  title: string;
  marathiTitle?: string;
  tagline: string;
  description: string;
  icon: string;
  ageGroup: string;
  batchSize: string;
  duration: string;
  classes: string;
  features: string;
  curriculum: string;
  orderIndex?: number;
  isPopular?: number;
}) {
  try {
    const inserted = await db.insert(courses).values(data).returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to create course:', error);
    throw new Error('Failed to create course', { cause: error });
  }
}

export async function deleteCourse(id: number) {
  try {
    return await db.delete(courses).where(eq(courses.id, id)).returning();
  } catch (error) {
    console.error('Failed to delete course:', error);
    throw new Error('Failed to delete course', { cause: error });
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
