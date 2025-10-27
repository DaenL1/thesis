import { pgTable, serial, varchar, text, integer, timestamp, decimal, uniqueIndex, foreignKey, primaryKey, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums (if applicable, e.g., for Credit Type)
export const CreditTypeEnum = pgEnum('CreditType', ['Earned', 'Spent', 'Adjustment']);
export const EventTypeEnum = pgEnum('EventType', ['Operation', 'Community', 'Management']);

export const Roles = pgTable('Roles', {
  RoleId: serial('RoleId').primaryKey(),
  Name: varchar('Name', { length: 50 }).notNull().unique(),
  Description: text('Description'),
  CreatedAt: timestamp('CreatedAt', { withTimezone: true }).defaultNow().notNull(),
  UpdatedAt: timestamp('UpdatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const Users = pgTable('Users', {
  UserId: serial('UserId').primaryKey(),
  Name: varchar('Name', { length: 255 }).notNull(),
  Email: varchar('Email', { length: 255 }).notNull().unique(),
  PasswordHash: varchar('PasswordHash', { length: 255 }).notNull(), // Store hashed passwords only!
  RoleId: integer('RoleId').notNull().references(() => Roles.RoleId),
  CreatedAt: timestamp('CreatedAt', { withTimezone: true }).defaultNow().notNull(),
  UpdatedAt: timestamp('UpdatedAt', { withTimezone: true }).defaultNow().notNull(),
});

// Define relations for Users
export const usersRelations = relations(Users, ({ one }) => ({
  Role: one(Roles, {
    fields: [Users.RoleId],
    references: [Roles.RoleId],
  }),
}));

export const Members = pgTable('Members', {
  MemberId: serial('MemberId').primaryKey(),
  Name: varchar('Name', { length: 255 }).notNull(),
  Email: varchar('Email', { length: 255 }).notNull().unique(),
  Phone: varchar('Phone', { length: 50 }),
  Address: text('Address'),
  CreditBalance: decimal('CreditBalance', { precision: 10, scale: 2 }).default('0.00').notNull(),
  CreditLimit: decimal('CreditLimit', { precision: 10, scale: 2 }).default('0.00').notNull(),
  UserId: integer('UserId').references(() => Users.UserId),
  CreatedAt: timestamp('CreatedAt', { withTimezone: true }).defaultNow().notNull(),
  UpdatedAt: timestamp('UpdatedAt', { withTimezone: true }).defaultNow().notNull(),
  Status: varchar('Status', { length: 50 }).default('active').notNull(), // e.g., 'active', 'inactive', 'suspended'
});

export const membersRelations = relations(Members, ({ one, many }) => ({
  User: one(Users, { fields: [Members.UserId], references: [Users.UserId] }),
  Transactions: many(Transactions),
  Credits: many(Credits),
  MemberActivities: many(MemberActivities),
}));

// Verification tokens for account creation and password reset
export const VerificationTokens = pgTable('VerificationTokens', {
  TokenId: serial('TokenId').primaryKey(),
  Token: varchar('Token', { length: 255 }).notNull().unique(),
  Type: varchar('Type', { length: 50 }).notNull(), // 'account-verification', 'password-reset', etc.
  MemberId: integer('MemberId').references(() => Members.MemberId),
  UserId: integer('UserId').references(() => Users.UserId),
  ExpiresAt: timestamp('ExpiresAt', { withTimezone: true }).notNull(),
  CreatedAt: timestamp('CreatedAt', { withTimezone: true }).defaultNow().notNull(),
  UsedAt: timestamp('UsedAt', { withTimezone: true }),
});

export const Categories = pgTable('Categories', {
  CategoryId: serial('CategoryId').primaryKey(),
  Name: varchar('Name', { length: 100 }).notNull().unique(),
  Description: text('Description'),
  CreatedAt: timestamp('CreatedAt', { withTimezone: true }).defaultNow().notNull(),
  UpdatedAt: timestamp('UpdatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const categoriesRelations = relations(Categories, ({ many }) => ({
  Products: many(Products),
}));

export const Products = pgTable('Products', {
  ProductId: serial('ProductId').primaryKey(),
  Name: varchar('Name', { length: 255 }).notNull(),
  Description: text('Description'),
  Sku: varchar('Sku', { length: 100 }).notNull().unique(),
  Price: decimal('Price', { precision: 10, scale: 2 }).notNull(),
  BasePrice: decimal('BasePrice', { precision: 10, scale: 2 }).default('0.00').notNull(),
  StockQuantity: integer('StockQuantity').default(0).notNull(),
  CategoryId: integer('CategoryId').notNull().references(() => Categories.CategoryId),
  Image: text('Image'),
  Supplier: varchar('Supplier', { length: 255 }),
  ExpiryDate: timestamp('ExpiryDate', { withTimezone: true }),
  IsActive: boolean('IsActive').default(true).notNull(),
  CreatedAt: timestamp('CreatedAt', { withTimezone: true }).defaultNow().notNull(),
  UpdatedAt: timestamp('UpdatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const productsRelations = relations(Products, ({ one, many }) => ({
  Category: one(Categories, {
    fields: [Products.CategoryId],
    references: [Categories.CategoryId],
  }),
  TransactionItems: many(TransactionItems),
}));

export const Transactions = pgTable('Transactions', {
  TransactionId: serial('TransactionId').primaryKey(),
  Timestamp: timestamp('Timestamp', { withTimezone: true }).defaultNow().notNull(),
  UserId: integer('UserId').notNull().references(() => Users.UserId), // Staff who processed
  MemberId: integer('MemberId').references(() => Members.MemberId), // Optional member
  TotalAmount: decimal('TotalAmount', { precision: 10, scale: 2 }).notNull(),
  PaymentMethod: varchar('PaymentMethod', { length: 50 }),
  ManualDiscountAmount: decimal('ManualDiscountAmount', { precision: 10, scale: 2 }),
  CreatedAt: timestamp('CreatedAt', { withTimezone: true }).defaultNow().notNull(),
  UpdatedAt: timestamp('UpdatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const transactionsRelations = relations(Transactions, ({ one, many }) => ({
  User: one(Users, { fields: [Transactions.UserId], references: [Users.UserId] }),
  Member: one(Members, {
    fields: [Transactions.MemberId],
    references: [Members.MemberId],
  }),
  TransactionItems: many(TransactionItems),
}));

export const TransactionItems = pgTable('TransactionItems', {
  TransactionItemId: serial('TransactionItemId').primaryKey(),
  TransactionId: integer('TransactionId').notNull().references(() => Transactions.TransactionId),
  ProductId: integer('ProductId').notNull().references(() => Products.ProductId),
  Quantity: integer('Quantity').notNull(),
  PriceAtTimeOfSale: decimal('PriceAtTimeOfSale', { precision: 10, scale: 2 }).notNull(),
  BasePriceAtTimeOfSale: decimal('BasePriceAtTimeOfSale', { precision: 10, scale: 2 }).default('0.00').notNull(),
  Profit: decimal('Profit', { precision: 10, scale: 2 }).default('0.00').notNull(),
  CreatedAt: timestamp('CreatedAt', { withTimezone: true }).defaultNow().notNull(),
  UpdatedAt: timestamp('UpdatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const transactionItemsRelations = relations(TransactionItems, ({ one }) => ({
  Transaction: one(Transactions, {
    fields: [TransactionItems.TransactionId],
    references: [Transactions.TransactionId],
  }),
  Product: one(Products, { fields: [TransactionItems.ProductId], references: [Products.ProductId] }),
}));

export const Credits = pgTable('Credits', {
  CreditId: serial('CreditId').primaryKey(),
  MemberId: integer('MemberId').notNull().references(() => Members.MemberId),
  Amount: decimal('Amount', { precision: 10, scale: 2 }).notNull(),
  Type: CreditTypeEnum('Type').notNull(),
  RelatedTransactionId: integer('RelatedTransactionId').references(() => Transactions.TransactionId), // Optional link to transaction
  Notes: text('Notes'), // To store info like "Credit payment received"
  Timestamp: timestamp('Timestamp', { withTimezone: true }).defaultNow().notNull(),
  CreatedAt: timestamp('CreatedAt', { withTimezone: true }).defaultNow().notNull(),
  UpdatedAt: timestamp('UpdatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const Events = pgTable('Events', {
  EventId: serial('EventId').primaryKey(),
  Title: varchar('Title', { length: 255 }).notNull(),
  Description: text('Description'),
  EventDate: timestamp('EventDate', { withTimezone: true }).notNull(),
  Type: EventTypeEnum('Type').notNull(),
  CreatedAt: timestamp('CreatedAt', { withTimezone: true }).defaultNow().notNull(),
  UpdatedAt: timestamp('UpdatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const MemberActivities = pgTable('MemberActivities', {
  ActivityId: serial('ActivityId').primaryKey(),
  MemberId: integer('MemberId').notNull().references(() => Members.MemberId),
  Action: varchar('Action', { length: 255 }).notNull(),
  Amount: decimal('Amount', { precision: 10, scale: 2 }),
  Timestamp: timestamp('Timestamp', { withTimezone: true }).defaultNow().notNull(),
  RelatedTransactionId: integer('RelatedTransactionId').references(() => Transactions.TransactionId),
  CreatedAt: timestamp('CreatedAt', { withTimezone: true }).defaultNow().notNull(),
  UpdatedAt: timestamp('UpdatedAt', { withTimezone: true }).defaultNow().notNull(),
  Description: text("description"),
}); 