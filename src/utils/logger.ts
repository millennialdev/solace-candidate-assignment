/**
 * Centralized logging utility
 * In production, this could be extended to send logs to a service like Sentry or DataDog
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    // In development, use console methods
    if (this.isDevelopment) {
      switch (level) {
        case "error":
          console.error(`[${entry.timestamp}] ERROR:`, message, data);
          break;
        case "warn":
          console.warn(`[${entry.timestamp}] WARN:`, message, data);
          break;
        case "info":
          console.info(`[${entry.timestamp}] INFO:`, message, data);
          break;
        case "debug":
          console.debug(`[${entry.timestamp}] DEBUG:`, message, data);
          break;
      }
    } else {
      // In production, send to monitoring service
      // For now, only log errors to console in production
      if (level === "error") {
        console.error(message, data);
      }

      // TODO: Send to external logging service (e.g., Sentry, DataDog)
      // this.sendToMonitoringService(entry);
    }
  }

  info(message: string, data?: unknown): void {
    this.log("info", message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log("warn", message, data);
  }

  error(message: string, data?: unknown): void {
    this.log("error", message, data);
  }

  debug(message: string, data?: unknown): void {
    this.log("debug", message, data);
  }
}

export const logger = new Logger();
