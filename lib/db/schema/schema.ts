import type { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,

  boolean,
  // Add this import
  integer,
  jsonb, 
  // Add this import
} from 'drizzle-orm/pg-core';


// export const bruxelles = pgSchema("bruxelles");

// Profiles table that references Supabase auth.users
// Profiles table reference (exists in public schema, not defined here)
// Using pgTable() defaults to public schema - Drizzle doesn't allow explicit 'public' schema
// This is a minimal definition for type reference only
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull(), // References auth.users.id
  firstName: text('first_name'),
  surname: text('surname'),
  email: text('email').unique().notNull(),
  startupName: text('startup_name').default('other').notNull(),
  founderName: text('founder_name').default('other').notNull(),
  industry: text('industry').default('other').notNull(),
  stage: text('stage').default('other').notNull(),
  
  bio: text('bio').default('other').notNull(),
  profilePhotoUrl: text('profile_photo_url'),

 
  website: text('website'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  subscriptionStatus: text('subscription_status'),
  planName: text('plan_name'),
  billingCycle: text('billing_cycle'),
  amountTotal: integer('amount_total'),
  currency: text('currency'),
  subscriptionMetadata: jsonb('subscription_metadata'),
  role: varchar('role', { enum: ['regular', 'guest'] }).notNull().default('regular'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Profiles = InferSelectModel<typeof profiles>;


export const assistants = pgTable('assistants', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull().unique(),
  provider: text('provider').notNull(),
  modelName: text('model_name').notNull(),
  systemPrompt: text('system_prompt').notNull(),
  suggestions: json('suggestions').notNull().default([]),
  temperature: text('temperature').notNull().default('0.7'),
  maxTokens: text('max_tokens').notNull().default('4000'),
  memoryLimit: integer('memory_limit').notNull().default(10),
  ragEnabled: boolean('rag_enabled').notNull().default(false),
  files: json('files').notNull().default([]),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  apiKey: text('api_key'),
  // Add greeting fields
  greetingTitle: text('greeting_title').default('Hello there!'),
  greetingSubtitle: text('greeting_subtitle').default(
    'How can I help you today?',
  ),
});

