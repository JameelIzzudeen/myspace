import "dotenv/config";

export const llmConfig = {
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL || "undefined",

  model: process.env.LLM_MODEL,
  maxIteration: 50,
};
