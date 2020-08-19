import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
interface ResponseAll {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): ResponseAll | null {
    const transaction = {
      transactions: this.transactions,
      balance: this.getBalance(),
    };
    return transaction;
  }

  public getBalance(): Balance {
    return this.transactions.reduce(
      (balance, transaction) => {
        // eslint-disable-next-line no-param-reassign
        balance[transaction.type] += transaction.value;
        // eslint-disable-next-line no-param-reassign
        balance.total = balance.income - balance.outcome;
        return balance;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const { total } = this.getBalance();
    if (total - value <= 0 && type === 'outcome') {
      throw Error('Insufficient balance');
    }
    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
