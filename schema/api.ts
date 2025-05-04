// API関連の型定義

// API共通のレスポンス型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// アノテーションAPIのレスポンス型
export interface AnnotationApiResponse {
  annotations: import('./annotation').Annotation[];
  categories: import('./annotation').LabelCategory[];
}

// 画像APIのレスポンス型
export interface ImageApiResponse {
  images: import('./image').ImageInfo[];
}

// 画像メタデータAPIのレスポンス型
export interface ImageMetadataApiResponse {
  metadata: import('./image').ImageMetadata;
}