import {pgTable, serial, varchar} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: serial().primaryKey(),
	whatsapp_id: varchar({length: 50}).notNull(),
	fullname: varchar({length: 255}).notNull()
})
