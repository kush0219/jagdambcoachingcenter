// src/db/admissions.ts
import { db } from './index.ts';
import { admissions } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export interface CreateAdmissionInput {
  studentName: string;
  parentName: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  grade: string;
  course: string;
  schoolName?: string;
  previousScore?: string;
  address: string;
  batchPreference?: string;
  notes?: string;
  userUid?: string;
}

export async function createAdmission(data: CreateAdmissionInput) {
  try {
    const timestamp = Date.now().toString().slice(-4);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const applicationNumber = `JCC-2026-${timestamp}${randomSuffix}`;

    const inserted = await db.insert(admissions).values({
      applicationNumber,
      studentName: data.studentName,
      parentName: data.parentName,
      email: data.email || '',
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      grade: data.grade,
      course: data.course,
      schoolName: data.schoolName || '',
      previousScore: data.previousScore || '',
      address: data.address,
      batchPreference: data.batchPreference || 'Morning Batch (8:00 AM - 10:00 AM)',
      notes: data.notes || '',
      status: 'pending',
      userUid: data.userUid || null,
    }).returning();

    return inserted[0];
  } catch (error) {
    console.error('Failed to create admission application:', error);
    throw new Error('Failed to submit admission application', { cause: error });
  }
}

export async function getAdmissionByAppNumber(appNumber: string) {
  try {
    const trimmed = appNumber.trim().toUpperCase();
    const result = await db.select().from(admissions).where(eq(admissions.applicationNumber, trimmed)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Failed to get admission by application number:', error);
    throw new Error('Failed to track application', { cause: error });
  }
}

export async function getAdmissionsByUser(userUid: string) {
  try {
    return await db.select().from(admissions).where(eq(admissions.userUid, userUid)).orderBy(desc(admissions.id));
  } catch (error) {
    console.error('Failed to get user admissions:', error);
    throw new Error('Failed to fetch admissions history', { cause: error });
  }
}

export async function getAllAdmissions() {
  try {
    return await db.select().from(admissions).orderBy(desc(admissions.id));
  } catch (error) {
    console.error('Failed to get all admissions:', error);
    throw new Error('Failed to fetch admissions list', { cause: error });
  }
}

export async function updateAdmissionStatus(id: number, status: string) {
  try {
    const updated = await db.update(admissions)
      .set({ status })
      .where(eq(admissions.id, id))
      .returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update admission status:', error);
    throw new Error('Failed to update admission status', { cause: error });
  }
}
