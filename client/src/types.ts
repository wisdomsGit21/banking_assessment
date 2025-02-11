export interface Account {
  id: string;
  accountNumber: string;
  accountType: "CHECKING" | "SAVINGS";
  balance: number;
  accountHolder: string;
  createdAt: string;
}

export interface TransactionType {
  id: string;
  accountId: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}
