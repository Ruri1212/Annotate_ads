"use client"

import {
    Alert,
    AlertTitle,
    Box,
    CircularProgress,
    ImageList,
    ImageListItem,
    Typography,
} from "@mui/material"
import { useEffect, useState } from "react"

interface ImageInfo {
    id: string
    name: string
    path: string
    size: number
    dimensions?: {
        width: number
        height: number
    }
    lastModified: Date
}

interface ImageSelectorProps {
    onImageSelect: (imageId: string, imagePath: string) => void
}

export const AnnotationImageList = ({ onImageSelect }: ImageSelectorProps) => {
    const [images, setImages] = useState<ImageInfo[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // コンポーネントマウント時に画像一覧を取得
    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true)
                const response = await fetch("/api/images")

                if (!response.ok) {
                    throw new Error("画像の取得に失敗しました")
                }

                const data = await response.json()
                setImages(data.images || [])
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "画像の取得中にエラーが発生しました"
                )
                console.error("画像取得エラー:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchImages()
    }, [])

    return (
        <>
            <Typography variant="h5" gutterBottom>
                画像選択
            </Typography>
            <Typography variant="body1" gutterBottom>
                アノテーションする広告画像を選択してください。
            </Typography>
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress color="primary" />
                    <Typography variant="body1" sx={{ ml: 2 }}>
                        画像を読み込み中...
                    </Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    <AlertTitle>エラー</AlertTitle>
                    {error}
                </Alert>
            )}

            {!loading && !error && images.length === 0 && (
                <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                    表示できる画像がありません
                </Alert>
            )}
            <ImageList
                sx={{ width: 500, height: 450 }}
                rowHeight={164}
                cols={3}
            >
                {images.map((image) => (
                    <ImageListItem key={image.id}>
                        <img
                            src={image.path}
                            alt={image.name}
                            loading="lazy"
                            onClick={() => onImageSelect(image.id, image.path)}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </>
    )
}
