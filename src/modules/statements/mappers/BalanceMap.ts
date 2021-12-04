import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({statement, balance}: { statement: Statement[], balance: number}) {
    console.log(balance);
    const parsedStatement = statement.map(({
      id,
      amount,
      description,
      type,
      created_at,
      updated_at,
      sender_id
    }) => {
      const stat = {
        id,
        amount: amount,
        description,
        type,
        created_at,
        updated_at
      };
      return sender_id ? {...stat, sender_id } : stat;
    }

    );

    return {
      statement: parsedStatement,
      balance: balance
    }
  }
}
