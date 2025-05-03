import { Annotation } from "@/types/annotation"
import { Button } from "@mui/material"
import { useState } from "react"

export const SaveJsonButton = () => {
    const [isSaving, setIsSaving] = useState<boolean>(false)

    const [saveStatus, setSaveStatus] = useState<{
        type: "success" | "error" | null
        message: string | null
    }>({ type: null, message: null })

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [annotations, setAnnotations] = useState<{
        [key: string]: Annotation[]
    }>({})

    const saveAnnotationsData = async (annotations: {
        [key: string]: Annotation[]
    }) => {
        // 画像IDごとにグループ化されたアノテーションを配列に変換
        const imageIds = Object.keys(annotations)
        const annotationsArray = imageIds.map(
            (imageId) => annotations[imageId] || []
        )

        try {
            const response = await fetch("/api/annotations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    annotations: annotationsArray,
                    imageIds: imageIds,
                }),
            })

            if (!response.ok) {
                throw new Error("アノテーションの保存に失敗しました")
            }

            const result = await response.json()
            return result
        } catch (error) {
            console.error(
                "アノテーションの保存中にエラーが発生しました:",
                error
            )
            throw error
        }
    }

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

    return (
        <>
            <Button
                variant="contained"
                onClick={handleSaveAnnotations}
                disabled={
                    isSaving ||
                    isLoading ||
                    Object.keys(annotations).length === 0
                }
            >
                {isSaving ? "保存中..." : "アノテーションデータを保存"}
            </Button>
        </>
    )
}
