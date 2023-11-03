import { MongoClient, WithId, Document } from "mongodb";
import { LogEntry, validateLog } from "../models/log";
import { LogEventDTO } from "../dtos/logEvent.dto";

var _client: MongoClient;
const MONGODB_URI = process.env["MONGODB_URI"];

export const initializeClient = async (url: string): Promise<MongoClient> => {
  if (!url) throw new Error("Missing database connection string");
  if (_client) return _client;
  _client = new MongoClient(url);
  await _client.connect();
  return _client;
};

export const insertLog = async (log: LogEventDTO) => {
  const { error, value } = validateLog(log as LogEntry);
  if (error) throw new Error(error.message);
  if (!value) throw new Error("Error validating log event");
  const logEntity = value as LogEntry;
  const client = await initializeClient(MONGODB_URI);
  const database = client.db();
  const coll = database.collection(logEntity.category);
  const result = await coll.insertOne(logEntity);
  const createdLogEntity = await coll.findOne({ _id: result.insertedId });
  return entityToJson(createdLogEntity);
};

const entityToJson = (document: WithId<Document>) => {
  document.id = document._id;
  delete document._id;
  return document;
};
