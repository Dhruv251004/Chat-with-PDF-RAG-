from langchain.agents.structured_output import ToolStrategy
import os
from langchain.agents import create_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from app.services.vector_service import load_vector_store
from langchain_core.tools import tool
from app.extensions import db
from app.models import Conversation
from pydantic import BaseModel, Field

# 1. Define the Structure you WANT


class RAGResponse(BaseModel):
    answer: str = Field(description="The main answer in markdown format")
    sources: list[str] = Field(
        description="List of page numbers or source snippets")
    confidence_score: int = Field(
        description="Confidence 1-10 based on document match")


SYSTEM_PROMPT = """

You are an expert Research Assistant powered by RAG technology. You help users understand complex PDF documents.

**Tool Usage:**
You must utilize `get_similar_pdf_content` to gather evidence for your answers.

**Reasoning Process:**
When a user asks a question, follow these steps explicitly:
1. **Tool Call:** Call `get_similar_pdf_content` with a search query optimized to find the answer.
2. **Context Analysis:** Read the retrieved chunks carefully.
3. **Reasoning:** Think about how the retrieved chunks relate to the user's question. Check for contradictions or synthesized insights.
4. **Formulate Answer:** Construct a comprehensive answer based on the evidence.

**Constraints:**
- for any query, don't just everytime paste the plain query in tool, try to reason what user wants to gather and then create your query.
- If the retrieved context is empty or irrelevant, try molding the query to find a content that user want to gather from pdf. If nothing works then at last politely inform the user you don't have that information.
- Do not use outside knowledge to fill in gaps unless explicitly asked to "explain using general knowledge."
- Keep your answers structured (use bullet points for lists).
"""


def query_llm(query: str, chat_id: str) -> str:
    """ takes query from user and gives repsonse of llm"""

    vector_db_path = os.path.join('storage', 'vectordb', chat_id)

    # 1. set up agent

    @tool
    def get_similar_pdf_content(text: str) -> str:
        """
            Fetch Similar content from the pdf 
        """

        vector_store = load_vector_store(vector_db_path)
        results = vector_store.similarity_search(text, k=20)
        output = []
        for res in results:
            output.append({
                "content": res.page_content,
                "page": res.metadata.get('page')
            })
        return output

    model = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
    agent = create_agent(
        model=model,
        tools=[get_similar_pdf_content],
        system_prompt=SYSTEM_PROMPT,
        response_format=ToolStrategy(RAGResponse)
    )

    # 2. fetch last 10 messages

    conversations = list(reversed(Conversation.query.filter_by(
        chat_id=chat_id).order_by(Conversation.created_at.desc()).limit(10).all()))

    messages = []

    for conv in conversations:
        messages.append({
            "role": conv.sender,
            "content": conv.content
        })

    res = agent.invoke(
        {
            "messages": messages
        }
    )

    print(res['structured_response'])
    return res['structured_response'].answer
