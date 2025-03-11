CREATE TABLE "assistant2" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"assistant_type" text NOT NULL,
	"provider" text NOT NULL,
	"api_key" text NOT NULL,
	"model_name" text NOT NULL,
	"system_prompt" text NOT NULL,
	"suggestions" text,
	"temperature" real NOT NULL,
	"max_tokens" integer NOT NULL,
	"created_at" text DEFAULT '2025-03-10T16:21:23.231Z' NOT NULL,
	"updated_at" text DEFAULT '2025-03-10T16:21:23.232Z' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"department" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "surveyResponses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"country" varchar(100) NOT NULL,
	"startup_name" varchar(255) NOT NULL,
	"challenges" json NOT NULL,
	"other_challenge" text,
	"has_used_ai" boolean NOT NULL,
	"current_solution_name" text,
	"solutions" json,
	"other_solution" text,
	"unsatisfactory_solutions" json,
	"other_unsatisfactory_solution" text,
	"feature_expectations" text NOT NULL,
	"likelihood_to_pay" integer NOT NULL,
	"price_range" varchar(50) NOT NULL,
	"other_price_range" text,
	"additional_insights" text,
	"follow_up_interview" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "consent" boolean DEFAULT false NOT NULL;