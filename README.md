# Annotate_ads

広告画像のアノテーションを行うための Web アプリケーションです。

## プロジェクト概要

このプロジェクトは、広告画像に対して領域を選択し、ラベル付けを行うためのツールです。Next.js と Material UI を使用して構築されています。

## アーキテクチャ

このプロジェクトは次のようなアーキテクチャで構成されています：

### ディレクトリ構造

```
app/                  # Next.js のアプリケーションルート
  ├── api/            # API エンドポイント
  ├── annotate/       # アノテーションページ
  └── providers/      # プロバイダーコンポーネント
components/           # UI コンポーネント
  ├── annotation/     # アノテーション関連コンポーネント
  ├── common/         # 共通コンポーネント
  ├── image/          # 画像関連コンポーネント
  └── layout/         # レイアウトコンポーネント
constants/            # 定数定義
public/               # 静的ファイル
  ├── annotations/    # アノテーションデータ
  └── no_annotated_ads_images/ # サンプル画像
schema/               # 型定義スキーマ
src/                  # ソースコード
  └── theme/          # MUI テーマ設定
utils/                # ユーティリティ関数
  ├── client/         # クライアント側ユーティリティ
  ├── common/         # 共通ユーティリティ
  └── server/         # サーバー側ユーティリティ
```

### 技術スタック

-   **フレームワーク**: Next.js
-   **UI ライブラリ**: Material UI (MUI)
-   **スタイリング**: Emotion (MUI の一部として)
-   **言語**: TypeScript

## 開発セットアップ

### 前提条件

-   Node.js 18.x 以上
-   npm 9.x 以上

### インストール

```bash
# 依存関係のインストール
npm install
```

### 開発サーバーの起動

```bash
# 開発サーバーを起動
npm run dev
```

アプリケーションは http://localhost:3000 で実行されます。

## 主な機能

-   画像の選択と表示
-   画像上での領域選択
-   ラベルの割り当て
-   アノテーションの保存と読み込み

## リファクタリングについて

このプロジェクトは以下のフェーズでリファクタリングを実施しました：

1. **基盤の準備**:

    - Material UI のインストールと設定
    - 型定義の整理と schema ディレクトリの作成

2. **コア機能のリファクタリング**:

    - ユーティリティ関数のクライアント/サーバー分離
    - コンポーネント構造の再編成

3. **UI の改善**:
    - 共通コンポーネントの MUI 化
    - ページレベルコンポーネントの改善

詳細なリファクタリングロードマップは `src/refactoring-roadmap.ts` に記載されています。
