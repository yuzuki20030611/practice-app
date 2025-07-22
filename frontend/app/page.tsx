"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();

  const clickLogin = () => {
    router.push("/nekoList");
  };

  return (
    <div>
      <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-8">
        {/* メインタイトル */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-700 mb-2">ねこの里🐈</h2>
        </div>

        <div>
          <button
            className="bg-red-500 hover:bg-red-700 text-white text-lg font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            onClick={clickLogin}
          >
            ログイン
          </button>
        </div>
      </div>
    </div>
  );
}
