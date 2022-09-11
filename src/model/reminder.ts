import {User} from "./user";

export enum ReminderStatus {
  PENDING, CLOSED, FINISHED,
}

export class Reminder {
  id: number;
  description: string;
  users: User[];
  status: ReminderStatus;
  amount: number;

  constructor(id: number, description: string, users: User[], status: ReminderStatus, amount: number) {
    this.id = id;
    this.description = description;
    this.users = users;
    this.status = status;
    this.amount = amount;
  }
}
