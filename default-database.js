// ─────────────────────────────────────────────
//  Bright Store — Default sample database
//  A small e-commerce company for BA practice
// ─────────────────────────────────────────────

const BRIGHT_STORE_SCHEMA = `

-- ═══════════════════════════════════════════
--  CUSTOMERS — 15 people across various cities
-- ═══════════════════════════════════════════
CREATE TABLE customers (
    customer_id   INTEGER PRIMARY KEY,
    first_name    TEXT NOT NULL,
    last_name     TEXT NOT NULL,
    email         TEXT NOT NULL,
    city          TEXT NOT NULL,
    state         TEXT NOT NULL,
    signup_date   TEXT NOT NULL
);

-- ═══════════════════════════════════════════
--  PRODUCTS — 12 items in 4 categories
-- ═══════════════════════════════════════════
CREATE TABLE products (
    product_id    INTEGER PRIMARY KEY,
    product_name  TEXT NOT NULL,
    category      TEXT NOT NULL,
    price         REAL NOT NULL
);

-- ═══════════════════════════════════════════
--  ORDERS — 28 orders with various statuses
-- ═══════════════════════════════════════════
CREATE TABLE orders (
    order_id      INTEGER PRIMARY KEY,
    customer_id   INTEGER NOT NULL,
    order_date    TEXT NOT NULL,
    status        TEXT NOT NULL
);

-- ═══════════════════════════════════════════
--  ORDER_ITEMS — line items linking orders to products
-- ═══════════════════════════════════════════
CREATE TABLE order_items (
    order_item_id INTEGER PRIMARY KEY,
    order_id      INTEGER NOT NULL,
    product_id    INTEGER NOT NULL,
    quantity      INTEGER NOT NULL,
    unit_price    REAL NOT NULL,
    discount      REAL DEFAULT 0
);

-- ═══════════════════════════════════════════
--  EMPLOYEES — 8 staff across departments
-- ═══════════════════════════════════════════
CREATE TABLE employees (
    employee_id   INTEGER PRIMARY KEY,
    first_name    TEXT NOT NULL,
    last_name     TEXT NOT NULL,
    department    TEXT NOT NULL,
    salary        REAL NOT NULL,
    hire_date     TEXT NOT NULL
);
`;

