from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional, List
import os
from datetime import datetime
from sqlalchemy import select

app = FastAPI()

# データベース接続
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://nekouser:nekopass@db:5432/nekoapp"
)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPIアプリ初期化
app = FastAPI(
    title="Backend API",
    version="1.0.0",
    description="バックエンドAPI - 環境構築用",
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Next.js frontend (ポート3001)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# データベースモデル（テーブル定義）
class CatModel(Base):
    __tablename__ = "cats"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    breed = Column(String, nullable=False)
    personality = Column(String, nullable=False)
    origin = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    color = Column(String, nullable=True)
    weight = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# Pydanticモデル（API用）
class CatCreate(BaseModel):
    name: str
    breed: str
    personality: str
    origin: Optional[str] = None
    age: Optional[int] = None
    color: Optional[str] = None
    weight: Optional[float] = None
    description: Optional[str] = None


class Cat(BaseModel):
    id: int
    name: str
    breed: str
    personality: str
    origin: Optional[str] = None
    age: Optional[int] = None
    color: Optional[str] = None
    weight: Optional[float] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


# データベースセッション取得
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ヘルスチェック用エンドポイント
@app.get("/")
def read_root():
    return {"message": "Backend API is running!", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    try:
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}


@app.get("/cats", response_model=List[Cat])
def get_cats(db: Session = Depends(get_db)):
    """猫一覧取得"""
    return db.query(CatModel).order_by(CatModel.created_at.desc()).all()


@app.post("/cats", response_model=Cat)
def create_cat(cat: CatCreate, db: Session = Depends(get_db)):
    """猫作成"""
    if not cat.name.strip() or not cat.breed.strip() or not cat.personality.strip():
        raise HTTPException(status_code=400, detail="名前、種類、性格は必須です")

    new_cat = CatModel(**cat.dict())
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat


@app.get("/cats/{cat_id}", response_model=Cat)
def get_cat(cat_id: int, db: Session = Depends(get_db)):
    """猫の特定の情報を取得"""
    result = db.execute(select(CatModel).where(CatModel.id == cat_id))
    cat = result.scalar_one_or_none()

    if cat is None:
        raise HTTPException(status_code=404, detail="猫が見つかりませんでした。")
    return cat


@app.put("/cats/{cat_id}", response_model=Cat)
def put_cat(cat_id: int, data: CatCreate, db: Session = Depends(get_db)):
    """猫の情報を更新する。"""
    result = db.execute(select(CatModel).where(CatModel.id == cat_id))
    cat = result.scalar_one_or_none()

    if cat is None:
        raise HTTPException(status_code=404, detail="猫が見つかりませんでした。")

    # バリデーション追加
    if not data.name.strip() or not data.breed.strip() or not data.personality.strip():
        raise HTTPException(status_code=400, detail="名前、種類、性格は必須です")

    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key != "id":
            setattr(cat, key, value)

    db.add(cat)
    db.commit()
    db.refresh(cat)

    return cat
