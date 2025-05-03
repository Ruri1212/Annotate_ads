'use client';

import { Annotation } from '../../types/annotation';
import { getLabelColor, getLabelBorderColor, getLabelName } from '../../utils/annotation';

interface AnnotationListProps {
  annotations: Annotation[];
}

/**
 * 選択済みのアノテーション一覧を表示するコンポーネント
 */
export const AnnotationList = ({ annotations }: AnnotationListProps) => {
  if (annotations.length === 0) return null;

  return (
    <div className="mt-2 p-2 bg-white rounded border border-gray-200">
      <p className="text-sm font-medium">選択済みラベル:</p>
      <div className="mt-1 space-y-2">
        {annotations.map((annotation, idx) => (
          annotation.category_id && (
            <div 
              key={idx} 
              className="w-full px-2 py-1 rounded border"
              style={{
                backgroundColor: getLabelColor(annotation.category_id),
                borderColor: getLabelBorderColor(annotation.category_id)
              }}
            >
              <span className="text-sm font-medium">
                {getLabelName(annotation.category_id)}_{annotation.index}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
};