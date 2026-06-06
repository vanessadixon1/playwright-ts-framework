import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';

const logsDir = path.resolve(process.cwd(), 'reports/logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
      return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
    })
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level}] ${message}`)
      ),
    }),
    new transports.File({
      filename: path.join(logsDir, 'test-run.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
    new transports.File({
      filename: path.join(logsDir, 'errors.log'),
      level: 'error',
    }),
  ],
});
