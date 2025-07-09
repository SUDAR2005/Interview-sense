from fastapi import FastAPI, APIRouter, HTTPException
from services.llm import get_llm, coding_prompt_template
from langchain_core.prompts import PromptTemplate
from typing import List
import json
import re
from models.schemas import CodingQuestion, UploadTitle
prompt_template = PromptTemplate.from_template(coding_prompt_template)

router = APIRouter()
@router.post("/generate_code", response_model=List[CodingQuestion])
async def generate_code_response(topic: UploadTitle):
    try:
        llm = get_llm()
        chain = prompt_template | llm
        response = chain.invoke({"topic": topic.title})
        print(response.content)

        # # Extract JSON array using regex
        # match = re.search(r'\[\s*{.*?}\s*}(?:\s*,\s*{.*?}\s*)*\]', response.content, re.DOTALL)
        # if not match:
        #     raise ValueError("No valid JSON array found in response")

        json_text = response.content.strip().removeprefix("```json").removesuffix("```").strip()
        parsed_data = json.loads(json_text)

        # Validate against Pydantic model
        return [CodingQuestion(**item) for item in parsed_data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
