import { LABEL_COLORS, LABEL_BORDER_COLORS, LABEL_NAMES } from '@/constants/labels';

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