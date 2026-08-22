# MEDORA | ميدورا

> **Healthcare operations, made governable.**
> **تشغيل الرعاية الصحية، بوضوحٍ وحوكمة.**

**MEDORA Health Care Eco System** is a bilingual healthcare-operations workspace for pharmacy, hospital, and multi-site teams. It brings point of sale, inventory, prescription-review workflows, access boundaries, and operational auditability into one deliberate environment—without presenting roadmap items or external integrations as live guarantees.

**MEDORA | ميدورا** منظومة تشغيل صحية ثنائية اللغة للصيدليات والمستشفيات والفرق متعددة المواقع. تجمع نقاط البيع والمخزون ومسارات مراجعة الوصفات وحدود الوصول والتدقيق التشغيلي في بيئة واحدة منضبطة، دون تقديم عناصر خارطة الطريق أو التكاملات الخارجية كوعود تشغيلية قائمة.

## Enter MEDORA | الدخول إلى ميدورا

**[Open the MEDORA workspace](https://aldorapharm-fwilugbd.manus.space)**
مساحة العمل المنشورة حاليًا ومسار الدخول المحمي.

**[Explore the product](docs/MEDORA-product-description-ar-en.md)**
نطاق المنتج، الجهات المستهدفة، والحدود التشغيلية المقصودة.

**[Read the security boundary](docs/security-review.md)**
الأدلة المتاحة، الضوابط، والحدود التي ما زالت مفتوحة.

> The visible workspace host is a deployment identifier; **MEDORA** is the product identity. A custom MEDORA domain requires an owner-authorized domain change.
> اسم المضيف الظاهر هو معرّف للنشر، بينما **MEDORA** هي هوية المنتج. يحتاج نطاق MEDORA مخصص إلى تغيير نطاق معتمد من مالك المشروع.

---

## Start with confidence | ابدأ بوضوح

### Product and operating scope | نطاق المنتج والتشغيل

**[Product overview](docs/MEDORA-product-description-ar-en.md)** explains the intended operational scope, intended audiences, and product language.
يوضح **[وصف المنتج](docs/MEDORA-product-description-ar-en.md)** النطاق التشغيلي المقصود والجهات المستهدفة ولغة المنتج.

### Role-oriented guidance | إرشاد حسب الدور

**[User manuals](docs/MEDORA-user-manuals-ar-en.md)** group practical guidance around the people who operate the workspace.
تجمع **[أدلة المستخدم](docs/MEDORA-user-manuals-ar-en.md)** الإرشادات العملية بحسب الأشخاص الذين يشغّلون مساحة العمل.

### Engineering and assurance | الهندسة والضمان

**[Architecture](docs/architecture.md)** documents implementation structure and engineering boundaries. **[Release readiness](docs/FINAL-RELEASE-READINESS-2026-08-22.md)** distinguishes verified work from owner- or external-party actions.
يوثق **[دليل البنية](docs/architecture.md)** هيكل التنفيذ وحدوده الهندسية. ويميز **[استعداد الإصدار](docs/FINAL-RELEASE-READINESS-2026-08-22.md)** بين ما تم التحقق منه وما يتطلب إجراءً من المالك أو طرف خارجي.

---

## Built around accountable operations | مبنية حول تشغيل خاضع للمساءلة

### Point of sale and stock | نقاط البيع والمخزون

Controlled selling, stock movement, batch-aware work, and branch context for day-to-day pharmacy operations.
بيع منضبط، وحركة مخزون، والعمل الواعي بالدفعات وسياق الفرع للعمليات الصيدلية اليومية.

### Prescription review | مراجعة الوصفات

Human-confirmed assistance around prescription-related workflows—not autonomous clinical decision-making.
مساعدة تخضع لتأكيد بشري في مسارات الوصفات، وليست اتخاذ قرار سريريًا ذاتيًا.

### Governance and traceability | الحوكمة وقابلية التتبع

Role boundaries, organization context, and operational activity designed to be auditable.
حدود للصلاحيات، وسياق مؤسسي، ونشاط تشغيلي مصمم ليكون قابلاً للتدقيق.

### Bilingual continuity | استمرارية ثنائية اللغة

Arabic RTL and English-oriented workflows across responsive surfaces for the same governed operating context.
مسارات عربية RTL وإنجليزية عبر واجهات متجاوبة ضمن السياق التشغيلي المحكوم نفسه.

> **Responsible-use boundary.** MEDORA supports human work and decision support. It does not claim clinical autonomy, regulatory approval, live government connectivity, or guaranteed outcomes unless a specific verified integration record says otherwise.
>
> **حد الاستخدام المسؤول.** تدعم ميدورا العمل البشري والمساعدة في اتخاذ القرار. ولا تدعي الاستقلال السريري أو الاعتماد التنظيمي أو الاتصال الحكومي الحي أو النتائج المضمونة ما لم يثبت سجل تكامل محدد ذلك صراحةً.

---

## Repository at a glance | خريطة المستودع

**`client/` — تجربة المستخدم.** React application and responsive user experience.

**`server/` — منطق الخدمة.** API, domain logic, access controls, and operational procedures.

**`drizzle/` — البيانات.** Database schema and migration history.

**`docs/` — المعرفة التشغيلية.** Product, operating, security, and readiness documentation.

**`e2e/` — رحلات الاستخدام.** End-to-end coverage and journey checks.

**`scripts/` — التحقق المتكرر.** Repeatable maintenance and verification utilities.

## Run locally | التشغيل محليًا

```bash
git clone https://github.com/0SSAM/MEDORA-Health-Care-Eco-System.git
cd MEDORA-Health-Care-Eco-System
pnpm install
pnpm dev
```

Use the project’s configured environment rather than committing secrets. Before production work, review the current environment and deployment documentation.
استخدم بيئة المشروع المهيأة بدلًا من إدخال الأسرار إلى Git. راجع وثائق البيئة والنشر الحالية قبل أي عمل إنتاجي.

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

## Technology | التقنية

`TypeScript` · `React` · `Vite` · `Node.js` · `Express` · `tRPC` · `Drizzle`
`Tailwind CSS` · `Vitest` · `PWA`

## Contribution and repository safety | المساهمة وسلامة المستودع

Use an integration branch and a pull request for every code or documentation change. Keep credentials, protected data, and production exports out of Git. The repository is currently publicly visible; an application sign-in or NDA gate does **not** make source code private. Repository visibility and collaborator settings require an authorized owner action.

استخدم فرع تكامل وطلب دمج لأي تعديل برمجي أو توثيقي. لا تضع بيانات الاعتماد أو البيانات المحمية أو صادرات الإنتاج داخل Git. المستودع ظاهر للعامة حاليًا؛ تسجيل الدخول أو بوابة NDA داخل التطبيق **لا** يجعل الشفرة المصدرية خاصة. تتطلب خصوصية المستودع وإعدادات المتعاونين إجراءً معتمدًا من مالكه.

## License and ownership | الترخيص والملكية

**MEDORA Health Care Eco System**

Copyright © 2026 Hossam Naeim Osman. All rights reserved.
Repository license: **UNLICENSED**.

---

**MEDORA | ميدورا**

*Healthcare operations, with clarity, accountability, and human control.*
*تشغيل صحي بوضوح ومساءلة وتحكم بشري.*
