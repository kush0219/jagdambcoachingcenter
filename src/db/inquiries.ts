// src/db/inquiries.ts
import { db } from './index.ts';
import { inquiries } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export interface CreateInquiryInput {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export async function createInquiry(data: CreateInquiryInput) {
  try {
    const inserted = await db.insert(inquiries).values({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      status: 'new',
    }).returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to submit contact inquiry:', error);
    throw new Error('Failed to submit contact message', { cause: error });
  }
}

export async function getAllInquiries() {
  try {
    return await db.select().from(inquiries).orderBy(desc(inquiries.id));
  } catch (error) {
    console.error('Failed to get inquiries:', error);
    throw new Error('Failed to fetch inquiries', { cause: error });
  }
}

export async function updateInquiryStatus(id: number, status: string) {
  try {
    const updated = await db.update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, id))
      .returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update inquiry status:', error);
    throw new Error('Failed to update inquiry status', { cause: error });
  }
}

export async function deleteInquiry(id: number) {
  try {
    return await db.delete(inquiries).where(eq(inquiries.id, id)).returning();
  } catch (error) {
    console.error('Failed to delete inquiry:', error);
    throw new Error('Failed to delete inquiry', { cause: error });
  }
}
