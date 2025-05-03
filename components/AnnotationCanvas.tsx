"use client"

import { useEffect, useState } from "react"
import { Annotation, ImageMetadata, SelectedRegion } from "../types/annotation"
import { calculateImageDimensions } from "../utils/annotation"
import { AnnotationList } from "./annotation/AnnotationList"
import { DrawingCanvas } from "./annotation/DrawingCanvas"
import { SelectedLabelInfo } from "./annotation/SelectedLabelInfo"

interface AnnotationCanvasProps {
    imageSrc: string | null
    onRegionSelected: (region: SelectedRegion) => void
    selectedLabel: number | null
    onAnnotationAdded: (annotation: Annotation) => void
    annotations: Annotation[]
}

export const AnnotationCanvas = ({
    imageSrc,
    onRegionSelected,
    selectedLabel,
    onAnnotationAdded,
    annotations = [],
}: AnnotationCanvasProps) => {
    const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(
        null
    )
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    // 画像が選択されたときにメタデータを取得
    useEffect(() => {
        if (!imageSrc) {
            setImageMetadata(null)
            return
        }

        const fetchImageMetadata = async () => {
            try {
                setLoading(true)

                // 画像名をパスから抽出
                const imageName = imageSrc.split("/").pop()
                if (!imageName) {
                    throw new Error("画像名を取得できませんでした")
                }

                // メタデータを取得
                const response = await fetch(
                    `/api/images/metadata?image=${encodeURIComponent(
                        imageName
                    )}`
                )

                if (!response.ok) {
                    throw new Error("画像メタデータの取得に失敗しました")
                }

                const data = await response.json()

                if (!data.width || !data.height) {
                    throw new Error("画像サイズを取得できませんでした")
                }

                setImageMetadata({ width: data.width, height: data.height })
                setError(null)
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "画像メタデータの取得中にエラーが発生しました"
                )
                console.error("メタデータ取得エラー:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchImageMetadata()
    }, [imageSrc])

    // 画像の表示サイズを計算
    const dimensions = calculateImageDimensions(
        imageMetadata?.width,
        imageMetadata?.height
    )

    return (
        <div className="card relative">
            <h2 className="text-xl font-semibold mb-4">アノテーションエリア</h2>
            <div
                className="border rounded bg-gray-100 flex justify-center items-center p-4"
                style={{ minHeight: "400px" }}
            >
                {loading && (
                    <div className="text-center">
                        <p>画像を読み込み中...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-500">
                        <p>{error}</p>
                    </div>
                )}

                {imageSrc && !loading && !error ? (
                    <DrawingCanvas
                        imageSrc={imageSrc}
                        imageMetadata={imageMetadata}
                        annotations={annotations}
                        selectedLabel={selectedLabel}
                        onRegionSelected={onRegionSelected}
                        onAnnotationAdded={onAnnotationAdded}
                        dimensions={dimensions}
                    />
                ) : (
                    !loading &&
                    !error && (
                        <p className="text-gray-500">
                            左側から画像を選択してください
                        </p>
                    )
                )}
            </div>

            {imageMetadata && (
                <div className="mt-2 text-sm text-gray-600">
                    画像サイズ: {imageMetadata.width} x {imageMetadata.height}{" "}
                    px
                </div>
            )}

            <SelectedLabelInfo selectedLabel={selectedLabel} />

            <AnnotationList annotations={annotations} />
        </div>
    )
}
