import { decimal, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const organizations = mysqlTable("organizations", {
  id: int("id").autoincrement().primaryKey(),
  organizationType: mysqlEnum("organizationType", ["government", "pharmacy", "pharmacy_chain", "distributor", "insurer", "rehabilitation", "hospital", "laboratory", "radiology"]).notNull(),
  legalName: varchar("legalName", { length: 240 }).notNull(),
  displayName: varchar("displayName", { length: 240 }).notNull(),
  countryCode: varchar("countryCode", { length: 3 }).notNull(),
  status: mysqlEnum("status", ["pending", "active", "suspended", "archived"]).default("pending").notNull(),
  environment: mysqlEnum("environment", ["production", "showcase"]).default("production").notNull(),
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
  organizationId: int("organizationId").notNull(),
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
  organizationId: int("organizationId").notNull(),
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
  organizationId: int("organizationId").notNull(),
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
  organizationId: int("organizationId").notNull(),
  branchId: int("branchId").notNull(),
  cashierId: int("cashierId").notNull(),
  invoiceNumber: varchar("invoiceNumber", { length: 80 }).notNull(),
  subtotal: decimal("subtotal", { precision: 14, scale: 2 }).notNull(),
  discountAmount: decimal("discountAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  totalAmount: decimal("totalAmount", { precision: 14, scale: 2 }).notNull(),
  discountValidation: varchar("discountValidation", { length: 40 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "meeza", "instapay", "insurance"]).notNull(),
  etaStatus: mysqlEnum("etaStatus", ["pending", "submitted", "valid", "invalid"]).default("pending").notNull(),
  saleStatus: mysqlEnum("saleStatus", ["completed", "voided", "cancelled"]).default("completed").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ invoiceIdx: uniqueIndex("sales_invoice_idx").on(table.invoiceNumber), branchDateIdx: index("sales_branch_date_idx").on(table.branchId, table.createdAt) }));

export const promotions = mysqlTable("promotions", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  jurisdictionId: int("jurisdictionId").notNull(),
  branchId: int("branchId"),
  code: varchar("code", { length: 48 }).notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  description: text("description"),
  discountType: mysqlEnum("discountType", ["percent", "fixed"]).notNull(),
  discountValue: decimal("discountValue", { precision: 12, scale: 2 }).notNull(),
  startsAt: timestamp("startsAt").notNull(),
  endsAt: timestamp("endsAt").notNull(),
  usageLimit: int("usageLimit"),
  usageCount: int("usageCount").default(0).notNull(),
  status: mysqlEnum("status", ["draft", "active", "paused", "expired", "archived"]).default("draft").notNull(),
  approvedByUserId: int("approvedByUserId"),
  approvedAt: timestamp("approvedAt"),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ codeScopeIdx: uniqueIndex("promotions_scope_code_idx").on(table.organizationId, table.jurisdictionId, table.code), activeIdx: index("promotions_active_idx").on(table.organizationId, table.jurisdictionId, table.status, table.startsAt, table.endsAt) }));

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
  organizationId: int("organizationId"),
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
  organizationId: int("organizationId"),
  branchId: int("branchId").notNull(),
  managerUserId: int("managerUserId").notNull(),
  alertType: mysqlEnum("alertType", ["reorder", "expiry"]).notNull(),
  inventoryBatchId: int("inventoryBatchId").notNull(),
  alertDate: timestamp("alertDate").notNull(),
  status: mysqlEnum("status", ["queued", "sent", "read"]).default("queued").notNull(),
}, table => ({ dedupeIdx: uniqueIndex("branch_alerts_dedupe_idx").on(table.managerUserId, table.inventoryBatchId, table.alertType, table.alertDate) }));

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId"),
  branchId: int("branchId"),
  audienceRole: mysqlEnum("audienceRole", ["all", "admin", "manager", "pharmacist", "cashier", "org_admin", "clinical_lead", "operations_manager", "staff", "auditor"]).default("all").notNull(),
  severity: mysqlEnum("severity", ["info", "success", "warning", "critical"]).default("info").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  body: varchar("body", { length: 1000 }).notNull(),
  expiresAt: timestamp("expiresAt"),
  createdByUserId: int("createdByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  active: int("active").default(1).notNull(),
}, table => ({ scopeIdx: index("notifications_scope_idx").on(table.organizationId, table.branchId, table.active, table.createdAt) }));

