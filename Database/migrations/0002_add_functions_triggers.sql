BEGIN;

-- Normalize merchant email on insert/update to lower-case and trimmed value.
CREATE OR REPLACE FUNCTION normalize_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IS NOT NULL THEN
    NEW.email = lower(trim(NEW.email));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER merchant_normalize_email
BEFORE INSERT OR UPDATE ON merchant
FOR EACH ROW EXECUTE FUNCTION normalize_email();

-- Create a helper function to insert merchants with an initial store in a single transaction.
CREATE OR REPLACE FUNCTION create_merchant_with_store(
  p_email TEXT,
  p_password TEXT,
  p_store_name TEXT,
  p_street TEXT,
  p_city TEXT,
  p_state TEXT,
  p_zip_code TEXT,
  p_phone_number BIGINT,
  p_timezone TEXT
)
RETURNS TABLE (merchant_id INTEGER, store_id INTEGER) AS $$
DECLARE
  existing_merchant merchant;
BEGIN
  SELECT * INTO existing_merchant FROM merchant WHERE email = lower(trim(p_email));

  IF existing_merchant.id IS NOT NULL THEN
    RAISE EXCEPTION 'Merchant with email % already exists.', p_email;
  END IF;

  INSERT INTO merchant (email, password)
  VALUES (lower(trim(p_email)), p_password)
  RETURNING id INTO merchant_id;

  INSERT INTO store (
    name, street, city, state, zip_code, phone_number, timezone, merchant_id
  ) VALUES (
    p_store_name, p_street, p_city, p_state, p_zip_code, p_phone_number, p_timezone, merchant_id
  ) RETURNING id INTO store_id;

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- RPC function to get all products for a merchant.
CREATE OR REPLACE FUNCTION get_products_for_merchant(p_merchant_id INTEGER)
RETURNS TABLE (
  product_id INTEGER,
  store_id INTEGER,
  store_name TEXT,
  name TEXT,
  description TEXT,
  price NUMERIC(10,2),
  availability_status BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    s.id,
    s.name,
    p.name,
    p.description,
    p.price,
    p.availability_status,
    p.created_at,
    p.updated_at
  FROM product p
  JOIN store s ON s.id = p.store_id
  WHERE s.merchant_id = p_merchant_id
  ORDER BY s.id, p.id;
END;
$$ LANGUAGE plpgsql;

-- Optional helper function to get products by store.
CREATE OR REPLACE FUNCTION get_store_products(p_store_id INTEGER)
RETURNS TABLE (
  product_id INTEGER,
  name TEXT,
  description TEXT,
  price NUMERIC(10,2),
  availability_status BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.description,
    p.price,
    p.availability_status,
    p.created_at,
    p.updated_at
  FROM product p
  WHERE p.store_id = p_store_id
  ORDER BY p.id;
END;
$$ LANGUAGE plpgsql;

COMMIT;
