# MEDORA Security Policy | سياسة أمان ميدورا

## Scope | النطاق

MEDORA is a multi-tenant healthcare operations platform for pharmacy, hospital, and healthcare-network workflows. This policy covers the source code, deployment configuration, server procedures, authentication and authorization boundaries, audit trails, AI-assisted prescription workflows, integrations, and documentation maintained in this repository.

ميدورا هي منصة متعددة المستأجرين لعمليات الصيدليات والمستشفيات وشبكات الرعاية الصحية. تشمل هذه السياسة الكود المصدري وإعدادات النشر وإجراءات الخادم وحدود المصادقة والتفويض وسجلات التدقيق ومسارات الوصفات المدعومة بالذكاء الاصطناعي والتكاملات والوثائق الموجودة في هذا المستودع.

## Security Principles | مبادئ الأمان

MEDORA follows a **fail-closed, least-privilege, tenant-isolated** approach. A feature must not silently proceed when identity, authorization, validation, regulatory prerequisites, or external integration state is missing. User-interface visibility is never treated as a security boundary; sensitive authorization decisions belong on the server.

تتبع ميدورا نهجًا **مغلقًا عند الفشل، وأقل صلاحية ممكنة، وعزلًا صارمًا للمستأجرين**. لا يجوز للميزة أن تتابع التنفيذ بصمت عند غياب الهوية أو التفويض أو التحقق أو المتطلبات التنظيمية أو حالة التكامل الخارجي. لا يُعد إخفاء عناصر الواجهة حدًا أمنيًا؛ بل يجب أن تتم قرارات التفويض الحساسة على الخادم.

| Control | MEDORA expectation | التوقع في ميدورا |
|---|---|---|
| Tenant isolation | Every tenant-scoped read and write must be authorized and scoped server-side. | كل قراءة وكتابة مرتبطة بمستأجر يجب تفويضها وتحديد نطاقها على الخادم. |
| Authentication | Authentication state is validated before protected procedures are executed. | التحقق من حالة المصادقة قبل تنفيذ الإجراءات المحمية. |
| Authorization | Roles and permissions are enforced on the server for Admin, Pharmacist, Cashier, and Manager workflows. | فرض الأدوار والصلاحيات على الخادم لمسارات المدير والصيدلي والكاشير والمشرف. |
| Sensitive data | Never use real patient, prescription, credential, or production financial data in fixtures, tests, issues, or pull requests. | عدم استخدام بيانات المرضى أو الوصفات أو بيانات الاعتماد أو البيانات المالية الحقيقية في الاختبارات أو Issues أو Pull Requests. |
| Auditability | Important state transitions must remain attributable, reviewable, and tamper-evident where implemented. | يجب أن تكون انتقالات الحالة المهمة قابلة للنسب والمراجعة ومقاومة للتلاعب حيثما تم تنفيذها. |
| AI safety | Prescription extraction is assistive only and requires pharmacist confirmation before dispensing; it must not silently create a sale. | استخراج الوصفات مساعد فقط ويتطلب تأكيد الصيدلي قبل الصرف، ولا ينشئ عملية بيع بصمت. |
| Integrations | External regulatory and payment integrations remain explicit boundaries and must fail safely when unavailable. | التكاملات التنظيمية وتكاملات الدفع حدود صريحة ويجب أن تفشل بأمان عند عدم توفرها. |

## Supported Security Practices | الممارسات الأمنية المدعومة

The repository uses automated TypeScript checks, tests, production builds, isolated database lifecycle checks, CodeQL analysis, Dependabot configuration, protected branches, and explicit owner review for security-sensitive surfaces. Contributors should run the applicable checks locally before opening a pull request.

يستخدم المستودع فحوصات TypeScript واختبارات وبناء الإنتاج وفحوصات دورة حياة قاعدة بيانات معزولة وتحليل CodeQL وإعداد Dependabot وفروعًا محمية ومراجعة صريحة من المالك للأسطح الحساسة. ينبغي للمساهمين تشغيل الفحوصات المناسبة محليًا قبل فتح Pull Request.

## Reporting a Vulnerability | الإبلاغ عن ثغرة

Please **do not disclose suspected vulnerabilities in a public GitHub issue, pull request, discussion, screenshot, or commit**. Send a private report to the project owner through the private security-reporting channel configured for this repository. Include the affected component, a concise description, reproducibility steps, impact assessment, and a safe proof of concept that contains no real healthcare data.

يرجى **عدم نشر الثغرات المحتملة في Issue أو Pull Request أو نقاش أو لقطة شاشة أو Commit عام على GitHub**. أرسل البلاغ الخاص إلى مالك المشروع عبر قناة الإبلاغ الأمني الخاصة المعتمدة لهذا المستودع. يجب أن يتضمن البلاغ المكوّن المتأثر ووصفًا موجزًا وخطوات إعادة الإنتاج وتقييم الأثر وإثبات مفهوم آمنًا لا يحتوي على بيانات صحية حقيقية.

| Include | Do not include |
|---|---|
| Affected file, route, procedure, or workflow. | Real patient or prescription records. |
| Reproduction steps and expected versus actual behavior. | Passwords, API keys, tokens, private keys, or database dumps. |
| Security impact and likely abuse path. | Unredacted screenshots or production URLs with sensitive parameters. |
| Suggested mitigation, if known. | Automated destructive testing against live systems. |

If the issue involves an active production system, stop testing, preserve only minimal non-sensitive evidence, and notify the owner immediately. Do not attempt to access data belonging to another tenant or user.

إذا كانت المشكلة تتعلق بنظام إنتاج نشط، فأوقف الاختبار واحتفظ بأدلة غير حساسة وبالحد الأدنى فقط، وأبلغ المالك فورًا. لا تحاول الوصول إلى بيانات مستأجر أو مستخدم آخر.

## Coordinated Disclosure | الإفصاح المنسق

The project owner will triage the report, determine severity and affected versions, coordinate a fix, and decide whether a security advisory or release note is appropriate. Reporters are asked to allow reasonable time for validation and remediation before public disclosure.

سيقوم مالك المشروع بتقييم البلاغ وتحديد درجة الخطورة والإصدارات المتأثرة وتنسيق الإصلاح وتحديد ملاءمة إصدار تنبيه أمني أو ملاحظة إصدار. يُرجى منح وقت معقول للتحقق والمعالجة قبل الإفصاح العام.

## Dependency and Secret Hygiene | نظافة الاعتماديات والأسرار

Never commit `.env` files, credentials, production configuration, private certificates, cloud access keys, dependency caches, build outputs, local logs, or temporary exports. Use synthetic CI-only values and keep production secrets in the approved secret-management system. Review `git diff --check`, `git status`, and the complete staged file list before every push.

يُمنع رفع ملفات `.env` أو بيانات الاعتماد أو إعدادات الإنتاج أو الشهادات الخاصة أو مفاتيح السحابة أو تخزين الاعتماديات المؤقت أو مخرجات البناء أو السجلات المحلية أو الملفات المصدّرة المؤقتة. استخدم قيمًا اصطناعية مخصصة لـ CI، واحتفظ بأسرار الإنتاج في نظام إدارة الأسرار المعتمد. راجع `git diff --check` و`git status` وقائمة الملفات المضافة كاملة قبل كل Push.

## References | المراجع

- [MEDORA README](README.md)
- [MEDORA Contribution Guide](CONTRIBUTING.md)
- [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories)
- [GitHub Code Security](https://docs.github.com/en/code-security)
- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)

---

© 2026 MEDORA Health Care Eco System. Private project.
