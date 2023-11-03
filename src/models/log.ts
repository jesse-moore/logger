import * as Joi from "joi";

export enum LogLevel {
  TRACE,
  INFO,
  WARN,
  ERROR,
  DEBUG,
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  data: string | Record<string, any>; // JSON string or parsed object
  category: string;
}

const logSchema = Joi.object<LogEntry>({
  id: Joi.string(),
  timestamp: Joi.date().iso().required(),
  level: Joi.number()
    .valid(...Object.values(LogLevel).filter((value) => typeof value === "number"))
    .required(),
  message: Joi.string().required(),
  data: Joi.alternatives().try(
    Joi.string().custom((value, helpers) => {
      try {
        JSON.parse(value);
        return value;
      } catch (e) {
        return helpers.error("any.invalid", { message: "data must be a valid JSON string" });
      }
    }),
    Joi.object()
  ),
  category: Joi.string()
    .required()
    .min(1) // Non-empty string
    .max(25)
    .pattern(/^[^$]/) // Doesn't start with the $ character
    .pattern(/^[a-zA-Z0-9_\- ]*$/) // Only allows letters, numbers, _, -, and spaces
    .lowercase(),
}).unknown(false);

export const validateLog = (logData: LogEntry): Joi.ValidationResult<LogEntry> => {
  return logSchema.validate(logData, { stripUnknown: true });
};
