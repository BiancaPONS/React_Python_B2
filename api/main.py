from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from db.database import create_db_and_tables
from routers.auth import router as auth_router
from routers.collection import router as collection_router
from routers.items import router as items_router


app = FastAPI(title="Catalogue de recettes")


app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1):517[3-9]",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,
    exception: HTTPException,
) -> JSONResponse:
    if isinstance(exception.detail, dict):
        content = exception.detail
    else:
        content = {
            "erreur": {
                "code": exception.status_code,
                "message": str(exception.detail),
            }
        }

    return JSONResponse(
        status_code=exception.status_code,
        content=content,
        headers=exception.headers,
    )


@app.on_event("startup")
async def startup() -> None:
    await create_db_and_tables()


app.include_router(auth_router)
app.include_router(items_router)
app.include_router(collection_router)
