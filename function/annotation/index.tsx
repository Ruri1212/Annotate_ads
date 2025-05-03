import { AnnotationMap, ImageMetadata } from "@/schema/annotation"

export const loadAnnotationsData = async () => {
    try {
        const reponse = await fetch("/api/annotations")
        if (!reponse.ok) {
            throw new Error("アノテーションの読み込みに失敗しました")
        }

        const data = await reponse.json()

        const annotations: AnnotationMap = {}

        data.images.forEach((imageMetaData: ImageMetadata, index: number) => {
            const imageFile = Buffer.from(imageMetaData.file_name).toString(
                "base64"
            )
            annotations[imageFile] = []

            // 該当画像に関連するアノテーションを処理
            if (data.annotations[index]) {
                data.annotations[index].forEach((row: any) => {
                    if (row.image_id === imageMetaData.id) {
                        annotations[imageFile].push({
                            bbox: row.bbox,
                            area: row.area,
                            category_id: row.category_id,
                        })
                    }
                })
            }
        })
        return annotations
    } catch (error) {
        return {}
    }
}
