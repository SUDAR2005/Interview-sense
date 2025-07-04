# %% [markdown]
# # Import Langchain library to load and split document

# %%
from langchain_community.document_loaders import PyPDFLoader
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from chromadb.config import Settings
from dotenv import load_dotenv
load_dotenv()

# %% [markdown]
# # Load the Document 

# %%
def load_document(path: str):
    '''Load a document from a given path'''
    # Split the pad and get the extension
    _, ext = os.path.splitext(path)
    # checks it is pdf
    if ext != '.pdf':
        raise TypeError(f"Expected a pyf object received {ext}")
    loader = PyPDFLoader(path)
    # return the loader instance
    return loader.load()
        

# %%
def split_text(documents):
    '''Split the document using text splitter'''
    splitter = RecursiveCharacterTextSplitter(
    chunk_size=300, # Size of each chunk in characters
    chunk_overlap=100, # Overlap between consecutive chunks
    length_function=len, # Function to compute the length of the text
    add_start_index=True, # Flag to add start index to each chunk
    )
    # chunks of splitted document.
    texts = splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(texts)} chunks.")
    
    print("Content: ", texts[0].page_content)
    print('Meta data: ', texts[0].metadata)
    return texts


# %%
def store_vectordb(embedding, texts, directory = './chroma_db'):
    # Create a new entry in the database
    db = Chroma.from_documents(texts, embedding, persist_directory=directory
                               ,client_settings=Settings(anonymized_telemetry=False))
    db.persist()
    return db

# %%
def generate_data_store(path, model = 'Gemini'):
    # Load the PDF document
    documents = load_document(path=path)
    # split the text using Recursive Text Splitter
    chunks = split_text(documents=documents)
    # Create a vector database
    if model == 'Gemini':
        embedding = GoogleGenerativeAIEmbeddings(model='models/embedding-001', google_api_key=os.getenv('GOOGLE_API_KEY'))
        db = store_vectordb(embedding=embedding, texts=chunks, directory='./chroma_db')
        return db
    

# %%
db = generate_data_store(path='./data/Sudar Manikandan S RESUME.pdf')

# %%
hr_prompt_template = """
You are an experienced HR interviewer conducting a professional interview. Based on the candidate's resume information provided below, ask relevant and insightful questions.

RESUME CONTEXT:
{context}

CONVERSATION HISTORY:
{chat_history}

CURRENT QUESTION/RESPONSE: {question}

Guidelines for your behavior:
1. Act as a professional, friendly HR interviewer
2. Ask follow-up questions based on the resume content
3. Explore technical skills, experience, and soft skills
4. Ask about projects, achievements, and career goals
5. Keep questions conversational and engaging
6. If the candidate asks about the company/role, provide general positive responses
7. Gradually progress from basic questions to more detailed technical/behavioral ones

If this is the start of conversation, introduce yourself and begin with an opening question.
If the candidate has responded, acknowledge their answer and ask appropriate follow-up questions.

Response:"""

# %%
from langchain import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
prompt_template = PromptTemplate(
    input_variables=["context", "chat_history", "question"],
    template=hr_prompt_template,
    output_variables=["Response"]
) 
llm  = ChatGoogleGenerativeAI(model='gemini-2.5-flash', api_key=os.getenv('GOOGLE_API_KEY'))

# %% [markdown]
# # Build RAG chain

# %%
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.schema.runnable import RunnableLambda

def build_rag_chain(db: Chroma, prompt, llm):
    rag_chain = (
    {"context": db.as_retriever(), "chat_history": RunnablePassthrough(), "question": RunnablePassthrough()} 
    | prompt 
    | llm
    | StrOutputParser() 
    )
    return rag_chain

# %% [markdown]
# # Sample testing part

# %%
# pass the prompt template and llm instance to construct the rag chain
rag_chain = build_rag_chain(db, prompt=prompt_template, llm=llm)

# %%
prompt = prompt_template.invoke({
    "context": "Experienced Python developer with AWS and DevOps exposure.",
    "chat_history": "HR: Hi! Can you tell me a bit about your last project?\nCandidate: Yes, I worked on a scalable microservice architecture using FastAPI...",
    "question": "Can you explain more about the architecture you designed?"
})


# %%
print(prompt.text)

# %%
rag_chain.invoke(prompt.text)

# %% [markdown]
# # Implementing Bot

# %%
chat_history = []

def format_chat_history(history):
    return "\n".join(history)

# %%
def chat_with_bot(rag_chain):
    print("👋 Welcome to HR Interview Bot. Type 'exit' to quit.\n")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ['exit', 'quit']:
            print("👋 Goodbye!")
            break
        
        # format history for prompt
        formatted_history = format_chat_history(chat_history)
        prompt = prompt_template.invoke({ 
            "context": "",
            "chat_history": formatted_history,
            "question": user_input
        })
        response = rag_chain.invoke(prompt.text)
        
        print(f"HR: {response}\n")
        # append to history
        chat_history.append(f"Candidate: {user_input}")
        chat_history.append(f"HR: {response}")


# %%
chat_with_bot(rag_chain=rag_chain)

# %% [markdown]
# # Voice Recognition Feature

# %%
import speech_recognition as sr

def get_voice_input():
    # recogniser instance
    r = sr.Recognizer()
    with sr.Microphone() as source:
        audio = r.listen(source=source)
    try:
        text = r.recognize_google(audio) # Using Google Speech Recognition API
        print(f"You said: {text}")
        return text
    except sr.UnknownValueError:
        print("Could not understand audio")
    except sr.RequestError as e:
        print(f"Could not request results; {e}")

# %%
text = get_voice_input()

# %%
def speak_with_bot(rag_chain):
    print("👋 Welcome to HR Interview Bot. Type 'exit' to quit.\n")
    while True:
        user_input = get_voice_input()
        if user_input == "Could not understand audio":
            print("Sorry, I didn't catch that. Please try again.\n")
            continue
        if user_input.lower() in ['exit', 'quit']:
            print("👋 Goodbye!")
            break
        
        # format history for prompt
        formatted_history = format_chat_history(chat_history)
        prompt = prompt_template.invoke({ 
            "context": "",
            "chat_history": formatted_history,
            "question": user_input
        })
        response = rag_chain.invoke(prompt.text)
        
        print(f"HR: {response}\n")
        # append to history
        chat_history.append(f"Candidate: {user_input}")
        chat_history.append(f"HR: {response}")



