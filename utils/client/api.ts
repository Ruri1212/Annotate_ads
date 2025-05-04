import { Annotation } from "@/schema/annotation"
import { ApiResponse } from "@/schema/api"

/**
 * アノテーションデータをサーバーに保存するAPI呼び出し
 */
export const saveAnnotationsData = async (annotations: {
    [key: string]: Annotation[]
}): Promise<ApiResponse<{ filePath: string }>> => {
    // 画像IDごとにグループ化されたアノテーションを配列に変換
    const imageIds = Object.keys(annotations)
    const annotationsArray = imageIds.map(
        (imageId) => annotations[imageId] || []
    )

    try {
        const response = await fetch("/api/annotations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                annotations: annotationsArray,
                imageIds: imageIds,
            }),
        })

        if (!response.ok) {
            throw new Error("アノテーションの保存に失敗しました")
        }

        const result = await response.json()
        return {
            success: true,
            data: result,
        }
    } catch (error) {
        console.error("アノテーションの保存中にエラーが発生しました:", error)
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "アノテーションの保存中に不明なエラーが発生しました",
        }
    }
}

/**
 * 保存されたアノテーションデータを読み込むAPI呼び出し
 */
export const loadAnnotationsData = async (): Promise<{
    [key: string]: Annotation[]
}> => {
    try {
        const response = await fetch("/api/annotations")

        if (!response.ok) {
            throw new Error("アノテーションの読み込みに失敗しました")
        }

        const data = await response.json()

        // データ構造を変換して、画像IDごとにアノテーションをグループ化
        const annotations: { [key: string]: Annotation[] } = {}

        // 各画像のメタデータを処理
        data.images.forEach((image: any) => {
            // 画像ファイル名をBase64エンコードしてIDに変換
            const imageId = Buffer.from(image.file_name).toString("base64")
            annotations[imageId] = []

            // この画像に対応するアノテーションを見つける
            data.annotations.forEach((annotationGroup: any[]) => {
                annotationGroup.forEach((annotation: any) => {
                    if (annotation.image_id === image.id) {
                        annotations[imageId].push({
                            bbox: annotation.bbox,
                            area: annotation.area,
                            category_id: annotation.category_id,
                        })
                    }
                })
            })
        })

        return annotations
    } catch (error) {
        console.error(
            "アノテーションの読み込み中にエラーが発生しました:",
            error
        )
        return {}
    }
}
