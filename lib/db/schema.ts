import type { InferSelectModel } from 'drizzle-orm';
import {
    pgTable,
    varchar,
    timestamp,
    json,
    uuid,
    text,
    primaryKey,
    foreignKey,
    boolean,
    integer,
    real,
    pgEnum, jsonb, vector, index,

} from 'drizzle-orm/pg-core';




export const embeddings = pgTable(
    'embeddings',
    {
      id: uuid('id').primaryKey().notNull().defaultRandom(),
        assistantsTable: uuid('assistantId')
            .notNull()
            .references(() => assistantsTable.id),
        content: text('content').notNull(),
        embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    },
    table => ({
        embeddingIndex: index('embeddingIndex').using(
            'hnsw',
            table.embedding.op('vector_cosine_ops'),
        ),
    }),
);

export const blockKinds = ['text', 'code', 'image', 'sheet'] as const;




export const surveyResponses = pgTable("surveyResponses", {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    // General Information
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    startupName: varchar("startup_name", { length: 255 }).notNull(),

    // Content Generation Challenges
    challenges: json("challenges").notNull(),
    otherChallenge: text("other_challenge"),

    // Generative AI
    hasUsedAi: boolean("has_used_ai").notNull(),
    currentSolutionName: text("current_solution_name"),
    solutions: json("solutions"),
    otherSolution: text("other_solution"),

    // Satisfaction Gaps
    unsatisfactorySolutions: json("unsatisfactory_solutions"),
    otherUnsatisfactorySolution: text("other_unsatisfactory_solution"),

    // Feature Expectations
    featureExpectations: text("feature_expectations").notNull(),

    // Willingness to Pay
    likelihoodToPay: integer("likelihood_to_pay").notNull(),
    priceRange: varchar("price_range", { length: 50 }).notNull(),
    otherPriceRange: text("other_price_range"),

    // Additional Insights
    additionalInsights: text("additional_insights"),

    // Contact Information
    followUpInterview: boolean("follow_up_interview").notNull().default(false),

    // Metadata
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
})








export const contacts = pgTable("contacts", {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    email: text("email").notNull(),
    department: text("department").notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
})



//dashboard
export const feedbacks = pgTable("feedbacks", {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    willBuy: boolean("will_buy"),
    price: integer("price"),
    userId: uuid('userId')
        .notNull()
        .references(() => user.id),
});

export type Feedback = InferSelectModel<typeof feedbacks>;


// Enum for billing cycle
export const billingCycleEnum = pgEnum("billing_cycle", ["monthly", "yearly"])



// Subscriptions table with complete plan information //add reference
export const subscriptions = pgTable("subscriptions", {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    userId: text("user_id").notNull(),

    // Plan details stored directly in subscription
    planName: text("plan_name").notNull(),
    planDescription: text("plan_description").notNull(),
    numberOfAssistants: integer("number_of_assistants").notNull(),
    numberOfTemplates: integer("number_of_templates").notNull(),
    features: text("features").array().notNull(),

    // Billing details
    billingCycle: billingCycleEnum("billing_cycle").notNull(),
    currentPrice: integer("current_price").notNull(), // Store in cents

    // Subscription status
    startDate: timestamp("start_date").defaultNow(),
    endDate: timestamp("end_date"),
    isActive: boolean("is_active").default(true),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
})

// Types
export type NewSubscription = typeof subscriptions.$inferInsert
export type Subscription = typeof subscriptions.$inferSelect







export const assistantsTable = pgTable("assistants2", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    provider: varchar("provider", { length: 100 }).notNull(),
    modelName: varchar("model_name", { length: 100 }).notNull(),
    systemPrompt: text("system_prompt").notNull(),
    suggestions: json("suggestions").$type<string[]>().default([]),
    temperature: real("temperature").notNull().default(0.7),
    maxTokens: integer("max_tokens").notNull().default(2048),
    ragEnabled: boolean("rag_enabled").notNull().default(false),
    files: json("files").$type<string[]>().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    apiKey: text("apiKey").notNull(),
    userId: uuid('userId')
        .notNull()
        .references(() => user.id),
})



export type Assistant = typeof assistantsTable.$inferSelect
export type NewAssistant = typeof assistantsTable.$inferInsert





export const ModelProvider = {
    OpenAI: 'OpenAI',
    Anthropic: 'Anthropic',

} as const;

export const ModelType = {
    Text: 'text',
    Image: 'image',
} as const;

export const ModelName = {
    GPT4Mini: 'gpt-4o-mini',
    GPT4: 'gpt-4o',
    Claude: 'claude-3-5-sonnet-20241022',

    GPT4Turbo: 'gpt-4-turbo',
    DallE2: 'dall-e-2',
    DallE3: 'dall-e-3',
} as const;

export type ModelProvider = typeof ModelProvider[keyof typeof ModelProvider];
export type ModelType = typeof ModelType[keyof typeof ModelType];
export type ModelName = typeof ModelName[keyof typeof ModelName];


//dashbaord end

export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }),
   consent: boolean("consent").notNull().default(false),
    name: varchar('name', { length: 64 }).notNull(),
    lname: varchar('lname', { length: 64 }).notNull(),


});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
    assistantId: uuid("assistantId")
        .notNull()
        .references(() => assistantsTable.id),
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


