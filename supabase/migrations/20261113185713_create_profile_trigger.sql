/*
# Auto-create profile on user signup

Plain-English summary
When a new user registers through Supabase Auth, a matching row is now
automatically inserted into the `profiles` table. This means the app can
load the user's display name and role immediately after they create an
account, without requiring a separate step.

1. New Functions
- `handle_new_user()`: a trigger function that reads the new user's email
  and display_name (from auth metadata) and inserts a row into `profiles`
  with the default role 'Creator'.

2. New Triggers
- `on_auth_user_created`: fires AFTER INSERT on `auth.users`, calling
  `handle_new_user()` for each new row.

3. Security
- The trigger function runs with SECURITY DEFINER (as the table owner) so
  it can insert into `profiles` even though the new user hasn't
  authenticated yet. This is the standard Supabase pattern.
- EXECUTE on the function is revoked from PUBLIC and anon; only the
  trigger (running as owner) and `authenticated` can call it.

4. Important notes
- Idempotent: the function uses INSERT ... ON CONFLICT DO NOTHING, so
  re-runs or duplicate trigger fires won't create duplicate profiles.
- The `profiles` table and its RLS policies already exist from a prior
  migration; this only adds the trigger.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'New user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
