-- =========================
-- Tabela Merchant
-- =========================
CREATE TABLE merchant (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- =========================
-- Tabela Store
-- =========================
CREATE TABLE store (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip_code INTEGER,
    phone_number BIGINT,
    timezone VARCHAR(100),
    active_inactive_status BOOLEAN DEFAULT TRUE,

    merchant_id INTEGER NOT NULL,

    CONSTRAINT fk_store_merchant
        FOREIGN KEY (merchant_id)
        REFERENCES merchant(id)
        ON DELETE CASCADE
);

-- =========================
-- Tabela Product
-- =========================
CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    price NUMERIC(10,2) NOT NULL,
    availability_status BOOLEAN DEFAULT TRUE,

    store_id INTEGER NOT NULL,

    CONSTRAINT fk_product_store
        FOREIGN KEY (store_id)
        REFERENCES store(id)
        ON DELETE CASCADE
);