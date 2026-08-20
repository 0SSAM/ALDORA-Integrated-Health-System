# Contributing to ALDORA | المساهمة في ألدورا

Thank you for helping build **ALDORA — the Integrated Health System**. This project supports pharmacy, hospital, and healthcare-network operations, so every contribution must balance product value with safety, privacy, auditability, and regulatory awareness.

شكرًا لمساهمتك في بناء **ألدورا — منظومة الرعاية الصحية المتكاملة**. يدعم المشروع عمليات الصيدليات والمستشفيات وشبكات الرعاية الصحية؛ لذلك يجب أن تجمع كل مساهمة بين القيمة العملية والسلامة والخصوصية وقابلية التدقيق والوعي بالمتطلبات التنظيمية.

## Before You Start | قبل البدء

Please read the project [README](README.md), the relevant material in `docs/`, and the repository [SECURITY.md](SECURITY.md). Do not commit real patient data, production credentials, private keys, access tokens, database exports, screenshots containing sensitive information, dependency caches, build artifacts, or local logs.

يرجى قراءة [README](README.md) والوثائق ذات الصلة داخل `docs/` وملف [SECURITY.md](SECURITY.md). يُمنع منعًا باتًا رفع بيانات مرضى حقيقية أو بيانات اعتماد الإنتاج أو المفاتيح الخاصة أو رموز الوصول أو نسخ قواعد البيانات أو لقطات تحتوي على معلومات حساسة أو ملفات التخزين المؤقت أو مخرجات البناء أو السجلات المحلية.

## Contribution Workflow | دورة المساهمة

1. **Create an issue or discussion first for substantial work.** Describe the user problem, affected workflow, regulatory assumptions, security implications, and the smallest useful scope. For a small documentation or test correction, a pull request may be opened directly.

   **أنشئ Issue أو نقاشًا أولًا للأعمال الكبيرة.** اشرح مشكلة المستخدم، ومسار العمل المتأثر، والافتراضات التنظيمية، والآثار الأمنية، وأصغر نطاق مفيد. أما إصلاحات الوثائق أو الاختبارات الصغيرة فيمكن تقديمها مباشرة عبر Pull Request.

2. **Create a focused branch from `main`.** Use a descriptive name such as `feature/fefo-alerts`, `fix/eta-validation`, `docs/security-guide`, or `test/pos-contracts`. Never work directly on `main`.

   **أنشئ فرعًا متخصصًا من `main`.** استخدم اسمًا واضحًا مثل `feature/fefo-alerts` أو `fix/eta-validation` أو `docs/security-guide` أو `test/pos-contracts`. لا تعمل مباشرة على `main`.

3. **Implement the smallest complete change.** Keep business rules on the server, preserve tenant isolation, make permission checks explicit, and avoid silently changing compliance behavior. Add or update tests for every changed rule.

   **نفّذ أصغر تغيير مكتمل.** أبقِ قواعد الأعمال على الخادم، وحافظ على عزل المستأجرين، واجعل فحوصات الصلاحيات صريحة، وتجنب تغيير سلوك الامتثال دون توثيق. أضف أو حدّث الاختبارات لكل قاعدة متغيرة.

4. **Run local quality checks.** At minimum, run `pnpm check`, `pnpm test`, and `pnpm build`. When changing workflows or smoke behavior, also run `pnpm exec prettier --check .github/workflows`, `bash -n scripts/ci-smoke.sh`, and the applicable smoke flow.

   **شغّل فحوصات الجودة محليًا.** شغّل على الأقل `pnpm check` و`pnpm test` و`pnpm build`. وعند تعديل ملفات CI أو الاختبارات السريعة، شغّل أيضًا `pnpm exec prettier --check .github/workflows` و`bash -n scripts/ci-smoke.sh` ومسار التحقق المناسب.

5. **Review the diff before opening a pull request.** Confirm that the diff contains only intentional files and that no secret, credential, cache, build output, or local log is included. Use `git status`, `git diff --stat`, and `git diff --check`.

   **راجع الفرق قبل فتح Pull Request.** تأكد من أن الفرق يحتوي على الملفات المقصودة فقط، وأنه لا يتضمن أسرارًا أو بيانات اعتماد أو تخزينًا مؤقتًا أو مخرجات بناء أو سجلات محلية. استخدم `git status` و`git diff --stat` و`git diff --check`.

