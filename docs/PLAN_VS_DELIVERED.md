# Plan versus delivered (Round 2)

This page compares the Round 1 plan with what the Round 2 build actually contains, so reviewers can see progress and the reasons for changes.

## Technology changes

| Area | Round 1 plan | Round 2 build | Why it changed |
| --- | --- | --- | --- |
| Frontend | Next.js + TypeScript + Tailwind | Vite + React 18 + TypeScript + Tailwind | Faster to build and deploy as a single-page app within the build window. No server rendering was needed |
| Backend | Python FastAPI | Supabase edge function (Deno) | One hosted platform instead of a separate API service |
| Database | PostgreSQL + pgvector on Supabase | Supabase PostgreSQL, no vectors yet | Retrieval is not needed while the source set is small and fully read by every rule |
| AI | Claude API with structured output | None. Rule-based checks only | Built the deterministic base and the workflow first. AI is planned for Round 3 |
| Auth | Supabase Auth with roles | No sign-up or sign-in. Role switch in the header (demo) | Decision: judges can try every role without creating an account |

## Features: planned versus delivered

| Feature | Status |
| --- | --- |
| Draft review with highlights, channel and audience | Delivered |
| Terminology, tone, claims and facts checks with source citations | Delivered (rule-based) |
| Suggested fixes with accept, edit, dismiss; dismissal needs a reason | Delivered |
| Revision history and activity log, saved to a database | Delivered |
| Approval routing, approve, request changes, reject, with notes | Delivered |
| Read-only source library with owners and expiry dates | Delivered |
| Document and image upload | Not delivered. Planned for Round 3 |
| Confidentiality tiers and redaction | Not delivered. Planned for Round 3 |
| AI analysis for tone, messaging and claims | Not delivered. Planned for Round 3 |
| User accounts and role-based access | Dropped by design. Roles are enforced in the app through a demo switch; no sign-up page |
| Governance insights dashboard | Not delivered. Planned for Round 3 |

## The three named improvements

| Improvement | Status |
| --- | --- |
| Citation-verified findings | Partly delivered. Each finding is checked in code: the cited source must exist, the quoted passage must appear in it, and the flagged text must sit at the recorded position. A model-based check of whether the source supports the finding comes with AI analysis in Round 3 |
| Intent-preserving fixes | Not yet. Fixes are single, small rewrites shown before and after. Extracting and checking intent is planned for Round 3 |
| Guideline-ambiguity insights | Not yet. Dismissals are already recorded with reasons, which is the data this feature needs. The dashboard is planned for Round 3 |

## Disclosure

- No AI model is used inside the product at this stage. The tone check is a rule-based Supabase edge function.
- AI tools used while building: Google Gemini for research, and ChatGPT and Claude for planning, drafting and code assistance. All output was reviewed by the team.
- External services: Supabase (database and edge function), Vercel (hosting), Pexels (photos), Google Fonts.
