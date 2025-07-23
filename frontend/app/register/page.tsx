"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { registerUser } from "../API/api";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    hobby: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      !formData.name || !formData.email || !formData.password
        ? () => {
            throw new Error("名前、メールアドレス、パスワードは必須です");
          }
        : null;

      await registerUser(formData);
      alert("アカウントを作成しました！🎉");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const clickLogin = () => {
    router.push("/login");
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-700 mb-3">
            アカウント作成 🐱
          </h1>
          <p className="text-gray-600">猫ちゃん管理アプリへようこそ！</p>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
        >
          <div className="space-y-6">
            {/* 名前 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="山田 太郎"
                required
              />
            </div>

            {/* メールアドレス */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="example@email.com"
                required
              />
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                パスワード <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="6文字以上"
                required
              />
            </div>

            {/* 出身国 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                出身国
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="日本"
              />
            </div>

            {/* 趣味 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                趣味
              </label>
              <input
                type="text"
                name="hobby"
                value={formData.hobby}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="猫と遊ぶこと"
              />
            </div>
          </div>

          {/* ボタン */}
          <div className="mt-8 space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200"
            >
              {loading ? "作成中..." : "アカウント作成 🚀"}
            </button>

            <button
              type="button"
              onClick={clickLogin}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-all duration-200"
            >
              既にアカウントをお持ちの方はこちら
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
