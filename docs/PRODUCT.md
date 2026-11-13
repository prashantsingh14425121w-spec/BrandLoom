# BrandLoom: Product Overview

## The problem

Modern organisations no longer publish through one controlled channel. Employees, freelancers, agencies and AI writing tools all produce content at the same time. Brand guidelines, approved facts and asset libraries exist, but they live in PDFs and wikis that creators rarely re-read under deadline pressure.

The result is content that is off-tone, uses the wrong terminology, repeats outdated facts, makes promotional claims nobody can support, uses the wrong logo or colours, or is inaccessible. These errors are usually found after publication, when credibility is already damaged.

What the brief actually asks for:

- Pre-publication review against approved sources, not generic opinions about writing quality.
- Detection across tone, terminology, messaging, facts, unsupported claims, visual consistency and accessibility.
- Explanation, not rejection: every finding names the guideline or source involved and proposes a fix that keeps the creator's purpose.
- Human control: suggestions never silently override decisions; roles, comments, approvals and revision history are part of the product.
- Governance insight: recurring mistakes and unclear guidelines are surfaced over time.
- Trust: confidential material is protected and AI / external-service use is disclosed.

BrandLoom moves the check before publication. It reviews each draft against the organisation's own approved sources, explains every finding, proposes fixes that keep the creator's purpose, and keeps people in control of every decision.

## Users

| User | Setting | Pain today | What BrandLoom gives them |
| --- | --- | --- | --- |
| Content creator (employee, freelancer, agency writer) | Drafting blogs, posts, decks, ad copy, often with AI tools | Unsure what is on-brand; gets vague feedback late | Instant pre-check with reasons and one-click suggested fixes |
| Brand / marketing manager | Owns guidelines, approves content | Reviews everything manually; same mistakes recur | Triage queue, severity ranking, approval workflow, trend insights |
| Authorised reviewer (legal, compliance, product) | Verifies claims and facts | Receives content without sources for claims | Claims flagged with the approved fact or a clear "unsupported" status |
| Brand / guideline administrator | Maintains guidelines, facts, assets | Cannot tell which rules are ignored or ambiguous | Ambiguity and recurring-issue reports; versioned source library |
| Audience and organisation (indirect) | Customers, partners, regulators | Misleading or inconsistent communication | Fewer incorrect claims reaching the public |

## Principles

1. **Grounded or silent.** A finding appears only when it points to an approved source passage. If no source supports a concern, it is shown as a question for a person, never as a rule violation.
2. **Explain, do not reject.** Each finding names the source and the reason, and offers a fix the creator can accept, edit or dismiss.
3. **Humans decide.** The system never publishes, approves or edits silently. Dismissals need a reason. Every action is logged.
4. **Expired facts are not trusted.** A fact past its expiry date is flagged for its owner.

## What makes our approach different

- **Grounded-or-silent rule.** A finding can only be shown if it points to an approved source chunk, which a separate verification step re-checks. If no source supports it, the item appears as a low-confidence "question for a human", never as a hard rule violation.
- **Intent-preserving rewrites.** We first extract the creator's intent (message, audience, call to action), then generate fixes, then check that the intent is unchanged before offering the suggestion. The creator accepts or rejects each edit individually.
- **Guideline health insights.** We track where reviewers override the AI or where several creators break the same rule, and flag the underlying guideline as ambiguous or outdated, so the fix is made at the source.
- **Hybrid engine.** Deterministic checks (banned terms, colour contrast, missing alt text, required disclaimers) run as code for reliability; AI handles tone, messaging and claim reasoning where judgement is needed.
- **Confidentiality tiers and AI disclosure** are built in from day one rather than added later.

## Three improvements we commit to showing

1. **Citation-verified findings:** no finding is displayed without a validated source reference (reliability and trust).
2. **Intent-preserving fixes:** suggestions are checked against the creator's extracted intent before they are shown.
3. **Guideline-ambiguity insights:** the dashboard identifies which guideline passages cause repeated or disputed findings.

## Workflow

| Step | Who | What happens |
| --- | --- | --- |
| 1. Set up the source library | Admin | Upload brand guideline documents, define terminology (preferred / banned terms), approved facts with owners and expiry dates, and assets (logos, palettes, fonts). Each source gets a version and a confidentiality tier. |
| 2. Submit content | Creator | Paste text or upload a document or image, choose channel and audience. Content is stored as version 1. |
| 3. Automated review | System | Deterministic checks run first, then retrieval of relevant guideline passages and facts, then AI analysis for tone, messaging and claims. A verifier rejects any finding without a valid source citation. (AI analysis is planned.) |
| 4. Explainable findings | Creator | Each finding shows: category, severity, highlighted text, why it was flagged, the exact source passage, confidence, and a suggested fix as a diff. |
| 5. Resolve | Creator | Accept, edit or dismiss each suggestion with a reason. Dismissals and accepted fixes create a new revision automatically. |
| 6. Submit for approval | Creator to Manager | Routing depends on risk: for example, any unsupported claim must go to a reviewer. Comments, change requests and approvals are tracked per revision. |
| 7. Decision | Manager / Reviewer | Approve, request changes or reject. The system never approves on its own. The decision, reviewer and timestamp are logged. |
| 8. Insights | Manager / Admin | Dashboard of recurring mistakes by team and category, most-overridden findings and guideline passages flagged as unclear. (Planned.) |

Workflow overview: Source library → Content submission → Deterministic checks → Retrieval of approved sources → AI analysis → Citation verifier → Findings and suggested fixes → Creator decisions → Review and approval → Audit log and insights.

## Feature list

| Area | Feature | Priority | Status |
| --- | --- | --- | --- |
| Source library | Import guidelines (PDF/DOCX/text); define terminology, approved facts (with owner and expiry) and assets; versioning | Must | Read-only demo library built; import and editing planned |
| Review engine | Terminology and banned-word checks; tone and messaging check; fact check against approved facts; unsupported-claim detection | Must | Built (rule-based) |
| Explainability | Every finding cites the source passage, confidence and reason; "unsupported" and "needs human" statuses | Must | Built |
| Suggested fixes | Intent-preserving rewrite shown as a diff; accept / edit / dismiss per suggestion | Must | Built |
| Workflow | Roles (creator, manager, reviewer, admin), comments, approve / request changes / reject, revision history, audit log | Must | Built with role switching in the demo; accounts planned |
| Visual and accessibility | Image checks: logo and palette conformity, text contrast, missing alt text, heading structure in documents | Should | Planned |
| Insights | Recurring issues by team and category; guidelines frequently overridden or ambiguous | Should | Planned |
| Responsible AI | Confidentiality tiers, redaction before external calls, visible AI-use disclosure, no training on customer data | Must | Disclosure built; tiers and redaction planned |
| Extra formats | Slides and social-post templates, bulk review, browser extension | Future | Not started |

## Demo content

The demo brand, Northwind Outdoor, is fictional. Its guidelines cover tone (G-01), claims (G-02), water-resistance wording (T-01) and product naming (T-02). Its approved facts cover the founding year (F-01), the Ridgeline 40 weight (F-02), recycled content (F-03) and a UK price (F-04), which is deliberately expired so the expiry rule can be seen working.
