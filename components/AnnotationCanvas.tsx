'use client';

import { useRef, useState, useEffect, MouseEvent } from 'react';
import Image from 'next/image';

interface Annotation {
  bbox: [number, number, number, number]; // [x, y, width, height]
  area: number;
  category_id: number | null;
}

interface AnnotationCanvasProps {
  imageSrc: string | null;
  onRegionSelected: (region: { x: number, y: number, width: number, height: number, area: number }) => void;
  selectedLabel: number | null;
  onAnnotationAdded: (annotation: Annotation) => void;
  annotations: Annotation[];
}

export const AnnotationCanvas = ({ 
  imageSrc, 
  onRegionSelected, 
  selectedLabel,
  onAnnotationAdded,
  annotations = []
}: AnnotationCanvasProps) => {
  const [imageMetadata, setImageMetadata] = useState<{ width: number, height: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // 矩形選択のための状態
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  
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

  // マウスイベントハンドラー
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setStartPoint({ x, y });
    setCurrentRect(null);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const width = Math.abs(x - startPoint.x);
    const height = Math.abs(y - startPoint.y);
    
    // 選択開始点からの相対位置に基づいて矩形の左上座標を計算
    const rectX = x < startPoint.x ? x : startPoint.x;
    const rectY = y < startPoint.y ? y : startPoint.y;
    
    setCurrentRect({ x: rectX, y: rectY, width, height });
  };
  
  const handleMouseUp = () => {
    if (!isDrawing || !currentRect) {
      setIsDrawing(false);
      return;
    }
    
    // 矩形の面積が小さすぎる場合は無視
    if (currentRect.width < 5 || currentRect.height < 5) {
      setIsDrawing(false);
      setCurrentRect(null);
      return;
    }
    
    // 親コンポーネントに選択領域を通知
    const area = currentRect.width * currentRect.height;
    onRegionSelected({
      x: currentRect.x,
      y: currentRect.y,
      width: currentRect.width,
      height: currentRect.height,
      area
    });
    
    // 選択されたラベルがある場合、アノテーションを追加
    if (selectedLabel) {
      const newAnnotation: Annotation = {
        bbox: [currentRect.x, currentRect.y, currentRect.width, currentRect.height],
        area,
        category_id: selectedLabel
      };
      
      onAnnotationAdded(newAnnotation);
    }
    
    setIsDrawing(false);
  };
  
  // 描画中のキャンセル（例：Escキー）
  const cancelDrawing = () => {
    setIsDrawing(false);
    setCurrentRect(null);
  };
  
  // Escキーでキャンセル
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelDrawing();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // ラベルごとの色を取得
  const getLabelColor = (categoryId: number) => {
    const colors = {
      1: 'rgba(255, 0, 0, 0.3)',     // Logo - 赤
      2: 'rgba(0, 0, 255, 0.3)',     // Text - 青
      3: 'rgba(0, 255, 0, 0.3)',     // Background - 緑
      4: 'rgba(255, 255, 0, 0.3)',   // Symbol Element - 黄
      5: 'rgba(255, 0, 255, 0.3)'    // Emphasized Text - マゼンタ
    };
    
    return colors[categoryId as keyof typeof colors] || 'rgba(128, 128, 128, 0.3)';
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
          <div 
            ref={canvasRef}
            className="relative bg-white border shadow-sm cursor-crosshair" 
            style={dimensions}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDrawing(false)}
          >
            <Image
              src={imageSrc}
              alt="広告画像"
              fill
              style={{ objectFit: 'contain' }}
              sizes={`(max-width: 800px) 100vw, 800px`}
            />
            
            {/* 既存のアノテーション表示 */}
            {annotations.map((annotation, index) => (
              <div
                key={index}
                className="absolute border-2 pointer-events-none"
                style={{
                  left: `${annotation.bbox[0]}px`,
                  top: `${annotation.bbox[1]}px`,
                  width: `${annotation.bbox[2]}px`,
                  height: `${annotation.bbox[3]}px`,
                  backgroundColor: annotation.category_id ? getLabelColor(annotation.category_id) : 'transparent',
                  borderColor: annotation.category_id ? getLabelColor(annotation.category_id).replace('0.3', '0.7') : 'gray'
                }}
              >
                {annotation.category_id && (
                  <span className="absolute top-0 left-0 bg-white text-xs px-1 border">
                    ID: {annotation.category_id}
                  </span>
                )}
              </div>
            ))}
            
            {/* 現在描画中の矩形 */}
            {currentRect && (
              <div
                className="absolute border-2 border-dashed border-blue-500 pointer-events-none"
                style={{
                  left: `${currentRect.x}px`,
                  top: `${currentRect.y}px`,
                  width: `${currentRect.width}px`,
                  height: `${currentRect.height}px`,
                  backgroundColor: selectedLabel ? getLabelColor(selectedLabel) : 'rgba(0, 0, 255, 0.1)'
                }}
              />
            )}
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
      
      {selectedLabel && (
        <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm">選択中のラベル: {selectedLabel}</p>
          <p className="text-xs text-gray-600">画像上でドラッグして領域を選択してください</p>
        </div>
      )}
    </div>
  );
};