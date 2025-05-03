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

/**
 * アノテーションデータをサーバーに保存する
 */
export const saveAnnotationsData = async (annotations: { [key: string]: Annotation[] }) => {
  // 画像IDごとにグループ化されたアノテーションを配列に変換
  const imageIds = Object.keys(annotations);
  const annotationsArray = imageIds.map(imageId => annotations[imageId] || []);
  
  try {
    const response = await fetch('/api/annotations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        annotations: annotationsArray,
        imageIds: imageIds,
      }),
    });
    
    if (!response.ok) {
      throw new Error('アノテーションの保存に失敗しました');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('アノテーションの保存中にエラーが発生しました:', error);
    throw error;
  }
};

/**
 * 保存されたアノテーションデータを読み込む
 */
export const loadAnnotationsData = async () => {
  try {
    const response = await fetch('/api/annotations');
    
    if (!response.ok) {
      throw new Error('アノテーションの読み込みに失敗しました');
    }
    
    const data = await response.json();
    
    // データ構造を変換して、画像IDごとにアノテーションをグループ化
    const annotations: { [key: string]: Annotation[] } = {};
    
    // 各画像のメタデータを処理
    data.images.forEach((image: any) => {
      // 画像ファイル名をBase64エンコードしてIDに変換
      const imageId = Buffer.from(image.file_name).toString('base64');
      annotations[imageId] = [];
      
      // この画像に対応するアノテーションを見つける
      data.annotations.forEach((annotationGroup: any[]) => {
        annotationGroup.forEach((annotation: any) => {
          if (annotation.image_id === image.id) {
            annotations[imageId].push({
              bbox: annotation.bbox,
              area: annotation.area,
              category_id: annotation.category_id
            });
          }
        });
      });
    });
    
    return annotations;
  } catch (error) {
    console.error('アノテーションの読み込み中にエラーが発生しました:', error);
    return {};
  }
};