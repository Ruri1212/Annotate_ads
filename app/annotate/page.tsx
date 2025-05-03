"use client"

import { AnnotationCanvas } from "@/components/AnnotationCanvas"
import { ImageSelector } from "@/components/ImageSelector"
import { LabelSelector } from "@/components/LabelSelector"
import { loadAnnotationsData } from "@/utils/annotation"
import { useEffect, useState } from "react"

import { Header } from "@/components/home/header"

interface Annotation {
    bbox: [number, number, number, number] // [x, y, width, height]
    area: number
    category_id: number | null
}

export default function AnnotatePage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [selectedImagePath, setSelectedImagePath] = useState<string | null>(
        null
    )
    const [selectedRegion, setSelectedRegion] = useState<{
        x: number
        y: number
        width: number
        height: number
        area: number
    } | null>(null)
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
    const handleRegionSelect = (region: {
        x: number
        y: number
        width: number
        height: number
        area: number
    }) => {
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

    // 現在選択されている画像のアノテーション取得
    const currentAnnotations = selectedImage
        ? annotations[selectedImage] || []
        : []

    return (
        <div className="flex flex-col space-y-6">
            <Header />
            {/* アノテーション保存ボタン */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 左側: 画像選択と ラベル選択 エリア */}
                <div className="md:col-span-1 space-y-6">
                    <ImageSelector onImageSelect={handleImageSelect} />

                    {selectedImage && (
                        <LabelSelector
                            onLabelSelect={handleLabelSelect}
                            selectedLabel={selectedLabel}
                        />
                    )}
                </div>

                {/* 右側: アノテーションエリア */}
                <div className="md:col-span-2">
                    <AnnotationCanvas
                        imageSrc={selectedImagePath}
                        onRegionSelected={handleRegionSelect}
                        selectedLabel={selectedLabel}
                        onAnnotationAdded={handleAnnotationAdded}
                        annotations={currentAnnotations}
                    />
                </div>
            </div>

            {/* アノテーション一覧 */}
            {selectedImage && currentAnnotations.length > 0 && (
                <div className="bg-white shadow-md rounded p-4 mt-4">
                    <h3 className="font-semibold mb-2">アノテーション一覧</h3>
                    <div className="space-y-2">
                        {currentAnnotations.map((annotation, index) => (
                            <div
                                key={index}
                                className="border rounded p-2 bg-gray-50 flex justify-between items-center"
                            >
                                <div>
                                    <p className="text-sm">
                                        <span className="font-medium">
                                            領域:
                                        </span>{" "}
                                        X=
                                        {annotation.bbox[0]}, Y=
                                        {annotation.bbox[1]}, 幅=
                                        {annotation.bbox[2]}, 高さ=
                                        {annotation.bbox[3]}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">
                                            面積:
                                        </span>{" "}
                                        {annotation.area} px²
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">
                                            ラベルID:
                                        </span>{" "}
                                        {annotation.category_id}
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        handleAnnotationDelete(index)
                                    }
                                    className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded text-sm"
                                >
                                    削除
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 選択された領域の情報表示 */}
            {selectedRegion && (
                <div className="bg-white shadow-md rounded p-4 mt-4">
                    <h3 className="font-semibold mb-2">選択された領域</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>X: {selectedRegion.x}</div>
                        <div>Y: {selectedRegion.y}</div>
                        <div>幅: {selectedRegion.width}</div>
                        <div>高さ: {selectedRegion.height}</div>
                        <div>面積: {selectedRegion.area}</div>
                    </div>

                    {/* ラベル付与ボタン */}
                    {selectedLabel && (
                        <button
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
                            className="mt-3 bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded"
                        >
                            ラベル {selectedLabel} を付与
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
