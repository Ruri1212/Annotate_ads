import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';

export async function GET(request: NextRequest) {
  // URLからファイル名を取得
  const searchParams = request.nextUrl.searchParams;
  const imageName = searchParams.get('image');

  if (!imageName) {
    return NextResponse.json({ error: '画像名が指定されていません' }, { status: 400 });
  }

  try {
    // 画像ファイルのパスを作成
    const imagePath = path.join(process.cwd(), 'no_annotated_ads_images', imageName);
    
    // Sharp を使用して画像のメタデータを取得
    const metadata = await sharp(imagePath).metadata();
    
    return NextResponse.json({
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
    });
  } catch (error) {
    console.error('画像メタデータの取得中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: '画像メタデータの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}