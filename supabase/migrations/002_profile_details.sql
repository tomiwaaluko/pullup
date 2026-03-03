-- Add member profile detail columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS graduation_year int;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS major text;

-- Update the handle_new_user trigger to populate new fields from user metadata
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_grad_year int;
BEGIN
  -- Safely cast graduation_year to int (returns NULL if not a valid number)
  BEGIN
    v_grad_year := (NEW.raw_user_meta_data->>'graduation_year')::int;
  EXCEPTION WHEN OTHERS THEN
    v_grad_year := NULL;
  END;

  INSERT INTO profiles (id, email, name, first_name, last_name, school, graduation_year, major)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    TRIM(COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', '')),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'school',
    v_grad_year,
    NEW.raw_user_meta_data->>'major'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
