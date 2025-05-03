"use client"

import { Box, CircularProgress, Typography } from "@mui/material"

interface LoadingProps {
    message?: string
    size?: "small" | "medium" | "large"
}

const Loading = ({
    message = "ロード中...",
    size = "medium",
}: LoadingProps) => {
    const getSize = (): number => {
        switch (size) {
            case "small":
                return 24
            case "large":
                return 48
            case "medium":
            default:
                return 36
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
            }}
        >
            <CircularProgress size={getSize()} />
            {message && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    )
}

export default Loading
