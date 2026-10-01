import { getDb } from './index.ts';
import { users, candidateApplications, clientInquiries } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name?: string) {
  try {
    const db = getDb();
    const result = await db.insert(users)
      .values({
        uid,
        email,
        name: name || '',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(name ? { name } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Database user upsert failed:", error);
    throw new Error("Database user operation failed.", { cause: error });
  }
}

export async function saveCandidateApplication(data: {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  linkedinUrl?: string;
  experienceYears?: number;
  coverLetter?: string;
}) {
  try {
    const db = getDb();
    const result = await db.insert(candidateApplications)
      .values(data)
      .returning();
    return result[0];
  } catch (error) {
    console.error("Failed to save candidate application:", error);
    throw new Error("Failed to save candidate application.", { cause: error });
  }
}

export async function getCandidateApplications() {
  try {
    const db = getDb();
    return await db.select().from(candidateApplications).orderBy(desc(candidateApplications.submittedAt));
  } catch (error) {
    console.error("Failed to query candidate applications:", error);
    throw new Error("Failed to query candidate applications.", { cause: error });
  }
}

export async function saveClientInquiry(data: {
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  serviceId: string;
  projectBrief: string;
}) {
  try {
    const db = getDb();
    const result = await db.insert(clientInquiries)
      .values(data)
      .returning();
    return result[0];
  } catch (error) {
    console.error("Failed to save client inquiry:", error);
    throw new Error("Failed to save client inquiry.", { cause: error });
  }
}

export async function getClientInquiries() {
  try {
    const db = getDb();
    return await db.select().from(clientInquiries).orderBy(desc(clientInquiries.createdAt));
  } catch (error) {
    console.error("Failed to query client inquiries:", error);
    throw new Error("Failed to query client inquiries.", { cause: error });
  }
}
