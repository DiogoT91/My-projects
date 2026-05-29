BEGIN;

-- Add auth_user_id to merchant so policies can map Supabase auth users to merchants.
ALTER TABLE merchant
  ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

-- Create helper function to resolve the current merchant from the authenticated user.
CREATE OR REPLACE FUNCTION current_merchant_id()
RETURNS INTEGER LANGUAGE sql STABLE AS $$
  SELECT id
  FROM merchant
  WHERE auth_user_id = auth.uid();
$$;

-- Enable RLS on relevant tables.
ALTER TABLE merchant ENABLE ROW LEVEL SECURITY;
ALTER TABLE store ENABLE ROW LEVEL SECURITY;
ALTER TABLE product ENABLE ROW LEVEL SECURITY;

-- Merchant policies: user can only see their own merchant row.
CREATE POLICY merchant_select_own
  ON merchant
  FOR SELECT
  USING (auth_user_id = auth.uid());

CREATE POLICY merchant_update_own
  ON merchant
  FOR UPDATE
  USING (auth_user_id = auth.uid());

CREATE POLICY merchant_delete_own
  ON merchant
  FOR DELETE
  USING (auth_user_id = auth.uid());

-- Store policies: merchant can only manage their own stores.
CREATE POLICY store_select_own
  ON store
  FOR SELECT
  USING (merchant_id = current_merchant_id());

CREATE POLICY store_insert_own
  ON store
  FOR INSERT
  WITH CHECK (merchant_id = current_merchant_id());

CREATE POLICY store_update_own
  ON store
  FOR UPDATE
  USING (merchant_id = current_merchant_id())
  WITH CHECK (merchant_id = current_merchant_id());

CREATE POLICY store_delete_own
  ON store
  FOR DELETE
  USING (merchant_id = current_merchant_id());

-- Product policies: merchant can only manage products that belong to their stores.
CREATE POLICY product_select_own
  ON product
  FOR SELECT
  USING (
    store_id IN (
      SELECT id FROM store WHERE merchant_id = current_merchant_id()
    )
  );

CREATE POLICY product_insert_own
  ON product
  FOR INSERT
  WITH CHECK (
    store_id IN (
      SELECT id FROM store WHERE merchant_id = current_merchant_id()
    )
  );

CREATE POLICY product_update_own
  ON product
  FOR UPDATE
  USING (
    store_id IN (
      SELECT id FROM store WHERE merchant_id = current_merchant_id()
    )
  )
  WITH CHECK (
    store_id IN (
      SELECT id FROM store WHERE merchant_id = current_merchant_id()
    )
  );

CREATE POLICY product_delete_own
  ON product
  FOR DELETE
  USING (
    store_id IN (
      SELECT id FROM store WHERE merchant_id = current_merchant_id()
    )
  );

COMMIT;
