import OpenAI from "openai";
import { llmConfig } from "../../config/llm.js";
import type {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources";
import tools from "./tools/index.js";

const client = new OpenAI({
  apiKey: llmConfig.apiKey,
  baseURL: llmConfig.baseURL,
});

const params = {
  model: "nvidia/nemotron-3-ultra-550b-a55b",
  temperature: 1,
  top_p: 0.95,
  max_tokens: 1024,
  stream: false,
  reasoning_effort: "none",
  tools: tools.definition,
} satisfies Omit<ChatCompletionCreateParamsNonStreaming, "messages">;

export const defaultMessage = (
  prompt: string,
): ChatCompletionMessageParam[] => [
  { role: "system", content: "You are a helpful assistant" },
  { role: "user", content: prompt },
];

export const query = async (messages: ChatCompletionMessageParam[]) => {
  let maxIteration = llmConfig.maxIteration;
  let res = await client.chat.completions.create({
    ...params,
    messages,
  });
  let message = res.choices[0]?.message;
  console.log(message?.tool_calls);
  if (!message?.tool_calls) {
    return message?.content;
  }
  messages.push({
    role: "assistant",
    content: message.content,
    tool_calls: message.tool_calls,
  });

  while (
    message &&
    maxIteration > 0 &&
    message.tool_calls &&
    message.tool_calls.length > 0
  ) {
    maxIteration--;
    for (const call of message.tool_calls) {
      if (call.type !== "function") {
        continue;
      }
      const execute = tools.executors.get(call.function.name);
      const res = execute
        ? await execute(call.function.arguments)
        : `Error: unknown tool ${call.function.name}`;
      console.log(res);
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: res,
      });
    }
    res = await client.chat.completions.create({
      ...params,
      messages,
    });
    message = res.choices[0]?.message;
    console.log(message?.tool_calls);
  }

  return message?.content;
};
