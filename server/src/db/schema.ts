import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Define role enum
export const roleEnum = pgEnum('role', ['admin', 'doctor', 'cashier']);

// Users table
export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  role: roleEnum('role').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// TypeScript types for the table schema
export type User = typeof usersTable.$inferSelect; // For SELECT operations
export type NewUser = typeof usersTable.$inferInsert; // For INSERT operations

// Important: Export all tables and relations for proper query building
export const tables = { 
  users: usersTable 
};