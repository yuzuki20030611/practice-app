import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
}

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
}

export const registerUser = async (userData: UserCreate): Promise<User> => {
  try {
    const response = await api.post("/users/register", userData)
    return response
  } catch (error: any) {
     console.error("アカウント作成に失敗しました:", error);
     throw error
  }
}

export const loginUser = async (loginData: UserLogin): Promise<User> => {
  try {
    const response = await api.post("/users/login", loginData);
    return response.data;
  } catch (error: any) {
    console.error("ログインに失敗しました:", error)
    throw error
  }
}

export const createCat = async (catData: Omit<Cat, "id">): Promise<Cat> => {
  try {
    const response = await api.post("/cats", catData);
    return response.data;
  } catch (error) {
    console.error("猫の作成に失敗しました:", error);
    throw error;
  }
};

// 猫一覧取得API
export const getCats = async (): Promise<Cat[]> => {
  try {
    const response = await api.get("/cats");
    return response.data;
  } catch (error) {
    console.error("猫の一覧取得に失敗しました:", error);
    throw error;
  }
};

// 特定の猫取得API
export const getCatById = async (id: number): Promise<Cat> => {
  try {
    const response = await api.get(`/cats/${id}`);
    return response.data;
  } catch (error) {
    console.error("猫の取得に失敗しました:", error);
    throw error;
  }
};

// 猫更新API
export const updateCat = async (
  id: number,
  catData: Partial<Cat>
): Promise<Cat> => {
  try {
    const response = await api.put(`/cats/${id}`, catData);
    return response.data;
  } catch (error) {
    console.error("猫の更新に失敗しました:", error);
    throw error;
  }
};


export const deleteCat = async (id: number): Promise<{message: string}> => {
  try {
    const response = await api.delete(`${API_BASE_URL}/cats/${id}`);
    return response.data;
  } catch(error: any) {
    throw new Error(
      error.response?.data?.detail ||
      `猫の削除に失敗しました: ${error.message}`
    );
  }
}