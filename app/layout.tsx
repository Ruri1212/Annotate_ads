import './globals.css';
import type { Metadata } from 'next';
import MUIProvider from './providers/MUIProvider';

export const metadata: Metadata = {
  title: '広告アノテーションツール',
  description: '広告画像に対してテキストやロゴなどの領域を選択し、ラベルを付与するツール',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        <MUIProvider>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </MUIProvider>
      </body>
    </html>
  );
}