import { Annotation } from '../types/annotation';
import { LABEL_COLORS, LABEL_BORDER_COLORS, LABEL_NAMES } from '../constants/labels';

/**
 * ラベルIDに基づいて背景色を取得する
 */
export const getLabelColor = (categoryId: number): string => {
  if (categoryId in LABEL_COLORS) {
    return LABEL_COLORS[categoryId as keyof typeof LABEL_COLORS];
  }
  return 'rgba(128, 128, 128, 0.2)'; // デフォルト色
};

/**
 * ラベルIDに基づいてボーダー色を取得する
 */
export const getLabelBorderColor = (categoryId: number): string => {
  if (categoryId in LABEL_BORDER_COLORS) {
    return LABEL_BORDER_COLORS[categoryId as keyof typeof LABEL_BORDER_COLORS];
  }
  return 'rgba(128, 128, 128, 0.7)'; // デフォルト色
};

/**
 * ラベルIDに基づいてラベル名を取得する
 */
export const getLabelName = (categoryId: number): string => {
  return LABEL_NAMES[categoryId] || `Label ${categoryId}`;
};

/**
 * 同じカテゴリのアノテーション数をカウントしてインデックスを付与する
 */
export const assignLabelIndex = (
  annotations: Annotation[], 
  categoryId: number
): number => {
  const categoryAnnotations = annotations.filter(a => a.category_id === categoryId);
  return categoryAnnotations.length + 1;
};

/**
 * 画像のサイズに基づいて表示サイズを計算する
 */
export const calculateImageDimensions = (
  width: number | undefined, 
  height: number | undefined
): { width: string, height: string } => {
  if (!width || !height) return { width: '100%', height: 'auto' };
  
  const maxWidth = 800;
  const maxHeight = 400;
  
  let displayWidth = width;
  let displayHeight = height;
  
  if (displayWidth > maxWidth) {
    const ratio = maxWidth / displayWidth;
    displayWidth = maxWidth;
    displayHeight = Math.floor(displayHeight * ratio);
  }
  
  if (displayHeight > maxHeight) {
    const ratio = maxHeight / displayHeight;
    displayHeight = maxHeight;
    displayWidth = Math.floor(displayWidth * ratio);
  }
  
  return { 
    width: `${displayWidth}px`, 
    height: `${displayHeight}px` 
  };
};