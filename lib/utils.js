import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { clickAddress, PERSONAL_ACCOUNTABILTY_ADDRESS } from "./constants";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// create the client with your clientId, or secretKey if in a server environment
const client = createThirdwebClient({
  clientId: "125d3898c029a03f84b52bb879fb3b0e"
 });

// connect to your contract
export const contract = getContract({
  client,
  chain: defineChain(84532),
  address: clickAddress,
});

// connect to your contract
export const personalAccountabilityContract = getContract({
  client,
  chain: defineChain(84532),
  address: PERSONAL_ACCOUNTABILTY_ADDRESS
});