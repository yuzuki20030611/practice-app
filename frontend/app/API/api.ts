import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

// 猫削除API
export const deleteCat = async (id: number): Promise<void> => {
  try {
    await api.delete(`/cats/${id}`);
  } catch (error) {
    console.error("猫の削除に失敗しました:", error);
    throw error;
  }
};
