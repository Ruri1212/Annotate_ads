import { DEFAULT_CATEGORIES } from "@/constants/labels"
import { Annotation } from "@/schema/annotation"
import { readJSONFile, saveJSONToFile } from "@/utils/server/file"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

// POSTリクエストハンドラー - アノテーションデータを保存
export async function POST(request: NextRequest) {
    try {
        // リクエストボディを取得
        const body = await request.json()
        const { annotations, imageIds } = body

        if (
            !annotations ||
            !imageIds ||
            !Array.isArray(annotations) ||
            !Array.isArray(imageIds)
        ) {
            return NextResponse.json(
                { error: "無効なデータ形式です" },
                { status: 400 }
            )
        }

        // 画像メタデータを取得
        const imageMetadataPromises = imageIds.map(
            async (imageId: string, index: number) => {
                // Base64エンコードされたIDをデコード
                const fileName = Buffer.from(imageId, "base64").toString(
                    "utf-8"
                )

                // 画像メタデータ取得APIを呼び出し
                const response = await fetch(
                    `${
                        request.nextUrl.origin
                    }/api/images/metadata?image=${encodeURIComponent(fileName)}`
                )

                if (!response.ok) {
                    throw new Error(
                        `画像 ${fileName} のメタデータの取得に失敗しました`
                    )
                }

                const metadata = await response.json()

                return {
                    file_name: fileName,
                    height: metadata.height,
                    width: metadata.width,
                    id: index + 1, // 1から始まるIDを割り当て
                }
            }
        )

        // すべての画像メタデータを並列で取得
        const images = await Promise.all(imageMetadataPromises)

        // アノテーションデータを整形
        const formattedAnnotations = images.map((image, imageIndex) => {
            const imageAnnotations = annotations[imageIndex] || []

            return imageAnnotations.map((annotation: Annotation) => {
                return {
                    area: annotation.area,
                    bbox: annotation.bbox,
                    category_id: annotation.category_id,
                    image_id: image.id,
                }
            })
        })

        // 最終的なアノテーションデータ構造を作成
        const annotationData = {
            annotations: formattedAnnotations,
            images: images,
            categories: DEFAULT_CATEGORIES.map(
                ({ id, name, supercategory }) => ({
                    id,
                    name,
                    supercategory,
                })
            ),
        }

        // アノテーションデータをファイルに保存
        const savePath = path.join(
            process.cwd(),
            "public",
            "annotations",
            "annotation_data.json"
        )
        const saveResult = await saveJSONToFile(savePath, annotationData)

        if (!saveResult) {
            return NextResponse.json(
                { error: "アノテーションデータの保存に失敗しました" },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "アノテーションデータが正常に保存されました",
            filePath: "/annotations/annotation_data.json",
        })
    } catch (error) {
        console.error(
            "アノテーションデータの保存中にエラーが発生しました:",
            error
        )
        return NextResponse.json(
            { error: "アノテーションデータの保存中にエラーが発生しました" },
            { status: 500 }
        )
    }
}

// GETリクエストハンドラー - 保存されたアノテーションデータを取得
export async function GET() {
    try {
        const filePath = path.join(
            process.cwd(),
            "public",
            "annotations",
            "annotation_data.json"
        )

        // 新しいutility関数を使用してJSONファイルを読み込む
        const defaultData = {
            annotations: [],
            images: [],
            categories: DEFAULT_CATEGORIES.map(
                ({ id, name, supercategory }) => ({
                    id,
                    name,
                    supercategory,
                })
            ),
        }

        const annotationData = await readJSONFile(filePath, defaultData)
        return NextResponse.json(annotationData)
    } catch (error) {
        console.error(
            "アノテーションデータの取得中にエラーが発生しました:",
            error
        )
        return NextResponse.json(
            { error: "アノテーションデータの取得中にエラーが発生しました" },
            { status: 500 }
        )
    }
}
