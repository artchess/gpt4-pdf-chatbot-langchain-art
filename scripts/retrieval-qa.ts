
import { RetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import * as fs from 'fs';

export const run = async () => {

    const model = new OpenAI({ modelName: 'gpt-3.5-turbo' });
    const text = fs.readFileSync('scripts/la_historia_biblica.txt', 'utf8');
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000});
    const docs = await textSplitter.createDocuments([text]);

    // create a vector store from the documents with  HNSWLib
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

    // create a chain that uses the OpenAI LLM and HNSWLib vector store
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

    const res = await chain.call({
        input_documents: docs,
        query: '¿Cual es la serie de pactos?'
    });

    console.log('openai response => ', {res});
};

(async () => {
    await run();
    console.log('finished');
  })();