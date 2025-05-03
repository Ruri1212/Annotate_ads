"use client"

import { Box, Container, Link as MuiLink, Typography } from "@mui/material"

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: "auto",
                backgroundColor: "background.paper",
                borderTop: 1,
                borderColor: "divider",
            }}
        >
            <Container maxWidth="lg">
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                >
                    © {currentYear} 広告アノテーションツール
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 1 }}
                >
                    <MuiLink href="#" color="inherit" underline="hover">
                        プライバシーポリシー
                    </MuiLink>
                    {" | "}
                    <MuiLink href="#" color="inherit" underline="hover">
                        利用規約
                    </MuiLink>
                </Typography>
            </Container>
        </Box>
    )
}

export default Footer