export const notificationReads = mysqlTable("notification_reads", {
  id: int("id").autoincrement().primaryKey(),
  notificationId: int("notificationId").notNull(),
  userId: int("userId").notNull(),
  readAt: timestamp("readAt").defaultNow().notNull(),
}, table => ({ readIdx: uniqueIndex("notification_reads_unique_idx").on(table.notificationId, table.userId), userIdx: index("notification_reads_user_idx").on(table.userId, table.readAt) }));

export type Notification = typeof notifications.$inferSelect;

export const prescriptionIntakes = mysqlTable("prescription_intakes", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
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
  organizationId: int("organizationId").notNull(),
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
  organizationId: int("organizationId").notNull(),
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
  organizationId: int("organizationId").notNull(),
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
  organizationId: int("organizationId"),
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


export const reportDefinitions = mysqlTable("report_definitions", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  jurisdictionId: int("jurisdictionId"),
  reportKey: varchar("reportKey", { length: 100 }).notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  description: text("description"),
  scheduleCronTaskUid: varchar("schedule_cron_task_uid", { length: 65 }),
  cronExpression: varchar("cronExpression", { length: 40 }),
  status: mysqlEnum("status", ["draft", "active", "paused", "archived"]).default("draft").notNull(),
  queryKey: varchar("queryKey", { length: 120 }).notNull(),
  recipientUserId: int("recipientUserId"),
  recipientRole: mysqlEnum("recipientRole", ["owner", "org_admin", "compliance_officer", "clinical_lead", "operations_manager", "staff", "auditor"]),
  deliveryChannel: mysqlEnum("deliveryChannel", ["in_app", "email", "webhook"]).default("in_app").notNull(),
  deliveryEnabled: int("deliveryEnabled").default(0).notNull(),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({
  scopeKeyIdx: uniqueIndex("report_definitions_scope_key_idx").on(table.organizationId, table.jurisdictionId, table.reportKey),
  taskUidIdx: uniqueIndex("report_definitions_task_uid_idx").on(table.scheduleCronTaskUid),
  statusIdx: index("report_definitions_status_idx").on(table.organizationId, table.status),
}));

export const reportRuns = mysqlTable("report_runs", {
  id: int("id").autoincrement().primaryKey(),
  definitionId: int("definitionId").notNull(),
  organizationId: int("organizationId").notNull(),
  jurisdictionId: int("jurisdictionId"),
  idempotencyKey: varchar("idempotencyKey", { length: 180 }).notNull(),
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  status: mysqlEnum("status", ["queued", "running", "succeeded", "failed", "skipped"]).default("queued").notNull(),
  outputRef: varchar("outputRef", { length: 500 }),
  errorCode: varchar("errorCode", { length: 100 }),
  startedAt: timestamp("startedAt"),
  finishedAt: timestamp("finishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({
  idempotencyIdx: uniqueIndex("report_runs_idempotency_idx").on(table.idempotencyKey),
  scopeTimeIdx: index("report_runs_scope_time_idx").on(table.organizationId, table.jurisdictionId, table.createdAt),
}));

export type ReportDefinition = typeof reportDefinitions.$inferSelect;
export type ReportRun = typeof reportRuns.$inferSelect;
export const reportDeliveryAttempts = mysqlTable("report_delivery_attempts", {
  id: int("id").autoincrement().primaryKey(),
  reportRunId: int("reportRunId").notNull(),
  definitionId: int("definitionId").notNull(),
  organizationId: int("organizationId").notNull(),
  jurisdictionId: int("jurisdictionId"),
  recipientRole: mysqlEnum("recipientRole", ["owner", "org_admin", "compliance_officer", "clinical_lead", "operations_manager", "staff", "auditor"]),
  recipientUserId: int("recipientUserId"),
  channel: mysqlEnum("channel", ["in_app", "email", "sms", "webhook"]).default("in_app").notNull(),
  status: mysqlEnum("status", ["queued", "delivered", "skipped", "failed"]).default("queued").notNull(),
  notificationId: int("notificationId"),
  errorCode: varchar("errorCode", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
}, table => ({ scopeTimeIdx: index("report_delivery_scope_time_idx").on(table.organizationId, table.jurisdictionId, table.createdAt) }));
export type ReportDeliveryAttempt = typeof reportDeliveryAttempts.$inferSelect;
export const insuranceRequests = mysqlTable("insurance_requests", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  jurisdictionId: int("jurisdictionId").notNull(),
  requestType: mysqlEnum("requestType", ["ELIGIBILITY", "PREAUTHORIZATION"]).notNull(),
  payerCode: varchar("payerCode", { length: 80 }).notNull(),
  memberReferenceHash: varchar("memberReferenceHash", { length: 128 }).notNull(),
  serviceCode: varchar("serviceCode", { length: 120 }).notNull(),
  status: mysqlEnum("status", ["DRAFT", "READY_FOR_SUBMISSION", "SUBMITTED", "APPROVED", "PARTIALLY_APPROVED", "REJECTED", "CANCELLED"]).default("DRAFT").notNull(),
  externalReference: varchar("externalReference", { length: 160 }),
  credentialGate: mysqlEnum("credentialGate", ["NOT_CONFIGURED", "TEST_READY", "PRODUCTION_READY"]).default("NOT_CONFIGURED").notNull(),
  requestJson: text("requestJson"),
  responseJson: text("responseJson"),
  idempotencyKey: varchar("idempotencyKey", { length: 180 }).notNull(),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({
  idempotencyIdx: uniqueIndex("insurance_requests_idempotency_idx").on(table.idempotencyKey),
  scopeStatusIdx: index("insurance_requests_scope_status_idx").on(table.organizationId, table.jurisdictionId, table.status, table.updatedAt),
}));

export type InsuranceRequestRecord = typeof insuranceRequests.$inferSelect;


/** Internal employee authentication is deliberately separate from OAuth sessions. */
export const internalCredentials = mysqlTable("internal_credentials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  username: varchar("username", { length: 80 }).notNull(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  failedAttempts: int("failedAttempts").default(0).notNull(),
  lockedUntil: timestamp("lockedUntil"),
  active: int("active").default(1).notNull(),
  accountType: mysqlEnum("accountType", ["employee", "showcase"]).default("employee").notNull(),
  passwordChangedAt: timestamp("passwordChangedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ usernameIdx: uniqueIndex("internal_credentials_username_idx").on(table.username), userIdx: uniqueIndex("internal_credentials_user_idx").on(table.userId) }));

export const internalSessions = mysqlTable("internal_sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionHash: varchar("sessionHash", { length: 128 }).notNull(),
  userId: int("userId").notNull(),
  organizationId: int("organizationId").notNull(),
  branchId: int("branchId").notNull(),
  jurisdictionId: int("jurisdictionId").notNull(),
  role: varchar("role", { length: 80 }).notNull(),
  sessionMode: mysqlEnum("sessionMode", ["production", "showcase"]).default("production").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  revokedAt: timestamp("revokedAt"),
  lastSeenAt: timestamp("lastSeenAt").defaultNow().notNull(),
}, table => ({ sessionHashIdx: uniqueIndex("internal_sessions_hash_idx").on(table.sessionHash), userScopeIdx: index("internal_sessions_user_scope_idx").on(table.userId, table.organizationId, table.branchId, table.revokedAt) }));

export const passwordResetTokens = mysqlTable("password_reset_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  credentialId: int("credentialId").notNull(),
  tokenHash: varchar("tokenHash", { length: 128 }).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ tokenHashIdx: uniqueIndex("password_reset_tokens_hash_idx").on(table.tokenHash), userIdx: index("password_reset_tokens_user_idx").on(table.userId, table.expiresAt) }));

export const authenticationEvents = mysqlTable("authentication_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  username: varchar("username", { length: 80 }),
  organizationId: int("organizationId"),
  branchId: int("branchId"),
  jurisdictionId: int("jurisdictionId"),
  eventType: mysqlEnum("eventType", ["login_success", "login_failure", "logout", "lockout", "session_revoked", "password_reset_requested", "password_reset_completed", "cache_refreshed", "showcase_mutation_simulated"]).notNull(),
  source: mysqlEnum("source", ["internal", "oauth"]).notNull(),
  requestId: varchar("requestId", { length: 120 }),
  recordHash: varchar("recordHash", { length: 128 }).notNull(),
  previousHash: varchar("previousHash", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ authEventTimeIdx: index("authentication_events_time_idx").on(table.createdAt), authEventScopeIdx: index("authentication_events_scope_idx").on(table.organizationId, table.branchId, table.jurisdictionId, table.createdAt) }));

