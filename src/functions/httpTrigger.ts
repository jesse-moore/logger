import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { LogEventDTO } from "../dtos/logEvent.dto";
import { insertLog } from "../services/mongodb";

export async function insertLogTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const logEvent = (await request.json()) as LogEventDTO;
    logEvent.timestamp = new Date().toISOString();
    const logDTO = await insertLog(logEvent);
    return { jsonBody: logDTO };
  } catch (error) {
    return { status: 500, body: "Error creating log" };
  }
}

app.http("insertLogTrigger", {
  methods: ["POST"],
  authLevel: "function",
  handler: insertLogTrigger,
});
