'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

interface Region {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  area: number;
}

interface AnnotationCanvasProps {
  imageSrc: string | null;
  onRegionSelected: (region: { x: number, y: number, width: number, height: number, area: number }) => void;
}

export const AnnotationCanvas = ({ imageSrc, onRegionSelected }: AnnotationCanvasProps) => {
  const [imageMetadata, setImageMetadata] = useState<{ width: number, height: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // 領域選択関連の状態
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentRegion, setCurrentRegion] = useState<{ startX: number, startY: number, endX: number, endY: number } | null>(null);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  
  // コンテナの参照を取得
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // 画像が選択されたときにメタデータを取得
  useEffect(() => {
    if (!imageSrc) {
      setImageMetadata(null);
      // 画像が変わったら選択領域をリセット
      setSelectedRegions([]);
      setCurrentRegion(null);
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
  
  // マウスダウン時の処理
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !imageSrc) return;
    
    // 画像コンテナの位置を取得
    const rect = imageContainerRef.current.getBoundingClientRect();
    
    // マウスの位置を取得して、相対座標に変換
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    // 描画開始状態にする
    setIsDrawing(true);
    setCurrentRegion({
      startX,
      startY,
      endX: startX,
      endY: startY
    });
  };
  
  // マウス移動時の処理
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !currentRegion || !imageContainerRef.current) return;
    
    // 画像コンテナの位置を取得
    const rect = imageContainerRef.current.getBoundingClientRect();
    
    // マウスの位置を取得して、相対座標に変換
    const endX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const endY = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    
    // 現在の選択領域を更新
    setCurrentRegion({
      ...currentRegion,
      endX,
      endY
    });
  };
  
  // マウスアップ時の処理
  const handleMouseUp = () => {
    if (!isDrawing || !currentRegion) return;
    
    // 描画終了状態にする
    setIsDrawing(false);
    
    // 領域の座標を計算
    const x = Math.min(currentRegion.startX, currentRegion.endX);
    const y = Math.min(currentRegion.startY, currentRegion.endY);
    const width = Math.abs(currentRegion.endX - currentRegion.startX);
    const height = Math.abs(currentRegion.endY - currentRegion.startY);
    
    // 領域の面積を計算
    const area = width * height;
    
    // 有効な領域が選択された場合のみ追加
    if (width > 5 && height > 5) {
      const newRegion: Region = {
        id: `region-${Date.now()}`,
        x,
        y,
        width,
        height,
        area
      };
      
      // 領域を追加
      setSelectedRegions(prev => [...prev, newRegion]);
      
      // アクティブな領域として設定
      setActiveRegion(newRegion.id);
      
      // 親コンポーネントに選択領域を通知
      onRegionSelected(newRegion);
    }
    
    // 現在の領域をリセット
    setCurrentRegion(null);
  };
  
  // 領域クリック時の処理
  const handleRegionClick = (region: Region) => {
    // アクティブな領域として設定
    setActiveRegion(region.id);
    
    // 親コンポーネントに選択領域を通知
    onRegionSelected(region);
  };
  
  // 領域削除時の処理
  const handleRegionDelete = (e: React.MouseEvent, regionId: string) => {
    e.stopPropagation();
    
    // 領域を削除
    setSelectedRegions(prev => prev.filter(region => region.id !== regionId));
    
    // アクティブな領域をリセット
    if (activeRegion === regionId) {
      setActiveRegion(null);
    }
  };
  
  // 描画領域のスタイルを計算
  const getRegionStyle = (startX: number, startY: number, endX: number, endY: number) => {
    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    
    return {
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`
    };
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
            ref={imageContainerRef}
            className="relative bg-white border shadow-sm" 
            style={dimensions}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <Image
              src={imageSrc}
              alt="広告画像"
              fill
              style={{ objectFit: 'contain' }}
              sizes={`(max-width: 800px) 100vw, 800px`}
              priority
            />
            
            {/* 選択中の領域 */}
            {currentRegion && (
              <div 
                className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 pointer-events-none"
                style={getRegionStyle(currentRegion.startX, currentRegion.startY, currentRegion.endX, currentRegion.endY)}
              />
            )}
            
            {/* 選択済みの領域 */}
            {selectedRegions.map(region => (
              <div 
                key={region.id}
                className={`absolute border-2 ${
                  activeRegion === region.id ? 'border-yellow-500' : 'border-green-500'
                } bg-green-500 bg-opacity-10 cursor-pointer group`}
                style={{
                  left: `${region.x}px`,
                  top: `${region.y}px`,
                  width: `${region.width}px`,
                  height: `${region.height}px`
                }}
                onClick={() => handleRegionClick(region)}
              >
                {/* 削除ボタン */}
                <button
                  className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleRegionDelete(e, region.id)}
                >
                  ×
                </button>
              </div>
            ))}
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
      
      {/* 選択された領域の一覧 */}
      {selectedRegions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">選択済み領域 ({selectedRegions.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {selectedRegions.map(region => (
              <div 
                key={region.id}
                className={`p-2 border rounded text-sm ${
                  activeRegion === region.id ? 'bg-yellow-50 border-yellow-500' : 'bg-white'
                } cursor-pointer`}
                onClick={() => handleRegionClick(region)}
              >
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">領域 #{region.id.split('-')[1]}</span>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={(e) => handleRegionDelete(e, region.id)}
                  >
                    削除
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div>X: {Math.round(region.x)}</div>
                  <div>Y: {Math.round(region.y)}</div>
                  <div>幅: {Math.round(region.width)}</div>
                  <div>高さ: {Math.round(region.height)}</div>
                  <div className="col-span-2">面積: {Math.round(region.area)} px²</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};