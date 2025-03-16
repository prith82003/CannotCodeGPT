import { integer, pgTable, serial, text, numeric, varchar } from "drizzle-orm/pg-core";

export const Budgets=pgTable('budgets', {
    id:serial('id').primaryKey(),
    name:varchar('name').notNull(),
    amount:varchar('amount').notNull(),
    icon: varchar('icon'),
    createdBy:varchar('createdBy').notNull()
})

export const Expenses=pgTable('expenses', {
    id:serial('id').primaryKey(),
    name:varchar('name').notNull(),
    amount:varchar('amount').notNull(),
    budgetId:integer('budgetId').references(()=>Budgets.id),
    createdAt:varchar('createdAt').notNull()
})

export const SavingsGoals = pgTable("savings_goals", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull(),
  icon: varchar("icon"),
  savedAmount: integer("saved_amount").default(0),
  createdBy: varchar("created_by").notNull(),
});