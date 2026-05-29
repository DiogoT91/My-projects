-- Seed example merchant, store and product data.
-- Use this file with the seed script when a database is already migrated.

INSERT INTO merchant (email, password)
VALUES
  ('merchant@example.com', '$2b$10$sfO2bqru6FUBpFRnu8Ms8ePvSrow7wo9Pu7nc8Ct5.ffirWrajaPW'),
  ('merchant2@example.com', '$2b$10$sfO2bqru6FUBpFRnu8Ms8ePvSrow7wo9Pu7nc8Ct5.ffirWrajaPW')
ON CONFLICT (email) DO NOTHING;

INSERT INTO store (name, street, city, state, zip_code, phone_number, timezone, merchant_id)
SELECT 'Loja Exemplo', 'Rua Central 123', 'Lisboa', 'Lisboa', '1000-100', 912345678, 'Europe/Lisbon', m.id
FROM merchant m
WHERE m.email = 'merchant@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM store s WHERE s.name = 'Loja Exemplo' AND s.merchant_id = m.id
  );

INSERT INTO store (name, street, city, state, zip_code, phone_number, timezone, merchant_id)
SELECT 'Loja Nova 1', 'Avenida Principal 45', 'Porto', 'Porto', '4000-200', 913000111, 'Europe/Lisbon', m.id
FROM merchant m
WHERE m.email = 'merchant2@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM store s WHERE s.name = 'Loja Nova 1' AND s.merchant_id = m.id
  );

INSERT INTO store (name, street, city, state, zip_code, phone_number, timezone, merchant_id)
SELECT 'Loja Nova 2', 'Rua da Praia 78', 'Faro', 'Faro', '8000-300', 914000222, 'Europe/Lisbon', m.id
FROM merchant m
WHERE m.email = 'merchant2@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM store s WHERE s.name = 'Loja Nova 2' AND s.merchant_id = m.id
  );

INSERT INTO product (name, description, price, availability_status, store_id)
SELECT 'Camisola', 'Camisola 100% algodão', 29.90, TRUE, s.id
FROM store s
JOIN merchant m ON m.id = s.merchant_id
WHERE m.email = 'merchant@example.com'
  AND s.name = 'Loja Exemplo'
  AND NOT EXISTS (
    SELECT 1 FROM product p WHERE p.name = 'Camisola' AND p.store_id = s.id
  );

INSERT INTO product (name, description, price, availability_status, store_id)
SELECT 'Calças', 'Calças de ganga confortáveis', 49.90, TRUE, s.id
FROM store s
JOIN merchant m ON m.id = s.merchant_id
WHERE m.email = 'merchant@example.com'
  AND s.name = 'Loja Exemplo'
  AND NOT EXISTS (
    SELECT 1 FROM product p WHERE p.name = 'Calças' AND p.store_id = s.id
  );

INSERT INTO product (name, description, price, availability_status, store_id)
SELECT 'Sandálias', 'Sandálias leves para o verão', 22.50, TRUE, s.id
FROM store s
JOIN merchant m ON m.id = s.merchant_id
WHERE m.email = 'merchant2@example.com'
  AND s.name = 'Loja Nova 1'
  AND NOT EXISTS (
    SELECT 1 FROM product p WHERE p.name = 'Sandálias' AND p.store_id = s.id
  );

INSERT INTO product (name, description, price, availability_status, store_id)
SELECT 'Chapéu', 'Chapéu de palha com estilo', 14.90, TRUE, s.id
FROM store s
JOIN merchant m ON m.id = s.merchant_id
WHERE m.email = 'merchant2@example.com'
  AND s.name = 'Loja Nova 1'
  AND NOT EXISTS (
    SELECT 1 FROM product p WHERE p.name = 'Chapéu' AND p.store_id = s.id
  );

INSERT INTO product (name, description, price, availability_status, store_id)
SELECT 'Mochila', 'Mochila de viagem durável', 59.90, TRUE, s.id
FROM store s
JOIN merchant m ON m.id = s.merchant_id
WHERE m.email = 'merchant2@example.com'
  AND s.name = 'Loja Nova 2'
  AND NOT EXISTS (
    SELECT 1 FROM product p WHERE p.name = 'Mochila' AND p.store_id = s.id
  );

INSERT INTO product (name, description, price, availability_status, store_id)
SELECT 'Relógio', 'Relógio clássico com pulseira de couro', 79.90, TRUE, s.id
FROM store s
JOIN merchant m ON m.id = s.merchant_id
WHERE m.email = 'merchant2@example.com'
  AND s.name = 'Loja Nova 2'
  AND NOT EXISTS (
    SELECT 1 FROM product p WHERE p.name = 'Relógio' AND p.store_id = s.id
  );
