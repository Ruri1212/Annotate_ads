"use client"

import {
    getLabelBorderColor,
    getLabelColor,
    getLabelName,
} from "../../utils/annotation"

interface SelectedLabelInfoProps {
    selectedLabel: number | null
}

/**
 * 選択中のラベル情報を表示するコンポーネント
 */
export const SelectedLabelInfo = ({
    selectedLabel,
}: SelectedLabelInfoProps) => {
    if (!selectedLabel) return null

    return (
        <div
            className="mt-2 p-2 rounded border-2"
            style={{
                backgroundColor: getLabelColor(selectedLabel),
                borderColor: getLabelBorderColor(selectedLabel),
            }}
        >
            <p className="text-sm font-semibold">
                選択中のラベル: {getLabelName(selectedLabel)} (ID:{" "}
                {selectedLabel})
            </p>
            <p className="text-xs text-gray-600">
                画像上でドラッグして領域を選択してください
            </p>
        </div>
    )
}
