import { LogLevel } from "../models/log";

export interface LogEventDTO {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  data: string | Record<string, any>; // JSON string or parsed object
  category: string;
}
