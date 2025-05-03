"use client"

import {
    Button as MuiButton,
    ButtonProps as MuiButtonProps,
} from "@mui/material"
import { ReactNode } from "react"

interface ButtonProps extends Omit<MuiButtonProps, "color"> {
    children: ReactNode
    color?: "primary" | "secondary" | "success" | "error" | "info" | "warning"
    fullWidth?: boolean
}

const Button = ({
    children,
    variant = "contained",
    color = "primary",
    fullWidth = false,
    ...props
}: ButtonProps) => {
    return (
        <MuiButton
            variant={variant}
            color={color}
            fullWidth={fullWidth}
            sx={{
                textTransform: "none",
                fontWeight: 500,
                boxShadow: variant === "contained" ? 1 : "none",
                ...props.sx,
            }}
            {...props}
        >
            {children}
        </MuiButton>
    )
}

export default Button
