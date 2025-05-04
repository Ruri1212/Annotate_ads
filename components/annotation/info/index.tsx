"use client"

import {
    getLabelBorderColor,
    getLabelColor,
    getLabelName,
} from "@/utils/client/label"
import { Paper, Typography } from "@mui/material"

interface SelectedLabelInfoProps {
    selectedLabel: number | null
}

/**
 * 選択中のラベル情報を表示するコンポーネント
 */
const SelectedLabelInfo = ({ selectedLabel }: SelectedLabelInfoProps) => {
    if (!selectedLabel) return null

    return (
        <Paper
            elevation={0}
            sx={{
                mt: 2,
                p: 1.5,
                borderWidth: 2,
                borderStyle: "solid",
                backgroundColor: getLabelColor(selectedLabel),
                borderColor: getLabelBorderColor(selectedLabel),
                borderRadius: 1,
            }}
        >
            <Typography variant="subtitle2" fontWeight="medium">
                選択中のラベル: {getLabelName(selectedLabel)} (ID:{" "}
                {selectedLabel})
            </Typography>

            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
            >
                画像上でドラッグして領域を選択してください
            </Typography>
        </Paper>
    )
}

export default SelectedLabelInfo
