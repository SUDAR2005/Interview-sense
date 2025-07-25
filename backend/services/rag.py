from langchain_core.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser

def build_rag_chain(db, prompt_template_str, llm):
    prompt = ChatPromptTemplate.from_template(prompt_template_str)

    rag_chain = (
        {
            "context": lambda x: db.as_retriever().invoke(x["question"]),
            "question": RunnablePassthrough(),
            "chat_history": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )
    return rag_chain

def format_chat_history(history):
    return "\n".join(history)
