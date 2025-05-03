'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ImageSelector } from '@/components/ImageSelector';
import { AnnotationCanvas } from '@/components/AnnotationCanvas';

export default function AnnotatePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImagePath, setSelectedImagePath] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<{ x: number, y: number, width: number, height: number, area: number } | null>(null);

  // 画像選択ハンドラー
  const handleImageSelect = (imageId: string, imagePath: string) => {
    setSelectedImage(imageId);
    setSelectedImagePath(imagePath);
    setSelectedRegion(null); // 画像が変わったら選択領域をリセット
  };

  // 領域選択ハンドラー
  const handleRegionSelect = (region: { x: number, y: number, width: number, height: number, area: number }) => {
    setSelectedRegion(region);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">広告アノテーションツール</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          ホームに戻る
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded p-6">
        <p className="text-gray-600 mb-4">
          このページでは広告画像のアノテーションを行います。画像を選択し、マウスドラッグで領域を指定してラベルを付与してください。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左側: 画像選択エリア */}
        <div className="md:col-span-1">
          <ImageSelector onImageSelect={handleImageSelect} />
        </div>
        
        {/* 右側: アノテーションエリア */}
        <div className="md:col-span-2">
          <AnnotationCanvas 
            imageSrc={selectedImagePath} 
            onRegionSelected={handleRegionSelect} 
          />
        </div>
      </div>
      
      {/* 選択された領域の情報表示（Issue #3で活用予定） */}
      {selectedRegion && (
        <div className="bg-white shadow-md rounded p-4 mt-4">
          <h3 className="font-semibold mb-2">選択された領域</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>X: {selectedRegion.x}</div>
            <div>Y: {selectedRegion.y}</div>
            <div>幅: {selectedRegion.width}</div>
            <div>高さ: {selectedRegion.height}</div>
            <div>面積: {selectedRegion.area}</div>
          </div>
        </div>
      )}
    </div>
  );
}