export type InternalCredential = typeof internalCredentials.$inferSelect;
export type InternalSession = typeof internalSessions.$inferSelect;
export type AuthenticationEvent = typeof authenticationEvents.$inferSelect;


/** Egypt internal hospital and payer foundation. External submission remains fail-closed. */
export const healthcareFacilities = mysqlTable("healthcare_facilities", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  jurisdictionId: int("jurisdictionId").notNull(),
  branchId: int("branchId").notNull(),
  facilityType: mysqlEnum("facilityType", ["government_hospital", "private_hospital", "primary_care", "laboratory", "radiology", "rehabilitation"]).notNull(),
  licensingStatus: mysqlEnum("licensingStatus", ["unverified", "pending", "licensed", "suspended", "expired"]).default("unverified").notNull(),
  accreditationStatus: mysqlEnum("accreditationStatus", ["not_ready", "readiness", "submitted", "accredited", "expired"]).default("not_ready").notNull(),
  licenseReference: varchar("licenseReference", { length: 160 }),
  accreditationReference: varchar("accreditationReference", { length: 160 }),
  readinessEvidenceJson: text("readinessEvidenceJson"),
  active: int("active").default(1).notNull(),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ scopeIdx: index("healthcare_facilities_scope_idx").on(table.organizationId, table.jurisdictionId, table.branchId, table.facilityType) }));

