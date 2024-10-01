import type { User } from '@ts//user.types';

export interface OrderSended {
  _id: string;
  itemId: string;
  user: User;
  amount: string;
  quantity: number;
  status: "PENDING" | "NEW" | "SUCCESS" | "FAILED";
}
