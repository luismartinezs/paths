import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';

let db: Database | null = null;
let initializationPromise: Promise<void> | null = null;

export async function initializeDatabase(): Promise<void> {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      const SQL = await initSqlJs({
        locateFile: (file: string) => `/node_modules/sql.js/dist/${file}`
      });
      db = new SQL.Database();

      db.run(`
        CREATE TABLE IF NOT EXISTS actions (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          position TEXT
        );

        CREATE TABLE IF NOT EXISTS edges (
          id TEXT PRIMARY KEY,
          startActionId TEXT,
          endActionId TEXT,
          weight REAL,
          FOREIGN KEY (startActionId) REFERENCES actions(id),
          FOREIGN KEY (endActionId) REFERENCES actions(id)
        );
      `);

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  })();

  return initializationPromise;
}

export async function getDatabase(): Promise<Database> {
  if (!db) {
    await initializeDatabase();
  }
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    db.close();
    db = null;
  }
  initializationPromise = null;
}

// Helper functions for database operations
export async function executeQuery(sql: string, params: any[] = []): Promise<any> {
  const db = await getDatabase();
  return db.exec(sql, params);
}

export async function runQuery(sql: string, params: any[] = []): Promise<void> {
  const db = await getDatabase();
  db.run(sql, params);
}