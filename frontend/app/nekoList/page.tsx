"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Cat, getCats, deleteCat } from "../API/api";
import SearchBar from "../components/SearchBar";

const NekoList = () => {
  const router = useRouter();
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catsData = await getCats();
        console.log("取得した猫データ:", catsData); // デバッグ用
        setCats(catsData);
      } catch (error) {
        console.error("猫の情報を取得するのに失敗しました", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    // ログインユーザー情報を取得
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUser(user);
        } catch (e) {
          console.error("ユーザーデータの解析に失敗:", e);
        }
      }
    }
  }, []);

  // 検索機能のロジック
  const filteredCats = useMemo(() => {
    if (!searchQuery.trim()) {
      return cats;
    }

    const query = searchQuery.toLowerCase().trim();

    return cats.filter((cat) => {
      // 猫の名前で検索
      const nameMatch = cat.name.toLowerCase().includes(query);

      // 猫の種類で検索
      const breedMatch = cat.breed.toLowerCase().includes(query);

      // 飼い主名で検索
      const ownerMatch = cat.user?.name.toLowerCase().includes(query) || false;

      // 性格で検索
      const personalityMatch = cat.personality.toLowerCase().includes(query);

      // 出身地で検索
      const originMatch = cat.origin?.toLowerCase().includes(query) || false;

      // 毛色で検索
      const colorMatch = cat.color?.toLowerCase().includes(query) || false;

      return (
        nameMatch ||
        breedMatch ||
        ownerMatch ||
        personalityMatch ||
        originMatch ||
        colorMatch
      );
    });
  }, [cats, searchQuery]);

  const createClick = () => {
    router.push("createNekoList");
  };

  const clickHome = () => {
    router.push("/");
  };

  const clickUpdate = (catId: number) => {
    router.push(`/updateNekoList?id=${catId}`);
  };

  // myCat関数を修正
  const myCat = () => {
    if (currentUser) {
      router.push(`/myCatList?id=${currentUser.id}`);
    } else {
      alert("ログインが必要です");
      router.push("/login");
    }
  };

  const clickDelete = async (catId: number, catName: string) => {
    const confirmed = window.confirm(
      `${catName}の情報を削除しますか？\nこの操作は元に戻せません。`
    );

    confirmed
      ? (async () => {
          setDeleting(catId);
          try {
            await deleteCat(catId);
            alert(`${catName}の情報を削除しました 😿`);

            // リストから削除して再描画
            setCats((prevCats) => prevCats.filter((cat) => cat.id !== catId));
          } catch (error: any) {
            alert(`削除に失敗しました: ${error.message}`);
          } finally {
            setDeleting(null);
          }
        })()
      : null;
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-pink-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
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
              {/* 検索バー */}
              {cats.length > 0 && (
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              )}
            </div>
            {/* 検索結果の表示 */}
            {searchQuery && (
              <div className="mb-6 text-center">
                <p className="text-gray-600">
                  「{searchQuery}」の検索結果: {filteredCats.length}匹の猫ちゃん
                </p>
                {filteredCats.length === 0 && (
                  <p className="text-gray-500 mt-2">
                    検索条件に該当する猫ちゃんが見つかりませんでした 😿
                  </p>
                )}
              </div>
            )}
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
                    {/* 猫の基本情報 */}
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">🐱</div>
                      <h3 className="text-2xl font-medium text-gray-800 mb-1">
                        {cat.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{cat.breed}</p>
                    </div>

                    {/* 猫の詳細情報 */}
                    <div className="text-center space-y-1 mb-4">
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

                    {cat.description && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">📝 説明：</p>
                        <p className="text-sm text-gray-700">
                          {cat.description}
                        </p>
                      </div>
                    )}

                    {cat.color && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">🎨 毛色：</p>
                        <p className="text-sm text-gray-700">{cat.color}</p>
                      </div>
                    )}

                    {/* 飼い主情報 */}
                    {cat.user ? (
                      <div className="border-t border-gray-200 pt-4 mb-4">
                        <p className="text-xs text-gray-500 mb-2">🏠 飼い主</p>
                        <button className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 rounded-lg p-3 transition-all duration-200 transform hover:scale-[1.02]">
                          <div className="text-center">
                            <p className="text-sm font-medium text-blue-800">
                              {cat.user.name}
                            </p>
                            {cat.user.country && (
                              <p className="text-xs text-blue-600 mt-1">
                                🌍 出身国: {cat.user.country}
                              </p>
                            )}
                            {cat.user.hobby /* ← この部分を追加 */ && (
                              <p className="text-xs text-blue-600 mt-1">
                                🎯 趣味: {cat.user.hobby}
                              </p>
                            )}
                          </div>
                        </button>
                      </div>
                    ) : (
                      <div className="border-t border-gray-200 pt-4 mb-4">
                        <p className="text-xs text-gray-500 mb-2">🏠 飼い主</p>
                        <div className="w-full bg-gray-100 rounded-lg p-3">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">
                              飼い主情報なし
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* アクションボタン */}
                    <div className="space-y-2">
                      <button
                        onClick={() => clickUpdate(cat.id!)}
                        className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] text-sm"
                      >
                        📝 {cat.name}の情報を更新
                      </button>

                      <button
                        onClick={() => clickDelete(cat.id!, cat.name)}
                        disabled={deleting === cat.id}
                        className="w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] text-sm"
                      >
                        {deleting === cat.id
                          ? "削除中..."
                          : `🗑️ ${cat.name}を削除`}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* フッターボタン */}
            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
                <button
                  onClick={clickHome}
                  className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                >
                  <span>🏠</span>
                  <span>ホームに戻る</span>
                </button>

                <button
                  onClick={createClick}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-0.5"
                >
                  <span>✨</span>
                  <span>新しい猫ちゃんを追加</span>
                </button>
                <button
                  onClick={() => myCat()}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-rose-500 hover:from-blue-600 hover:to-rose-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-0.5"
                >
                  <span>😽</span>
                  <span>私の猫</span>
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
