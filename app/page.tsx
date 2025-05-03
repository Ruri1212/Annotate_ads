import Link from "next/link"

export default function Home() {
    return (
        <div className="flex flex-col items-center space-y-8">
            <h1 className="text-3xl font-bold">広告アノテーションツール</h1>

            <p className="text-center max-w-2xl text-gray-600">
                広告画像に対してテキストやロゴなどの領域を選択し、ラベルを付与するためのツールです。
                ドラッグして長方形で領域を選択し、その後ラベルを設定できます。
            </p>

            <div className="mt-8 flex space-x-4">
                <Link href="/annotate" className="btn-primary">
                    アノテーションを開始
                </Link>
            </div>
        </div>
    )
}
