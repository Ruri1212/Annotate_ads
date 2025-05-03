import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { Box } from "@mui/material"
import type { Metadata } from "next"
import "./globals.css"
import MUIProvider from "./providers/MUIProvider"

export const metadata: Metadata = {
    title: "広告アノテーションツール",
    description:
        "広告画像に対してテキストやロゴなどの領域を選択し、ラベルを付与するツール",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja">
            <body className="min-h-screen bg-gray-50">
                <MUIProvider>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "100vh",
                        }}
                    >
                        <Header />
                        <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                            {children}
                        </Box>
                        <Footer />
                    </Box>
                </MUIProvider>
            </body>
        </html>
    )
}
