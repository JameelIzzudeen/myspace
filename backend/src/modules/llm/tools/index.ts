import type { ChatCompletion, ChatCompletionTool } from "openai/resources";
import { testTool } from "./test.tool.js";
import { test2Tool } from "./test2.tool.js";
import { bashTool } from "./bash.tool.js";

const tools = [testTool, test2Tool];

const definition: ChatCompletionTool[] = tools.map((t) => t.definition);
const executors = new Map(
  tools.map((t) => [t.definition.function.name, t.execute]),
);

export default {
  definition,
  executors,
};
