type BBox = {
    x: number
    y: number
    width: number
    height: number
}

export type ImageMetadata = {
    file_name: string
    height: number
    width: number
    id: number
}

export interface Annotation {
    bbox: BBox
    area: number
    category_id: number
}

export interface AnnotationMap {
    [imageId: string]: Annotation[]
}
