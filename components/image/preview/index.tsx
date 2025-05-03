"use client"

import { Alert, Box, Paper, Skeleton, Typography } from "@mui/material"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ImagePreviewProps {
    imageSrc: string | null
    alt?: string
    maxHeight?: number
}

const ImagePreview = ({
    imageSrc,
    alt = "画像プレビュー",
    maxHeight = 400,
}: ImagePreviewProps) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [dimensions, setDimensions] = useState<{
        width: number
        height: number
    } | null>(null)

    useEffect(() => {
        if (!imageSrc) {
            setLoading(false)
            setDimensions(null)
            return
        }

        setLoading(true)
        setError(null)

        // 画像のメタデータを取得
        const fetchImageMetadata = async () => {
            try {
                // 画像名をパスから抽出
                const imageName = imageSrc.split("/").pop()
                if (!imageName) {
                    throw new Error("画像名を取得できませんでした")
                }

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

                setDimensions({ width: data.width, height: data.height })
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

    if (!imageSrc) {
        return (
            <Paper
                sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: maxHeight,
                    bgcolor: "grey.100",
                }}
            >
                <Typography color="text.secondary">
                    画像が選択されていません
                </Typography>
            </Paper>
        )
    }

    if (loading) {
        return (
            <Paper
                sx={{
                    width: "100%",
                    height: maxHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={maxHeight}
                    animation="wave"
                />
            </Paper>
        )
    }

    if (error) {
        return (
            <Paper
                sx={{
                    p: 2,
                    width: "100%",
                }}
            >
                <Alert severity="error">{error}</Alert>
            </Paper>
        )
    }

    return (
        <Paper
            elevation={1}
            sx={{
                position: "relative",
                width: "100%",
                height: maxHeight,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                }}
            >
                <Image
                    src={imageSrc}
                    alt={alt}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </Box>

            {dimensions && (
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderTopLeftRadius: 4,
                        fontSize: "0.75rem",
                    }}
                >
                    {dimensions.width} x {dimensions.height} px
                </Box>
            )}
        </Paper>
    )
}

export default ImagePreview
