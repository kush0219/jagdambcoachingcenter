// src/db/users.ts
import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export interface UserInput {
  uid: string;
  email: string;
  displayName?: string | null;
  photoUrl?: string | null;
  phone?: string | null;
  role?: string;
}

export async function getOrCreateUser(userData: UserInput) {
  try {
    const existing = await db.select().from(users).where(eq(users.uid, userData.uid)).limit(1);
    
    if (existing.length > 0) {
      const updated = await db.update(users)
        .set({
          email: userData.email,
          displayName: userData.displayName || existing[0].displayName,
          photoUrl: userData.photoUrl || existing[0].photoUrl,
          phone: userData.phone || existing[0].phone,
          updatedAt: new Date(),
        })
        .where(eq(users.uid, userData.uid))
        .returning();
      return updated[0];
    }

    const inserted = await db.insert(users)
      .values({
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName || '',
        photoUrl: userData.photoUrl || '',
        phone: userData.phone || '',
        role: userData.role || 'student',
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Database getOrCreateUser failed:', error);
    throw new Error('Failed to synchronize user profile', { cause: error });
  }
}

export async function getUserByUid(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Database getUserByUid failed:', error);
    throw new Error('Failed to fetch user profile', { cause: error });
  }
}
