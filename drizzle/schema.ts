import { decimal, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const organizations = mysqlTable("organizations", {
  id: int("id").autoincrement().primaryKey(),
  organizationType: mysqlEnum("organizationType", ["government", "pharmacy", "pharmacy_chain", "distributor", "insurer", "rehabilitation", "hospital", "laboratory", "radiology"]).notNull(),
  legalName: varchar("legalName", { length: 240 }).notNull(),
  displayName: varchar("displayName", { length: 240 }).notNull(),
  countryCode: varchar("countryCode", { length: 3 }).notNull(),
  status: mysqlEnum("status", ["pending", "active", "suspended", "archived"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ nameIdx: index("organizations_name_idx").on(table.displayName), countryIdx: index("organizations_country_idx").on(table.countryCode) }));

export const organizationMemberships = mysqlTable("organization_memberships", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  userId: int("userId").notNull(),
  organizationRole: mysqlEnum("organizationRole", ["owner", "org_admin", "compliance_officer", "clinical_lead", "operations_manager", "staff", "auditor"]).notNull(),
  active: int("active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ membershipIdx: uniqueIndex("organization_memberships_unique_idx").on(table.organizationId, table.userId), userIdx: index("organization_memberships_user_idx").on(table.userId, table.active) }));

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
  organizationId: int("organizationId"),
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
  jurisdictionId: int("jurisdictionId"),
  catalogItemId: int("catalogItemId"),
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
  jurisdictionId: int("jurisdictionId"),
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
  jurisdictionId: int("jurisdictionId"),
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
export type Organization = typeof organizations.$inferSelect;
export type OrganizationMembership = typeof organizationMemberships.$inferSelect;
export type OrganizationType = Organization["organizationType"];
export type OrganizationRole = OrganizationMembership["organizationRole"];

export const branchAlerts = mysqlTable("branch_alerts", {
  id: int("id").autoincrement().primaryKey(),
  branchId: int("branchId").notNull(),
  managerUserId: int("managerUserId").notNull(),
  alertType: mysqlEnum("alertType", ["reorder", "expiry"]).notNull(),
  inventoryBatchId: int("inventoryBatchId").notNull(),
  alertDate: timestamp("alertDate").notNull(),
  status: mysqlEnum("status", ["queued", "sent", "read"]).default("queued").notNull(),
}, table => ({ dedupeIdx: uniqueIndex("branch_alerts_dedupe_idx").on(table.managerUserId, table.inventoryBatchId, table.alertType, table.alertDate) }));

export const prescriptionIntakes = mysqlTable("prescription_intakes", {
  id: int("id").autoincrement().primaryKey(),
  branchId: int("branchId"),
  jurisdictionId: int("jurisdictionId"),
  createdByUserId: int("createdByUserId").notNull(),
  imageKey: varchar("imageKey", { length: 255 }).notNull(),
  imageMimeType: varchar("imageMimeType", { length: 80 }).notNull(),
  status: mysqlEnum("status", ["UPLOADED", "PENDING_REVIEW", "CONFIRMED", "REJECTED"]).default("UPLOADED").notNull(),
  extractionJson: text("extractionJson"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});


export const customerProfiles = mysqlTable("customer_profiles", {
  id: int("id").autoincrement().primaryKey(),
  branchId: int("branchId"),
  fullName: varchar("fullName", { length: 220 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  nationalIdHash: varchar("nationalIdHash", { length: 128 }),
  consentStatus: mysqlEnum("consentStatus", ["pending", "granted", "withdrawn"]).default("pending").notNull(),
  chronicCareEnabled: int("chronicCareEnabled").default(0).notNull(),
  notes: text("notes"),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ phoneIdx: index("customer_profiles_phone_idx").on(table.phone) }));

export const careInteractions = mysqlTable("care_interactions", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  userId: int("userId").notNull(),
  interactionType: mysqlEnum("interactionType", ["follow_up", "complaint", "counseling", "chronic_care"]).notNull(),
  summary: text("summary").notNull(),
  nextActionAt: timestamp("nextActionAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const callTickets = mysqlTable("call_tickets", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId"),
  branchId: int("branchId"),
  assignedUserId: int("assignedUserId"),
  channel: mysqlEnum("channel", ["phone", "whatsapp", "web", "in_person"]).notNull(),
  direction: mysqlEnum("direction", ["inbound", "outbound"]).notNull(),
  subject: varchar("subject", { length: 220 }).notNull(),
  priority: mysqlEnum("priority", ["low", "normal", "high", "urgent"]).default("normal").notNull(),
  status: mysqlEnum("status", ["open", "pending", "resolved", "closed"]).default("open").notNull(),
  disposition: varchar("disposition", { length: 120 }),
  callbackAt: timestamp("callbackAt"),
  escalationAt: timestamp("escalationAt"),
  recordingRef: varchar("recordingRef", { length: 255 }),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ statusIdx: index("call_tickets_status_idx").on(table.status, table.priority) }));

export const catalogItems = mysqlTable("catalog_items", {
  id: int("id").autoincrement().primaryKey(),
  jurisdictionId: int("jurisdictionId"),
  category: mysqlEnum("category", ["medicine", "cosmetic", "medical_supply"]).notNull(),
  sku: varchar("sku", { length: 80 }).notNull(),
  barcode: varchar("barcode", { length: 80 }),
  nameAr: varchar("nameAr", { length: 240 }).notNull(),
  nameEn: varchar("nameEn", { length: 240 }),
  genericName: varchar("genericName", { length: 240 }),
  manufacturer: varchar("manufacturer", { length: 220 }),
  registrationNumber: varchar("registrationNumber", { length: 120 }),
  sourceAuthority: varchar("sourceAuthority", { length: 40 }).notNull(),
  sourceRecordId: varchar("sourceRecordId", { length: 160 }),
  sourceUrl: varchar("sourceUrl", { length: 500 }),
  sourceRetrievedAt: timestamp("sourceRetrievedAt"),
  verificationStatus: mysqlEnum("verificationStatus", ["UNVERIFIED", "PENDING_REVIEW", "VERIFIED", "REJECTED"]).default("UNVERIFIED").notNull(),
  createdByUserId: int("createdByUserId").notNull(),
  approvedByUserId: int("approvedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ catalogSkuIdx: uniqueIndex("catalog_items_sku_idx").on(table.sku), catalogBarcodeIdx: index("catalog_items_barcode_idx").on(table.barcode) }));

export const catalogSyncQueue = mysqlTable("catalog_sync_queue", {
  id: int("id").autoincrement().primaryKey(),
  jurisdictionId: int("jurisdictionId"),
  entityType: mysqlEnum("entityType", ["medicine", "cosmetic", "medical_supply"]).notNull(),
  operation: mysqlEnum("operation", ["create", "update", "review"]).notNull(),
  entityId: int("entityId"),
  idempotencyKey: varchar("idempotencyKey", { length: 100 }).notNull(),
  payloadJson: text("payloadJson").notNull(),
  status: mysqlEnum("status", ["pending", "synced", "conflict", "failed"]).default("pending").notNull(),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ idempotencyIdx: uniqueIndex("catalog_sync_idempotency_idx").on(table.idempotencyKey) }));

export type CustomerProfile = typeof customerProfiles.$inferSelect;
export type CallTicket = typeof callTickets.$inferSelect;
export type CatalogItem = typeof catalogItems.$inferSelect;


export const jurisdictionProfiles = mysqlTable("jurisdiction_profiles", {
  id: int("id").autoincrement().primaryKey(),
  countryCode: varchar("countryCode", { length: 2 }).notNull(),
  countryNameAr: varchar("countryNameAr", { length: 120 }).notNull(),
  legalAuthorityProfile: varchar("legalAuthorityProfile", { length: 240 }).default("UNVERIFIED_AUTHORITY").notNull(),
  language: varchar("language", { length: 16 }).notNull().default("ar"),
  defaultLocale: varchar("defaultLocale", { length: 16 }).notNull(),
  currencyCode: varchar("currencyCode", { length: 3 }).notNull(),
  timezone: varchar("timezone", { length: 64 }).notNull(),
  taxProfile: varchar("taxProfile", { length: 80 }).notNull(),
  dateFormat: varchar("dateFormat", { length: 32 }).notNull(),
  numberSystem: varchar("numberSystem", { length: 16 }).default("latn").notNull(),
  active: int("active").default(0).notNull(),
  approvedByUserId: int("approvedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ countryIdx: uniqueIndex("jurisdiction_profiles_country_idx").on(table.countryCode) }));

export const branchJurisdictions = mysqlTable("branch_jurisdictions", {
  id: int("id").autoincrement().primaryKey(),
  branchId: int("branchId").notNull(),
  jurisdictionId: int("jurisdictionId").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  locationSource: mysqlEnum("locationSource", ["admin_confirmed", "manual_override", "device"]).notNull(),
  confirmedByUserId: int("confirmedByUserId").notNull(),
  confirmedAt: timestamp("confirmedAt").defaultNow().notNull(),
}, table => ({ branchIdx: uniqueIndex("branch_jurisdictions_branch_idx").on(table.branchId) }));

export const compliancePacks = mysqlTable("compliance_packs", {
  id: int("id").autoincrement().primaryKey(),
  jurisdictionId: int("jurisdictionId").notNull(),
  packVersion: varchar("packVersion", { length: 40 }).notNull(),
  authorityName: varchar("authorityName", { length: 160 }).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 500 }).notNull(),
  effectiveFrom: timestamp("effectiveFrom").notNull(),
  reviewDueAt: timestamp("reviewDueAt"),
  status: mysqlEnum("status", ["draft", "review", "approved", "expired", "rolled_back"]).default("draft").notNull(),
  rulesJson: text("rulesJson").notNull(),
  createdByUserId: int("createdByUserId").notNull(),
  approvedByUserId: int("approvedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ versionIdx: uniqueIndex("compliance_packs_version_idx").on(table.jurisdictionId, table.packVersion) }));

export const complianceRuleAudits = mysqlTable("compliance_rule_audits", {
  id: int("id").autoincrement().primaryKey(),
  packId: int("packId").notNull(),
  action: mysqlEnum("action", ["created", "approved", "activated", "expired", "rolled_back"]).notNull(),
  actorUserId: int("actorUserId").notNull(),
  reason: text("reason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type JurisdictionProfile = typeof jurisdictionProfiles.$inferSelect;
export type BranchJurisdiction = typeof branchJurisdictions.$inferSelect;
export type CompliancePack = typeof compliancePacks.$inferSelect;

export const complianceEvidence = mysqlTable("compliance_evidence", {
  id: int("id").autoincrement().primaryKey(),
  jurisdictionId: int("jurisdictionId").notNull(),
  packId: int("packId").notNull(),
  operation: varchar("operation", { length: 40 }).notNull(),
  ruleKey: varchar("ruleKey", { length: 120 }),
  catalogField: varchar("catalogField", { length: 120 }),
  authorityName: varchar("authorityName", { length: 160 }).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 500 }).notNull(),
  sourceRecordId: varchar("sourceRecordId", { length: 160 }),
  sourceRetrievedAt: timestamp("sourceRetrievedAt").notNull(),
  effectiveFrom: timestamp("effectiveFrom"),
  reviewDueAt: timestamp("reviewDueAt"),
  verificationStatus: mysqlEnum("verificationStatus", ["unverified", "review", "verified", "rejected"]).default("unverified").notNull(),
  verifiedByUserId: int("verifiedByUserId"),
  verifiedAt: timestamp("verifiedAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ sourceIdx: index("compliance_evidence_source_idx").on(table.jurisdictionId, table.packId, table.operation) }));

export type ComplianceEvidence = typeof complianceEvidence.$inferSelect;


export const offlineDrafts = mysqlTable("offline_drafts", {
  id: int("id").autoincrement().primaryKey(),
  idempotencyKey: varchar("idempotencyKey", { length: 120 }).notNull(),
  module: mysqlEnum("module", ["customerCare", "callCentre"]).notNull(),
  payloadJson: text("payloadJson").notNull(),
  status: mysqlEnum("status", ["queued", "replayed", "conflict", "failed"]).default("queued").notNull(),
  errorCode: varchar("errorCode", { length: 80 }),
  createdByUserId: int("createdByUserId").notNull(),
  replayedEntityId: int("replayedEntityId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ idempotencyIdx: uniqueIndex("offline_drafts_idempotency_idx").on(table.idempotencyKey), ownerStatusIdx: index("offline_drafts_owner_status_idx").on(table.createdByUserId, table.status) }));

export type OfflineDraft = typeof offlineDrafts.$inferSelect;
