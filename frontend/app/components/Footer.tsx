"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Footer = () => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ実行
    setIsClient(true);
  }, []);

  // ホームページではフッターを表示しない
  if (pathname === "/" || !isClient) {
    return null;
  }

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ロゴ・説明 */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <div className="text-2xl">🐱</div>
              <h3 className="text-xl font-bold text-gray-800">ねこの里</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              あなたの大切な猫ちゃんたちを記録・管理できるアプリです。
              <br />
              猫好きのための、猫による、猫のコミュニティ 🐾
            </p>
          </div>

          {/* 機能一覧 */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-gray-800 mb-3">主な機能</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-orange-500">📝</span>
                猫の情報登録・管理
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-blue-500">👥</span>
                他の飼い主さんとの交流
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-green-500">📱</span>
                いつでもどこでもアクセス
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-purple-500">🔒</span>
                安全なデータ管理
              </li>
            </ul>
          </div>

          {/* お役立ち情報 */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-gray-800 mb-3">猫ちゃん豆知識</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-3 rounded-lg">
                <p className="font-medium text-gray-700 mb-1">💡 今日のTips</p>
                <p>猫は1日に16-20時間眠ります。たくさん寝るのは正常です！</p>
              </div>
            </div>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* コピーライト */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500">
                © 2024 ねこの里. Made with ❤️ for cat lovers everywhere.
              </p>
            </div>

            {/* ソーシャルアイコン風の装飾 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>🌟</span>
                <span>みんなで猫ちゃんを愛でましょう</span>
                <span>🐾</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
