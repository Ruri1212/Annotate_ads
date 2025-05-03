import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { promises as fsPromises } from 'fs';
import { stat } from 'fs/promises';

// 画像ファイルの詳細情報を取得する型定義
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

// 画像一覧を取得するGETリクエストハンドラー
export async function GET() {
  // publicディレクトリ内の画像フォルダへのパスを指定
  const imageDirectory = path.join(process.cwd(), 'public', 'no_annotated_ads_images');
  
  try {
    // ディレクトリが存在するか確認
    await fsPromises.access(imageDirectory);
    
    // ディレクトリの中身を読み込む
    const files = await fsPromises.readdir(imageDirectory);
    
    // 画像ファイルのみをフィルタリング（.png, .jpg, .jpeg）
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
    });
    
    // 各画像ファイルの詳細情報を取得
    const imagesInfo: ImageInfo[] = await Promise.all(
      imageFiles.map(async (filename) => {
        const filePath = path.join(imageDirectory, filename);
        const stats = await stat(filePath);
        
        return {
          id: Buffer.from(filename).toString('base64'),
          name: filename,
          path: `/no_annotated_ads_images/${filename}`,
          size: stats.size,
          lastModified: stats.mtime,
        };
      })
    );
    
    // 画像情報を最終更新日の降順にソート
    imagesInfo.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
    
    return NextResponse.json({ images: imagesInfo });
  } catch (error) {
    console.error('画像一覧の取得中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: '画像一覧の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}