"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { createCat } from "../API/api";

const CreateNekoList = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    personality: "",
    origin: "",
    age: undefined,
    color: "",
    weight: undefined,
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "age" || name === "weight"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.name || !formData.breed || !formData.personality) {
        throw new Error("名前、種類、性格は必須項目です。");
      }

      await createCat(formData);

      alert("猫の情報が正常に登録されました。");
      router.push("/nekoList");
    } catch (err: any) {
      setError(err.message || "登録に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const clickBack = () => {
    router.push("/nekoList");
  };

  return (
    <div className="bg-orange-50 min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-700 mb-2">
            新しい猫ちゃんを登録しよう！🐈
          </h2>
          <p className="text-gray-800">
            かわいい猫ちゃんの情報を教えてください
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="例： みけちゃん"
                required
              />
            </div>
            {/* 種類 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                種類 <span className="text-red-500">*</span>
              </label>
              <select
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">選択してください</option>
                <option value="日本猫">日本猫</option>
                <option value="アメリカンショートヘア">
                  アメリカンショートヘア
                </option>
                <option value="ペルシャ">ペルシャ</option>
                <option value="ロシアンブルー">ロシアンブルー</option>
                <option value="メインクーン">メインクーン</option>
                <option value="ブリティッシュショートヘア">
                  ブリティッシュショートヘア
                </option>
                <option value="スコティッシュフォールド">
                  スコティッシュフォールド
                </option>
                <option value="ラグドール">ラグドール</option>
                <option value="その他">その他</option>
              </select>
            </div>
            {/* 性格 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性格 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="personality"
                value={formData.personality}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline focus:ring-2 focus:ring-orange-500"
                placeholder="例: 甘えん坊で元気"
                required
              />
            </div>
            {/* 出身地 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                出身地
              </label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="例: 東京都"
              />
            </div>
            {/* 年齢 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年齢（歳）
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="0"
                max="30"
                placeholder="例: 3"
              />
            </div>
            {/* 毛色 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                毛色
              </label>
              <select
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">選択してください</option>
                <option value="白">白</option>
                <option value="黒">黒</option>
                <option value="グレー">グレー</option>
                <option value="茶色">茶色</option>
                <option value="三毛">三毛</option>
                <option value="キジトラ">キジトラ</option>
                <option value="サバトラ">サバトラ</option>
                <option value="茶トラ">茶トラ</option>
                <option value="その他">その他</option>
              </select>
            </div>
            {/* 体重 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                体重（kg）
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="0"
                max="20"
                step="0.1"
                placeholder="例: 4.5"
              />
            </div>

            {/* 説明 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                その他の特徴・説明
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="例: とても人懐っこくて、おもちゃで遊ぶのが大好きです。膝の上で寝るのが癖です。"
              />
            </div>
          </div>
          {/* ボタン */}
          <div className="flex gap-4 mt-8 justify-center">
            <button
              type="button"
              onClick={clickBack}
              className="bg-gray-500 hover:bg-gray-600 text-white text-lg font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              戻る
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-lg font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              {loading ? "登録中..." : "登録する 🐾"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNekoList;
