"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ実行
    setIsClient(true);
  }, []);

  useEffect(() => {
    // ログインユーザー情報を取得（クライアントサイドのみ）
    if (isClient && typeof window !== "undefined") {
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
  }, [isClient, pathname]); // isClientも依存配列に追加

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
  }, [pathname]); // パスが変わったときにもチェック

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("user");
      setCurrentUser(null);
      router.push("/");
    }
  };

  const navigateToMyMyCats = () => {
    if (currentUser) {
      router.push(`/myCatList?id=${currentUser.id}`);
    }
  };

  // ホームページではヘッダーを表示しない
  if (pathname === "/") {
    return null;
  }

  // クライアントサイドでない場合は、ログイン状態を表示しないバージョンをレンダリング
  if (!isClient) {
    return (
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* ロゴ・タイトル */}
            <div className="flex items-center gap-3">
              <div className="text-3xl">🐱</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">ねこの里</h1>
                <p className="text-xs text-gray-500">猫ちゃん管理アプリ</p>
              </div>
            </div>

            {/* ナビゲーション */}
            <nav className="hidden md:flex items-center gap-6">
              <span className="px-4 py-2 rounded-lg font-medium text-gray-600">
                すべての猫
              </span>
              <span className="px-4 py-2 rounded-lg font-medium text-gray-600">
                猫を登録
              </span>
            </nav>

            {/* ローディング状態 */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ・タイトル */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push("/nekoList")}
          >
            <div className="text-3xl">🐱</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ねこの里</h1>
              <p className="text-xs text-gray-500">猫ちゃん管理アプリ</p>
            </div>
          </div>

          {/* ナビゲーション */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => router.push("/nekoList")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                pathname === "/nekoList"
                  ? "bg-orange-100 text-orange-800"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              すべての猫
            </button>

            {currentUser && (
              <button
                onClick={navigateToMyMyCats}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  pathname === "/myCatList"
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                私の猫
              </button>
            )}

            <button
              onClick={() => router.push("/createNekoList")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                pathname === "/createNekoList"
                  ? "bg-pink-100 text-pink-800"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              猫を登録
            </button>
          </nav>

          {/* ユーザー情報・ログイン/ログアウト */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-800">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500">ログイン中</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push("/login")}
                  className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  ログイン
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  新規登録
                </button>
              </div>
            )}
          </div>
        </div>

        {/* モバイルナビゲーション */}
        <nav className="md:hidden mt-4 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => router.push("/nekoList")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              pathname === "/nekoList"
                ? "bg-orange-100 text-orange-800"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            すべての猫
          </button>

          {currentUser && (
            <button
              onClick={navigateToMyMyCats}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                pathname === "/myCatList"
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              私の猫
            </button>
          )}

          <button
            onClick={() => router.push("/createNekoList")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              pathname === "/createNekoList"
                ? "bg-pink-100 text-pink-800"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            猫を登録
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
