/**
 * 画像のサイズに基づいて表示サイズを計算する
 */
export const calculateImageDimensions = (
    width: number | undefined,
    height: number | undefined
): { width: string; height: string } => {
    if (!width || !height) return { width: "100%", height: "auto" }

    const maxWidth = 800
    const maxHeight = 400

    let displayWidth = width
    let displayHeight = height

    if (displayWidth > maxWidth) {
        const ratio = maxWidth / displayWidth
        displayWidth = maxWidth
        displayHeight = Math.floor(displayHeight * ratio)
    }

    if (displayHeight > maxHeight) {
        const ratio = maxHeight / displayHeight
        displayHeight = maxHeight
        displayWidth = Math.floor(displayWidth * ratio)
    }

    return {
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
    }
}
