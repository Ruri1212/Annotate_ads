// 画像関連の型定義

// 画像のメタデータの型定義
export interface ImageMetadata {
  width: number;
  height: number;
}

// 画像情報の型定義
export interface ImageInfo {
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