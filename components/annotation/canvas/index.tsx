"use client"

import { Annotation, ImageMetadata, SelectedRegion } from "@/schema/annotation"
import { calculateImageDimensions } from "@/utils/annotation"
import { Alert, Box, Card, CircularProgress, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import DrawingCanvas from "../canvas/drawing"
import SelectedLabelInfo from "../info"
import AnnotationList from "../list"

interface AnnotationCanvasProps {
    imageSrc: string | null
    onRegionSelected: (region: SelectedRegion) => void
    selectedLabel: number | null
    onAnnotationAdded: (annotation: Annotation) => void
    annotations: Annotation[]
}

const AnnotationCanvas = ({
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
        <Card sx={{ p: 3, position: "relative" }}>
            <Typography variant="h5" component="h2" gutterBottom>
                アノテーションエリア
            </Typography>

            <Box
                sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    bgcolor: "grey.50",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 2,
                    minHeight: "400px",
                }}
            >
                {loading && (
                    <Box sx={{ textAlign: "center" }}>
                        <CircularProgress size={24} sx={{ mb: 1 }} />
                        <Typography>画像を読み込み中...</Typography>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ width: "100%" }}>
                        {error}
                    </Alert>
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
                        <Typography color="text.secondary">
                            左側から画像を選択してください
                        </Typography>
                    )
                )}
            </Box>

            {imageMetadata && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    画像サイズ: {imageMetadata.width} x {imageMetadata.height}{" "}
                    px
                </Typography>
            )}

            <SelectedLabelInfo selectedLabel={selectedLabel} />

            <AnnotationList annotations={annotations} />
        </Card>
    )
}

export default AnnotationCanvas
