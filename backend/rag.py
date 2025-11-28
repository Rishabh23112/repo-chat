import os
import time
from typing import List, Tuple
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

# Persistent path for ChromaDB
DB_DIR = "./chroma_db"

def load_documents(repo_path: str):
    docs = []
    for root, dirs, files in os.walk(repo_path):
        # Skip hidden directories and common ignore patterns
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', '__pycache__', 'venv', 'env']]
        
        for filename in files:
            if filename.startswith('.'):
                continue
            
            file_path = os.path.join(root, filename)
            try:
                # Basic text loader, might fail for binary files
                loader = TextLoader(file_path, encoding="utf-8")
                docs.extend(loader.load())
            except Exception:
                # Skip files that can't be read as text
                continue
    return docs

def ingest_repo(repo_path: str, repo_name: str, gemini_api_key: str):
    docs = load_documents(repo_path)
    if not docs:
        return False, "No valid text files found in the repository."
    
    # Limit the number of documents to avoid processing too much
    if len(docs) > 50:
        print(f"Warning: Repository has {len(docs)} files. Limiting to first 50 for faster processing.")
        docs = docs[:50]
        
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100
    )
    splits = text_splitter.split_documents(docs)
    
    # Limit splits
    if len(splits) > 150:
        print(f"Warning: Limiting to 150 chunks for faster processing.")
        splits = splits[:150]
    
    try:
        # Use LOCAL HuggingFace embeddings - NO API calls, NO rate limits!
        print("Using local embeddings (HuggingFace) - this may take a moment on first use...")
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
        
        persist_directory = os.path.join(DB_DIR, repo_name)
        
        print(f"Processing {len(splits)} chunks...")
        vectorstore = Chroma.from_documents(
            documents=splits,
            embedding=embeddings,
            persist_directory=persist_directory
        )
        vectorstore.persist()
        return True, f"Successfully processed {len(splits)} chunks from {len(docs)} files using local embeddings."
        
    except Exception as e:
        error_msg = str(e)
        return False, f"Error during ingestion: {error_msg}"

def get_chat_chain(repo_name: str, openai_api_key: str):
    persist_directory = os.path.join(DB_DIR, repo_name)
    if not os.path.exists(persist_directory):
        raise ValueError("Repository not processed yet.")
        
    embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
    vectorstore = Chroma(persist_directory=persist_directory, embedding_function=embeddings)
    
    llm = ChatOpenAI(temperature=0, openai_api_key=openai_api_key, model_name="gpt-3.5-turbo")
    
    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True
    )
    
    qa_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory,
    )
    
    return qa_chain

def ask_question(repo_name: str, question: str, chat_history: List[Tuple[str, str]], gemini_api_key: str):
    persist_directory = os.path.join(DB_DIR, repo_name)
    if not os.path.exists(persist_directory):
        raise ValueError("Repository not processed yet.")
        
    # Use LOCAL embeddings (same as ingestion)
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': True}
    )
    vectorstore = Chroma(persist_directory=persist_directory, embedding_function=embeddings)
    
    # Still use Gemini for chat (only 1 API call per question, very unlikely to hit limit)
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0,
        google_api_key=gemini_api_key
    )
    
    qa_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
    )
    
    result = qa_chain({"question": question, "chat_history": chat_history})
    return result["answer"]
