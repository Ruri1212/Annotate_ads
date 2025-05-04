import { Annotation } from "@/schema/annotation"

/**
 * 同じカテゴリのアノテーション数をカウントしてインデックスを付与する
 */
export const assignLabelIndex = (
    annotations: Annotation[],
    categoryId: number
): number => {
    const categoryAnnotations = annotations.filter(
        (a) => a.category_id === categoryId
    )
    return categoryAnnotations.length + 1
}
