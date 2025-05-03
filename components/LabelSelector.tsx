'use client';

import { useState, useEffect } from 'react';

// Label category interface matching the structure in sample_annotation.json
interface LabelCategory {
  id: number;
  name: string;
  supercategory: string;
}

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
        // Note: In a real application, we would fetch this from an API
        // For now, we'll hardcode the categories from sample_annotation.json
        const hardcodedCategories: LabelCategory[] = [
          { id: 1, name: "Logo", supercategory: "Logo" },
          { id: 2, name: "Text", supercategory: "Text" },
          { id: 3, name: "Background", supercategory: "Background" },
          { id: 4, name: "Symbol Element", supercategory: "Symbol Element" },
          { id: 5, name: "Emphasized Text", supercategory: "Emphasized Text" }
        ];
        
        setCategories(hardcodedCategories);
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
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
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