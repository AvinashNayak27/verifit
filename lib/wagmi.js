import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";
 
export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "VeriFIt",
      appLogoUrl:"https://www.verifit.club/favicon.ico",
      preference: "smartWalletOnly",
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});