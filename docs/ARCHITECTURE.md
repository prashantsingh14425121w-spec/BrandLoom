# BrandLoom: Architecture

## Current prototype

The prototype is a single-page web app built with Vite, React 18, TypeScript and Tailwind CSS. Everything runs in the browser. Drafts, dismissals and the activity log are held in memory for the session, and nothing is stored in a database. Icons come from lucide-react. There is no AI call and no sign-in yet.

### Layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| Source data | `src/data/demoBrand.ts` | Fictional guidelines and approved facts, and the sample draft |
| Types | `src/types.ts` | Shared shapes for sources, findings, decisions and log entries |
| Review engine | `src/lib/reviewEngine.ts` | Runs rules over a draft, builds findings, and checks each finding's citation |
| Workflow state | `src/hooks/useReviewWorkflow.ts` | Holds the draft, revision, role, status, dismissals and activity log |
| Screens | `src/components/` | Header, page hero, review, approval and sources screens |
| Shell | `src/App.tsx` | Tabs, page heroes and layout |

### How a review runs

1. The draft text changes, and `runReview` runs every rule over it.
2. Each rule finds matches with a global pattern. A rule either returns a verdict (with category, severity, status, confidence, reason, source ID, quoted passage and optional fix) or nothing.
3. Each candidate finding is verified before it is kept. The cited source must exist, the quoted passage must appear in that source, and the flagged text must still sit at the recorded position in the draft. A candidate that fails is discarded and counted.
4. Findings are sorted by position. Findings the creator dismissed are removed by matching their dismissal key, which combines the rule, the flagged text and the surrounding words.
5. Accepting a fix or dismissing a finding creates a new revision automatically, increments the revision counter and writes to the activity log. The review then runs again on the new text.

### Workflow rules

- Only the Creator can edit the draft or resolve findings, and only while the status is draft, changes requested or rejected.
- Submission requires zero open findings and non-empty text.
- The approver is a Reviewer if any claim or fact finding was dismissed, otherwise a Manager.
- Only the routed approver can approve, request changes or reject. A request for changes or a rejection requires a note.
- Approval is terminal for the revision. Rejection sends the draft back to the creator for editing and resubmission.

### Rendering

- Tailwind utility classes with a stone neutral scale and an emerald accent.
- Inter (Google Fonts) with three weights: 400, 500 and 600.
- Scroll reveals use IntersectionObserver. Hero photos use a slow zoom. Motion is turned off for users who prefer reduced motion.

## Planned production architecture

The plan in the challenge document describes the target system. The mapping from prototype to production is:

| Concern | Prototype | Production (planned) |
| --- | --- | --- |
| Frontend | Vite + React | Next.js (React) + TypeScript + Tailwind, as in the plan |
| Backend | None | Python FastAPI, running the review pipeline and verifier |
| Data | In-memory state for the session | PostgreSQL with pgvector on Supabase, with row-level security by role and confidentiality tier |
| Auth | Role switch in the header | Supabase Auth with role-based access control |
| AI analysis | None | Claude API (LLM) with structured JSON output; embedding model for retrieval |
| Rule checks | JavaScript rules in the browser | Python rules: regex / term lists, WCAG contrast calculation (Pillow, colorspace maths), alt-text and heading checks |
| Parsing | None | pypdf / python-docx, OCR (Tesseract) for images |
| Retrieval | Every rule reads the whole source set | Guideline and fact chunks embedded and retrieved per content segment |
| Verifier | Code checks citation and span | Code checks, plus a second model call that confirms the source supports the finding |
| Audit log | In-memory activity list | Append-only audit table |
| Hosting | Local dev server | Vercel (frontend) + Render or Railway (API) |
| Quality | Manual testing | pytest, small labelled evaluation set of content with known issues |

### Hardest technical challenge: trustworthy, grounded findings

The main risk is that an AI reviewer produces plausible but wrong flags. The production architecture addresses this in four ways:

- **Retrieval over approved sources only.** Guidelines and facts are chunked, embedded and retrieved per content segment. The model sees only these chunks, not its general knowledge, as the authority.
- **Structured output with mandatory citations.** The model must return a source ID and quoted span for each finding.
- **Verifier pass.** Code checks that the cited chunk exists, that the quoted span appears in it, and that the flagged text appears in the content. A second model call checks whether the source actually supports the finding. Failures are discarded or downgraded to "needs human review".
- **Evaluation set.** A small labelled test set tracks precision and false-positive rate between rounds to show measurable reliability gains.

## Extending the review

To add a rule:

1. Add a source passage to `src/data/demoBrand.ts` if the rule needs one.
2. Add an entry to `RULES` in `src/lib/reviewEngine.ts` with a unique ID, a global pattern and a check function.
3. Make sure the verdict's quoted passage appears verbatim in the cited source. Otherwise the verifier discards every finding from that rule.
4. Document the rule in `docs/REVIEW_RULES.md`.
