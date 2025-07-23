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
import hashlib

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
class UserModel(Base):
    """ユーザーテーブル"""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)  # ハッシュ化されたパスワード
    country = Column(String(100), nullable=True)
    hobby = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


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
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ユーザー関連
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    country: Optional[str] = None
    hobby: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class User(BaseModel):
    id: int
    name: str
    email: str
    country: Optional[str] = None
    hobby: Optional[str] = None
    created_at: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


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
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


def hash_password(password: str) -> str:
    """パスワードをハッシュ化"""
    return hashlib.sha256(password.encode()).hexdigest()


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


@app.post("/users/register", response_model=User)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """ユーザー登録"""
    # メールアドレス重複チェック
    existing_user = (
        db.query(UserModel)
        .filter(UserModel.email == user.email.strip().lower())
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=400, detail="このメールアドレスは既に登録されています"
        )

    # バリデーション
    if not user.name.strip() or not user.email.strip() or not user.password.strip():
        raise HTTPException(
            status_code=400, detail="名前、メールアドレス、パスワードは必須です"
        )

    if len(user.password) < 6:
        raise HTTPException(
            status_code=400, detail="パスワードは6文字以上で入力してください"
        )

    # パスワードハッシュ化
    hashed_password = hash_password(user.password)

    # ユーザー作成
    new_user = UserModel(
        name=user.name.strip(),
        email=user.email.strip().lower(),
        password=hashed_password,
        country=user.country.strip() if user.country else None,
        hobby=user.hobby.strip() if user.hobby else None,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.post("/users/login", response_model=User)
def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    """ユーザーログイン"""
    # ユーザー検索
    user = (
        db.query(UserModel)
        .filter(UserModel.email == login_data.email.strip().lower())
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401, detail="メールアドレスまたはパスワードが間違っています"
        )

    # パスワード確認
    hashed_password = hash_password(login_data.password)
    if user.password != hashed_password:
        raise HTTPException(
            status_code=401, detail="メールアドレスまたはパスワードが間違っています"
        )

    return user


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


@app.delete("/cats/{cat_id}")
def delete_cat(cat_id: int, db: Session = Depends(get_db)):
    """猫の情報を削除する"""
    cat = (
        db.query(CatModel).filter(CatModel.id == cat_id).first()
    )  # これはCatModelインスタンス

    if cat is None:
        raise HTTPException(status_code=404, detail="猫の情報が見つかりませんでした")

    db.delete(cat)
    db.commit()

    return {"message": f"{cat.name}の情報を削除しました"}


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
