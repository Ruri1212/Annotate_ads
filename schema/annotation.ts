export interface Annotation {
    bbox: [number, number, number, number] // [x, y, width, height]
    area: number
    category_id: number | null
}
