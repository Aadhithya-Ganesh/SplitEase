from llama_cloud_services import LlamaExtract
from llama_cloud import ExtractConfig
from app.utils.llama_config import schema, config
from fastapi import UploadFile, APIRouter, File
import tempfile


router = APIRouter(prefix="/api/scan", tags=["scan"])

extractor = LlamaExtract()


@router.post("/upload")
async def create_file(file: UploadFile = File(...)):

    # read uploaded image
    contents = await file.read()

    # save to temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    result = extractor.extract(
        files=tmp_path,
        data_schema=schema,
        config=ExtractConfig(**config),
    )

    return result.data  # type: ignore
