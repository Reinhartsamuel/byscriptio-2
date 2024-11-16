ALTER TABLE "users" ADD COLUMN "external_customer_id" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "total_followers";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "total_likes";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "total_subscribers";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_external_customer_id_unique" UNIQUE("external_customer_id");