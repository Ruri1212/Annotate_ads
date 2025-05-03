"use client"
import { Header } from "@/components/home/header"
import { AnnotationImageList } from "@/components/image_list"
import { loadAnnotationsData } from "@/function/annotation"
import { AnnotationMap } from "@/schema/annotation"
import { useEffect, useState } from "react"

export default function AnnotationOriginalPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [annotations, setAnnotations] = useState<AnnotationMap>({})

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

    // 画像選択ハンドラー
    const handleImageSelect = (imageId: string, imagePath: string) => {
        setSelectedImage(imageId)
        setSelectedImagePath(imagePath)
        setSelectedRegion(null) // 画像が変わったら選択領域をリセット
    }

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

    return (
        <>
            <Header />
            <AnnotationImageList onImageSelect={handleImageSelect} />
        </>
    )
}
