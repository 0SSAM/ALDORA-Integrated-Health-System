import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { protectedProcedure, router } from "../_core/trpc";
import { enforceDiscount, selectFefoBatches, type AppRole } from "../domain/rules";

const pharmacistProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = ctx.user.role as AppRole;
  if (!["admin", "manager", "pharmacist"].includes(role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Pharmacist review permission required" });
  }
  return next();
});

export const erpRouter = router({
  policy: router({
    validateDiscount: protectedProcedure
      .input(z.object({ officialPrice: z.number().nonnegative(), discountAmount: z.number().nonnegative() }))
      .query(({ input }) => enforceDiscount(input.officialPrice, input.discountAmount)),
    planFefo: protectedProcedure
      .input(z.object({ requestedQuantity: z.number().positive(), batches: z.array(z.object({ id: z.string(), expiryDate: z.coerce.date(), quantityOnHand: z.number().nonnegative() })) }))
      .query(({ input }) => selectFefoBatches(input.batches, input.requestedQuantity)),
  }),
  prescription: router({
    extract: pharmacistProcedure
      .input(z.object({ imageUrl: z.string().url().or(z.string().startsWith("data:image/")) }))
      .mutation(async ({ input }) => {
        const result = await invokeLLM({
          model: "gemini-3-flash-preview",
          messages: [{ role: "user", content: [
            { type: "text", text: "اقرأ صورة هذه الوصفة الطبية المصرية. استخرج النص الدوائي فقط، ولا تخمّن أسماء غير واضحة. أعد ثقة منخفضة عند عدم اليقين. النتائج تحتاج مراجعة صيدلي ولا تمثل قرار صرف." },
            { type: "image_url", image_url: { url: input.imageUrl, detail: "high" } },
          ] }],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "prescription_extraction",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  items: { type: "array", items: { type: "object", properties: { detectedText: { type: "string" }, dosage: { type: "string" }, quantity: { type: "string" }, confidence: { type: "number" } }, required: ["detectedText", "dosage", "quantity", "confidence"], additionalProperties: false } },
                  overallConfidence: { type: "number" },
                  requiresPharmacistReview: { type: "boolean" },
                },
                required: ["items", "overallConfidence", "requiresPharmacistReview"],
                additionalProperties: false,
              },
            },
          },
        });
        const content = result.choices?.[0]?.message?.content;
        if (typeof content !== "string") throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Vision model returned no structured result" });
        return { extraction: JSON.parse(content), status: "PENDING_REVIEW" as const, model: "gemini-3-flash-preview" };
      }),
  }),
});
