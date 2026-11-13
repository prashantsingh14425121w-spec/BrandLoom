/*
# Remove the sign-up profile trigger

Plain-English summary
The product has no sign-up or sign-in. Roles are a demo switch in the header. The earlier
`create_profile_trigger` migration pointed at a `profiles` table that no migration creates,
so it is removed from the repository. This migration cleans up the trigger and function if
they were already applied to a database.

1. Removed objects
- Trigger `on_auth_user_created` on `auth.users`
- Function `public.handle_new_user()`

2. Security
- No table, policy or data changes.

3. Important notes
- Idempotent: safe to run on a database that never had the trigger.
*/

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
