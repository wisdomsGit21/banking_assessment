/**
 * AccountList Component
 *
 * TECHNICAL ASSESSMENT NOTES:
 * This is a basic implementation with intentional areas for improvement:
 * - Basic error handling
 * - Simple loading state
 * - No skeleton loading
 * - No retry mechanism
 * - No pagination
 * - No sorting/filtering
 * - No animations
 * - No accessibility features
 * - No tests
 *
 * Candidates should consider:
 * - Component structure
 * - Error boundary implementation
 * - Loading states and animations
 * - User feedback
 * - Performance optimization
 * - Accessibility (ARIA labels, keyboard navigation)
 * - Testing strategy
 */

import { useState, useEffect } from "react";
import { Account } from "../types";
import { getAccounts } from "../api";
import styles from "./AccountList.module.css";
import { Link } from "react-router-dom";

export function AccountList() {
  // Basic state management - Consider using more robust state management for larger applications
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data fetching - Consider implementing retry logic, caching, and better error handling
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getAccounts();
        setAccounts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Basic loading and error states - Consider implementing skeleton loading and error boundaries
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Basic render logic - Consider implementing:
  // - Sorting and filtering
  // - Pagination
  // - Search functionality
  // - More interactive features
  // - Accessibility improvements
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {accounts.map((account) => (
          <div key={account.id} className={styles.card}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{account.accountHolder}</h3>
              <p className={styles.accountNumber}>
                Account Number: {account.accountNumber}
              </p>
              <p className={styles.accountNumber}>
                Type: {account.accountType}
              </p>
              <p className={styles.balance}>
                ${account.balance.toLocaleString()}
              </p>
            </div>

            <Link className={styles.button} to={`/accounts/${account.id}`}>
              View Transactions
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
