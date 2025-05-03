'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

interface AnnotationCanvasProps {
  imageSrc: string | null;
  onRegionSelected: (region: { x: number, y: number, width: number, height: number, area: number }) => void;
}

export const AnnotationCanvas = ({ imageSrc, onRegionSelected }: AnnotationCanvasProps) => {
  const [imageMetadata, setImageMetadata] = useState<{ width: number, height: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // 画像が選択されたときにメタデータを取得
  useEffect(() => {
    if (!imageSrc) {
      setImageMetadata(null);
      return;
    }
    
    const fetchImageMetadata = async () => {
      try {
        setLoading(true);
        
        // 画像名をパスから抽出
        const imageName = imageSrc.split('/').pop();
        if (!imageName) {
          throw new Error('画像名を取得できませんでした');
        }
        
        // メタデータを取得
        const response = await fetch(`/api/images/metadata?image=${encodeURIComponent(imageName)}`);
        
        if (!response.ok) {
          throw new Error('画像メタデータの取得に失敗しました');
        }
        
        const data = await response.json();
        
        if (!data.width || !data.height) {
          throw new Error('画像サイズを取得できませんでした');
        }
        
        setImageMetadata({ width: data.width, height: data.height });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '画像メタデータの取得中にエラーが発生しました');
        console.error('メタデータ取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImageMetadata();
  }, [imageSrc]);
  
  // 画像の大きさに基づいて表示サイズを計算
  const calculateDimensions = () => {
    if (!imageMetadata) return { width: '100%', height: 'auto', maxHeight: '400px' };
    
    // 画像のアスペクト比を維持しながら、コンテナに収まるサイズを計算
    const maxWidth = 800;
    const maxHeight = 400;
    
    let width = imageMetadata.width;
    let height = imageMetadata.height;
    
    if (width > maxWidth) {
      const ratio = maxWidth / width;
      width = maxWidth;
      height = Math.floor(height * ratio);
    }
    
    if (height > maxHeight) {
      const ratio = maxHeight / height;
      height = maxHeight;
      width = Math.floor(width * ratio);
    }
    
    return { width: `${width}px`, height: `${height}px` };
  };
  
  const dimensions = calculateDimensions();
  
  return (
    <div className="card relative">
      <h2 className="text-xl font-semibold mb-4">アノテーションエリア</h2>
      <div className="border rounded bg-gray-100 flex justify-center items-center p-4" style={{ minHeight: '400px' }}>
        {loading && (
          <div className="text-center">
            <p>画像を読み込み中...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        )}
        
        {imageSrc && !loading && !error ? (
          <div className="relative bg-white border shadow-sm" style={dimensions}>
            <Image
              src={imageSrc}
              alt="広告画像"
              fill
              style={{ objectFit: 'contain' }}
              sizes={`(max-width: 800px) 100vw, 800px`}
            />
            
            {/* 長方形選択オーバーレイ（Issue #3で実装予定） */}
            <div className="absolute inset-0">
              {/* Issue #3で実装予定 */}
            </div>
          </div>
        ) : !loading && !error && (
          <p className="text-gray-500">左側から画像を選択してください</p>
        )}
      </div>
      
      {imageMetadata && (
        <div className="mt-2 text-sm text-gray-600">
          画像サイズ: {imageMetadata.width} x {imageMetadata.height} px
        </div>
      )}
    </div>
  );
};