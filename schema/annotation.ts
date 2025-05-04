// アノテーション関連の型定義

// アノテーション（画像上の選択領域とそのラベル）の型定義
export interface Annotation {
  bbox: [number, number, number, number]; // [x, y, width, height]
  area: number;
  category_id: number | null;
  index?: number; // 同じカテゴリーを区別するためのインデックス
}

// ラベルカテゴリの型定義
export interface LabelCategory {
  id: number;
  name: string;
  supercategory: string;
  color: string;
}

// 選択領域の型定義
export interface SelectedRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  area: number;
}