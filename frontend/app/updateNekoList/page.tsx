"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Cat, getCatById, updateCat } from "../API/api";

const updateNekoList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catId = searchParams.get("id");
  const [formData, setFormData] = useState<Omit<Cat, "id">>({
    name: "",
    breed: "",
    personality: "",
    origin: "",
    age: undefined,
    color: "",
    weight: undefined,
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCat = async () => {
      if (!catId) {
        setError("猫のIDが見つかりません");
        setLoading(false);
        return;
      }
      try {
        const cat = await getCatById(Number(catId));
        setFormData({
          name: cat.name,
          breed: cat.breed,
          personality: cat.personality,
          origin: cat.origin || "",
          age: cat.age,
          color: cat.color || "",
          weight: cat.weight,
          description: cat.description || "",
        });
      } catch (err) {
        setError("猫の情報を取得できませんでした");
      } finally {
        setLoading(false);
      }
    };
    fetchCat();
  }, [catId]);

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
    setSaving(true);
    setError("");

    try {
      if (!formData.name || !formData.breed || !formData.personality) {
        throw new Error("名前、種類、性格は必須です");
      }
      // データをクリーニング（CreateNekoListと同じ形式に合わせる）
      const cleanedData = {
        name: formData.name.trim(),
        breed: formData.breed.trim(),
        personality: formData.personality.trim(),
        origin: formData.origin?.trim() || "", // 空文字列で送信（nullではなく）
        age: formData.age || undefined, // undefinedのまま
        color: formData.color?.trim() || "", // 空文字列で送信
        weight: formData.weight || undefined, // undefinedのまま
        description: formData.description?.trim() || "", // 空文字列で送信
      };

      console.log("送信するデータ:", cleanedData);

      await updateCat(Number(catId), cleanedData);
      alert("猫の情報を更新しました！🐈");
      router.push("/nekoList");
    } catch (err: any) {
      setError(err.message || "更新に失敗しました");
    } finally {
      setLoading(false);
    }
  };
  const clickBack = () => {
    router.push("/nekoList");
  };

  return loading ? (
    <div className="bg-gradient-to-br from-orange-50 to-pink-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl animate-pulse">🐱</div>
        <p className="text-gray-500 mt-2">猫の情報を読み込み中...</p>
      </div>
    </div>
  ) : error && !formData.name ? (
    <div className="bg-gradient-to-br from-orange-50 to-pink-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">😿</div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={clickBack}
          className="bg-red-500 text-white px-6 py-2 rounded"
        >
          猫リストに戻る
        </button>
      </div>
    </div>
  ) : (
    <div className="bg-gradient-to-br from-orange-50 to-pink-50 min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-700 mb-3">
            {formData.name}の情報を更新 🐈
          </h1>
          <p className="text-gray-500">猫ちゃんの情報を編集できます</p>
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
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
                placeholder="例： みけちゃん"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
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
                value={formData.age || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                min="0"
                max="30"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
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
                value={formData.weight || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                min="0"
                max="20"
                step="0.1"
              />
            </div>

            {/* 説明 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明・特徴
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="例: とても人懐っこくて、おもちゃで遊ぶのが大好きです。膝の上で寝るのが癖です。"
              />
            </div>
          </div>
          {/* ボタン */}
          <div className="flex gap-4 mt-8 justify-center">
            <button
              type="button"
              onClick={clickBack}
              className="bg-white/50 backdrop-blur-sm hover:bg-white/70 text-gray-700 px-8 py-3 rounded-full transition-all duration-200"
            >
              キャンセル
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 text-white px-8 py-3 rounded-full transition-all duration-200"
            >
              {saving ? "更新中..." : "更新する 🐾"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default updateNekoList;
