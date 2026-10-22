import { defaultMessage, query } from "../llm/llm.service.js";

export const createMessage = async (content: string) => {
  //   const res = await (content);
  //   let params = buildPrompt;
  //   params = withTools(params);
  //   const res = await queryLLM(withTools(buildPrompt), content);
  //   return res;
  const res = await query(defaultMessage(content));
  return res;
};
