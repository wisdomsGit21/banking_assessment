// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { getTransactions } from "../api";
// import { TransactionType } from "../types";
// import styles from "./transactions.module.css";
// import { TransactionModal } from "./transaction-modal";

// export default function Transactions() {
//   const { id } = useParams<{ id: string }>();
//   const [transactions, setTransactions] = useState<TransactionType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filter, setFilter] = useState<string>("");
//   const [modalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         if (id) {
//           const data = await getTransactions(id);
//           setTransactions(data);
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTransactions();
//   }, [id]);

//   const filteredTransactions = transactions.filter((txn) =>
//     txn.type.includes(filter)
//   );

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <Link className={styles.Back} to={"/"}>
//           Back
//         </Link>
//         <div className={styles.header}>
//           <div className={styles.filter}>
//             <select
//               onChange={(e) => setFilter(e.target.value)}
//               className={styles.filterSelect}
//             >
//               <option value="">All Types</option>
//               <option value="DEPOSIT">Deposit</option>
//               <option value="WITHDRAWAL">Withdrawal</option>
//               <option value="TRANSFER">Transfer</option>
//             </select>
//           </div>
//           <button onClick={() => setModalOpen(true)}>Add Transaction</button>
//         </div>
//       </div>

//       {modalOpen && (
//         <TransactionModal onClose={() => setModalOpen(false)} accountId={id!} />
//       )}
//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th>Type</th>
//             <th>Amount</th>
//             <th>Description</th>
//             <th>Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredTransactions.map((txn) => (
//             <tr key={txn.id}>
//               <td>{txn.type}</td>
//               <td>${txn.amount.toLocaleString()}</td>
//               <td>{txn.description}</td>
//               <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTransactions } from "../api";
import { TransactionType } from "../types";
import styles from "./transactions.module.css";
import { TransactionModal } from "./transaction-modal";

export default function Transactions() {
  const { id } = useParams<{ id: string }>();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (id) {
          const data = await getTransactions(id);
          setTransactions(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [id]);

  const filteredTransactions = transactions.filter((txn) =>
    txn.type.includes(filter)
  );

  // Calculate pagination indexes
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    endIndex
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link className={styles.Back} to={"/"}>
          Back
        </Link>
        <div className={styles.header}>
          <div
            style={{
              display: "flex",
              placeItems: "center",
              gap: "10px",
              backgroundColor: "#fff",
              padding: "4px 10px",
              paddingLeft: "10px",
              borderRadius: "10px",
              border: "4px solid #f4f4f4",
              position: "relative",
              width: "150px",
            }}
            className={styles.filter}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-filter"
              style={{
                position: "absolute",
                paddingLeft: "-10px",
                transform: "translateX(-40%)",
              }}
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <select
              style={{
                padding: "6px 10px",
                borderRadius: "5px",
                border: "0px solid #ddd",
                color: "#333",
                outline: "none",
                width: "100%",
              }}
              onChange={(e) => setFilter(e.target.value)}
              className={""}
            >
              <option value="">All Types</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>
          <button
            style={{
              backgroundColor: "#0056b3",
              color: "white",
            }}
            onClick={() => setModalOpen(true)}
          >
            Add Transaction
          </button>
        </div>
      </div>

      {modalOpen && (
        <TransactionModal onClose={() => setModalOpen(false)} accountId={id!} />
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.map((txn) => (
            <tr key={txn.id}>
              <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
              <td
                style={{
                  color:
                    txn.type === "DEPOSIT"
                      ? "#166534"
                      : txn.type === "WITHDRAWAL"
                      ? "#991b1b"
                      : "#991b1b",
                }}
              >
                <span
                  style={{
                    backgroundColor:
                      txn.type === "DEPOSIT"
                        ? "#dcfce7"
                        : txn.type === "WITHDRAWAL"
                        ? "#fee2e2"
                        : "#fee2e2",
                    padding: "2px 6px",
                    fontWeight: "semibold",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                >
                  {txn.type}
                </span>
              </td>
              <td>{txn.description}</td>
              <td
                style={{
                  color:
                    txn.type === "DEPOSIT"
                      ? "green"
                      : txn.type === "WITHDRAWAL"
                      ? "#991b1b"
                      : "#991b1b",
                  fontWeight: "semibold",
                  fontSize: "12px",
                }}
              >
                ${txn.amount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          Previous
        </button>
        <span className={styles.pageInfo}>{currentPage}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          Next
        </button>
      </div>
    </div>
  );
}
