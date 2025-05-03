import { createTheme } from '@mui/material/styles';

// アプリケーションのカラーパレットを定義
const palette = {
  primary: {
    main: '#3f51b5', // メインカラー（青系）
    light: '#757de8',
    dark: '#002984',
  },
  secondary: {
    main: '#f50057', // アクセントカラー（ピンク系）
    light: '#ff5983',
    dark: '#bb002f',
  },
  error: {
    main: '#f44336',
  },
  warning: {
    main: '#ff9800',
  },
  info: {
    main: '#2196f3',
  },
  success: {
    main: '#4caf50',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.54)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
};

// タイポグラフィの設定
const typography = {
  fontFamily: [
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    '"Hiragino Kaku Gothic ProN"',
    '"Hiragino Sans"',
    'Meiryo',
    'sans-serif',
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 500,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 500,
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 500,
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 500,
  },
  h5: {
    fontSize: '1rem',
    fontWeight: 500,
  },
  h6: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  button: {
    textTransform: 'none', // ボタンのテキストを大文字に変換しない
  },
};

// MUIテーマを作成
const theme = createTheme({
  palette,
  typography,
  components: {
    // ボタンのカスタマイズ
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    // カードのカスタマイズ
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    // 入力フィールドのカスタマイズ
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        },
      },
    },
  },
});

export default theme;