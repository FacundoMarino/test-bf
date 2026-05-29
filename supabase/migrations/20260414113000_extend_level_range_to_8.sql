
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_level_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_level_check
  CHECK (level IS NULL OR (level >= 1 AND level <= 8));

ALTER TABLE court_bookings
  DROP CONSTRAINT IF EXISTS court_bookings_level_check;

ALTER TABLE court_bookings
  ADD CONSTRAINT court_bookings_level_check
  CHECK (level IS NULL OR (level >= 1 AND level <= 8));

ALTER TABLE loose_matches
  DROP CONSTRAINT IF EXISTS loose_matches_level_check;

ALTER TABLE loose_matches
  ADD CONSTRAINT loose_matches_level_check
  CHECK (level >= 1 AND level <= 8);
