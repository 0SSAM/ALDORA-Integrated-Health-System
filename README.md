# MEDORA | ميدورا

> **A governed, bilingual healthcare operations workspace.**
> **مساحة عمل تشغيلية صحية محكومة وثنائية اللغة.**

MEDORA brings day-to-day healthcare operations into a deliberate workflow for pharmacy, hospital, and multi-site teams. It connects the operational foundations around point of sale, inventory, prescription review, access control, and auditability—without presenting roadmap work or external integrations as live guarantees.

تجمع ميدورا العمليات اليومية لجهات الرعاية الصحية ضمن مسار عمل منضبط للصيدليات والمستشفيات والفرق متعددة المواقع. وهي تربط الأسس التشغيلية لنقاط البيع والمخزون ومراجعة الوصفات والتحكم في الوصول والتدقيق، دون عرض عناصر خارطة الطريق أو التكاملات الخارجية كوعود تشغيلية قائمة.

**[Open the MEDORA workspace](https://aldorapharm-fwilugbd.manus.space)** &nbsp;·&nbsp; **[Explore the product](docs/MEDORA-product-description-ar-en.md)** &nbsp;·&nbsp; **[Read the security boundary](docs/security-review.md)**

> The published workspace currently uses a protected sign-in route. The visible host name is a deployment identifier; **MEDORA** is the product identity. A custom MEDORA domain requires an owner-authorized domain change.
>
> تستخدم مساحة العمل المنشورة حاليًا مسار دخول محميًا. اسم المضيف الظاهر هو معرّف للنشر، بينما **MEDORA** هي هوية المنتج. يحتاج نطاق MEDORA مخصص إلى تغيير نطاق معتمد من مالك المشروع.

---

## Start here | ابدأ من هنا

| Path | What it gives you | ما الذي ستجده؟ |
|---|---|---|
| [Product overview](docs/MEDORA-product-description-ar-en.md) | The intended operational scope and audience. | نطاق المنتج والجمهور المستهدف. |
| [User manuals](docs/MEDORA-user-manuals-ar-en.md) | Role-oriented guides for using the workspace. | أدلة استخدام حسب الدور الوظيفي. |
| [Architecture](docs/architecture.md) | The implementation structure and engineering boundaries. | البنية التقنية وحدود التنفيذ. |
| [Security review](docs/security-review.md) | Security posture, evidence, and open boundaries. | وضع الأمان والأدلة والحدود المفتوحة. |
| [Release readiness](docs/FINAL-RELEASE-READINESS-2026-08-22.md) | What has been verified and what still needs owner or external action. | ما تم التحقق منه وما يحتاج إجراءً من المالك أو طرف خارجي. |

## What MEDORA is built to support | ما الذي تدعمه ميدورا؟

| Operational area | Product intent | النية التشغيلية |
|---|---|---|
| **Point of sale & stock** | Controlled selling, stock movement, batch-aware work, and branch context. | بيع منضبط، وحركة مخزون، والعمل الواعي بالدفعات والفروع. |
| **Prescription review** | Human-confirmed assistance around prescription-related workflows. | مساعدة تخضع لتأكيد بشري في مسارات الوصفات. |
| **Governance & auditability** | Role boundaries, organization context, and traceable operational activity. | حدود صلاحيات وسياق مؤسسي ونشاط تشغيلي قابل للتتبع. |
| **Bilingual continuity** | Arabic RTL and English-oriented workflows across responsive surfaces. | مسارات عربية RTL وإنجليزية عبر واجهات متجاوبة. |

> **Responsible-use boundary:** MEDORA supports human work and decision support. It does not claim clinical autonomy, regulatory approval, live government connectivity, or guaranteed outcomes unless a specific verified integration record says otherwise.
>
> **حد الاستخدام المسؤول:** تدعم ميدورا العمل البشري والمساعدة في اتخاذ القرار. ولا تدعي الاستقلال السريري أو الاعتماد التنظيمي أو الاتصال الحكومي الحي أو النتائج المضمونة ما لم يثبت سجل تكامل محدد ذلك صراحةً.

## Repository map | خريطة المستودع

| Location | Purpose |
|---|---|
| `client/` | React application and responsive user experience. |
| `server/` | API, domain logic, access controls, and operational procedures. |
| `drizzle/` | Database schema and migration history. |
| `docs/` | Product, operating, security, and readiness documentation. |
| `e2e/` | End-to-end coverage and journey checks. |
| `scripts/` | Repeatable maintenance and verification utilities. |

## Run locally | التشغيل محليًا

```bash
git clone https://github.com/0SSAM/MEDORA-Health-Care-Eco-System.git
cd MEDORA-Health-Care-Eco-System
pnpm install
pnpm dev
```

Use the project’s configured environment rather than committing secrets. Before production work, review the current environment and deployment documentation. Run the quality gates with:

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

## Technology | التقنية

`TypeScript` · `React` · `Vite` · `Node.js` · `Express` · `tRPC` · `Drizzle` · `Tailwind CSS` · `Vitest` · `PWA`

## Contribution and repository safety | المساهمة وسلامة المستودع

Use an integration branch and a pull request for code or documentation changes. Keep credentials, protected data, and production exports out of Git. The repository is currently publicly visible; an application sign-in or NDA gate does **not** make source code private. Repository visibility and collaborator settings require an authorized owner action.

استخدم فرع تكامل وطلب دمج لأي تعديل برمجي أو توثيقي. لا تضع بيانات الاعتماد أو البيانات المحمية أو صادرات الإنتاج داخل Git. المستودع ظاهر للعامة حاليًا؛ تسجيل الدخول أو بوابة NDA داخل التطبيق **لا** يجعل الشفرة المصدرية خاصة. تتطلب خصوصية المستودع وإعدادات المتعاونين إجراءً معتمدًا من مالكه.

## License and ownership | الترخيص والملكية

**MEDORA Health Care Eco System**

Copyright © 2026 Hossam Naeim Osman. All rights reserved.
Repository license: **UNLICENSED**.

---

**MEDORA | ميدورا**

*Healthcare operations, with clarity, accountability, and human control.*
*تشغيل صحي بوضوح ومساءلة وتحكم بشري.*
