CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"auth_uid" text NOT NULL,
	"auth_provider" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"verified" boolean NOT NULL,
	"last_login" timestamp,
	"no_of_logins" integer DEFAULT 0,
	"avatar" text,
	"background_photo" text,
	"bio" text,
	"total_followers" integer DEFAULT 0,
	"total_likes" integer DEFAULT 0,
	"total_subscribers" integer DEFAULT 0,
	CONSTRAINT "users_auth_uid_unique" UNIQUE("auth_uid"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_uid_idx" ON "users" USING btree ("auth_uid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_search_index" ON "users" USING gin (to_tsvector('english', "name");