import { decimal, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "manager", "pharmacist", "cashier"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const branches = mysqlTable("branches", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 32 }).notNull(),
  nameAr: varchar("nameAr", { length: 160 }).notNull(),
  address: text("address"),
  active: int("active").default(1).notNull(),
}, table => ({ codeIdx: uniqueIndex("branches_code_idx").on(table.code) }));

export const branchUsers = mysqlTable("branch_users", {
  id: int("id").autoincrement().primaryKey(),
  branchId: int("branchId").notNull(),
  userId: int("userId").notNull(),
  active: int("active").default(1).notNull(),
}, table => ({ membershipIdx: uniqueIndex("branch_users_membership_idx").on(table.branchId, table.userId) }));

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  sku: varchar("sku", { length: 64 }).notNull(),
  barcode: varchar("barcode", { length: 64 }),
  nameAr: varchar("nameAr", { length: 220 }).notNull(),
  nameEn: varchar("nameEn", { length: 220 }),
  officialPrice: decimal("officialPrice", { precision: 12, scale: 2 }).notNull(),
  requiresPrescription: int("requiresPrescription").default(0).notNull(),
  active: int("active").default(1).notNull(),
}, table => ({ skuIdx: uniqueIndex("products_sku_idx").on(table.sku), barcodeIdx: uniqueIndex("products_barcode_idx").on(table.barcode) }));

export const inventoryBatches = mysqlTable("inventory_batches", {
  id: int("id").autoincrement().primaryKey(),
  branchId: int("branchId").notNull(),
  productId: int("productId").notNull(),
  batchNumber: varchar("batchNumber", { length: 80 }).notNull(),
  expiryDate: timestamp("expiryDate").notNull(),
  quantityOnHand: decimal("quantityOnHand", { precision: 14, scale: 3 }).default("0").notNull(),
  reorderPoint: decimal("reorderPoint", { precision: 14, scale: 3 }).default("0").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ fefoIdx: index("inventory_batches_fefo_idx").on(table.branchId, table.productId, table.expiryDate) }));

export const sales = mysqlTable("sales", {
  id: int("id").autoincrement().primaryKey(),
  branchId: int("branchId").notNull(),
  cashierId: int("cashierId").notNull(),
  invoiceNumber: varchar("invoiceNumber", { length: 80 }).notNull(),
  subtotal: decimal("subtotal", { precision: 14, scale: 2 }).notNull(),
  discountAmount: decimal("discountAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  totalAmount: decimal("totalAmount", { precision: 14, scale: 2 }).notNull(),
  discountValidation: varchar("discountValidation", { length: 40 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "meeza", "instapay", "insurance"]).notNull(),
  etaStatus: mysqlEnum("etaStatus", ["pending", "submitted", "valid", "invalid"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ invoiceIdx: uniqueIndex("sales_invoice_idx").on(table.invoiceNumber), branchDateIdx: index("sales_branch_date_idx").on(table.branchId, table.createdAt) }));

export const saleItems = mysqlTable("sale_items", {
  id: int("id").autoincrement().primaryKey(),
  saleId: int("saleId").notNull(),
  productId: int("productId").notNull(),
  batchId: int("batchId").notNull(),
  unit: varchar("unit", { length: 24 }).notNull(),
  quantity: decimal("quantity", { precision: 14, scale: 3 }).notNull(),
  unitPrice: decimal("unitPrice", { precision: 14, scale: 2 }).notNull(),
});

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  branchId: int("branchId"),
  action: varchar("action", { length: 80 }).notNull(),
  entityType: varchar("entityType", { length: 80 }).notNull(),
  entityId: varchar("entityId", { length: 80 }),
  previousHash: varchar("previousHash", { length: 128 }),
  recordHash: varchar("recordHash", { length: 128 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ auditTimeIdx: index("audit_logs_time_idx").on(table.createdAt) }));

export const scheduledJobs = mysqlTable("scheduled_jobs", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  scheduleCronTaskUid: varchar("schedule_cron_task_uid", { length: 65 }),
  cronExpression: varchar("cronExpression", { length: 40 }).notNull(),
  active: int("active").default(1).notNull(),
  lastRunAt: timestamp("lastRunAt"),
}, table => ({ taskUidIdx: uniqueIndex("scheduled_jobs_task_uid_idx").on(table.scheduleCronTaskUid) }));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const branchAlerts = mysqlTable("branch_alerts", {
  id: int("id").autoincrement().primaryKey(),
  branchId: int("branchId").notNull(),
  managerUserId: int("managerUserId").notNull(),
  alertType: mysqlEnum("alertType", ["reorder", "expiry"]).notNull(),
  inventoryBatchId: int("inventoryBatchId").notNull(),
  alertDate: timestamp("alertDate").notNull(),
  status: mysqlEnum("status", ["queued", "sent", "read"]).default("queued").notNull(),
}, table => ({ dedupeIdx: uniqueIndex("branch_alerts_dedupe_idx").on(table.managerUserId, table.inventoryBatchId, table.alertType, table.alertDate) }));
