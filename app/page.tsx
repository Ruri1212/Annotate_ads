import Button from "@/components/common/button"
import { Box, Container, Paper, Stack, Typography } from "@mui/material"
import Link from "next/link"

export default function Home() {
    return (
        <Container maxWidth="lg">
            <Stack
                sx={{
                    py: 8,
                    minHeight: "calc(100vh - 120px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                spacing={4}
            >
                <Typography
                    variant="h2"
                    component="h1"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{ mb: 2 }}
                >
                    広告アノテーションツール
                </Typography>

                <Paper
                    elevation={2}
                    sx={{
                        p: 4,
                        maxWidth: 700,
                        mx: "auto",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        paragraph
                    >
                        広告画像に対してテキストやロゴなどの領域を選択し、ラベルを付与するためのツールです。
                        ドラッグして長方形で領域を選択し、その後ラベルを設定できます。
                    </Typography>

                    <Box
                        sx={{
                            mt: 4,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            component={Link}
                            href="/annotate"
                            color="primary"
                            variant="contained"
                            size="large"
                        >
                            アノテーションを開始
                        </Button>
                    </Box>
                </Paper>
            </Stack>
        </Container>
    )
}
