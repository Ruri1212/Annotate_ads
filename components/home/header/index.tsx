import { Box, Link, Typography } from "@mui/material"

export const Header = () => {
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          広告アノテーションツール
        </Typography>

        <Link href="/" variant="body1" color="primary">
          ホームに戻る
        </Link>
      </Box>
      <Typography variant="body1" gutterBottom>
        このページでは広告画像のアノテーションを行います。ラベルを選択し、画像上で領域を指定してアノテーションを追加してください。
      </Typography>
    </>
  )
}
