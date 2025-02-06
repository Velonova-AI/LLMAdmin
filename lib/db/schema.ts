import type { InferSelectModel } from 'drizzle-orm';
import {pgTable, varchar, timestamp, json, uuid, text, primaryKey, foreignKey, boolean, integer, real,} from 'drizzle-orm/pg-core';
// import { blockKinds } from '../blocks/server';


export const blockKinds = ['text', 'code', 'image', 'sheet'] as const;


export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable('Message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
  'Vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  'Document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('text', { enum: blockKinds }).notNull().default('text'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'Suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('documentId').notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: boolean('isResolved').notNull().default(false),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  }),
);

export type Suggestion = InferSelectModel<typeof suggestion>;


export const assistants = pgTable('assistants', {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    provider: text('provider', { enum: ['OpenAI', 'Anthropic'] }).notNull().default('OpenAI'),
    modelName: text('modelName').notNull(),
    type: text('type', { enum: ['text', 'image'] }).notNull(),
    systemPrompt: text('systemPrompt'),
    temperature: real('temperature').default(0.7),
    maxTokens: integer('maxTokens').default(2048),
    suggestions: json('suggestions'), // Changed from array to json
       apiKey: text('apiKey'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
    userId: uuid('userId')
        .notNull()
        .references(() => user.id),
});

export type Assistant = InferSelectModel<typeof assistants>;


// lib/db/enums.ts

export const ModelProvider = {
    OpenAI: 'OpenAI',
    Anthropic: 'Anthropic',
    Fireworks: 'Fireworks',
} as const;

export const ModelType = {
    Text: 'text',
    Image: 'image',
} as const;

export const ModelName = {
    GPT4Mini: 'gpt-4o-mini',
    GPT4: 'gpt-4o',
    Claude: 'claude-3-5-sonnet-20241022',
    DeepseekR1: 'accounts/fireworks/models/deepseek-r1',
    GPT4Turbo: 'gpt-4-turbo',
    DallE2: 'dall-e-2',
    DallE3: 'dall-e-3',
} as const;

export type ModelProvider = typeof ModelProvider[keyof typeof ModelProvider];
export type ModelType = typeof ModelType[keyof typeof ModelType];
export type ModelName = typeof ModelName[keyof typeof ModelName];