export const healthcarePatients = mysqlTable("healthcare_patients", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  jurisdictionId: int("jurisdictionId").notNull(),
  branchId: int("branchId").notNull(),
  nationalIdHash: varchar("nationalIdHash", { length: 128 }),
  localMedicalRecordNumber: varchar("localMedicalRecordNumber", { length: 80 }).notNull(),
  fullNameEncrypted: text("fullNameEncrypted").notNull(),
  dateOfBirthEncrypted: text("dateOfBirthEncrypted"),
  sex: mysqlEnum("sex", ["female", "male", "intersex", "unknown"]).default("unknown").notNull(),
  phoneHash: varchar("phoneHash", { length: 128 }),
  consentStatus: mysqlEnum("consentStatus", ["pending", "granted", "withdrawn"]).default("pending").notNull(),
  active: int("active").default(1).notNull(),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ mrnIdx: uniqueIndex("healthcare_patients_scope_mrn_idx").on(table.organizationId, table.branchId, table.localMedicalRecordNumber), nationalIdx: index("healthcare_patients_national_hash_idx").on(table.organizationId, table.nationalIdHash) }));

export const healthcareEncounters = mysqlTable("healthcare_encounters", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  jurisdictionId: int("jurisdictionId").notNull(),
  branchId: int("branchId").notNull(),
  patientId: int("patientId").notNull(),
  facilityId: int("facilityId").notNull(),
  encounterType: mysqlEnum("encounterType", ["primary_care", "outpatient", "emergency", "inpatient", "day_surgery", "telehealth", "follow_up"]).notNull(),
  status: mysqlEnum("status", ["scheduled", "arrived", "in_progress", "referred", "admitted", "discharged", "cancelled"]).default("scheduled").notNull(),
  attendingUserId: int("attendingUserId"),
  chiefComplaintEncrypted: text("chiefComplaintEncrypted"),
  clinicalSummaryEncrypted: text("clinicalSummaryEncrypted"),
  startedAt: timestamp("startedAt"),
  endedAt: timestamp("endedAt"),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ patientTimeIdx: index("healthcare_encounters_patient_time_idx").on(table.organizationId, table.branchId, table.patientId, table.createdAt), statusIdx: index("healthcare_encounters_status_idx").on(table.organizationId, table.branchId, table.status) }));

export const healthcareAppointments = mysqlTable("healthcare_appointments", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  jurisdictionId: int("jurisdictionId").notNull(),
  branchId: int("branchId").notNull(),
  patientId: int("patientId").notNull(),
  facilityId: int("facilityId").notNull(),
  clinicianUserId: int("clinicianUserId"),
  specialty: varchar("specialty", { length: 120 }).notNull(),
  status: mysqlEnum("status", ["requested", "confirmed", "checked_in", "completed", "cancelled", "no_show"]).default("requested").notNull(),
  scheduledAt: timestamp("scheduledAt").notNull(),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ scheduleIdx: index("healthcare_appointments_schedule_idx").on(table.organizationId, table.branchId, table.scheduledAt, table.status) }));

export const healthcareReferrals = mysqlTable("healthcare_referrals", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  jurisdictionId: int("jurisdictionId").notNull(),
  fromBranchId: int("fromBranchId").notNull(),
  toBranchId: int("toBranchId"),
  patientId: int("patientId").notNull(),
  encounterId: int("encounterId"),
  specialty: varchar("specialty", { length: 120 }).notNull(),
  reasonEncrypted: text("reasonEncrypted"),
  status: mysqlEnum("status", ["requested", "accepted", "scheduled", "completed", "declined", "cancelled"]).default("requested").notNull(),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ referralIdx: index("healthcare_referrals_scope_status_idx").on(table.organizationId, table.jurisdictionId, table.fromBranchId, table.status) }));

