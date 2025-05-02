'use client';

import { useRef, useState, useEffect } from 'react';

interface AnnotationCanvasProps {
  imageSrc: string | null;
  onRegionSelected: (region: { x: number, y: number, width: number, height: number, area: number }) => void;
}

export const AnnotationCanvas = ({ imageSrc, onRegionSelected }: AnnotationCanvasProps) => {
  // この部分は後で実装：キャンバス上での長方形選択機能
  
  return (
    <div className="card relative">
      <h2 className="text-xl font-semibold mb-4">アノテーションエリア</h2>
      <div className="border rounded bg-gray-100 flex justify-center items-center" style={{ minHeight: '400px' }}>
        {imageSrc ? (
          <div className="relative">
            {/* 画像表示エリア */}
            <div className="bg-white p-4 text-center">
              選択された画像がここに表示されます（Issue #3で実装予定）
            </div>
            
            {/* 長方形選択オーバーレイ */}
            <div className="absolute inset-0">
              {/* Issue #3で実装予定 */}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">左側から画像を選択してください</p>
        )}
      </div>
    </div>
  );
};