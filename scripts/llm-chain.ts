
import { LLMChain } from "langchain/chains";
import { ChatPromptTemplate, HumanMessagePromptTemplate, PromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";

export const run = async () => {

    // construct an LLMChain from PromptTemplate and LLM
    const model = new OpenAI({ temperature: 0 });
    const template = '¿Cuál es la capital de {country}?';
    const prompt = new PromptTemplate({template, inputVariables: ['country'] });
    const normalChain = new LLMChain({ llm: model, prompt });
    const res = await normalChain.call({country: 'Francia'});
    console.log('openai response => ', {res});

    // construct an LLMChain from a ChatPromptTemplate and a chat model.
    const chatModel = new OpenAI({ temperature: 0 });
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
        SystemMessagePromptTemplate.fromTemplate(
            'Eres un asistente muy util que hace traducción del {input_language} al {output_language}.'
        ),
        HumanMessagePromptTemplate.fromTemplate('{text}'),
    ]);
    const chatChain = new LLMChain({ llm: chatModel, prompt: chatPrompt });
    const chatRes = await chatChain.call({input_language: 'English', output_language: 'Spanish', text: 'Hello, how are you?'});
    console.log('chat response => ', {chatRes});
};

(async () => {
    await run();
    console.log('finished');
  })();