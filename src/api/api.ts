import {User} from "../model/user";
import {Reminder, ReminderStatus} from "../model/reminder";

export enum ApiError {
  OK,
  NETWORK,
  UNAUTHENTICATED,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR
}

export class ApiResponse<T> {
  error: ApiError;
  content?: T;

  constructor(error: ApiError, content?: T) {
    this.error = error;
    this.content = content;
  }

  static ok<T>(content: T) {
    return new ApiResponse(ApiError.OK, content);
  }

  static err(error: ApiError) {
    return new ApiResponse(error);
  }

  ok(): boolean {
    return this.error === ApiError.OK;
  }
}

export interface Api {
  isLoggedIn(): boolean;

  login(username: string, password: string): Promise<ApiResponse<string>>;

  getAllUsers(): Promise<ApiResponse<Array<User>>>;

  getAllReminders(): Promise<ApiResponse<Array<Reminder>>>;

  createReminder(description: string, userIds: Array<string>, amount: number): Promise<ApiResponse<Reminder>>;
}

export class ApiImpl implements Api {
  isLoggedIn(): boolean {
    return false;
  }

  login(username: string, password: string): Promise<ApiResponse<string>> {
    throw new Error("Method not implemented.");
  }

  getAllUsers(): Promise<ApiResponse<Array<User>>> {
    throw new Error("Method not implemented.");
  }

  getAllReminders(): Promise<ApiResponse<Array<Reminder>>> {
    throw new Error("Method not implemented.");
  }

  createReminder(description: string, userIds: Array<string>, amount: number): Promise<ApiResponse<Reminder>> {
    throw new Error("Method not implemented.");
  }
}

export class CachedApi implements Api {
  api: Api
  cachedUsers?: Array<User>
  lastFetchListUsers?: number
  cacheConfig: { duration: number; refreshOnAccess: boolean; }

  constructor(api: Api, cacheDuration: number = 10000, refreshOnAccess: boolean = false) {
    this.api = api;
    this.cachedUsers = undefined;
    this.cacheConfig = {duration: cacheDuration, refreshOnAccess: refreshOnAccess};
  }

  isLoggedIn(): boolean {
    return this.api.isLoggedIn();
  }

  login(username: string, password: string): Promise<ApiResponse<string>> {
    return this.api.login(username, password);
  }

  getAllUsers(): Promise<ApiResponse<Array<User>>> {
    if (this.cachedUsers !== undefined) {
      const now = Date.now();
      if (this.lastFetchListUsers! + this.cacheConfig.duration < now) {
        if (this.cacheConfig.refreshOnAccess) {
          this.lastFetchListUsers = now;
        }
        return Promise.resolve(ApiResponse.ok(this.cachedUsers));
      }
    }
    const future = this.api.getAllUsers();
    return future.then(resp => {
      if (resp.ok()) {
        this.cachedUsers = resp.content;
        this.lastFetchListUsers = Date.now();
      }
      return resp;
    });
  }

  getAllReminders(): Promise<ApiResponse<Array<Reminder>>> {
    return this.api.getAllReminders();
  }

  createReminder(description: string, userIds: Array<string>, amount: number): Promise<ApiResponse<Reminder>> {
    return this.api.createReminder(description, userIds, amount);
  }
}

export class FakeApi implements Api {

  authToken: string | null;
  users: User[];
  reminders: Reminder[];

  constructor() {
    this.authToken = null;
    this.users = [
      new User("mvu", "Minh Vu", "https://i.pravatar.cc/150?u=mv", "eca"),
      new User("vunguyen", "Vuong Nguyen", "https://i.pravatar.cc/150?u=vun", "ecm"),
      new User("tdnguyen", "Tai Nguyen", "https://i.pravatar.cc/150?u=tn", "eca"),
      new User("tdo", "Trung Do", "https://i.pravatar.cc/150?u=td", "fe"),
      new User("vynguyen", "Vy Nguyen", "https://i.pravatar.cc/150?u=vyn"),
    ];
    this.reminders = [];
  }

  isLoggedIn(): boolean {
    return this.authToken !== null;
  }

  login(username: string, password: string): Promise<ApiResponse<string>> {
    this.authToken = "fakeToken";
    return Promise.resolve(ApiResponse.ok(this.authToken));
  }

  getAllUsers(): Promise<ApiResponse<Array<User>>> {
    return Promise.resolve(ApiResponse.ok(this.users));
  }

  getAllReminders(): Promise<ApiResponse<Array<Reminder>>> {
    return Promise.resolve(ApiResponse.ok(this.reminders));
  }

  createReminder(description: string, userIds: Array<string>, amount: number): Promise<ApiResponse<Reminder>> {
    const users = userIds.map(id => this.users.filter(u => u.id === id)[0]);
    const createdReminder = new Reminder(this.reminders.length + 1, description, users, ReminderStatus.PENDING, amount);
    this.reminders = [createdReminder, ...this.reminders];
    return Promise.resolve(ApiResponse.ok(createdReminder));
  }
}
