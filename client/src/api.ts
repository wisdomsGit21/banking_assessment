import { Account, TransactionType } from "./types";

const API_URL = "http://localhost:3001/api";

export const getAccounts = async (): Promise<Account[]> => {
  const response = await fetch(`${API_URL}/accounts`);
  if (!response.ok) {
    throw new Error("Failed to fetch accounts");
  }
  return response.json();
};

export const getAccount = async (id: string): Promise<Account> => {
  const response = await fetch(`${API_URL}/accounts/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch account");
  }
  return response.json();
};

export const getTransactions = async (
  id: string,
  page = 1,
  limit = 10
): Promise<TransactionType[]> => {
  const response = await fetch(
    `${API_URL}/accounts/${id}/transactions?page=${page}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return response.json();
};

export const createTransaction = async (
  id: string,
  type: string,
  amount: number,
  description: string
): Promise<Account> => {
  const response = await fetch(`${API_URL}/accounts/${id}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type, amount, description }),
  });
  if (!response.ok) {
    throw new Error("Failed to create transaction");
  }
  return response.json();
};