6. **Open a pull request using the repository template.** Summarize the English and Arabic impact, list tests, identify migrations or operational prerequisites, and state whether the change affects patient safety, billing, audit trails, or regulatory integration.

   **افتح Pull Request باستخدام القالب الموجود في المستودع.** لخّص الأثر بالعربية والإنجليزية، وسجّل الاختبارات، وحدد أي ترحيلات أو متطلبات تشغيلية، واذكر ما إذا كان التغيير يؤثر في سلامة المرضى أو الفوترة أو سجلات التدقيق أو التكاملات التنظيمية.

## Technical Expectations | التوقعات التقنية

| Area | Expectation | التوقع بالعربية |
|---|---|---|
| Architecture | Preserve the separation between client, server, shared types, and database migrations. | الحفاظ على الفصل بين الواجهة والخادم والأنواع المشتركة وترحيلات قاعدة البيانات. |
| Security | Enforce authorization on the server; client-side visibility is not a security boundary. | فرض التفويض على الخادم؛ إخفاء عناصر الواجهة ليس حدًا أمنيًا. |
| Healthcare data | Use synthetic fixtures and redact sensitive values in tests and logs. | استخدام بيانات اختبار اصطناعية وإخفاء القيم الحساسة في الاختبارات والسجلات. |
| Auditability | Keep important state transitions explainable and traceable. | إبقاء انتقالات الحالة المهمة قابلة للتفسير والتتبع. |
| Compliance | Treat MOH, EDA, ETA, NFSA, UHIA, and similar integrations as explicit boundaries. | التعامل مع تكاملات الجهات التنظيمية كحدود واضحة ومُوثقة. |
| Accessibility | Preserve keyboard access, readable contrast, responsive layouts, and Arabic RTL behavior. | الحفاظ على الوصول بلوحة المفاتيح والتباين والتجاوب واتجاه RTL العربي. |
| Tests | Add regression coverage for business rules, authorization, validation, and integrations. | إضافة اختبارات انحدار لقواعد الأعمال والتفويض والتحقق والتكاملات. |

## Pull Request Review | مراجعة Pull Request

Every pull request should be reviewed for correctness, security, tenant isolation, operational impact, documentation quality, and test evidence. Changes affecting `/server/`, `/drizzle/`, `/.github/`, or security documentation require explicit owner review according to `CODEOWNERS`.

يجب مراجعة كل Pull Request من حيث الصحة والأمان وعزل المستأجرين والأثر التشغيلي وجودة التوثيق وأدلة الاختبار. وتتطلب التغييرات التي تمس `/server/` أو `/drizzle/` أو `/.github/` أو وثائق الأمان مراجعة صريحة من مالك المشروع وفقًا لملف `CODEOWNERS`.

## Commit Messages | رسائل الالتزام

Use concise, imperative messages with a conventional prefix when practical: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `security:`, or `ci:`. If the change is user-facing, mention the business capability and include Arabic context when it improves clarity.

استخدم رسائل موجزة بصيغة الأمر مع بادئة واضحة عند الإمكان مثل: `feat:` أو `fix:` أو `docs:` أو `test:` أو `refactor:` أو `security:` أو `ci:`. وإذا كان التغيير ظاهرًا للمستخدم، فاذكر القدرة التشغيلية وأضف السياق العربي عند الحاجة.

## Questions and Support | الأسئلة والدعم

For feature questions, open a GitHub issue with a reproducible description. For suspected vulnerabilities, do **not** open a public issue; follow the private reporting process in [SECURITY.md](SECURITY.md).

للاستفسارات المتعلقة بالميزات، أنشئ Issue يتضمن وصفًا قابلًا لإعادة الإنتاج. أما الثغرات المحتملة فلا تُنشر في Issue عام، بل اتبع آلية الإبلاغ الخاص في [SECURITY.md](SECURITY.md).

Thank you for improving ALDORA responsibly.

شكرًا لتحسين ألدورا بمسؤولية.

## References | المراجع

- [ALDORA README](README.md)
- [ALDORA Security Policy](SECURITY.md)
- [GitHub Documentation: About pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)
- [GitHub Documentation: About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)

<!-- References: GitHub documentation pages above. -->

---

© 2026 ALDORA Health Care Eco System. Private project.