const BRIGHT_STORE_DATA = `

-- ───── CUSTOMERS (15 rows) ─────
-- 3 in New York, 2 in Los Angeles, rest spread out
INSERT INTO customers VALUES ( 1, 'Alice',   'Johnson',  'alice.johnson@email.com',    'New York',      'NY', '2023-01-15');
INSERT INTO customers VALUES ( 2, 'Bob',     'Smith',    'bob.smith@email.com',        'Los Angeles',   'CA', '2023-02-20');
INSERT INTO customers VALUES ( 3, 'Carol',   'Williams', 'carol.w@email.com',          'New York',      'NY', '2023-03-10');
INSERT INTO customers VALUES ( 4, 'David',   'Brown',    'david.brown@email.com',      'Chicago',       'IL', '2023-04-05');
INSERT INTO customers VALUES ( 5, 'Emma',    'Davis',    'emma.davis@email.com',       'Houston',       'TX', '2023-05-12');
INSERT INTO customers VALUES ( 6, 'Frank',   'Garcia',   'frank.garcia@email.com',     'Phoenix',       'AZ', '2023-06-18');
INSERT INTO customers VALUES ( 7, 'Grace',   'Martinez', 'grace.m@email.com',          'New York',      'NY', '2023-07-22');
INSERT INTO customers VALUES ( 8, 'Henry',   'Anderson', 'henry.a@email.com',          'Los Angeles',   'CA', '2023-08-30');
INSERT INTO customers VALUES ( 9, 'Iris',    'Thomas',   'iris.thomas@email.com',      'Seattle',       'WA', '2023-09-14');
INSERT INTO customers VALUES (10, 'Jack',    'Wilson',   'jack.wilson@email.com',      'Denver',        'CO', '2023-10-01');
INSERT INTO customers VALUES (11, 'Karen',   'Taylor',   'karen.t@email.com',          'Miami',         'FL', '2023-10-25');
INSERT INTO customers VALUES (12, 'Leo',     'Moore',    'leo.moore@email.com',        'Portland',      'OR', '2023-11-08');
INSERT INTO customers VALUES (13, 'Mia',     'Jackson',  'mia.jackson@email.com',      'Austin',        'TX', '2023-11-30');
INSERT INTO customers VALUES (14, 'Noah',    'White',    'noah.white@email.com',       'Boston',        'MA', '2024-01-10');
INSERT INTO customers VALUES (15, 'Olivia',  'Harris',   'olivia.h@email.com',         'San Diego',     'CA', '2024-02-14');

-- ───── PRODUCTS (12 rows) ─────
-- 4 categories: Electronics, Clothing, Home, Books
INSERT INTO products VALUES ( 1, 'Wireless Mouse',       'Electronics', 29.99);
INSERT INTO products VALUES ( 2, 'USB-C Hub',            'Electronics', 49.99);
INSERT INTO products VALUES ( 3, 'Noise-Cancelling Headphones', 'Electronics', 189.99);
INSERT INTO products VALUES ( 4, 'Cotton T-Shirt',       'Clothing',    19.99);
INSERT INTO products VALUES ( 5, 'Denim Jacket',         'Clothing',    79.99);
INSERT INTO products VALUES ( 6, 'Running Shoes',        'Clothing',    124.99);
INSERT INTO products VALUES ( 7, 'Ceramic Mug Set',      'Home',        24.99);
INSERT INTO products VALUES ( 8, 'Desk Lamp',            'Home',        44.99);
INSERT INTO products VALUES ( 9, 'Throw Blanket',        'Home',        39.99);
INSERT INTO products VALUES (10, 'SQL for Beginners',    'Books',        9.99);
INSERT INTO products VALUES (11, 'Data Analytics Handbook', 'Books',     34.99);
INSERT INTO products VALUES (12, 'Business Strategy Guide', 'Books',     14.99);

-- ───── ORDERS (28 rows) ─────
-- Spread across 2023-2024, mix of completed/pending/cancelled
-- Some customers have multiple orders, customer 14 has none (for LEFT JOIN)
INSERT INTO orders VALUES ( 1,  1, '2023-03-01', 'completed');
INSERT INTO orders VALUES ( 2,  2, '2023-03-15', 'completed');
INSERT INTO orders VALUES ( 3,  3, '2023-04-10', 'completed');
INSERT INTO orders VALUES ( 4,  1, '2023-05-20', 'completed');
INSERT INTO orders VALUES ( 5,  5, '2023-06-01', 'completed');
INSERT INTO orders VALUES ( 6,  4, '2023-06-18', 'cancelled');
INSERT INTO orders VALUES ( 7,  6, '2023-07-05', 'completed');
INSERT INTO orders VALUES ( 8,  7, '2023-07-22', 'completed');
INSERT INTO orders VALUES ( 9,  2, '2023-08-10', 'completed');
INSERT INTO orders VALUES (10,  8, '2023-08-30', 'completed');
INSERT INTO orders VALUES (11,  3, '2023-09-15', 'cancelled');
INSERT INTO orders VALUES (12,  9, '2023-10-01', 'completed');
INSERT INTO orders VALUES (13,  1, '2023-10-20', 'completed');
INSERT INTO orders VALUES (14, 10, '2023-11-05', 'completed');
INSERT INTO orders VALUES (15, 11, '2023-11-18', 'pending');
INSERT INTO orders VALUES (16,  5, '2023-12-01', 'completed');
INSERT INTO orders VALUES (17, 12, '2023-12-15', 'completed');
INSERT INTO orders VALUES (18,  4, '2024-01-08', 'completed');
INSERT INTO orders VALUES (19, 13, '2024-01-22', 'completed');
INSERT INTO orders VALUES (20,  6, '2024-02-05', 'pending');
INSERT INTO orders VALUES (21,  7, '2024-02-20', 'completed');
INSERT INTO orders VALUES (22,  9, '2024-03-01', 'completed');
INSERT INTO orders VALUES (23,  2, '2024-03-15', 'cancelled');
INSERT INTO orders VALUES (24, 15, '2024-04-01', 'completed');
INSERT INTO orders VALUES (25,  8, '2024-04-18', 'pending');
INSERT INTO orders VALUES (26, 11, '2024-05-02', 'completed');
INSERT INTO orders VALUES (27,  3, '2024-05-20', 'completed');
INSERT INTO orders VALUES (28, 10, '2024-06-10', 'completed');

-- ───── ORDER_ITEMS (45 rows) ─────
-- Multiple items per order in some cases
-- Product 12 (Business Strategy Guide) is never ordered → LEFT JOIN exercise
INSERT INTO order_items VALUES ( 1,  1,  1, 1, 29.99, 0.00);
INSERT INTO order_items VALUES ( 2,  1, 10, 1,  9.99, 0.00);
INSERT INTO order_items VALUES ( 3,  2,  3, 1, 189.99, 0.10);
INSERT INTO order_items VALUES ( 4,  3,  4, 2, 19.99, 0.00);
INSERT INTO order_items VALUES ( 5,  3,  7, 1, 24.99, 0.00);
INSERT INTO order_items VALUES ( 6,  4,  5, 1, 79.99, 0.05);
INSERT INTO order_items VALUES ( 7,  4, 11, 1, 34.99, 0.00);
INSERT INTO order_items VALUES ( 8,  5,  6, 1, 124.99, 0.00);
INSERT INTO order_items VALUES ( 9,  5,  9, 1, 39.99, 0.00);
INSERT INTO order_items VALUES (10,  6,  2, 1, 49.99, 0.00);
INSERT INTO order_items VALUES (11,  7,  8, 2, 44.99, 0.00);
INSERT INTO order_items VALUES (12,  7,  1, 1, 29.99, 0.00);
INSERT INTO order_items VALUES (13,  8,  3, 1, 189.99, 0.15);
INSERT INTO order_items VALUES (14,  8, 10, 2,  9.99, 0.00);
INSERT INTO order_items VALUES (15,  9,  5, 1, 79.99, 0.00);
INSERT INTO order_items VALUES (16,  9,  4, 3, 19.99, 0.10);
INSERT INTO order_items VALUES (17, 10,  6, 1, 124.99, 0.05);
INSERT INTO order_items VALUES (18, 10,  9, 2, 39.99, 0.00);
INSERT INTO order_items VALUES (19, 11,  7, 2, 24.99, 0.00);
INSERT INTO order_items VALUES (20, 12,  2, 1, 49.99, 0.00);
INSERT INTO order_items VALUES (21, 12, 11, 1, 34.99, 0.00);
INSERT INTO order_items VALUES (22, 13,  1, 2, 29.99, 0.00);
INSERT INTO order_items VALUES (23, 13,  8, 1, 44.99, 0.00);
INSERT INTO order_items VALUES (24, 14,  3, 1, 189.99, 0.10);
INSERT INTO order_items VALUES (25, 15, 10, 1,  9.99, 0.00);
INSERT INTO order_items VALUES (26, 15,  4, 1, 19.99, 0.00);
INSERT INTO order_items VALUES (27, 16,  6, 1, 124.99, 0.00);
INSERT INTO order_items VALUES (28, 16, 11, 1, 34.99, 0.05);
INSERT INTO order_items VALUES (29, 17,  9, 1, 39.99, 0.00);
INSERT INTO order_items VALUES (30, 17,  7, 1, 24.99, 0.00);
INSERT INTO order_items VALUES (31, 18,  2, 1, 49.99, 0.00);
INSERT INTO order_items VALUES (32, 18,  1, 1, 29.99, 0.00);
INSERT INTO order_items VALUES (33, 19,  5, 1, 79.99, 0.00);
INSERT INTO order_items VALUES (34, 19,  8, 1, 44.99, 0.00);
INSERT INTO order_items VALUES (35, 20,  3, 1, 189.99, 0.00);
INSERT INTO order_items VALUES (36, 21, 10, 3,  9.99, 0.00);
INSERT INTO order_items VALUES (37, 21,  4, 1, 19.99, 0.00);
INSERT INTO order_items VALUES (38, 22,  6, 1, 124.99, 0.10);
INSERT INTO order_items VALUES (39, 22,  2, 1, 49.99, 0.00);
INSERT INTO order_items VALUES (40, 24,  1, 1, 29.99, 0.00);
INSERT INTO order_items VALUES (41, 24,  9, 1, 39.99, 0.00);
INSERT INTO order_items VALUES (42, 26,  5, 1, 79.99, 0.00);
INSERT INTO order_items VALUES (43, 27, 11, 1, 34.99, 0.00);
INSERT INTO order_items VALUES (44, 28,  8, 1, 44.99, 0.00);
INSERT INTO order_items VALUES (45, 28, 10, 1,  9.99, 0.00);

-- ───── EMPLOYEES (8 rows) ─────
INSERT INTO employees VALUES (1, 'Sarah',   'Chen',     'Sales',       72000, '2022-03-15');
INSERT INTO employees VALUES (2, 'Marcus',  'Rivera',   'Sales',       65000, '2022-08-01');
INSERT INTO employees VALUES (3, 'Priya',   'Patel',    'Marketing',   78000, '2021-11-20');
INSERT INTO employees VALUES (4, 'James',   'O''Brien', 'Engineering', 120000, '2021-06-10');
INSERT INTO employees VALUES (5, 'Linda',   'Kim',      'Marketing',   68000, '2023-01-15');
INSERT INTO employees VALUES (6, 'Ahmed',   'Hassan',   'Support',     52000, '2023-04-01');
INSERT INTO employees VALUES (7, 'Rachel',  'Foster',   'Engineering', 105000, '2022-01-20');
INSERT INTO employees VALUES (8, 'Tom',     'Murphy',   'Support',     48000, '2023-09-10');
`;
