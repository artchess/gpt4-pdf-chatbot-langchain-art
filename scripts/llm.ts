import { OpenAI } from "langchain/llms/openai";

export const run = async () => {
    const model = new OpenAI({ temperature: 0.9 });
    const res = await model.call('¿Cuál es la capital de Francia?');
    console.log('openai response => ', {res});
};

(async () => {
    await run();
    console.log('finished');
  })();