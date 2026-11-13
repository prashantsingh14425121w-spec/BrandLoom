/*
# Update review workflow for audience, Admin role and reject status

Plain-English summary
This migration adds the audience column to drafts, adds 'rejected' as a valid status,
and adds 'Admin' as a valid actor in the activity log. These bring the database in line
with the plan document and the frontend.

1. Modified Tables
- `drafts`: new column `audience` (text, defaults to 'General public'), with a CHECK
  constraint limiting it to the four approved audiences.
- `drafts`: status CHECK constraint now includes 'rejected'.
- `activity_log`: actor CHECK constraint now includes 'Admin'.

2. Security
- No policy changes. Existing anon/authenticated policies on drafts cover the new column
  automatically because they are not column-scoped.
- The new `audience` column is writable by the same roles that already update drafts.

3. Important notes
- Uses IF NOT EXISTS for the column addition so re-runs are safe.
- The status and actor CHECK constraints are replaced (DROP + ADD) to include the new values.
- No data is lost: existing rows keep their current values, and the new column gets its default.
*/

ALTER TABLE drafts ADD COLUMN IF NOT EXISTS audience text NOT NULL DEFAULT 'General public'
  CHECK (audience IN ('General public', 'Existing customers', 'Industry / B2B', 'Internal team'));

ALTER TABLE drafts DROP CONSTRAINT IF EXISTS drafts_status_check;
ALTER TABLE drafts ADD CONSTRAINT drafts_status_check
  CHECK (status IN ('draft', 'in-review', 'changes-requested', 'approved', 'rejected'));

ALTER TABLE activity_log DROP CONSTRAINT IF EXISTS activity_log_actor_check;
ALTER TABLE activity_log ADD CONSTRAINT activity_log_actor_check
  CHECK (actor IN ('Creator', 'Manager', 'Reviewer', 'Admin', 'System'));