export const insuranceMembers = mysqlTable("insurance_members", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  jurisdictionId: int("jurisdictionId").notNull(),
  patientId: int("patientId").notNull(),
  payerCode: varchar("payerCode", { length: 80 }).notNull(),
  memberReferenceHash: varchar("memberReferenceHash", { length: 128 }).notNull(),
  eligibilityStatus: mysqlEnum("eligibilityStatus", ["unknown", "pending", "active", "inactive", "expired", "blocked"]).default("unknown").notNull(),
  coverageStart: timestamp("coverageStart"),
  coverageEnd: timestamp("coverageEnd"),
  sourceStatus: mysqlEnum("sourceStatus", ["internal", "verified_external", "unverified_external"]).default("internal").notNull(),
  lastVerifiedAt: timestamp("lastVerifiedAt"),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ memberIdx: uniqueIndex("insurance_members_payer_member_idx").on(table.organizationId, table.payerCode, table.memberReferenceHash), patientIdx: index("insurance_members_patient_idx").on(table.organizationId, table.patientId) }));

export const insuranceClaims = mysqlTable("insurance_claims", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  jurisdictionId: int("jurisdictionId").notNull(),
  branchId: int("branchId").notNull(),
  patientId: int("patientId").notNull(),
  memberId: int("memberId"),
  encounterId: int("encounterId"),
  payerCode: varchar("payerCode", { length: 80 }).notNull(),
  claimNumber: varchar("claimNumber", { length: 120 }).notNull(),
  status: mysqlEnum("status", ["draft", "ready", "submitted", "received", "under_review", "approved", "partially_approved", "rejected", "appealed", "paid", "reconciled", "cancelled"]).default("draft").notNull(),
  credentialGate: mysqlEnum("credentialGate", ["not_configured", "test_ready", "production_ready"]).default("not_configured").notNull(),
  totalAmount: decimal("totalAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  approvedAmount: decimal("approvedAmount", { precision: 14, scale: 2 }),
  externalReference: varchar("externalReference", { length: 160 }),
  claimJson: text("claimJson"),
  responseJson: text("responseJson"),
  idempotencyKey: varchar("idempotencyKey", { length: 180 }).notNull(),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ claimIdx: uniqueIndex("insurance_claims_scope_number_idx").on(table.organizationId, table.claimNumber), statusIdx: index("insurance_claims_scope_status_idx").on(table.organizationId, table.jurisdictionId, table.branchId, table.status), idempotencyIdx: uniqueIndex("insurance_claims_idempotency_idx").on(table.idempotencyKey) }));

export const insuranceClaimLines = mysqlTable("insurance_claim_lines", {
  id: int("id").autoincrement().primaryKey(),
  claimId: int("claimId").notNull(),
  serviceCode: varchar("serviceCode", { length: 120 }).notNull(),
  description: varchar("description", { length: 240 }).notNull(),
  quantity: decimal("quantity", { precision: 12, scale: 3 }).default("1").notNull(),
  requestedAmount: decimal("requestedAmount", { precision: 14, scale: 2 }).notNull(),
  approvedAmount: decimal("approvedAmount", { precision: 14, scale: 2 }),
  adjudicationStatus: mysqlEnum("adjudicationStatus", ["pending", "approved", "partially_approved", "rejected"]).default("pending").notNull(),
  denialCode: varchar("denialCode", { length: 80 }),
});

export type HealthcareFacility = typeof healthcareFacilities.$inferSelect;
export type HealthcarePatient = typeof healthcarePatients.$inferSelect;
export type HealthcareEncounter = typeof healthcareEncounters.$inferSelect;
export type InsuranceClaim = typeof insuranceClaims.$inferSelect;


export const healthcareBeds = mysqlTable("healthcare_beds", {
  id: int("id").autoincrement().primaryKey(), organizationId: int("organizationId").notNull(), jurisdictionId: int("jurisdictionId").notNull(), branchId: int("branchId").notNull(), facilityId: int("facilityId").notNull(), wardCode: varchar("wardCode", { length: 80 }).notNull(), bedCode: varchar("bedCode", { length: 80 }).notNull(), status: mysqlEnum("status", ["available", "occupied", "reserved", "blocked", "maintenance"]).default("available").notNull(), createdAt: timestamp("createdAt").defaultNow().notNull(), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ scopeIdx: index("healthcare_beds_scope_status_idx").on(table.organizationId, table.jurisdictionId, table.branchId, table.status), uniqueBed: uniqueIndex("healthcare_beds_facility_bed_idx").on(table.facilityId, table.bedCode) }));

