
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import * as fs from 'fs';

export const run = async () => {

    const model = new OpenAI({  });
    const text = fs.readFileSync('scripts/la_historia_biblica.txt', 'utf8');
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000});
    const docs = await textSplitter.createDocuments([text]);

    // create a vector store from the documents with  HNSWLib
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

    // create a chain that uses the OpenAI LLM and HNSWLib vector store
    const chain = ConversationalRetrievalQAChain.fromLLM(
            model, 
            vectorStore.asRetriever()
        );

    // Ask it a question
    const question = 'Mencioname el nombre del primer pacto en la serie de pactos';

    const res = await chain.call({
        question,
        chat_history: []
    });

    console.log('openai response => ', {res});

    // Ask it a follow up question

    const chatHistory = question + res.text;
    const followUpRes = await chain.call({
        question: 'Dame mas detalles sobre ese pacto',
        chat_history: chatHistory,
    });

    console.log('openai response 2 => ', {followUpRes});
};

(async () => {
    await run();
    console.log('finished');
  })();