BEGIN;

-- Create merchants table with secure password hashing storage
CREATE TABLE IF NOT EXISTS merchant (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create stores table with relationship to merchant
CREATE TABLE IF NOT EXISTS store (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255),
    phone_number VARCHAR(20) NOT NULL,
    timezone VARCHAR(100) NOT NULL,
    active_inactive_status BOOLEAN NOT NULL DEFAULT TRUE,
    merchant_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_store_merchant
        FOREIGN KEY (merchant_id)
        REFERENCES merchant(id)
        ON DELETE CASCADE
);

-- Create products table with relationship to store
CREATE TABLE IF NOT EXISTS product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    availability_status BOOLEAN DEFAULT TRUE,
    store_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_product_store
        FOREIGN KEY (store_id)
        REFERENCES store(id)
        ON DELETE CASCADE
);

-- Ensure updated_at is refreshed on update
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER merchant_update_timestamp
BEFORE UPDATE ON merchant
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER store_update_timestamp
BEFORE UPDATE ON store
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER product_update_timestamp
BEFORE UPDATE ON product
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

COMMIT;
