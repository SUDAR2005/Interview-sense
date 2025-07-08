from services.llm import get_llm, aptitude_prompt_template
from langchain_core.prompts import PromptTemplate
from models.schemas import UploadTitle, AptitudeQuestion
from fastapi import APIRouter, HTTPException
from typing import List
import re
import json

router = APIRouter()
prompt_template = PromptTemplate.from_template(aptitude_prompt_template)

@router.post("/generate_aptitude", response_model=List[AptitudeQuestion])
async def get_apti_response(topic: UploadTitle):
    try:
        llm = get_llm()
        chain = prompt_template | llm
        response = chain.invoke({"topic": topic.title})
        print(response.content)

        # Extract JSON array using regex
        match = re.search(r'(\[\s*{.*?}\s*\])', response.content, re.DOTALL)
        if not match:
            raise ValueError("No valid JSON array found in response")

        json_text = match.group(1)
        parsed_data = json.loads(json_text)

        # Validate against Pydantic model
        return [AptitudeQuestion(**item) for item in parsed_data]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
