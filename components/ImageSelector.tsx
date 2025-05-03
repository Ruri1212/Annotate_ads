'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageInfo {
  id: string;
  name: string;
  path: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  lastModified: Date;
}

interface ImageSelectorProps {
  onImageSelect: (imageId: string, imagePath: string) => void;
}

export const ImageSelector = ({ onImageSelect }: ImageSelectorProps) => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // コンポーネントマウント時に画像一覧を取得
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/images');
        
        if (!response.ok) {
          throw new Error('画像の取得に失敗しました');
        }
        
        const data = await response.json();
        setImages(data.images || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : '画像の取得中にエラーが発生しました');
        console.error('画像取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // 画像選択ハンドラー
  const handleImageSelect = (image: ImageInfo) => {
    setSelectedImage(image.id);
    onImageSelect(image.id, image.path);
  };

  return (
    <div className="card mb-4">
      <h2 className="text-xl font-semibold mb-4">画像選択</h2>
      <p className="text-gray-600 mb-4">
        アノテーションする広告画像を選択してください。
      </p>

      {loading && (
        <div className="p-4 text-center">
          <p>画像を読み込み中...</p>
        </div>
      )}

      {error && (
        <div className="p-4 text-center text-red-500">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && images.length === 0 && (
        <div className="p-4 text-center">
          <p>表示できる画像がありません</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {images.map((image) => (
          <div 
            key={image.id}
            className={`relative border rounded-md overflow-hidden cursor-pointer transition-all hover:shadow-md ${
              selectedImage === image.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleImageSelect(image)}
          >
            <div className="relative h-32 w-full">
              <Image
                src={image.path}
                alt={image.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="p-2 text-xs truncate bg-white">
              {image.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};