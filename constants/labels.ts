// ラベル関連の定数

// ラベルカテゴリーごとの固有色
export const LABEL_COLORS = {
  1: 'rgba(255, 100, 100, 0.2)', // Logo - 赤系
  2: 'rgba(100, 100, 255, 0.2)', // Text - 青系
  3: 'rgba(100, 255, 100, 0.2)', // Background - 緑系
  4: 'rgba(255, 140, 0, 0.2)',   // Symbol Element - オレンジ系
  5: 'rgba(255, 100, 255, 0.2)'  // Emphasized Text - マゼンタ系
};

// 濃い色のバージョン（ボーダーや選択中の表示に使用）
export const LABEL_BORDER_COLORS = {
  1: 'rgba(255, 100, 100, 0.7)', // Logo - 赤系
  2: 'rgba(100, 100, 255, 0.7)', // Text - 青系
  3: 'rgba(100, 255, 100, 0.7)', // Background - 緑系
  4: 'rgba(255, 140, 0, 0.7)',   // Symbol Element - オレンジ系
  5: 'rgba(255, 100, 255, 0.7)'  // Emphasized Text - マゼンタ系
};

// ラベル名の定義
export const LABEL_NAMES: Record<number, string> = {
  1: "Logo",
  2: "Text",
  3: "Background",
  4: "Symbol Element",
  5: "Emphasized Text"
};

// デフォルトのラベルカテゴリー一覧
export const DEFAULT_CATEGORIES = [
  { id: 1, name: "Logo", supercategory: "Logo", color: LABEL_COLORS[1] },
  { id: 2, name: "Text", supercategory: "Text", color: LABEL_COLORS[2] },
  { id: 3, name: "Background", supercategory: "Background", color: LABEL_COLORS[3] },
  { id: 4, name: "Symbol Element", supercategory: "Symbol Element", color: LABEL_COLORS[4] },
  { id: 5, name: "Emphasized Text", supercategory: "Emphasized Text", color: LABEL_COLORS[5] }
];