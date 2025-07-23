from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Text,
    ForeignKey,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship, joinedload
from pydantic import BaseModel
from typing import Optional, List
import os
from datetime import datetime
import hashlib
import json

# データベース接続
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://nekouser:nekopass@db:5432/nekoapp"
)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI(
    title="Backend API",
    version="1.0.0",
    description="バックエンドAPI - 猫管理・ユーザー認証",
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# データベースモデル
class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    country = Column(String(100), nullable=True)
    hobby = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    cats = relationship("CatModel", back_populates="user")


class CatModel(Base):
    __tablename__ = "cats"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    breed = Column(String(100), nullable=False)
    personality = Column(String(200), nullable=False)
    origin = Column(String(100), nullable=True)
    age = Column(Integer, nullable=True)
    color = Column(String(50), nullable=True)
    weight = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("UserModel", back_populates="cats")


# Pydanticモデル
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
    updated_at: datetime

    class Config:
        from_attributes = True


class UserInfo(BaseModel):
    id: int
    name: str
    country: Optional[str] = None

    class Config:
        from_attributes = True


class UserDetail(BaseModel):
    id: int
    name: str
    email: str
    country: Optional[str] = None
    hobby: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


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
    user_id: int
    created_at: datetime
    updated_at: datetime
    user: UserInfo

    class Config:
        from_attributes = True


# ユーティリティ関数
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    x_user_id: str = Header(None), db: Session = Depends(get_db)
) -> Optional[UserModel]:
    if not x_user_id:
        return None

    try:
        user_id = int(x_user_id)
        return db.query(UserModel).filter(UserModel.id == user_id).first()
    except (ValueError, TypeError) as e:
        print(f"ユーザーID解析エラー: {e}")
        return None


# エンドポイント
@app.get("/")
def read_root():
    return {"message": "Backend API is running!", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}


@app.post("/users/register", response_model=User)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = (
        db.query(UserModel)
        .filter(UserModel.email == user.email.strip().lower())
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=400, detail="このメールアドレスは既に登録されています"
        )

    if not user.name.strip() or not user.email.strip() or not user.password.strip():
        raise HTTPException(
            status_code=400, detail="名前、メールアドレス、パスワードは必須です"
        )

    if len(user.password) < 6:
        raise HTTPException(
            status_code=400, detail="パスワードは6文字以上で入力してください"
        )

    hashed_password = hash_password(user.password)

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
    user = (
        db.query(UserModel)
        .filter(UserModel.email == login_data.email.strip().lower())
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401, detail="メールアドレスまたはパスワードが間違っています"
        )

    hashed_password = hash_password(login_data.password)
    if user.password != hashed_password:
        raise HTTPException(
            status_code=401, detail="メールアドレスまたはパスワードが間違っています"
        )

    return user


@app.get("/users/{user_id}", response_model=UserDetail)
def get_user_detail(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()

    if user is None:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりませんでした。")

    return user


@app.get("/cats", response_model=List[Cat])
def get_cats(db: Session = Depends(get_db)):
    return (
        db.query(CatModel)
        .options(joinedload(CatModel.user))
        .order_by(CatModel.created_at.desc())
        .all()
    )


@app.post("/cats", response_model=Cat)
def create_cat(
    cat: CatCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="ログインが必要です")

    if not cat.name.strip() or not cat.breed.strip() or not cat.personality.strip():
        raise HTTPException(status_code=400, detail="名前、種類、性格は必須です")

    new_cat = CatModel(**cat.dict(), user_id=current_user.id)
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat


@app.get("/cats/{cat_id}", response_model=Cat)
def get_cat(cat_id: int, db: Session = Depends(get_db)):
    cat = (
        db.query(CatModel)
        .options(joinedload(CatModel.user))
        .filter(CatModel.id == cat_id)
        .first()
    )

    if cat is None:
        raise HTTPException(status_code=404, detail="猫が見つかりませんでした。")

    return cat


@app.put("/cats/{cat_id}", response_model=Cat)
def put_cat(
    cat_id: int,
    data: CatCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="ログインが必要です")

    cat = db.query(CatModel).filter(CatModel.id == cat_id).first()

    if cat is None:
        raise HTTPException(status_code=404, detail="猫が見つかりませんでした。")

    if cat.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="この猫を編集する権限がありません。"
        )

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


@app.delete("/cats/{cat_id}")
def delete_cat(
    cat_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="ログインが必要です")

    cat = db.query(CatModel).filter(CatModel.id == cat_id).first()

    if cat is None:
        raise HTTPException(status_code=404, detail="猫の情報が見つかりませんでした")

    if cat.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="この猫を削除する権限がありません。"
        )

    cat_name = cat.name
    db.delete(cat)
    db.commit()
    return {"message": f"{cat_name}の情報を削除しました"}
