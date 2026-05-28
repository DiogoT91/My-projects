-- =========================
-- Tabela Merchant
-- =========================
CREATE TABLE merchant (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    -- Hash bcrypt da palavra-passe (nunca guardar texto plano)
    password_hash VARCHAR(255) NOT NULL
);

-- Exemplo de registo (gerar hash no backend com bcrypt antes de inserir):
-- INSERT INTO merchant (email, password_hash)
-- VALUES ('merchant@example.com', '<hash_bcrypt_aqui>');

-- =========================
-- Tabela Store
-- =========================
CREATE TABLE store (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code INTEGER NOT NULL,
    phone_number BIGINT NOT NULL,
    timezone VARCHAR(100) NOT NULL,
    active_inactive_status BOOLEAN NOT NULL DEFAULT TRUE,

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
