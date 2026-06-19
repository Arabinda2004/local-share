import sqlite3 from 'sqlite3';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Database {
    constructor(dbPath = './data/localshare.db') {
        this.dbPath = dbPath;
        this.db = null;
    }

    // Initialize database connection and schema
    async initialize() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    logger.error('Database connection error:', err);
                    reject(err);
                    return;
                }

                logger.info(`Connected to SQLite database at ${this.dbPath}`);

                // Enable foreign keys
                this.db.run('PRAGMA foreign_keys = ON', (err) => {
                    if (err) {
                        logger.error('Failed to enable foreign keys:', err);
                        reject(err);
                        return;
                    }

                    // Initialize schema
                    this.initializeSchema()
                        .then(() => resolve())
                        .catch(reject);
                });
            });
        });
    }

    // Initialize database schema
    async initializeSchema() {
        return new Promise((resolve, reject) => {
            try {
                const schemaPath = join(__dirname, 'init.sql');
                const schema = readFileSync(schemaPath, 'utf-8');

                // Execute all SQL statements
                this.db.exec(schema, (err) => {
                    if (err) {
                        logger.error('Schema initialization error:', err);
                        reject(err);
                        return;
                    }

                    logger.info('Database schema initialized successfully');
                    resolve();
                });
            } catch (err) {
                logger.error('Error reading schema file:', err);
                reject(err);
            }
        });
    }

    // Run a single SQL statement
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    logger.error('Database run error:', { sql, err });
                    reject(err);
                    return;
                }

                resolve({
                    lastID: this.lastID,
                    changes: this.changes
                });
            });
        });
    }

    // Get a single row
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    logger.error('Database get error:', { sql, err });
                    reject(err);
                    return;
                }

                resolve(row);
            });
        });
    }

    // Get all rows
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    logger.error('Database all error:', { sql, err });
                    reject(err);
                    return;
                }

                resolve(rows || []);
            });
        });
    }

    // Close database connection
    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        logger.error('Error closing database:', err);
                        reject(err);
                        return;
                    }

                    logger.info('Database connection closed');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    // Execute transaction
    async transaction(callback) {
        try {
            await this.run('BEGIN TRANSACTION');
            const result = await callback(this);
            await this.run('COMMIT');
            return result;
        } catch (err) {
            await this.run('ROLLBACK');
            throw err;
        }
    }
}

export default Database;
