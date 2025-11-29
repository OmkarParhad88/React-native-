import * as SQLite from 'expo-sqlite';
import { Item } from '../Context/ItemsContext';

const db = SQLite.openDatabaseSync('items.db');

export const initDB = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY NOT NULL,
        seller TEXT,
        item TEXT,
        date TEXT,
        dag TEXT,
        qty TEXT,
        price TEXT,
        subtotal TEXT,
        expenseTotal TEXT,
        total TEXT
      );
    `);
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export const getItems = (): Item[] => {
  const allRows = db.getAllSync('SELECT * FROM items ORDER BY id DESC');
  return allRows as Item[];
};

export const insertItem = (item: Item) => {
  db.runSync(
    `INSERT INTO items (id, seller, item, date, dag, qty, price, subtotal, expenseTotal, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      item.id,
      item.seller,
      item.item,
      item.date,
      item.dag,
      item.qty,
      item.price,
      item.subtotal,
      item.expenseTotal,
      item.total,
    ]
  );
};

export const updateItem = (item: Item) => {
  try {
    db.runSync(
      `UPDATE items SET seller = ?, item = ?, date = ?, dag = ?, qty = ?, price = ?, subtotal = ?, expenseTotal = ?, total = ? WHERE id = ?`,
      [
        item.seller,
        item.item,
        item.date,
        item.dag,
        item.qty,
        item.price,
        item.subtotal,
        item.expenseTotal,
        item.total,
        item.id
      ]
    );
  } catch (error) {
    console.error("Error updating item:", error);
  }
};

export const deleteItem = (id: string) => {
  try {
    db.runSync('DELETE FROM items WHERE id = ?', [id]);
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

export const getUniqueSellers = (): string[] => {
  try {
    const result = db.getAllSync('SELECT DISTINCT seller FROM items WHERE seller IS NOT NULL AND seller != ""');
    return result ? result.map((row: any) => row.seller) : [];
  } catch (error) {
    console.error("Error fetching unique sellers:", error);
    return [];
  }
};

export const getUniqueItems = (): string[] => {
  try {
    const result = db.getAllSync('SELECT DISTINCT item FROM items WHERE item IS NOT NULL AND item != ""');
    return result ? result.map((row: any) => row.item) : [];
  } catch (error) {
    console.error("Error fetching unique items:", error);
    return [];
  }
};
