/**
 * Banking Dashboard API Server
 *
 * TECHNICAL ASSESSMENT NOTES:
 * This is a basic implementation with intentional areas for improvement:
 * - Currently uses in-memory SQLite (not persistent)
 * - Basic error handling
 * - No authentication/authorization
 * - No input validation
 * - No rate limiting
 * - No caching
 * - No logging system
 * - No tests
 *
 * Candidates should consider:
 * - Data persistence
 * - Security measures
 * - API documentation
 * - Error handling
 * - Performance optimization
 * - Code organization
 * - Testing strategy
 */

import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { Database } from "sqlite3";

const app = express();
const PORT = 3001;

interface Account {
  id: string;
  accountNumber: string;
  accountType: "CHECKING" | "SAVINGS";
  balance: number;
  accountHolder: string;
  createdAt: string;
}

// Basic middleware setup - Consider additional security middleware
app.use(cors());
app.use(express.json());

// Database setup - Currently using in-memory SQLite for simplicity
// Consider: Production database, connection pooling, error handling
const db: Database = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to in-memory SQLite database");
    initializeDatabase();
  }
});

// Basic database initialization
// Consider: Migration system, seed data management, error handling
function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      accountNumber TEXT UNIQUE,
      accountType TEXT CHECK(accountType IN ('CHECKING', 'SAVINGS')),
      balance REAL,
      accountHolder TEXT,
      createdAt TEXT
    )
  `;

  const createTransactionTableQuery = `
  CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  accountId TEXT,
  type TEXT CHECK(type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER')),
  amount REAL,
  description TEXT,
  createdAt TEXT,
  FOREIGN KEY(accountId) REFERENCES accounts(id)
  )
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Accounts table created");
      insertSampleData();
    }
  });
  db.run(createTransactionTableQuery, (err) => {
    if (err) {
      console.error("Error creating transactions table:", err);
    } else {
      console.log("Transactions table created");
    }
  });
}

// Sample data insertion
// Consider: Data validation, error handling, transaction management
function insertSampleData() {
  const sampleAccounts = [
    {
      id: "1",
      accountNumber: "1001",
      accountType: "CHECKING",
      balance: 5000.0,
      accountHolder: "John Doe",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      accountNumber: "1002",
      accountType: "SAVINGS",
      balance: 10000.0,
      accountHolder: "Jane Smith",
      createdAt: new Date().toISOString(),
    },
  ];

  const insertQuery = `
    INSERT OR REPLACE INTO accounts (id, accountNumber, accountType, balance, accountHolder, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  sampleAccounts.forEach((account) => {
    db.run(
      insertQuery,
      [
        account.id,
        account.accountNumber,
        account.accountType,
        account.balance,
        account.accountHolder,
        account.createdAt,
      ],
      (err) => {
        if (err) {
          console.error("Error inserting sample data:", err);
        }
      }
    );
  });
}

// Basic API routes
// Consider: Input validation, authentication, rate limiting, response formatting
app.get("/api/accounts", (req, res) => {
  db.all("SELECT * FROM accounts", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/api/accounts/:id", (req, res) => {
  db.get("SELECT * FROM accounts WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Account not found" });
      return;
    }
    res.json(row);
  });
});

app.post("/api/accounts/:id/transactions", (req, res) => {
  const { type, amount, description } = req.body;
  const accountId = req.params.id;

  db.get(
    "SELECT * FROM accounts WHERE id = ?",
    [accountId],
    (err, row: Account | undefined) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      if (!row) {
        return res.status(404).json({ error: "Account not found" });
      }

      let newBalance = row.balance;

      if (type === "WITHDRAWAL" || type === "TRANSFER") {
        if (amount > row.balance) {
          return res.status(400).json({ error: "Insufficient funds" });
        }
        newBalance -= parseInt(amount);
      } else if (type === "DEPOSIT") {
        newBalance += parseInt(amount);
      }

      db.run(
        "UPDATE accounts SET balance = ? WHERE id = ?",
        [newBalance, accountId],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ error: "Error updating balance" });
          }

          db.run(
            "INSERT INTO transactions (accountId, type, amount, description, createdAt) VALUES (?, ?, ?, ?, ?)",
            [accountId, type, amount, description, new Date().toISOString()],
            function (insertErr) {
              if (insertErr) {
                return res
                  .status(500)
                  .json({ error: "Error recording transaction" });
              }
              res.json({ message: "Transaction successful", newBalance });
            }
          );
        }
      );
    }
  );
});

app.get("/api/accounts/:id/transactions", (req, res) => {
  const accountId = req.params.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  // if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
  //   return res.status(400).json({ error: "Invalid pagination parameters" });
  // }

  const offset = (page - 1) * limit;
  db.all(
    "SELECT * FROM transactions WHERE accountId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?",
    [accountId, limit, offset],
    (err, transactions) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(transactions);
    }
  );
});

// Server startup
// Consider: Graceful shutdown, environment configuration, clustering
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
