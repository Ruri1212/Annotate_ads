'use client';

import { useState } from 'react';

interface ImageSelectorProps {
  onImageSelect: (imageId: string, imagePath: string) => void;
}

export const ImageSelector = ({ onImageSelect }: ImageSelectorProps) => {
  // この部分は後で実装：画像一覧の取得と表示
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="card mb-4">
      <h2 className="text-xl font-semibold mb-4">画像選択</h2>
      <p className="text-gray-600 mb-4">
        アノテーションする広告画像を選択してください。
      </p>
      <div className="grid grid-cols-1 gap-2">
        {/* 画像一覧表示部分: 後のIssueで実装 */}
        <div className="p-4 border rounded bg-gray-50 flex justify-center items-center h-32">
          画像一覧がここに表示されます（Issue #2で実装予定）
        </div>
      </div>
    </div>
  );
};