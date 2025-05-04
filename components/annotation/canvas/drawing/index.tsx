"use client"

import { Annotation, SelectedRegion } from "@/schema/annotation"
import {
    getLabelBorderColor,
    getLabelColor,
    getLabelName,
} from "@/utils/annotation"
import { Box } from "@mui/material"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface DrawingCanvasProps {
    imageSrc: string | null
    imageMetadata: { width: number; height: number } | null
    annotations: Annotation[]
    selectedLabel: number | null
    onRegionSelected: (region: SelectedRegion) => void
    onAnnotationAdded: (annotation: Annotation) => void
    dimensions: { width: string; height: string }
}

/**
 * 画像表示と領域選択を担当するコンポーネント
 */
const DrawingCanvas = ({
    imageSrc,
    imageMetadata,
    annotations,
    selectedLabel,
    onRegionSelected,
    onAnnotationAdded,
    dimensions,
}: DrawingCanvasProps) => {
    // 矩形選択のための状態
    const canvasRef = useRef<HTMLDivElement>(null)
    const [isDrawing, setIsDrawing] = useState<boolean>(false)
    const [startPoint, setStartPoint] = useState<{
        x: number
        y: number
    } | null>(null)
    const [currentRect, setCurrentRect] = useState<{
        x: number
        y: number
        width: number
        height: number
    } | null>(null)

    // マウスイベントハンドラー
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!canvasRef.current) return

        const rect = canvasRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        setIsDrawing(true)
        setStartPoint({ x, y })
        setCurrentRect(null)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !startPoint || !canvasRef.current) return

        const rect = canvasRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const width = Math.abs(x - startPoint.x)
        const height = Math.abs(y - startPoint.y)

        // 選択開始点からの相対位置に基づいて矩形の左上座標を計算
        const rectX = x < startPoint.x ? x : startPoint.x
        const rectY = y < startPoint.y ? y : startPoint.y

        setCurrentRect({ x: rectX, y: rectY, width, height })
    }

    const handleMouseUp = () => {
        if (!isDrawing || !currentRect) {
            setIsDrawing(false)
            return
        }

        // 矩形の面積が小さすぎる場合は無視
        if (currentRect.width < 5 || currentRect.height < 5) {
            setIsDrawing(false)
            setCurrentRect(null)
            return
        }

        // 親コンポーネントに選択領域を通知
        const area = currentRect.width * currentRect.height
        onRegionSelected({
            x: currentRect.x,
            y: currentRect.y,
            width: currentRect.width,
            height: currentRect.height,
            area,
        })

        // 選択されたラベルがある場合、アノテーションを追加
        if (selectedLabel) {
            // 同じカテゴリーIDのアノテーション数をカウントしてインデックスを付与
            const categoryAnnotations = annotations.filter(
                (a) => a.category_id === selectedLabel
            )
            const index = categoryAnnotations.length + 1

            const newAnnotation: Annotation = {
                bbox: [
                    currentRect.x,
                    currentRect.y,
                    currentRect.width,
                    currentRect.height,
                ],
                area,
                category_id: selectedLabel,
                index,
            }

            onAnnotationAdded(newAnnotation)
        }

        setIsDrawing(false)
    }

    // 描画中のキャンセル（例：Escキー）
    const cancelDrawing = () => {
        setIsDrawing(false)
        setCurrentRect(null)
    }

    // Escキーでキャンセル
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                cancelDrawing()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    return (
        <Box
            ref={canvasRef}
            sx={{
                position: "relative",
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                boxShadow: 1,
                cursor: "crosshair",
                width: dimensions.width,
                height: dimensions.height,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDrawing(false)}
        >
            {imageSrc && (
                <Image
                    src={imageSrc}
                    alt="広告画像"
                    fill
                    style={{ objectFit: "contain", pointerEvents: "none" }}
                    sizes={`(max-width: 800px) 100vw, 800px`}
                    draggable={false}
                />
            )}

            {/* 既存のアノテーション表示 */}
            {annotations.map((annotation, idx) => (
                <Box
                    key={idx}
                    sx={{
                        position: "absolute",
                        left: `${annotation.bbox[0]}px`,
                        top: `${annotation.bbox[1]}px`,
                        width: `${annotation.bbox[2]}px`,
                        height: `${annotation.bbox[3]}px`,
                        bgcolor: annotation.category_id
                            ? getLabelColor(annotation.category_id)
                            : "rgba(255, 255, 255, 0.1)",
                        border: 2,
                        borderColor: annotation.category_id
                            ? getLabelBorderColor(annotation.category_id)
                            : "gray",
                        pointerEvents: "none",
                    }}
                >
                    {annotation.category_id && (
                        <Box
                            component="span"
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                fontSize: "0.75rem",
                                px: 0.5,
                                border: 1,
                                borderColor: "inherit",
                                bgcolor: annotation.category_id
                                    ? getLabelBorderColor(
                                          annotation.category_id
                                      )
                                    : "gray",
                                color: "white",
                                fontWeight: "medium",
                                lineHeight: 1.5,
                            }}
                        >
                            {getLabelName(annotation.category_id)}_
                            {annotation.index}
                        </Box>
                    )}
                </Box>
            ))}

            {/* 現在描画中の矩形 */}
            {currentRect && (
                <Box
                    sx={{
                        position: "absolute",
                        left: `${currentRect.x}px`,
                        top: `${currentRect.y}px`,
                        width: `${currentRect.width}px`,
                        height: `${currentRect.height}px`,
                        bgcolor: selectedLabel
                            ? getLabelColor(selectedLabel)
                            : "rgba(0, 0, 255, 0.1)",
                        border: 2,
                        borderColor: selectedLabel
                            ? getLabelBorderColor(selectedLabel)
                            : "rgba(0, 0, 255, 0.7)",
                        borderStyle: "dashed",
                        pointerEvents: "none",
                    }}
                />
            )}
        </Box>
    )
}

export default DrawingCanvas
