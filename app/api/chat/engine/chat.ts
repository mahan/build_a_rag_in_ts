import { ContextChatEngine, Settings } from "llamaindex";
import { getDataSource } from "./index";
import { VectorIndexRetriever, RetrieveParams, NodeWithScore } from "llamaindex"; // Adjust import paths as necessary

class DebugVectorIndexRetriever extends VectorIndexRetriever {
    async retrieve(params: RetrieveParams): Promise<NodeWithScore[]> {
        const nodes = await super.retrieve(params);
        console.log("RAG-nodes:", nodes);
        return nodes;
    }
}


export async function createChatEngine() {
    const index = await getDataSource();
    if (!index) {
        throw new Error(
            `StorageContext is empty - call 'npm run generate' to generate the storage first`,
        );
    }
    /*
    const retriever = index.asRetriever();
    retriever.similarityTopK = process.env.TOP_K
      ? parseInt(process.env.TOP_K)
      : 3;
    */

    const retriever = new DebugVectorIndexRetriever({
        index: index,
        similarityTopK: process.env.TOP_K ? parseInt(process.env.TOP_K) : 3
        //,topK: {}, // Assuming an empty object, adjust based on actual needs
    });

    return new ContextChatEngine({
        chatModel: Settings.llm,
        retriever,
        systemPrompt: process.env.SYSTEM_PROMPT,
    });
}