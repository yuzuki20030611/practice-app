"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { loginUser } from "../API/api";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      !formData.email || !formData.password
        ? (() => {
            throw new Error("メールアドレスとパスワードを入力してください");
          })()
        : null;

      const user = await loginUser(formData);

      // ログイン成功時にユーザー情報を保存（簡易実装）
      if (typeof window !== "undefined") {
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      alert(`おかえりなさい、${user.name}さん！🐾`);
      router.push("/nekoList");
    } catch (err: any) {
      setError(err.message || "ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };
  const clickRegister = () => {
    router.push("/register");
  };

  const clickHome = () => {
    router.push("/");
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-pink-50 min-h-screen flex items-center justify-center p-4">
      <div className="max-m-md w-full">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🐱</div>
          <h1 className="text-4xl font-bold text-gray-700 mb-3">ログイン</h1>
          <p className="text-gray-600">ねこの里へおかえりなさい</p>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
        >
          <div className="space-y-6">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                placeholder="パスワードを入力"
                required
              />
            </div>

            {/* ボタン */}
            <div className="mt-8 space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? "ログイン中..." : "ログイン 🚀"}
              </button>

              <button
                type="button"
                onClick={clickRegister}
                className="w-full bg-white/50 hover:bg-white/70 border border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-6 rounded-lg font-medium transition-all duration-200"
              >
                アカウントを作成する
              </button>

              <button
                type="button"
                onClick={clickHome}
                className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm transition-all duration-200"
              >
                ← ホームに戻る
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
