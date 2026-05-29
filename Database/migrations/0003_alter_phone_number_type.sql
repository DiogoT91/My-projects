BEGIN;

ALTER TABLE store
  ALTER COLUMN phone_number TYPE VARCHAR(20)
  USING phone_number::text;

COMMIT;
