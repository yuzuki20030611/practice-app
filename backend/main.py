from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# FastAPIアプリ初期化
app = FastAPI(
    title="Backend API",
    version="1.0.0",
    description="バックエンドAPI - 環境構築用",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Next.js frontend (ポート3001)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ヘルスチェック用エンドポイント
@app.get("/")
def read_root():
    return {"message": "Backend API is running!", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/test")
def test_endpoint():
    return {"message": "Test endpoint working", "data": "Hello from FastAPI!"}
