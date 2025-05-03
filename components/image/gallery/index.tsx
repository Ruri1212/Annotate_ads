"use client"

import {
    Alert,
    Box,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Grid,
    Typography,
} from "@mui/material"
import Image from "next/image"
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

interface ImageGalleryProps {
    onImageSelect: (imageId: string, imagePath: string) => void
}

const ImageGallery = ({ onImageSelect }: ImageGalleryProps) => {
    const [images, setImages] = useState<ImageInfo[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

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

    // 画像選択ハンドラー
    const handleImageSelect = (image: ImageInfo) => {
        setSelectedImage(image.id)
        onImageSelect(image.id, image.path)
    }

    return (
        <Card sx={{ mb: 4, p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                画像選択
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
                アノテーションする広告画像を選択してください。
            </Typography>

            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && images.length === 0 && (
                <Alert severity="info">表示できる画像がありません</Alert>
            )}

            <Grid container spacing={2} sx={{ mt: 1 }}>
                {images.map((image) => (
                    <Grid item xs={6} md={4} key={image.id}>
                        <Card
                            elevation={selectedImage === image.id ? 4 : 1}
                            onClick={() => handleImageSelect(image)}
                            sx={{
                                cursor: "pointer",
                                transition: "all 0.2s",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: 3,
                                },
                                border: selectedImage === image.id ? 2 : 0,
                                borderColor: "primary.main",
                            }}
                        >
                            <CardMedia
                                sx={{ height: 140, position: "relative" }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                >
                                    <Image
                                        src={image.path}
                                        alt={image.name}
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </Box>
                            </CardMedia>
                            <CardContent sx={{ py: 1 }}>
                                <Typography variant="body2" noWrap>
                                    {image.name}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Card>
    )
}

export default ImageGallery
