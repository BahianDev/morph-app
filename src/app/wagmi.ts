import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  walletConnectWallet,
  bitgetWallet,
  metaMaskWallet
} from "@rainbow-me/rainbowkit/wallets";
import { morphHolesky } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "YOUR_PROJECT_ID",
  chains: [morphHolesky],
  ssr: true,
  wallets: [
    {
      groupName: "Recommended",
      wallets: [
        bitgetWallet,
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
  ],
});
