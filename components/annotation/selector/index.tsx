"use client"

import { DEFAULT_CATEGORIES, LABEL_BORDER_COLORS } from "@/constants/labels"
import { LabelCategory } from "@/types/annotation"
import {
    Alert,
    Box,
    Button,
    Card,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material"
import { useEffect, useState } from "react"

interface LabelSelectorProps {
    onLabelSelect: (categoryId: number) => void
    selectedLabel: number | null
}

const LabelSelector = ({
    onLabelSelect,
    selectedLabel,
}: LabelSelectorProps) => {
    const [categories, setCategories] = useState<LabelCategory[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // 初期ロード時にカテゴリ情報を取得
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                // 実際のアプリケーションではAPIからカテゴリを取得するが、
                // ここではハードコードしたカテゴリを使用
                setCategories(DEFAULT_CATEGORIES)
                setError(null)
            } catch (err) {
                setError("ラベルカテゴリの読み込みに失敗しました")
                console.error("カテゴリ読み込みエラー:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    const handleLabelClick = (categoryId: number) => {
        onLabelSelect(categoryId)
    }

    if (loading) {
        return (
            <Card sx={{ p: 3, display: "flex", justifyContent: "center" }}>
                <CircularProgress size={24} />
            </Card>
        )
    }

    if (error) {
        return (
            <Card sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Card>
        )
    }

    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                ラベルを選択
            </Typography>

            <Stack spacing={1.5} sx={{ mt: 2 }}>
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        fullWidth
                        variant={
                            selectedLabel === category.id
                                ? "contained"
                                : "outlined"
                        }
                        onClick={() => handleLabelClick(category.id)}
                        sx={{
                            justifyContent: "flex-start",
                            backgroundColor: category.color,
                            borderColor:
                                selectedLabel === category.id
                                    ? LABEL_BORDER_COLORS[
                                          category.id as keyof typeof LABEL_BORDER_COLORS
                                      ]
                                    : "transparent",
                            "&:hover": {
                                backgroundColor: category.color,
                                opacity: 0.9,
                            },
                            fontWeight:
                                selectedLabel === category.id
                                    ? "bold"
                                    : "normal",
                            textTransform: "none",
                            boxShadow: selectedLabel === category.id ? 2 : 0,
                            borderWidth: selectedLabel === category.id ? 2 : 1,
                        }}
                    >
                        <Typography variant="body1" component="span">
                            {category.name}
                        </Typography>
                        <Typography
                            variant="caption"
                            component="span"
                            sx={{ ml: 1, opacity: 0.75 }}
                        >
                            ({category.id})
                        </Typography>
                    </Button>
                ))}
            </Stack>

            {selectedLabel && (
                <Box
                    sx={{
                        mt: 2,
                        p: 1,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="body2">
                        選択されたラベル:{" "}
                        {categories.find((c) => c.id === selectedLabel)?.name}
                    </Typography>
                </Box>
            )}
        </Card>
    )
}

export default LabelSelector
