import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { CustomPDFLoader } from '@/utils/customPDFLoader';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { promises as fs } from 'fs';

export const run = async () => {
  try {

    // https://docs.pinecone.io/docs/node-client
    const index = pinecone.Index(PINECONE_INDEX_NAME);
    let indexStats = await index.describeIndexStats({
        describeIndexStatsRequest: {
            filter: {},
        },
    });

    console.log('indexStats => ', indexStats);

    await index.delete1({
        deleteAll: true,
        namespace: PINECONE_NAME_SPACE,
      });

    indexStats = await index.describeIndexStats({
        describeIndexStatsRequest: {
            filter: {},
        },
    });

    console.log('indexStats => ', indexStats);
  
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to delete namespace');
  }
};

(async () => {
  await run();
  console.log('namespace deleted');
})();
