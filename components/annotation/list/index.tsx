"use client"

import { Annotation } from "@/schema/annotation"
import {
    getLabelBorderColor,
    getLabelColor,
    getLabelName,
} from "@/utils/annotation"
import { Box, Paper, Stack, Typography } from "@mui/material"

interface AnnotationListProps {
    annotations: Annotation[]
}

/**
 * 選択済みのアノテーション一覧を表示するコンポーネント
 */
const AnnotationList = ({ annotations }: AnnotationListProps) => {
    if (annotations.length === 0) return null

    return (
        <Paper
            variant="outlined"
            sx={{
                mt: 2,
                p: 2,
                borderRadius: 1,
            }}
        >
            <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                選択済みラベル:
            </Typography>

            <Stack spacing={1} sx={{ mt: 1 }}>
                {annotations.map(
                    (annotation, idx) =>
                        annotation.category_id && (
                            <Box
                                key={idx}
                                sx={{
                                    width: "100%",
                                    px: 2,
                                    py: 1,
                                    borderRadius: 1,
                                    border: 1,
                                    backgroundColor: getLabelColor(
                                        annotation.category_id
                                    ),
                                    borderColor: getLabelBorderColor(
                                        annotation.category_id
                                    ),
                                }}
                            >
                                <Typography variant="body2" fontWeight="medium">
                                    {getLabelName(annotation.category_id)}_
                                    {annotation.index}
                                </Typography>
                            </Box>
                        )
                )}
            </Stack>
        </Paper>
    )
}

export default AnnotationList
