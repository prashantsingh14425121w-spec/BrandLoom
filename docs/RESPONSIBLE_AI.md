# Responsible AI, Privacy and Oversight

This document states what BrandLoom does with people's content, what it does not do, and how a human stays in control.

## Current disclosure

- **No AI model is used in the current prototype.** Every check is a fixed rule written in code and listed in [REVIEW_RULES.md](REVIEW_RULES.md).
- **Draft text goes to our own Supabase project only.** While you edit, the draft is sent to a Supabase edge function (rule-based tone check) and saved, together with dismissals and the activity log, in a Supabase demo database hosted by us. No draft text is sent to any third-party AI or analytics service.
- **The tone check is not AI.** It is a set of fixed patterns. The interface labels it "Rule-based tone check".
- **Do not paste confidential text into the demo.** The demo database has open anonymous access and no sign-in.
- **The demo data is fictional.** Northwind Outdoor, its guidelines and facts are invented for demonstration.
- **Research and drafting tools.** The challenge plan records that Google Gemini was used for research, and ChatGPT and Claude were used for planning and drafting. All content was reviewed by the team.

## Planned disclosure for production

When AI analysis is added, the product will show users, in plain language:

- which model and which external services are used,
- what data is sent (only the text being reviewed and the approved passages it is checked against),
- which findings were produced by AI and labelled as such.

## Human oversight

- AI and rules suggest. People decide.
- Nothing is published, approved or edited without a person doing it.
- Dismissing a finding requires a written reason.
- Claims and expired facts never receive an automatic rewrite.
- Approval routing depends on risk. A dismissed claim or fact requires a Reviewer.
- Approvers must leave a note when requesting changes or rejecting.

## Grounded findings

- A finding appears only when it cites an approved source passage.
- The citation check confirms that the source exists, that the quoted passage appears in it, and that the flagged text is at the recorded position in the draft. Findings that fail are discarded.
- When no source supports a concern, the product should ask a question rather than state a rule was broken. The current rules do not generate such questions yet.

## Confidentiality (planned)

Each source and content item will carry a confidentiality tier. Restricted items will never be sent to external services. Internal items will be sent only after redaction of detected sensitive data (emails, phone numbers, keys). The prototype has no tiers yet because it sends nothing externally.

## Access control (planned)

Role-based permissions and row-level security will ensure users see only the workspaces and content they are allowed to access. The prototype uses a demo role switch, not verified identities.

## Fairness

- Tone findings tie back to written guidelines, not to the reviewer's taste.
- The rules do not judge dialect, spelling variants or non-native phrasing unless a guideline says so.
- Reviewers see the reason and the source for every finding, so a finding can be challenged on its merits.

## Data handling

- The prototype saves draft text, dismissals and the activity log in a Supabase demo database, one draft per browser (ID kept in local storage). Access policies are open to anonymous users because there is no sign-in; the activity log and dismissals are insert-only.
- There is no sign-up or sign-in by design. Roles are a demo switch in the header, not verified identities. A production version would need accounts before real content is used.
- Production plans call for encrypted storage and transport, no use of customer content for model training, and deletion on request.

## Accessibility

- Controls have visible focus states and labels.
- Motion is reduced for users who prefer less motion.
- Text uses dark-on-light colour pairs. A formal WCAG contrast audit has not been run yet.
- The interface follows keyboard navigation, contrast and label patterns. Tone checks avoid penalising dialects or non-native writers by tying flags to written guidelines rather than taste.