export const healthcareAdmissions = mysqlTable("healthcare_admissions", {
  id: int("id").autoincrement().primaryKey(), organizationId: int("organizationId").notNull(), jurisdictionId: int("jurisdictionId").notNull(), branchId: int("branchId").notNull(), patientId: int("patientId").notNull(), encounterId: int("encounterId").notNull(), bedId: int("bedId"), admissionType: mysqlEnum("admissionType", ["planned", "emergency", "observation", "transfer"]).notNull(), status: mysqlEnum("status", ["requested", "admitted", "on_leave", "discharged", "cancelled"]).default("requested").notNull(), admittedAt: timestamp("admittedAt"), dischargedAt: timestamp("dischargedAt"), dischargeSummaryEncrypted: text("dischargeSummaryEncrypted"), createdByUserId: int("createdByUserId").notNull(), createdAt: timestamp("createdAt").defaultNow().notNull(), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ scopeIdx: index("healthcare_admissions_scope_status_idx").on(table.organizationId, table.jurisdictionId, table.branchId, table.status), patientIdx: index("healthcare_admissions_patient_idx").on(table.organizationId, table.patientId) }));

export const healthcareClinicalOrders = mysqlTable("healthcare_clinical_orders", {
  id: int("id").autoincrement().primaryKey(), organizationId: int("organizationId").notNull(), jurisdictionId: int("jurisdictionId").notNull(), branchId: int("branchId").notNull(), patientId: int("patientId").notNull(), encounterId: int("encounterId").notNull(), orderType: mysqlEnum("orderType", ["lab", "radiology", "medication", "procedure", "referral"]).notNull(), serviceCode: varchar("serviceCode", { length: 120 }).notNull(), status: mysqlEnum("status", ["requested", "scheduled", "in_progress", "resulted", "cancelled"]).default("requested").notNull(), resultEncrypted: text("resultEncrypted"), orderedByUserId: int("orderedByUserId").notNull(), createdAt: timestamp("createdAt").defaultNow().notNull(), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ scopeIdx: index("healthcare_orders_scope_status_idx").on(table.organizationId, table.jurisdictionId, table.branchId, table.status), encounterIdx: index("healthcare_orders_encounter_idx").on(table.encounterId) }));

export const insurancePayerContracts = mysqlTable("insurance_payer_contracts", {
  id: int("id").autoincrement().primaryKey(), organizationId: int("organizationId").notNull(), jurisdictionId: int("jurisdictionId").notNull(), payerCode: varchar("payerCode", { length: 80 }).notNull(), contractReference: varchar("contractReference", { length: 120 }).notNull(), status: mysqlEnum("status", ["draft", "pending_review", "active", "suspended", "expired"]).default("draft").notNull(), credentialGate: mysqlEnum("credentialGate", ["not_configured", "test_ready", "production_ready"]).default("not_configured").notNull(), effectiveFrom: timestamp("effectiveFrom"), effectiveTo: timestamp("effectiveTo"), createdByUserId: int("createdByUserId").notNull(), createdAt: timestamp("createdAt").defaultNow().notNull(), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ scopeIdx: index("insurance_payer_contracts_scope_status_idx").on(table.organizationId, table.jurisdictionId, table.status), refIdx: uniqueIndex("insurance_payer_contracts_ref_idx").on(table.organizationId, table.contractReference) }));

export const insurancePreauthorizations = mysqlTable("insurance_preauthorizations", {
  id: int("id").autoincrement().primaryKey(), organizationId: int("organizationId").notNull(), jurisdictionId: int("jurisdictionId").notNull(), branchId: int("branchId").notNull(), patientId: int("patientId").notNull(), encounterId: int("encounterId"), payerCode: varchar("payerCode", { length: 80 }).notNull(), requestNumber: varchar("requestNumber", { length: 120 }).notNull(), status: mysqlEnum("status", ["draft", "ready", "submitted", "received", "approved", "partially_approved", "rejected", "expired", "cancelled"]).default("draft").notNull(), credentialGate: mysqlEnum("credentialGate", ["not_configured", "test_ready", "production_ready"]).default("not_configured").notNull(), requestedAmount: decimal("requestedAmount", { precision: 14, scale: 2 }).default("0").notNull(), approvedAmount: decimal("approvedAmount", { precision: 14, scale: 2 }), externalReference: varchar("externalReference", { length: 160 }), idempotencyKey: varchar("idempotencyKey", { length: 180 }).notNull(), createdByUserId: int("createdByUserId").notNull(), createdAt: timestamp("createdAt").defaultNow().notNull(), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ scopeIdx: index("insurance_preauth_scope_status_idx").on(table.organizationId, table.jurisdictionId, table.branchId, table.status), requestIdx: uniqueIndex("insurance_preauth_request_idx").on(table.organizationId, table.requestNumber), idemIdx: uniqueIndex("insurance_preauth_idempotency_idx").on(table.idempotencyKey) }));

