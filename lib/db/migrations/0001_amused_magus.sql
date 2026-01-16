ALTER TABLE "profiles" ALTER COLUMN "bio" SET DEFAULT 'other';--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "bio" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "startup_name" text DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "founder_name" text DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "industry" text DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "stage" text DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "musical_level";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "instruments";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "musical_styles";