'use client';

import { useState, useEffect } from 'react';
import { LabelCategory } from '../types/annotation';
import { DEFAULT_CATEGORIES, LABEL_BORDER_COLORS } from '../constants/labels';

interface LabelSelectorProps {
  onLabelSelect: (categoryId: number) => void;
  selectedLabel: number | null;
}

export const LabelSelector = ({ onLabelSelect, selectedLabel }: LabelSelectorProps) => {
  const [categories, setCategories] = useState<LabelCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 初期ロード時にカテゴリ情報を取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // 実際のアプリケーションではAPIからカテゴリを取得するが、
        // ここではハードコードしたカテゴリを使用
        setCategories(DEFAULT_CATEGORIES);
        setError(null);
      } catch (err) {
        setError('ラベルカテゴリの読み込みに失敗しました');
        console.error('カテゴリ読み込みエラー:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleLabelClick = (categoryId: number) => {
    onLabelSelect(categoryId);
  };

  if (loading) {
    return <div className="p-4 text-center">カテゴリを読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="card bg-white shadow-md rounded p-4">
      <h3 className="text-lg font-semibold mb-3">ラベルを選択</h3>
      
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleLabelClick(category.id)}
            className={`w-full p-2 rounded text-left ${
              selectedLabel === category.id
                ? 'border-2 font-bold'
                : 'border hover:opacity-80'
            }`}
            style={{
              backgroundColor: category.color,
              borderColor: selectedLabel === category.id 
                ? LABEL_BORDER_COLORS[category.id as keyof typeof LABEL_BORDER_COLORS] 
                : 'transparent'
            }}
          >
            <span className="font-medium">{category.name}</span>
            <span className="ml-2 text-sm opacity-75">({category.id})</span>
          </button>
        ))}
      </div>
      
      {selectedLabel && (
        <div className="mt-4 text-sm">
          <p>選択されたラベル: {categories.find(c => c.id === selectedLabel)?.name}</p>
        </div>
      )}
    </div>
  );
};