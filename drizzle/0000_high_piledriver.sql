CREATE TYPE "public"."OrderStatus" AS ENUM('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."ShopCategory" AS ENUM('ELECTRONICS', 'CLOTHING', 'SHOES');--> statement-breakpoint
CREATE TYPE "public"."UserRole" AS ENUM('CUSTOMER', 'ADMIN', 'SUPER_ADMIN');--> statement-breakpoint
CREATE TABLE "bonus_codes" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"amount" double precision NOT NULL,
	"isUsed" boolean DEFAULT false NOT NULL,
	"expiresAt" timestamp (3) NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"usedAt" timestamp (3),
	"residenceProofPath" text,
	"userId" text NOT NULL,
	"shopId" text,
	"orderId" text
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"total" double precision NOT NULL,
	"status" "OrderStatus" DEFAULT 'PENDING' NOT NULL,
	"description" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"userId" text NOT NULL,
	"shopId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shops" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"postalCode" text NOT NULL,
	"phone" text,
	"email" text,
	"website" text,
	"category" "ShopCategory" NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"password" text NOT NULL,
	"role" "UserRole" DEFAULT 'CUSTOMER' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bonus_codes" ADD CONSTRAINT "bonus_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "bonus_codes" ADD CONSTRAINT "bonus_codes_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."shops"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "bonus_codes" ADD CONSTRAINT "bonus_codes_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."shops"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "bonus_codes_code_key" ON "bonus_codes" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "bonus_codes_orderId_key" ON "bonus_codes" USING btree ("orderId");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_key" ON "users" USING btree ("email");