export const insuranceRemittances = mysqlTable("insurance_remittances", {
  id: int("id").autoincrement().primaryKey(), organizationId: int("organizationId").notNull(), jurisdictionId: int("jurisdictionId").notNull(), branchId: int("branchId").notNull(), payerCode: varchar("payerCode", { length: 80 }).notNull(), remittanceReference: varchar("remittanceReference", { length: 120 }).notNull(), status: mysqlEnum("status", ["draft", "received", "under_reconciliation", "partially_reconciled", "reconciled", "disputed"]).default("draft").notNull(), credentialGate: mysqlEnum("credentialGate", ["not_configured", "test_ready", "production_ready"]).default("not_configured").notNull(), amount: decimal("amount", { precision: 14, scale: 2 }).default("0").notNull(), reconciliationJson: text("reconciliationJson"), createdByUserId: int("createdByUserId").notNull(), createdAt: timestamp("createdAt").defaultNow().notNull(), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ scopeIdx: index("insurance_remittances_scope_status_idx").on(table.organizationId, table.jurisdictionId, table.branchId, table.status), refIdx: uniqueIndex("insurance_remittances_ref_idx").on(table.organizationId, table.remittanceReference) }));

export const insuranceAppeals = mysqlTable("insurance_appeals", {
  id: int("id").autoincrement().primaryKey(), organizationId: int("organizationId").notNull(), jurisdictionId: int("jurisdictionId").notNull(), branchId: int("branchId").notNull(), claimId: int("claimId").notNull(), status: mysqlEnum("status", ["draft", "submitted", "under_review", "accepted", "rejected", "withdrawn"]).default("draft").notNull(), reasonEncrypted: text("reasonEncrypted"), externalReference: varchar("externalReference", { length: 160 }), credentialGate: mysqlEnum("credentialGate", ["not_configured", "test_ready", "production_ready"]).default("not_configured").notNull(), createdByUserId: int("createdByUserId").notNull(), createdAt: timestamp("createdAt").defaultNow().notNull(), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ scopeIdx: index("insurance_appeals_scope_status_idx").on(table.organizationId, table.jurisdictionId, table.branchId, table.status), claimIdx: index("insurance_appeals_claim_idx").on(table.claimId) }));


/** Internal private-hospital billing foundation; payer and tax submission remain fail-closed. */
export const hospitalBillingAccounts = mysqlTable("hospital_billing_accounts", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  jurisdictionId: int("jurisdictionId").notNull(),
  branchId: int("branchId").notNull(),
  facilityId: int("facilityId").notNull(),
  patientId: int("patientId").notNull(),
  encounterId: int("encounterId"),
  payerType: mysqlEnum("payerType", ["self_pay", "insurance", "government", "employer"]).notNull(),
  packageCode: varchar("packageCode", { length: 120 }),
  status: mysqlEnum("status", ["draft", "pending_approval", "approved", "partially_paid", "paid", "disputed", "cancelled"]).default("draft").notNull(),
  approvalStatus: mysqlEnum("approvalStatus", ["not_required", "pending", "approved", "rejected"]).default("pending").notNull(),
  depositAmount: decimal("depositAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  billedAmount: decimal("billedAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  paidAmount: decimal("paidAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  externalInvoiceGate: mysqlEnum("externalInvoiceGate", ["not_configured", "test_ready", "production_ready"]).default("not_configured").notNull(),
  notesEncrypted: text("notesEncrypted"),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ scopeIdx: index("hospital_billing_scope_status_idx").on(table.organizationId, table.jurisdictionId, table.branchId, table.status), patientIdx: index("hospital_billing_patient_idx").on(table.organizationId, table.patientId) }));


