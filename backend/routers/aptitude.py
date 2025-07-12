from services.llm import get_llm, aptitude_prompt_template
from langchain_core.prompts import PromptTemplate
from models.schemas import UploadTitle, AptitudeQuestion
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List
import json
import re

router = APIRouter()
prompt_template = PromptTemplate.from_template(aptitude_prompt_template)

@router.get("/generate_aptitude", response_model=List[AptitudeQuestion])
async def get_apti_response(topic: UploadTitle = Depends()):
    try:
        llm = get_llm()
        chain = prompt_template | llm
        response = chain.invoke({"topic": topic.title})

        raw = response.content.strip()
        print(">>> RAW LLM OUTPUT:", repr(raw))

        match = re.search(r'\[\s*{.*?}\s*\]', raw, re.DOTALL)
        if not match:
            raise ValueError(f"No valid JSON array found in: {raw}")

        json_text = match.group(0)
        print(">>> EXTRACTED JSON:", json_text)

        parsed_data = json.loads(json_text)
        print(">>> PARSED:", parsed_data)

        return [AptitudeQuestion(**item) for item in parsed_data]

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))