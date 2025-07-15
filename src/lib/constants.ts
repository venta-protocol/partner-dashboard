import {
  USDC_MINT,
  USDT_MINT,
  PYUSD_MINT,
  USDG_MINT,
  TOKEN_PROGRAM,
  TOKEN_PROGRAM_2022,
} from "./config";

export const SupportedSplTokens = [
  {
    mint: USDG_MINT,
    uri: "/token-image/usdg_token_image.png",
    symbol: "USDG",
    decimal: 6,
    tokenProgram: TOKEN_PROGRAM_2022,
  },
  {
    mint: USDC_MINT,
    uri: "/token-image/usdc_token_image.png",
    symbol: "USDC",
    decimal: 6,
    tokenProgram: TOKEN_PROGRAM,
  },
  {
    mint: USDT_MINT,
    uri: "/token-image/usdt_token_image.png",
    symbol: "USDT",
    decimal: 6,
    tokenProgram: TOKEN_PROGRAM,
  },
  {
    mint: PYUSD_MINT,
    uri: "/token-image/pyusd_token_image.png",
    symbol: "PYUSD",
    decimal: 6,
    tokenProgram: TOKEN_PROGRAM_2022,
  },
];
