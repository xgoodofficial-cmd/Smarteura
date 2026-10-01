import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table authenticated via Firebase Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Candidate Job Applications
export const candidateApplications = pgTable('candidate_applications', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  position: text('position').notNull(),
  linkedinUrl: text('linkedin_url'),
  experienceYears: integer('experience_years').default(0),
  coverLetter: text('cover_letter'),
  status: text('status').default('new').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow(),
});

// Client Inquiries
export const clientInquiries = pgTable('client_inquiries', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  company: text('company'),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  serviceId: text('service_id').notNull(),
  projectBrief: text('project_brief').notNull(),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, () => ({}));
