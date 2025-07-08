# services/resume_processor.py

import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from chromadb.config import Settings
from services.embeddings import get_embedding_model


def load_document(path: str):
    _, ext = os.path.splitext(path)
    if ext.lower() != ".pdf":
        raise TypeError(f"Expected PDF file, received {ext}")
    loader = PyPDFLoader(path)
    return loader.load()

def split_text(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=300,
        chunk_overlap=100,
        length_function=len,
        add_start_index=True,
    )
    return splitter.split_documents(documents)

def store_vectordb(embedding, texts, directory):
    return Chroma.from_documents(
        texts,
        embedding,
        persist_directory=directory,
        client_settings=Settings(anonymized_telemetry=False)
    )

def generate_data_store(path: str, session_id: str):
    documents = load_document(path)
    chunks = split_text(documents)
    embedding = get_embedding_model()
    db_directory = f"./chroma_db_{session_id}"
    db = store_vectordb(embedding, chunks, db_directory)
    return db, len(chunks)
