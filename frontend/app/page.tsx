"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();

  const clickLogin = () => {
    router.push("/login");
  };

  const clickRegister = () => {
    router.push("/register");
  };

  const clickGuestMode = () => {
    router.push("/nekoList");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full">
        {/* メインタイトル */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6 animate-bounce">🐱</div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">ねこの里</h1>
          <p className="text-gray-600 text-lg font-light">
            あなたの大切な猫ちゃんたちを
            <br />
            記録・管理できるアプリです
          </p>
        </div>

        {/* ボタンエリア */}
        <div className="space-y-4">
          {/* ログインボタン */}
          <button
            onClick={clickLogin}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] hover:-translate-y-1"
          >
            <div className="flex items-center justify-center gap-3">
              <span>🚪</span>
              <span>ログイン</span>
            </div>
          </button>

          {/* アカウント作成ボタン */}
          <button
            onClick={clickRegister}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] hover:-translate-y-1"
          >
            <div className="flex items-center justify-center gap-3">
              <span>✨</span>
              <span>新規アカウント作成</span>
            </div>
          </button>

          {/* 区切り線 */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">または</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* ゲストモードボタン */}
          <button
            onClick={clickGuestMode}
            className="w-full bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 py-3 px-6 rounded-2xl font-medium text-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.01]"
          >
            <div className="flex items-center justify-center gap-3">
              <span>👤</span>
              <span>ゲストとして続行</span>
            </div>
          </button>
        </div>

        {/* フッター */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            猫好きのための、猫による、猫のアプリ 🐾
          </p>
        </div>
      </div>
    </div>
  );
}
