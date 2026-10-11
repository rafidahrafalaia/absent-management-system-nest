import mysql from 'mysql2';

/**
 * mysql2 with every pooled session pinned to UTC. Combined with `timezone: 'Z'`
 * this keeps DB-generated timestamps (created_at/updated_at) correct no matter
 * which time zone the MySQL server itself runs in.
 */
export const utcMysqlDriver = {
  ...mysql,
  createPool: (options: mysql.PoolOptions) => {
    const pool = mysql.createPool(options);
    pool.on('connection', (connection) => {
      connection.query("SET time_zone = '+00:00'");
    });
    return pool;
  },
};

export const UTC_MYSQL_OPTIONS = { timezone: 'Z', driver: utcMysqlDriver } as const;
