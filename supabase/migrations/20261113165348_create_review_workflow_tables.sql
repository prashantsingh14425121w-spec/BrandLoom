/*
# Create review workflow tables

Plain-English summary
BrandLoom now stores the draft being reviewed, the dismissals the creator has recorded, and the activity log in the database, so work survives a page refresh.

1. New Tables
- `drafts`: the copy under review.
  - `id` (uuid, primary key)
  - `text` (text, up to 20,000 characters)
  - `channel` (text, one of the four publishing channels)
  - `revision` (integer, starts at 1, never decreases)
  - `status` (text: draft, in-review, changes-requested or approved)
  - `routed_to` (text: Manager or Reviewer, empty until submitted)
  - `created_at`, `updated_at` (timestamps)
- `dismissals`: one row per finding the creator dismissed with a reason.
  - `id`, `draft_id` (linked to drafts, removed with the draft), `dismiss_key`, `category`, `reason` (up to 1,000 characters), `created_at`
- `activity_log`: the append-only record of edits, decisions and comments.
  - `id`, `draft_id` (linked to drafts), `actor` (Creator, Manager, Reviewer or System), `message` (up to 1,000 characters), `created_at`

2. Security
- Row level security is enabled on all three tables.
- The app has no sign-in screen, so every policy targets the `anon` and `authenticated` roles, and the policies say so.
- `drafts`: anyone using the app can read and create drafts and update them. Deletion is not permitted.
- `dismissals`: can be read and added. Existing dismissals cannot be changed or removed.
- `activity_log`: can be read and added. It cannot be edited or deleted, so the history stays intact.
- Length and value checks are enforced in the database, not only in the browser.

3. Important notes
- Permissions (Creator, Manager, Reviewer) are enforced in the app, not the database, because there are no accounts yet.
- Statements are idempotent, so the migration can be safely re-run.
*/

CREATE TABLE IF NOT EXISTS drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL DEFAULT '' CHECK (char_length(text) <= 20000),
  channel text NOT NULL DEFAULT 'Blog post' CHECK (channel IN ('Blog post', 'Product page', 'Social post', 'Email')),
  revision integer NOT NULL DEFAULT 1 CHECK (revision >= 1),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in-review', 'changes-requested', 'approved')),
  routed_to text CHECK (routed_to IS NULL OR routed_to IN ('Manager', 'Reviewer')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dismissals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id uuid NOT NULL REFERENCES drafts(id) ON DELETE CASCADE,
  dismiss_key text NOT NULL CHECK (char_length(dismiss_key) <= 500),
  category text NOT NULL CHECK (category IN ('Terminology', 'Tone', 'Claims', 'Facts')),
  reason text NOT NULL CHECK (char_length(reason) BETWEEN 1 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS dismissals_draft_id_idx ON dismissals (draft_id);

CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id uuid NOT NULL REFERENCES drafts(id) ON DELETE CASCADE,
  actor text NOT NULL CHECK (actor IN ('Creator', 'Manager', 'Reviewer', 'System')),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS activity_log_draft_created_idx ON activity_log (draft_id, created_at DESC);

ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE dismissals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON drafts TO anon, authenticated;
GRANT SELECT, INSERT ON dismissals TO anon, authenticated;
GRANT SELECT, INSERT ON activity_log TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_drafts" ON drafts;
CREATE POLICY "anon_select_drafts" ON drafts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_drafts" ON drafts;
CREATE POLICY "anon_insert_drafts" ON drafts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_drafts" ON drafts;
CREATE POLICY "anon_update_drafts" ON drafts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_dismissals" ON dismissals;
CREATE POLICY "anon_select_dismissals" ON dismissals FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_dismissals" ON dismissals;
CREATE POLICY "anon_insert_dismissals" ON dismissals FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_activity_log" ON activity_log;
CREATE POLICY "anon_select_activity_log" ON activity_log FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_activity_log" ON activity_log;
CREATE POLICY "anon_insert_activity_log" ON activity_log FOR INSERT
  TO anon, authenticated WITH CHECK (true);
