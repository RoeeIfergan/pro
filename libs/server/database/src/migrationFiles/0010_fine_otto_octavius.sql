CREATE TABLE "screens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "steps" (
	"id" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transitions" (
	"id" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"from_step_id" uuid NOT NULL,
	"to_step_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "type" text DEFAULT 'standard' NOT NULL;--> statement-breakpoint
ALTER TABLE "steps" ADD CONSTRAINT "steps_id_screens_id_fk" FOREIGN KEY ("id") REFERENCES "public"."screens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transitions" ADD CONSTRAINT "transitions_from_step_id_steps_id_fk" FOREIGN KEY ("from_step_id") REFERENCES "public"."steps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transitions" ADD CONSTRAINT "transitions_to_step_id_steps_id_fk" FOREIGN KEY ("to_step_id") REFERENCES "public"."steps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transitions" ADD CONSTRAINT "transitions_id_screens_id_fk" FOREIGN KEY ("id") REFERENCES "public"."screens"("id") ON DELETE no action ON UPDATE no action;