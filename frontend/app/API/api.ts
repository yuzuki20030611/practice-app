import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

// APIインスタンス作成
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// リクエストインターセプター：ユーザー情報をヘッダーに追加
api.interceptors.request.use(
  (config: any) => {
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          // ユーザーIDのみを送信（数字なので安全）
          config.headers["X-User-Id"] = user.id.toString();
        } catch (e) {
          console.error("ユーザーデータの解析に失敗:", e);
        }
      }
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// ユーザー型定義
export interface UserCreate {
  name: string;
  email: string;
  password: string;
  country?: string;
  hobby?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  country?: string;
  hobby?: string;
  created_at: string;
  updated_at: string;
}

// ユーザー詳細情報（user詳細ページ用）
export interface UserDetail {
  id: number;
  name: string;
  email: string;
  country?: string;
  hobby?: string;
  created_at: string;
}

// ユーザー基本情報（猫リスト表示用）
export interface UserInfo {
  id: number;
  name: string;
  country?: string;
}

// 猫型定義（完全版）
export interface Cat {
  id?: number;
  name: string;
  breed: string;
  personality: string;
  origin?: string;
  age?: number;
  color?: string;
  weight?: number;
  description?: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
  user?: UserInfo;  // ← これが重要！バックエンドからのuser情報
}

// ユーザー関連API
export const registerUser = async (userData: UserCreate): Promise<User> => {
  try {
    const response = await api.post("/users/register", userData);
    return response.data;
  } catch (error: any) {
    console.error("アカウント作成に失敗しました:", error);
    throw new Error(
      error.response?.data?.detail || 
      `アカウント作成に失敗しました: ${error.message}`
    );
  }
};

export const loginUser = async (loginData: UserLogin): Promise<User> => {
  try {
    const response = await api.post("/users/login", loginData);
    return response.data;
  } catch (error: any) {
    console.error("ログインに失敗しました:", error);
    throw new Error(
      error.response?.data?.detail || 
      `ログインに失敗しました: ${error.message}`
    );
  }
};

// ユーザー詳細取得API
export const getUserDetail = async (userId: number): Promise<UserDetail> => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("ユーザー詳細取得に失敗しました:", error);
    throw new Error(
      error.response?.data?.detail || 
      `ユーザー詳細取得に失敗しました: ${error.message}`
    );
  }
};

// 猫関連API
export const getCats = async (): Promise<Cat[]> => {
  try {
    const response = await api.get("/cats");
    console.log("API レスポンス:", response.data); // デバッグ用
    return response.data;
  } catch (error: any) {
    console.error("猫の一覧取得に失敗しました:", error);
    throw new Error(
      error.response?.data?.detail || 
      `猫の一覧取得に失敗しました: ${error.message}`
    );
  }
};

export const getCatById = async (id: number): Promise<Cat> => {
  try {
    const response = await api.get(`/cats/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("猫の取得に失敗しました:", error);
    throw new Error(
      error.response?.data?.detail || 
      `猫の取得に失敗しました: ${error.message}`
    );
  }
};

export const createCat = async (catData: Omit<Cat, "id" | "user_id" | "user" | "created_at" | "updated_at">): Promise<Cat> => {
  try {
    const response = await api.post("/cats", catData);
    return response.data;
  } catch (error: any) {
    console.error("猫の作成に失敗しました:", error);
    throw new Error(
      error.response?.data?.detail || 
      `猫の作成に失敗しました: ${error.message}`
    );
  }
};

export const updateCat = async (
  id: number,
  catData: Omit<Cat, "id" | "user_id" | "user" | "created_at" | "updated_at">
): Promise<Cat> => {
  try {
    const response = await api.put(`/cats/${id}`, catData);
    return response.data;
  } catch (error: any) {
    console.error("猫の更新に失敗しました:", error);
    throw new Error(
      error.response?.data?.detail || 
      `猫の更新に失敗しました: ${error.message}`
    );
  }
};

export const deleteCat = async (id: number): Promise<{message: string}> => {
  try {
    const response = await api.delete(`/cats/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("猫の削除に失敗しました:", error);
    throw new Error(
      error.response?.data?.detail ||
      `猫の削除に失敗しました: ${error.message}`
    );
  }
};