-- Accounts on @bitbaum/accountkit, beside the product's own tables.
-- Re-runnable from top to bottom: IF NOT EXISTS on every table and index,
-- constraints that already exist are skipped, and the import below inserts
-- only what is missing. Applied by loki's apply-schema.sh on deploy, in one
-- transaction; scripts/db/rehearse-accountkit.sh runs it twice in CI.
CREATE TABLE IF NOT EXISTS "auth_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_passkeys" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"public_key" text NOT NULL,
	"user_id" text NOT NULL,
	"credential_id" text NOT NULL,
	"counter" integer NOT NULL,
	"device_type" text NOT NULL,
	"backed_up" boolean NOT NULL,
	"transports" text,
	"aaguid" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "auth_passkeys_credential_id_unique" UNIQUE("credential_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auth_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_two_factors" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" text NOT NULL,
	"verified" boolean DEFAULT true,
	"failed_verification_count" integer DEFAULT 0,
	"locked_until" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'customer' NOT NULL,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auth_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "auth_accounts" ADD CONSTRAINT "auth_accounts_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "auth_passkeys" ADD CONSTRAINT "auth_passkeys_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "auth_two_factors" ADD CONSTRAINT "auth_two_factors_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_accounts_user_id_idx" ON "auth_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "auth_accounts_provider_account_uidx" ON "auth_accounts" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_passkeys_user_id_idx" ON "auth_passkeys" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_sessions_user_id_idx" ON "auth_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_two_factors_user_id_idx" ON "auth_two_factors" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_two_factors_secret_idx" ON "auth_two_factors" USING btree ("secret");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "auth_verifications_identifier_idx" ON "auth_verifications" USING btree ("identifier");--> statement-breakpoint
-- Every existing account, imported into AccountKit under its own id, so
-- orders and bonus codes stay theirs. The NextAuth bcrypt hash is copied byte
-- for byte; lib/auth.ts passes `legacyBcrypt`, so the old password signs in
-- and is re-hashed to the native format on its first use. Addresses are
-- compared lower-cased, as AccountKit compares them. Two that collide once
-- lower-cased stop the whole deploy (this file is one transaction) rather than
-- give one person's account to another. Re-runnable: ON CONFLICT DO NOTHING.
DO $$ BEGIN
  IF EXISTS (
    SELECT lower(trim("email")) FROM "users" GROUP BY 1 HAVING count(*) > 1
  ) OR EXISTS (
    SELECT 1 FROM "users" WHERE "email" NOT LIKE '%_@_%'
  ) THEN
    RAISE EXCEPTION 'accountkit import: addresses need reconciling first';
  END IF;
END $$;
--> statement-breakpoint
INSERT INTO "auth_users" ("id", "name", "email", "email_verified", "created_at", "updated_at")
SELECT "id", coalesce("name", ''), lower(trim("email")), false, "createdAt", "updatedAt"
FROM "users"
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "auth_accounts" ("id", "account_id", "provider_id", "user_id", "password", "created_at", "updated_at")
SELECT 'legacy-credential:' || u."id", u."id", 'credential', u."id", u."password", u."createdAt", u."updatedAt"
FROM "users" u
JOIN "auth_users" a ON a."id" = u."id"
WHERE u."password" IS NOT NULL AND u."password" <> ''
ON CONFLICT DO NOTHING;
--> statement-breakpoint
-- The cutover window. Between this file and the new server starting, the old
-- server may still register someone into "users". This mirror gives them the
-- same AccountKit account the import above gave everyone else. Under the new
-- server every insert into "users" follows an AccountKit account that already
-- exists, so the mirror finds it and does nothing.
CREATE OR REPLACE FUNCTION "accountkit_mirror_legacy_user"() RETURNS trigger AS $$
BEGIN
  INSERT INTO "auth_users" ("id", "name", "email", "email_verified")
  VALUES (NEW."id", coalesce(NEW."name", ''), lower(trim(NEW."email")), false)
  ON CONFLICT DO NOTHING;
  -- Only where the shared account is this person's: an address another
  -- account already holds gets no password here, and the old server's
  -- registration still succeeds.
  IF NEW."password" IS NOT NULL AND NEW."password" <> ''
    AND EXISTS (SELECT 1 FROM "auth_users" WHERE "id" = NEW."id") THEN
    INSERT INTO "auth_accounts" ("id", "account_id", "provider_id", "user_id", "password")
    VALUES ('legacy-credential:' || NEW."id", NEW."id", 'credential', NEW."id", NEW."password")
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;
--> statement-breakpoint
DROP TRIGGER IF EXISTS "users_accountkit_mirror" ON "users";
--> statement-breakpoint
CREATE TRIGGER "users_accountkit_mirror" AFTER INSERT ON "users"
FOR EACH ROW EXECUTE FUNCTION "accountkit_mirror_legacy_user"();
