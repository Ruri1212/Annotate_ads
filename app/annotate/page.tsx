'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AnnotatePage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">広告アノテーションツール</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          ホームに戻る
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded p-6">
        <p className="text-gray-600 mb-4">
          このページでは広告画像のアノテーションを行います。画像を選択し、マウスドラッグで領域を指定してラベルを付与してください。
        </p>
        <p className="text-sm text-gray-500">
          ※実装予定：画像選択、長方形領域指定、ラベル付与機能
        </p>
      </div>
    </div>
  );
}