"use client"

import AnnotationCanvas from "@/components/annotation/canvas"
import LabelSelector from "@/components/annotation/selector"
import Button from "@/components/common/button"
import Loading from "@/components/common/loading"
import ImageGallery from "@/components/image/gallery"
import { Annotation, SelectedRegion } from "@/types/annotation"
import { loadAnnotationsData, saveAnnotationsData } from "@/utils/annotation"
import {
    Alert,
    Box,
    Container,
    Divider,
    Grid,
    Paper,
    Snackbar,
    Stack,
    Typography,
} from "@mui/material"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function AnnotatePage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [selectedImagePath, setSelectedImagePath] = useState<string | null>(
        null
    )
    const [selectedRegion, setSelectedRegion] = useState<SelectedRegion | null>(
        null
    )
    const [selectedLabel, setSelectedLabel] = useState<number | null>(null)
    const [annotations, setAnnotations] = useState<{
        [key: string]: Annotation[]
    }>({})
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [saveStatus, setSaveStatus] = useState<{
        type: "success" | "error" | null
        message: string | null
    }>({ type: null, message: null })
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // ページロード時に保存されたアノテーションを読み込む
    useEffect(() => {
        const fetchAnnotations = async () => {
            setIsLoading(true)
            try {
                const loadedAnnotations = await loadAnnotationsData()
                setAnnotations(loadedAnnotations)
            } catch (error) {
                console.error("アノテーションの読み込みに失敗しました:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAnnotations()
    }, [])

    // 画像選択ハンドラー
    const handleImageSelect = (imageId: string, imagePath: string) => {
        setSelectedImage(imageId)
        setSelectedImagePath(imagePath)
        setSelectedRegion(null) // 画像が変わったら選択領域をリセット
    }

    // 領域選択ハンドラー
    const handleRegionSelect = (region: SelectedRegion) => {
        setSelectedRegion(region)
    }

    // ラベル選択ハンドラー
    const handleLabelSelect = (categoryId: number) => {
        setSelectedLabel(categoryId)
    }

    // アノテーション追加ハンドラー
    const handleAnnotationAdded = (annotation: Annotation) => {
        if (!selectedImage) return

        setAnnotations((prev) => {
            const imageAnnotations = prev[selectedImage] || []
            return {
                ...prev,
                [selectedImage]: [...imageAnnotations, annotation],
            }
        })

        // 選択領域をリセット
        setSelectedRegion(null)
    }

    // アノテーション削除ハンドラー
    const handleAnnotationDelete = (index: number) => {
        if (!selectedImage) return

        setAnnotations((prev) => {
            const imageAnnotations = [...(prev[selectedImage] || [])]
            imageAnnotations.splice(index, 1)
            return {
                ...prev,
                [selectedImage]: imageAnnotations,
            }
        })
    }

    // アノテーションデータ保存ハンドラー
    const handleSaveAnnotations = async () => {
        if (Object.keys(annotations).length === 0) {
            setSaveStatus({
                type: "error",
                message: "アノテーションデータがありません。",
            })
            return
        }

        setIsSaving(true)
        setSaveStatus({ type: null, message: null })

        try {
            const result = await saveAnnotationsData(annotations)

            setSaveStatus({
                type: "success",
                message:
                    result.message ||
                    "アノテーションデータが正常に保存されました。",
            })
        } catch (error) {
            setSaveStatus({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "アノテーションデータの保存中にエラーが発生しました。",
            })
        } finally {
            setIsSaving(false)
        }
    }

    // 通知を閉じるハンドラー
    const handleCloseSnackbar = () => {
        setSaveStatus({ type: null, message: null })
    }

    // 現在選択されている画像のアノテーション取得
    const currentAnnotations = selectedImage
        ? annotations[selectedImage] || []
        : []

    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 4 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        広告アノテーションツール
                    </Typography>
                    <Button
                        component={Link}
                        href="/"
                        variant="outlined"
                        size="small"
                    >
                        ホームに戻る
                    </Button>
                </Box>

                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                    >
                        このページでは広告画像のアノテーションを行います。ラベルを選択し、画像上で領域を指定してアノテーションを追加してください。
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Button
                            onClick={handleSaveAnnotations}
                            disabled={
                                isSaving ||
                                isLoading ||
                                Object.keys(annotations).length === 0
                            }
                            color="success"
                            variant="contained"
                        >
                            {isSaving
                                ? "保存中..."
                                : "アノテーションデータを保存"}
                        </Button>

                        {isLoading && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Loading size="small" message="" />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ ml: 1 }}
                                >
                                    データを読み込み中...
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>

                <Grid container spacing={3}>
                    {/* 左側: 画像選択とラベル選択 */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            <ImageGallery onImageSelect={handleImageSelect} />

                            {selectedImage && (
                                <LabelSelector
                                    onLabelSelect={handleLabelSelect}
                                    selectedLabel={selectedLabel}
                                />
                            )}
                        </Stack>
                    </Grid>

                    {/* 右側: アノテーションエリア */}
                    <Grid item xs={12} md={8}>
                        <AnnotationCanvas
                            imageSrc={selectedImagePath}
                            onRegionSelected={handleRegionSelect}
                            selectedLabel={selectedLabel}
                            onAnnotationAdded={handleAnnotationAdded}
                            annotations={currentAnnotations}
                        />
                    </Grid>
                </Grid>

                {/* アノテーション一覧 */}
                {selectedImage && currentAnnotations.length > 0 && (
                    <Paper sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            アノテーション一覧
                        </Typography>
                        <Stack spacing={1.5}>
                            {currentAnnotations.map((annotation, index) => (
                                <Paper
                                    key={index}
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        bgcolor: "background.paper",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2">
                                            <Box
                                                component="span"
                                                fontWeight="medium"
                                            >
                                                領域:
                                            </Box>
                                            X={annotation.bbox[0]}, Y=
                                            {annotation.bbox[1]}, 幅=
                                            {annotation.bbox[2]}, 高さ=
                                            {annotation.bbox[3]}
                                        </Typography>
                                        <Typography variant="body2">
                                            <Box
                                                component="span"
                                                fontWeight="medium"
                                            >
                                                面積:
                                            </Box>{" "}
                                            {annotation.area} px²
                                        </Typography>
                                        <Typography variant="body2">
                                            <Box
                                                component="span"
                                                fontWeight="medium"
                                            >
                                                ラベルID:
                                            </Box>{" "}
                                            {annotation.category_id}
                                        </Typography>
                                    </Box>
                                    <Button
                                        onClick={() =>
                                            handleAnnotationDelete(index)
                                        }
                                        color="error"
                                        variant="outlined"
                                        size="small"
                                    >
                                        削除
                                    </Button>
                                </Paper>
                            ))}
                        </Stack>
                    </Paper>
                )}

                {/* 選択された領域の情報表示 */}
                {selectedRegion && (
                    <Paper sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            選択された領域
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={4} md={2}>
                                <Typography variant="body2">
                                    X: {selectedRegion.x}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={4} md={2}>
                                <Typography variant="body2">
                                    Y: {selectedRegion.y}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={4} md={2}>
                                <Typography variant="body2">
                                    幅: {selectedRegion.width}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={4} md={2}>
                                <Typography variant="body2">
                                    高さ: {selectedRegion.height}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={4} md={4}>
                                <Typography variant="body2">
                                    面積: {selectedRegion.area}
                                </Typography>
                            </Grid>
                        </Grid>

                        {selectedLabel && (
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    onClick={() => {
                                        const newAnnotation: Annotation = {
                                            bbox: [
                                                selectedRegion.x,
                                                selectedRegion.y,
                                                selectedRegion.width,
                                                selectedRegion.height,
                                            ],
                                            area: selectedRegion.area,
                                            category_id: selectedLabel,
                                        }
                                        handleAnnotationAdded(newAnnotation)
                                    }}
                                    color="primary"
                                    variant="contained"
                                >
                                    ラベル {selectedLabel} を付与
                                </Button>
                            </Box>
                        )}
                    </Paper>
                )}
            </Box>

            {/* 保存ステータス通知 */}
            <Snackbar
                open={saveStatus.message !== null}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={
                        saveStatus.type === "success" ? "success" : "error"
                    }
                    sx={{ width: "100%" }}
                >
                    {saveStatus.message}
                </Alert>
            </Snackbar>
        </Container>
    )
}
