"use client"

import Button from "@/components/common/button"
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material"
import Link from "next/link"

const Header = () => {
    return (
        <AppBar position="static" color="primary" elevation={0}>
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Link
                        href="/"
                        passHref
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ fontWeight: "bold" }}
                        >
                            広告アノテーションツール
                        </Typography>
                    </Link>

                    <Box>
                        <Button
                            component={Link}
                            href="/annotate"
                            color="inherit"
                            variant="outlined"
                            sx={{
                                borderColor: "rgba(255, 255, 255, 0.5)",
                                "&:hover": {
                                    borderColor: "white",
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                },
                            }}
                        >
                            アノテーション開始
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Header
