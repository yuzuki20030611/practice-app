"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Cat, getCats } from "../API/api";

const NekoList = () => {
  const router = useRouter();
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catsData = await getCats();
        setCats(catsData);
      } catch (error) {
        console.error("猫の情報を取得するのに失敗しました", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const createClick = () => {
    router.push("createNekoList");
  };

  const clickBack = () => {
    router.push("/");
  };

  const clickUpdate = (catId: number) => {
    router.push(`/updateNekoList?id=${catId}`);
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-pink-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center">
            <div className="text-5xl animate-pulse">🐈</div>
            <p className="text-gray-500 mt-2">読み込み中...</p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-12">
              <h1 className="text-5xl font-light text-gray-700 mb-3">
                ねこの里 🐈
              </h1>
              <p className="text-gray-500 text-lg">
                {cats.length > 0
                  ? `${cats.length}匹の猫ちゃんたち`
                  : "猫ちゃんはまだいません"}
              </p>
            </div>
            {cats.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-8xl mb-6 opacity-60">😸</div>
                <p className="text-gray-600 text-xl mb-8 font-light">
                  最初の猫ちゃんを登録してみませんか？
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {cats.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">🐱</div>
                      <h3 className="text-2xl font-medium text-gray-800 mb-1">
                        {cat.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{cat.breed}</p>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-gray-600 italic">{cat.personality}</p>
                      {cat.origin ? (
                        <p className="text-xs text-gray-500">📍 {cat.origin}</p>
                      ) : null}

                      <div className="flex justify-center gap-3 text-xs text-gray-500 mt-3">
                        {cat.age !== undefined && cat.age !== null ? (
                          <span>🎂 {cat.age}歳</span>
                        ) : null}
                        {cat.weight !== undefined &&
                        cat.weight !== null &&
                        cat.weight > 0 ? (
                          <span>⚖️ {cat.weight}kg</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-center mt-1 pt-1 text-sm">
                      <button
                        onClick={() => clickUpdate(cat.id!)}
                        className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white px-5 py-3 rounded-full transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                      >
                        {cat.name}の情報を更新！
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-center">
              <div className="flex gap-4 justify-center">
                <button
                  onClick={clickBack}
                  className="bg-white/50 backdrop-blur-sm hover:bg-white/70 text-gray-700 px-8 py-3 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  ← ホーム
                </button>

                <button
                  onClick={createClick}
                  className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white px-8 py-3 rounded-full transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  + 新しい猫ちゃん
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NekoList;
