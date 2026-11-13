# Roadmap

## Round 1: The Plan (completed)

- Defined problem, users, workflow and architecture in the plan document
- Interview and survey evidence gathered from marketers, social media managers, agency staff and student-club content teams
- Fictional demo brand (Northwind Outdoor) with synthetic guidelines and facts
- Repository created. The Round 1 plan named Next.js + FastAPI + PostgreSQL/pgvector; the Round 2 build uses Vite + React + Supabase (see [PLAN_VS_DELIVERED.md](PLAN_VS_DELIVERED.md))
- AI use disclosure: Google Gemini for research, ChatGPT and Claude for planning and drafting

## Built (Round 2 prototype)

- Draft review with highlighted text, channel and audience selection
- Rule-based checks for terminology, tone, claims and facts, including expiry
- Cited findings with reason, severity, confidence and approved passage
- Suggested fixes with accept, edit and dismiss; dismissals require a reason
- Dismissals and accepted fixes create a new revision automatically
- Approval routing (Manager or Reviewer), approve, request changes and reject with notes
- Roles: Creator, Manager, Reviewer and Admin (demo role switching)
- Activity log and revision numbers, saved to a Supabase demo database (one draft per browser)
- Rule-based tone check in a Supabase edge function (not an AI model)
- Linkable tabs (URL hash) with a title, description and canonical URL for each view
- Read-only source library with owners and expiry dates
- Fictional demo brand and sample copy
- SEO metadata, structured data, sitemap, crawl policy and reduced-motion support

## Round 3 (planned)

- AI analysis for tone, messaging and claims, returning structured JSON with citations
- Verifier that confirms each AI finding's source actually supports it
- Intent-preserving rewrites: extract the creator's message, call to action and audience, then check that each suggested fix keeps them
- Guideline-ambiguity insights: passages that cause repeated or disputed findings
- Image and document accessibility checks: logo and palette conformity, text contrast, missing alt text, heading structure
- Confidentiality tiers with redaction before any external call
- Evaluation set with precision, recall and false-positive measures

## Later

- Guideline import from PDF and DOCX
- Slide and social-post templates, bulk review, browser extension
- Integrations with CMS platforms, Google Workspace, Figma and Slack
- Multilingual and regional guideline variants
- Fact-source connectors for product databases and pricing sheets
- Fine-grained policy engine for regulated industries (financial or health claims)
- Private-model deployment for strict confidentiality needs
- Learning from reviewer overrides to suggest guideline edits, for admin approval only (never auto-applied)

## Known limitations

- Checks match defined wording. They cannot judge a whole piece's tone the way a person can.
- Only one fixed phrasing of each fact is checked.
- Demo database access is open to anonymous users and tied to one draft per browser, so it is not suitable for confidential content.
- The tone check is rule-based. It has no AI model and its second pass uses the same patterns as the first.
- The source library cannot be edited in the app yet.
- There is no sign-up or sign-in by design. Roles are a demo switch, not verified identities.
- Image analysis covers only a limited set of checks in the event timeframe.
