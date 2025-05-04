// 共通の型定義

// 共通のサイズ型
export interface Size {
  width: number;
  height: number;
}

// 共通の位置情報型
export interface Position {
  x: number;
  y: number;
}

// 処理状態を表す型
export type Status = 'idle' | 'loading' | 'success' | 'error';