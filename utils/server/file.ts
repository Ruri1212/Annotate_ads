import fs from "fs/promises"
import path from "path"

/**
 * ファイルシステムにJSONを保存するヘルパー関数
 */
export async function saveJSONToFile(
    filePath: string,
    data: any
): Promise<boolean> {
    try {
        // ディレクトリが存在するか確認、なければ作成
        const directory = path.dirname(filePath)
        await fs.mkdir(directory, { recursive: true })

        // データをJSONとして書き込み
        await fs.writeFile(filePath, JSON.stringify(data, null, 2))
        return true
    } catch (error) {
        console.error("JSONファイルの保存中にエラーが発生しました:", error)
        return false
    }
}

/**
 * ファイルシステムからJSONを読み込むヘルパー関数
 */
export async function readJSONFile<T>(
    filePath: string,
    defaultValue: T
): Promise<T> {
    try {
        // ファイルが存在するか確認
        await fs.access(filePath)

        // ファイルからデータを読み込む
        const data = await fs.readFile(filePath, "utf-8")
        return JSON.parse(data) as T
    } catch (error) {
        // ファイルが存在しない場合やエラーが発生した場合はデフォルト値を返す
        console.error("JSONファイルの読み込み中にエラーが発生しました:", error)
        return defaultValue
    }
}
