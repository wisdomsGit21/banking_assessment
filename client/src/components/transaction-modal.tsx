import { useState } from "react";
import { createTransaction } from "../api";
import styles from "./transactions.module.css";

export function TransactionModal({
  accountId,
  onClose,
}: {
  accountId: string;
  onClose: () => void;
}) {
  const [type, setType] = useState("DEPOSIT");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTransaction(accountId, type, parseFloat(amount), description);
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3
          style={{
            textAlign: "start",
          }}
        >
          New Transaction
        </h3>
        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <label>
            Type:
            <select
              value={type}
              className={styles.inputField}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </label>
          <label>
            Amount:
            <input
              type="number"
              className={styles.inputField}
              value={amount}
              style={{ width: "96%" }}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              className={styles.inputField}
              value={description}
              style={{ width: "96%" }}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <button className={styles.submitButton} type="submit">
            Submit
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
