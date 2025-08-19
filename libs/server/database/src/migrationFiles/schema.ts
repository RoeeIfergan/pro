import { pgTable, index, uuid, varchar, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const orders = pgTable("orders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 256 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("name_index").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);
