// ─────────────────────────────────────────────
//  Assignments — tied to each lesson Part
//  Validation is OUTPUT-based (not syntax-based)
// ─────────────────────────────────────────────

const ASSIGNMENTS = [

  // ═══════════════════════════════════════
  //  PART 1 — SELECT + FROM
  // ═══════════════════════════════════════
  {
    part: 1,
    partTitle: 'SELECT + FROM',
    conceptsReminder: null,
    assignments: [
      {
        id: '1-1',
        title: 'Show all customer names and emails',
        instructions: 'Write a query that shows the <strong>first_name</strong>, <strong>last_name</strong>, and <strong>email</strong> of every customer.',
        whyItMatters: 'As a business analyst, pulling a quick customer list for a report or email campaign is one of the most common things you\'ll do.',
        hints: [
          'Start with the keyword SELECT, then list the column names separated by commas.',
          'The columns you need are: first_name, last_name, email',
          'After the columns, write FROM followed by the table name: customers',
          'Full answer: SELECT first_name, last_name, email FROM customers;'
        ],
        starterQuery: 'SELECT ___\nFROM ___;',
        validation: {
          expectedColumns: ['first_name', 'last_name', 'email'],
          expectedRowCount: 15
        }
      },
      {
        id: '1-2',
        title: 'List all products with their prices',
        instructions: 'Write a query to see every product\'s <strong>product_name</strong>, <strong>category</strong>, and <strong>price</strong>.',
        whyItMatters: 'Product catalogs are core to any retail analysis. "What are we selling and at what price?" is a question you\'ll answer weekly.',
        hints: [
          'Same pattern: SELECT columns FROM table',
          'The columns are: product_name, category, price',
          'The table is: products',
          'Full answer: SELECT product_name, category, price FROM products;'
        ],
        starterQuery: 'SELECT ___\nFROM ___;',
        validation: {
          expectedColumns: ['product_name', 'category', 'price'],
          expectedRowCount: 12
        }
      },
      {
        id: '1-3',
        title: 'See everything in the orders table',
        instructions: 'Show <strong>ALL columns</strong> from the orders table. (Hint: there\'s a shortcut for "all columns".)',
        whyItMatters: 'When you first encounter a new table, SELECT * lets you take a quick look at everything inside it — like opening a new spreadsheet tab.',
        hints: [
          'Remember the * (star) shortcut from the lesson?',
          'SELECT * means "all columns"',
          'Full answer: SELECT * FROM orders;'
        ],
        starterQuery: 'SELECT ___\nFROM orders;',
        validation: {
          expectedColumns: ['order_id', 'customer_id', 'order_date', 'status'],
          expectedRowCount: 28
        }
      }
    ]
  },

  // ═══════════════════════════════════════
  //  PART 2 — WHERE
  // ═══════════════════════════════════════
  {
    part: 2,
    partTitle: 'WHERE',
    conceptsReminder: 'Remember: <strong>SELECT</strong> picks columns, <strong>FROM</strong> picks the table. Now we add <strong>WHERE</strong> to filter rows.',
    assignments: [
      {
        id: '2-1',
        title: 'Find customers in New York',
        instructions: 'Show the <strong>first_name</strong>, <strong>last_name</strong>, and <strong>city</strong> of customers who live in <strong>New York</strong>.',
        whyItMatters: 'Regional analysis is huge in business — marketing campaigns, sales territories, and shipping logistics all start with filtering by location.',
        hints: [
          'You need SELECT, FROM, and WHERE.',
          'Text values in WHERE need single quotes: WHERE city = \'New York\'',
          'The columns are first_name, last_name, city from the customers table.',
          'Full answer: SELECT first_name, last_name, city FROM customers WHERE city = \'New York\';'
        ],
        starterQuery: 'SELECT first_name, last_name, city\nFROM customers\nWHERE ___;',
        validation: {
          expectedColumns: ['first_name', 'last_name', 'city'],
          expectedRowCount: 3
        }
      },
      {
        id: '2-2',
        title: 'Find expensive products',
        instructions: 'Show the <strong>product_name</strong> and <strong>price</strong> of products that cost <strong>more than $50</strong>.',
        whyItMatters: 'Price analysis helps segment products. "Which products are premium?" is a common question from product managers.',
        hints: [
          'Use the > operator for "greater than".',
          'Numbers don\'t need quotes: WHERE price > 50',
          'Full answer: SELECT product_name, price FROM products WHERE price > 50;'
        ],
        starterQuery: 'SELECT product_name, price\nFROM products\nWHERE ___;',
        validation: {
          expectedColumns: ['product_name', 'price'],
          expectedRowCount: 5
        }
      },
      {
        id: '2-3',
        title: 'Find completed orders from 2024',
        instructions: 'Show <strong>all columns</strong> from orders where the status is <strong>\'completed\'</strong> AND the order_date is <strong>2024 or later</strong>.',
        whyItMatters: 'Filtering by multiple conditions is something you\'ll do daily. "Show me all closed deals from this quarter" is a classic stakeholder request.',
        hints: [
          'You need two conditions connected with AND.',
          'Text: status = \'completed\'   Date: order_date >= \'2024-01-01\'',
          'Combine them: WHERE status = \'completed\' AND order_date >= \'2024-01-01\'',
          'Full answer: SELECT * FROM orders WHERE status = \'completed\' AND order_date >= \'2024-01-01\';'
        ],
        starterQuery: 'SELECT *\nFROM orders\nWHERE ___ AND ___;',
        validation: {
          expectedColumns: ['order_id', 'customer_id', 'order_date', 'status'],
          expectedRowCount: 7
        }
      }
    ]
  },

  // ═══════════════════════════════════════
  //  PART 3 — Aggregate Functions
  // ═══════════════════════════════════════
  {
    part: 3,
    partTitle: 'Aggregate Functions',
    conceptsReminder: 'You already know <strong>SELECT + FROM</strong> and <strong>WHERE</strong>. Now we use functions that <em>calculate</em> across rows.',
    assignments: [
      {
        id: '3-1',
        title: 'Count all customers',
        instructions: 'Write a query that tells you <strong>how many customers</strong> are in the database. Name the result <strong>total_customers</strong>.',
        whyItMatters: '"How many customers do we have?" is probably the most-asked question in any business. This is how you answer it.',
        hints: [
          'Use the COUNT() function.',
          'COUNT(*) counts all rows in a table.',
          'Use AS to give it a name: COUNT(*) AS total_customers',
          'Full answer: SELECT COUNT(*) AS total_customers FROM customers;'
        ],
        starterQuery: 'SELECT ___\nFROM customers;',
        validation: {
          expectedColumns: ['total_customers'],
          expectedRowCount: 1
        }
      },
      {
        id: '3-2',
        title: 'Find the average product price',
        instructions: 'What is the <strong>average price</strong> of all products? Name the result <strong>avg_price</strong>.',
        whyItMatters: 'Understanding average price points helps with pricing strategy, competitive analysis, and financial forecasting.',
        hints: [
          'Use the AVG() function.',
          'Put the column name inside: AVG(price)',
          'Use AS to rename: AVG(price) AS avg_price',
          'Full answer: SELECT AVG(price) AS avg_price FROM products;'
        ],
        starterQuery: 'SELECT ___\nFROM products;',
        validation: {
          expectedColumns: ['avg_price'],
          expectedRowCount: 1
        }
      },
      {
        id: '3-3',
        title: 'Find the highest and lowest salary',
        instructions: 'Show the <strong>highest salary</strong> (call it <strong>max_salary</strong>) and the <strong>lowest salary</strong> (call it <strong>min_salary</strong>) from the employees table.',
        whyItMatters: 'Salary range analysis is essential for HR reporting and budgeting. "What\'s our pay range?" comes up in every compensation review.',
        hints: [
          'Use MAX() and MIN() functions.',
          'You can select multiple aggregates: SELECT MAX(salary), MIN(salary)',
          'Add aliases: MAX(salary) AS max_salary, MIN(salary) AS min_salary',
          'Full answer: SELECT MAX(salary) AS max_salary, MIN(salary) AS min_salary FROM employees;'
        ],
        starterQuery: 'SELECT ___\nFROM employees;',
        validation: {
          expectedColumns: ['max_salary', 'min_salary'],
          expectedRowCount: 1
        }
      }
    ]
  },

  // ═══════════════════════════════════════
  //  PART 4 — GROUP BY
  // ═══════════════════════════════════════
  {
    part: 4,
    partTitle: 'GROUP BY',
    conceptsReminder: 'You know <strong>SELECT + FROM</strong>, <strong>WHERE</strong>, and <strong>aggregate functions</strong>. Now we <em>group</em> rows before aggregating.',
    assignments: [
      {
        id: '4-1',
        title: 'Count orders per customer',
        instructions: 'Show each <strong>customer_id</strong> and <strong>how many orders</strong> they placed (call it <strong>order_count</strong>).',
        whyItMatters: 'Knowing which customers order most helps identify your VIPs — the 20% of customers who often drive 80% of revenue.',
        hints: [
          'You need COUNT() combined with GROUP BY.',
          'SELECT customer_id, COUNT(*) AS order_count',
          'GROUP BY customer_id — this tells SQL to count separately for each customer.',
          'Full answer: SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id;'
        ],
        starterQuery: 'SELECT customer_id, ___\nFROM orders\nGROUP BY ___;',
        validation: {
          expectedColumns: ['customer_id', 'order_count'],
          expectedRowCount: 14
        }
      },
      {
        id: '4-2',
        title: 'Total products per category',
        instructions: 'Show each <strong>category</strong> and <strong>how many products</strong> are in it (call it <strong>product_count</strong>).',
        whyItMatters: 'Category breakdown is a staple of product analytics. "How balanced is our catalog?" is answered exactly like this.',
        hints: [
          'Same idea: COUNT() + GROUP BY, but on the products table.',
          'SELECT category, COUNT(*) AS product_count',
          'GROUP BY category',
          'Full answer: SELECT category, COUNT(*) AS product_count FROM products GROUP BY category;'
        ],
        starterQuery: 'SELECT ___, ___\nFROM products\nGROUP BY ___;',
        validation: {
          expectedColumns: ['category', 'product_count'],
          expectedRowCount: 4
        }
      },
      {
        id: '4-3',
        title: 'Average salary by department',
        instructions: 'Show each <strong>department</strong> and the <strong>average salary</strong> in that department (call it <strong>avg_salary</strong>).',
        whyItMatters: 'Departmental salary comparisons are critical for HR. "Are we paying our teams fairly relative to each other?" is the question.',
        hints: [
          'Use AVG(salary) instead of COUNT(*).',
          'SELECT department, AVG(salary) AS avg_salary',
          'GROUP BY department',
          'Full answer: SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department;'
        ],
        starterQuery: 'SELECT ___, ___\nFROM employees\nGROUP BY ___;',
        validation: {
          expectedColumns: ['department', 'avg_salary'],
          expectedRowCount: 4
        }
      }
    ]
  },

  // ═══════════════════════════════════════
  //  PART 5 — ORDER BY + LIMIT
  // ═══════════════════════════════════════
  {
    part: 5,
    partTitle: 'ORDER BY + LIMIT',
    conceptsReminder: 'You can now select, filter, aggregate, and group. <strong>ORDER BY</strong> sorts results and <strong>LIMIT</strong> caps how many rows you see.',
    assignments: [
      {
        id: '5-1',
        title: 'Top 5 most expensive products',
        instructions: 'Show the <strong>product_name</strong> and <strong>price</strong> of the 5 most expensive products, <strong>highest price first</strong>.',
        whyItMatters: '"What are our top-priced items?" is a standard product strategy question. Top-N lists are everywhere in business reports.',
        hints: [
          'You need ORDER BY price DESC to sort highest first.',
          'Add LIMIT 5 at the end to cap at 5 rows.',
          'Full query: SELECT, FROM, ORDER BY, LIMIT — in that order.',
          'Full answer: SELECT product_name, price FROM products ORDER BY price DESC LIMIT 5;'
        ],
        starterQuery: 'SELECT product_name, price\nFROM products\nORDER BY ___\nLIMIT ___;',
        validation: {
          expectedColumns: ['product_name', 'price'],
          expectedRowCount: 5
        }
      },
      {
        id: '5-2',
        title: 'Most recent orders first',
        instructions: 'Show <strong>all columns</strong> from orders, sorted by <strong>order_date</strong> from <strong>newest to oldest</strong>.',
        whyItMatters: 'Seeing the most recent activity first is how dashboards work. "What just happened?" is the first thing a BA checks every morning.',
        hints: [
          'SELECT * to get all columns.',
          'ORDER BY order_date DESC — DESC means newest first.',
          'No LIMIT needed — show all orders.',
          'Full answer: SELECT * FROM orders ORDER BY order_date DESC;'
        ],
        starterQuery: 'SELECT *\nFROM orders\nORDER BY ___;',
        validation: {
          expectedColumns: ['order_id', 'customer_id', 'order_date', 'status'],
          expectedRowCount: 28
        }
      },
      {
        id: '5-3',
        title: 'Top 3 highest-paid employees',
        instructions: 'Show the <strong>first_name</strong>, <strong>department</strong>, and <strong>salary</strong> of the 3 highest-paid employees.',
        whyItMatters: 'Executive compensation reports, budget reviews — knowing who earns what is sensitive but essential for HR analytics.',
        hints: [
          'SELECT the three columns you need.',
          'ORDER BY salary DESC to put highest first.',
          'LIMIT 3 to show only top 3.',
          'Full answer: SELECT first_name, department, salary FROM employees ORDER BY salary DESC LIMIT 3;'
        ],
        starterQuery: 'SELECT first_name, department, salary\nFROM employees\nORDER BY ___\nLIMIT ___;',
        validation: {
          expectedColumns: ['first_name', 'department', 'salary'],
          expectedRowCount: 3
        }
      }
    ]
  },

  // ═══════════════════════════════════════
  //  PART 6 — JOIN
  // ═══════════════════════════════════════
  {
    part: 6,
    partTitle: 'JOIN',
    conceptsReminder: 'Everything so far used one table. <strong>JOIN</strong> connects two tables using a shared column — like VLOOKUP in Excel.',
    assignments: [
      {
        id: '6-1',
        title: 'Show customer names with their orders',
        instructions: 'Show the customer\'s <strong>first_name</strong>, <strong>last_name</strong>, <strong>order_date</strong>, and <strong>status</strong> by joining the <strong>customers</strong> and <strong>orders</strong> tables.',
        whyItMatters: 'Order IDs are meaningless without customer names. Joining tables turns raw data into a story: "Alice ordered on March 1st."',
        hints: [
          'JOIN customers and orders using customer_id (it exists in both tables).',
          'Use table.column to avoid confusion: customers.first_name, orders.order_date',
          'The ON clause: ON customers.customer_id = orders.customer_id',
          'Full answer: SELECT customers.first_name, customers.last_name, orders.order_date, orders.status FROM customers JOIN orders ON customers.customer_id = orders.customer_id;'
        ],
        starterQuery: 'SELECT customers.first_name, customers.last_name,\n       orders.order_date, orders.status\nFROM customers\nJOIN orders ON ___;',
        validation: {
          expectedColumns: ['first_name', 'last_name', 'order_date', 'status'],
          expectedRowCount: 28
        }
      },
      {
        id: '6-2',
        title: 'Order details with product names',
        instructions: 'Show the <strong>product_name</strong>, <strong>quantity</strong>, and <strong>unit_price</strong> by joining <strong>order_items</strong> and <strong>products</strong>.',
        whyItMatters: 'Raw order_items just has product_id numbers. Joining with products turns "product_id 3" into "Noise-Cancelling Headphones" — much more useful for reporting.',
        hints: [
          'JOIN order_items and products using product_id.',
          'SELECT products.product_name, order_items.quantity, order_items.unit_price',
          'ON products.product_id = order_items.product_id',
          'Full answer: SELECT products.product_name, order_items.quantity, order_items.unit_price FROM order_items JOIN products ON order_items.product_id = products.product_id;'
        ],
        starterQuery: 'SELECT products.product_name,\n       order_items.quantity,\n       order_items.unit_price\nFROM order_items\nJOIN products ON ___;',
        validation: {
          expectedColumns: ['product_name', 'quantity', 'unit_price'],
          expectedRowCount: 45
        }
      },
      {
        id: '6-3',
        title: 'Find products never ordered',
        instructions: 'Show <strong>product_name</strong> for products that have <strong>never been ordered</strong>. (Hint: use LEFT JOIN and look for NULL.)',
        whyItMatters: 'Dead inventory costs money. "Which products have zero sales?" helps a BA recommend what to discount or discontinue.',
        hints: [
          'A LEFT JOIN keeps ALL rows from the left table, even if there\'s no match on the right.',
          'Products with no orders will have NULL in the order_items columns.',
          'Use WHERE order_items.order_item_id IS NULL to find the unmatched ones.',
          'Full answer: SELECT products.product_name FROM products LEFT JOIN order_items ON products.product_id = order_items.product_id WHERE order_items.order_item_id IS NULL;'
        ],
        starterQuery: 'SELECT products.product_name\nFROM products\nLEFT JOIN order_items ON ___\nWHERE ___;',
        validation: {
          expectedColumns: ['product_name'],
          expectedRowCount: 1
        }
      }
    ]
  },

  // ═══════════════════════════════════════
  //  PART 7 — Putting It All Together
  // ═══════════════════════════════════════
  {
    part: 7,
    partTitle: 'Putting It All Together',
    conceptsReminder: 'This is the final boss. You\'ll use <strong>SELECT, FROM, JOIN, WHERE, GROUP BY, ORDER BY, and LIMIT</strong> — all in one query.',
    assignments: [
      {
        id: '7-1',
        title: 'Top 5 customers by total spending',
        instructions: 'Show each customer\'s <strong>first_name</strong>, <strong>last_name</strong>, and their <strong>total spending</strong> (call it <strong>total_spent</strong>). Sort by <strong>highest spender first</strong>, and show only the <strong>top 5</strong>.',
        whyItMatters: 'This is THE classic business analyst query. "Who are our best customers?" drives loyalty programs, VIP treatment, and revenue forecasting.',
        hints: [
          'You need to JOIN three tables: customers → orders → order_items (to get prices).',
          'Total spending = SUM(order_items.quantity * order_items.unit_price)',
          'GROUP BY customer to get one row per person, ORDER BY total_spent DESC, LIMIT 5.',
          'Full answer: SELECT customers.first_name, customers.last_name, SUM(order_items.quantity * order_items.unit_price) AS total_spent FROM customers JOIN orders ON customers.customer_id = orders.customer_id JOIN order_items ON orders.order_id = order_items.order_id GROUP BY customers.customer_id ORDER BY total_spent DESC LIMIT 5;'
        ],
        starterQuery: 'SELECT customers.first_name, customers.last_name,\n       SUM(___) AS total_spent\nFROM customers\nJOIN orders ON ___\nJOIN order_items ON ___\nGROUP BY ___\nORDER BY ___\nLIMIT ___;',
        validation: {
          expectedColumns: ['first_name', 'last_name', 'total_spent'],
          expectedRowCount: 5
        }
      },
      {
        id: '7-2',
        title: 'Revenue by category for completed orders',
        instructions: 'Show each product <strong>category</strong> and its <strong>total revenue</strong> (call it <strong>revenue</strong>), but only for <strong>completed orders</strong>. Sort by <strong>highest revenue first</strong>.',
        whyItMatters: 'Category revenue analysis is the backbone of business reporting. "Which product line makes us the most money?" answers where to invest next.',
        hints: [
          'JOIN orders → order_items → products to connect revenue with categories.',
          'WHERE orders.status = \'completed\' to filter.',
          'SUM(order_items.quantity * order_items.unit_price) AS revenue',
          'Full answer: SELECT products.category, SUM(order_items.quantity * order_items.unit_price) AS revenue FROM orders JOIN order_items ON orders.order_id = order_items.order_id JOIN products ON order_items.product_id = products.product_id WHERE orders.status = \'completed\' GROUP BY products.category ORDER BY revenue DESC;'
        ],
        starterQuery: 'SELECT products.category,\n       SUM(___) AS revenue\nFROM orders\nJOIN order_items ON ___\nJOIN products ON ___\nWHERE ___\nGROUP BY ___\nORDER BY ___;',
        validation: {
          expectedColumns: ['category', 'revenue'],
          expectedRowCount: 4
        }
      }
    ]
  }
];
