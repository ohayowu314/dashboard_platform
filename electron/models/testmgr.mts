import { db } from "./dbmgr.mjs";

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )`);

export const getNames = (): string[] => {
  console.log("getNames called");
  const sql = "SELECT name FROM users";
  return db.prepare(sql).all() as string[];
};
