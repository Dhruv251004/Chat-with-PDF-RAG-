import tempfile
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import os


def preprocess_pdf(pdf_bytes):
    final_chunks = []
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(pdf_bytes)
        tmp.flush()
        tmp_name = tmp.name

    try:
        loader = PyPDFLoader(tmp_name)
        documents = loader.load()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=2000,
            chunk_overlap=300,
            add_start_index=True,
            separators=["\n\n", "\n", " ", ""]
        )
        final_chunks = text_splitter.split_documents(documents)
    finally:
        os.remove(tmp_name)  # cleanup temp file
    return final_chunks


def create_vector_store(pdf, file_name):
    chunks = preprocess_pdf(pdf)
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    # embeddings = HuggingFaceEmbeddings(
    #     model_name="nomic-ai/nomic-embed-text-v1.5", model_kwargs={'trust_remote_code': True})
    vector_store = FAISS.from_documents(chunks, embeddings)
    storage_path = os.path.join("storage", "vectordb")
    file_path = os.path.join(storage_path, file_name)
    vector_store.save_local(file_path)


def load_vector_store(path: str):
    return FAISS.load_local(path, embeddings=HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2"), allow_dangerous_deserialization=True)
