// src/db.ts
import Dexie, { Table } from 'dexie';

class MyAppDB extends Dexie {
  constructor() {
    super("MyAppDB");
    this.version(1).stores({
      credentials: "++id, type, publicKey, privateKey",
      permissionContexts: "++id, context",
    });
  }
}

// Export an instance of the database
const db = new MyAppDB();
export default db;
