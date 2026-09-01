/**
 * Drizzle schema — SSOT for models, enums and derived types.
 *
 * EXACT parity with the live database, whose shape was created by the old
 * Prisma `0_init` migration: table/column names are Prisma's camelCase
 * (`createdAt`, not `created_at`), enums keep their Prisma type names
 * (`"UserRole"`), ids are TEXT generated app-side, timestamps are
 * TIMESTAMP(3), and index/FK constraint names are pinned to the ones Prisma
 * generated (`users_email_key`, `orders_userId_fkey`, …) so a fresh database
 * and the live one are byte-identical. Do not "normalize" any of this — the
 * schema must match the database that exists, and the deploy pipeline
 * refuses destructive diffs.
 *
 * Prisma generated `cuid()` ids and `@updatedAt` client-side; the equivalents
 * here are `$defaultFn(createId)` and `$onUpdateFn` — also app-side, so the
 * database needs no new defaults (the columns carry none).
 */

import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  foreignKey,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('UserRole', ['CUSTOMER', 'ADMIN', 'SUPER_ADMIN']);
export const shopCategoryEnum = pgEnum('ShopCategory', ['ELECTRONICS', 'CLOTHING', 'SHOES']);
export const orderStatusEnum = pgEnum('OrderStatus', [
  'PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type ShopCategory = (typeof shopCategoryEnum.enumValues)[number];
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];

const id = () =>
  text('id')
    .primaryKey()
    .$defaultFn(() => createId());

const createdAt = () =>
  timestamp('createdAt', { precision: 3, mode: 'date' }).notNull().defaultNow();

const updatedAt = () =>
  timestamp('updatedAt', { precision: 3, mode: 'date' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date());

export const users = pgTable(
  'users',
  {
    id: id(),
    email: text('email').notNull(),
    name: text('name'),
    password: text('password').notNull(),
    role: userRoleEnum('role').notNull().default('CUSTOMER'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex('users_email_key').on(table.email)],
);

export const shops = pgTable('shops', {
  id: id(),
  name: text('name').notNull(),
  description: text('description'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  postalCode: text('postalCode').notNull(),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  category: shopCategoryEnum('category').notNull(),
  isActive: boolean('isActive').notNull().default(true),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const orders = pgTable(
  'orders',
  {
    id: id(),
    total: doublePrecision('total').notNull(),
    status: orderStatusEnum('status').notNull().default('PENDING'),
    description: text('description'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    userId: text('userId').notNull(),
    shopId: text('shopId').notNull(),
  },
  (table) => [
    foreignKey({
      name: 'orders_userId_fkey',
      columns: [table.userId],
      foreignColumns: [users.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    foreignKey({
      name: 'orders_shopId_fkey',
      columns: [table.shopId],
      foreignColumns: [shops.id],
    })
      .onDelete('restrict')
      .onUpdate('cascade'),
  ],
);

export const bonusCodes = pgTable(
  'bonus_codes',
  {
    id: id(),
    code: text('code').notNull(),
    amount: doublePrecision('amount').notNull(),
    isUsed: boolean('isUsed').notNull().default(false),
    expiresAt: timestamp('expiresAt', { precision: 3, mode: 'date' }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    usedAt: timestamp('usedAt', { precision: 3, mode: 'date' }),
    residenceProofPath: text('residenceProofPath'),
    userId: text('userId').notNull(),
    shopId: text('shopId'),
    orderId: text('orderId'),
  },
  (table) => [
    uniqueIndex('bonus_codes_code_key').on(table.code),
    uniqueIndex('bonus_codes_orderId_key').on(table.orderId),
    foreignKey({
      name: 'bonus_codes_userId_fkey',
      columns: [table.userId],
      foreignColumns: [users.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    foreignKey({
      name: 'bonus_codes_shopId_fkey',
      columns: [table.shopId],
      foreignColumns: [shops.id],
    })
      .onDelete('set null')
      .onUpdate('cascade'),
    foreignKey({
      name: 'bonus_codes_orderId_fkey',
      columns: [table.orderId],
      foreignColumns: [orders.id],
    })
      .onDelete('set null')
      .onUpdate('cascade'),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  bonusCodes: many(bonusCodes),
  orders: many(orders),
}));

export const shopsRelations = relations(shops, ({ many }) => ({
  bonusCodes: many(bonusCodes),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  shop: one(shops, { fields: [orders.shopId], references: [shops.id] }),
  bonusCode: one(bonusCodes),
}));

export const bonusCodesRelations = relations(bonusCodes, ({ one }) => ({
  user: one(users, { fields: [bonusCodes.userId], references: [users.id] }),
  shop: one(shops, { fields: [bonusCodes.shopId], references: [shops.id] }),
  order: one(orders, { fields: [bonusCodes.orderId], references: [orders.id] }),
}));

export type User = typeof users.$inferSelect;
export type Shop = typeof shops.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type BonusCode = typeof bonusCodes.$inferSelect;