/** GAHAR readiness evidence management; official accreditation remains fail-closed. */
export const gaharReadinessProfiles = mysqlTable("gahar_readiness_profiles", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  jurisdictionId: int("jurisdictionId").notNull(),
  branchId: int("branchId").notNull(),
  facilityId: int("facilityId").notNull(),
  facilityType: mysqlEnum("facilityType", ["government_hospital", "private_hospital", "primary_care", "laboratory", "radiology", "rehabilitation", "mental_health", "extended_care"]).notNull(),
  standardFamily: varchar("standardFamily", { length: 160 }).notNull(),
  standardVersion: varchar("standardVersion", { length: 80 }).notNull(),
  effectiveFrom: timestamp("effectiveFrom"),
  status: mysqlEnum("status", ["draft", "self_assessment", "action_required", "ready_for_review", "submitted_blocked", "archived"]).default("draft").notNull(),
  officialSubmissionGate: mysqlEnum("officialSubmissionGate", ["not_authorized", "test_ready", "production_authorized"]).default("not_authorized").notNull(),
  ownerUserId: int("ownerUserId").notNull(),
  reviewDueAt: timestamp("reviewDueAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ scopeIdx: index("gahar_profiles_scope_status_idx").on(table.organizationId, table.jurisdictionId, table.branchId, table.status), facilityIdx: index("gahar_profiles_facility_idx").on(table.facilityId) }));

export const gaharCriteria = mysqlTable("gahar_criteria", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  orientation: mysqlEnum("orientation", ["patient_centered", "organization_centered"]).notNull(),
  domainCode: varchar("domainCode", { length: 80 }).notNull(),
  criterionCode: varchar("criterionCode", { length: 120 }).notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  requirementSummary: text("requirementSummary").notNull(),
  ownerUserId: int("ownerUserId"),
  reviewCycleDays: int("reviewCycleDays").default(365).notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "partially_met", "met", "not_applicable", "blocked"]).default("not_started").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ profileStatusIdx: index("gahar_criteria_profile_status_idx").on(table.profileId, table.status), codeIdx: uniqueIndex("gahar_criteria_profile_code_idx").on(table.profileId, table.criterionCode) }));

export const gaharEvidence = mysqlTable("gahar_evidence", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  criterionId: int("criterionId").notNull(),
  evidenceType: mysqlEnum("evidenceType", ["policy", "procedure", "training", "audit", "indicator", "incident", "record", "attachment"]).notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  referenceKey: varchar("referenceKey", { length: 180 }),
  contentHash: varchar("contentHash", { length: 128 }),
  verificationStatus: mysqlEnum("verificationStatus", ["unverified", "verified_internal", "rejected", "expired"]).default("unverified").notNull(),
  verifiedByUserId: int("verifiedByUserId"),
  validFrom: timestamp("validFrom"),
  validUntil: timestamp("validUntil"),
  notesEncrypted: text("notesEncrypted"),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ criterionStatusIdx: index("gahar_evidence_criterion_status_idx").on(table.criterionId, table.verificationStatus), profileIdx: index("gahar_evidence_profile_idx").on(table.profileId) }));

export const gaharCorrectiveActions = mysqlTable("gahar_corrective_actions", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  criterionId: int("criterionId").notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  riskLevel: mysqlEnum("riskLevel", ["low", "moderate", "high", "critical"]).notNull(),
  status: mysqlEnum("status", ["open", "assigned", "in_progress", "pending_verification", "closed", "overdue"]).default("open").notNull(),
  ownerUserId: int("ownerUserId").notNull(),
  dueAt: timestamp("dueAt"),
  resolutionEncrypted: text("resolutionEncrypted"),
  verifiedByUserId: int("verifiedByUserId"),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ profileStatusIdx: index("gahar_actions_profile_status_idx").on(table.profileId, table.status) }));

export const gaharQualityIndicators = mysqlTable("gahar_quality_indicators", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  code: varchar("code", { length: 100 }).notNull(),
  name: varchar("name", { length: 240 }).notNull(),
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  numerator: decimal("numerator", { precision: 14, scale: 4 }).default("0").notNull(),
  denominator: decimal("denominator", { precision: 14, scale: 4 }).default("0").notNull(),
  value: decimal("value", { precision: 14, scale: 4 }),
  sourceStatus: mysqlEnum("sourceStatus", ["internal_verified", "internal_pending", "external_blocked"]).default("internal_pending").notNull(),
  reviewedByUserId: int("reviewedByUserId"),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ profilePeriodIdx: index("gahar_indicators_profile_period_idx").on(table.profileId, table.periodStart, table.periodEnd), codeIdx: uniqueIndex("gahar_indicators_profile_code_period_idx").on(table.profileId, table.code, table.periodStart, table.periodEnd) }));
