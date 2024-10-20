# Verifit: Accountability Fitness App Powered by zkProofs and session keys

**Verifit** is a decentralized fitness accountability app that allows users to log their activity using Google Fit, generate zkProofs using Reclaim Protocol's zkFetch to validate their step counts, and participate in both private accountability bets and public prediction markets. Verifit offers privacy-focused verification for fitness goals while gamifying the experience through prediction markets.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
  - [Smart Contracts](#smart-contracts)
  - [Coinbase Smart Wallet Session Keys](#coinbase-smart-wallet-session-keys)
- [Usage](#usage)
- [References](#references)
- [Inspirations](#inspirations)

## Overview
Verifit connects users’ Google Fit accounts and allows them to privately verify their daily step counts using zkProofs. These proofs can be validated on Base Layer 2 (Ethereum). Users engage with two core functionalities:
1. **Private Accountability Bets**: Users place a bet on their fitness goals. If they fail to submit a proof of completion by the deadline, their stake is reduced exponentially and returned to sme public goods.
2. **Public Prediction Markets**: Binary prediction markets allow users to bet on other users' fitness outcomes by swiping right (yes) or left (no) on time-limited markets.

## Features
- **Reclaim Protocol's zkFetch**: Tracks users' steps and generates zkProofs utilizing the Google Fit API.
- **Private Bets**: Users set goals and wager money on their success. Penalties apply for missed goals.
- **Prediction Markets**: A Tinder-style UI for predicting other users' fitness success, where users bet on "Yes" or "No" outcomes.
- **Coinbase Smart Wallet Integration**: Users connect via a Coinbase Wallet, enabling streamlined wallet management with session keys for quick and frictionless transactions.
- **Weekly Rewards**: Users who hit 1000 steps per day for 7 consecutive days can earn a free basename (via **SponsoredBasenameRegistration**) or other incentives.

## System Architecture

Verifit is designed for seamless user interaction and smooth prediction market participation. Key components include:
- **User Interface (UI)**: A swiping system for prediction markets (Tinder-style swipe right for “yes,” swipe left for “no”).
- **Google Login**: Integration with Google OAuth for accessing Google Fit data.
- **Session Key Management**: User keys of generated credentials are stored in the browser's IndexedDB for quick transactions using session keys, avoiding the need for constant wallet signing.
- **Bet Configuration**: Users can configure default bet amounts and other prediction market preferences.
- **Proof Generation Service**: Uses Reclaim's zkFetch to generate zkProofs from the Google Fit activity.

### Smart Contracts
Verifit operates on Base Layer 2 (e.g., Ethereum Layer 2 solution), utilizing smart contracts for:
- **[Personal Accountability Bets](https://github.com/AvinashNayak27/verifit/blob/main/contracts/PersonalAccountability.sol)**: Manages the staking, deadlines, and refund logic. If proof is not submitted by the deadline, the stake is donated to some public goods.
- **[Prediction Markets](https://github.com/AvinashNayak27/verifit/blob/main/contracts/PredictionMarkets.sol)**: Creates binary markets where users can bet on the outcomes of others’ fitness goals.
- **[SponsoredBasenameRegistration](https://github.com/AvinashNayak27/verifit/blob/main/contracts/SponsoredBasenameRegistration.sol)**: Users who meet a step goal of 1000 steps per day for 7 consecutive days are eligible for a free basename registration (e.g., a decentralized identity). This acts as an additional incentive and reward for consistent participation.

### Coinbase Smart Wallet Session Keys
Verifit uses **Coinbase Smart Wallet Session Keys** to ensure a seamless and user-friendly experience, especially in prediction markets. Session keys enable the app to sign and submit transactions on behalf of users without the need for constant wallet pop-ups or biometric scans. This creates a smooth, frictionless interaction for high-frequency transactions and background processes, enhancing the overall user experience.

## Usage

1. **Log In**: Users log into Verifit using their Google account and connect their Coinbase Wallet.
2. **Set Goals**: Set a daily or weekly fitness goal and place a bet.
3. **Generate Proof**: Verifit will pull step data from Google Fit and generate a zkProof for the user.
4. **Submit Proof**: Submit the proof to validate the goal and settle the bet.
5. **Prediction Markets**: Participate in public prediction markets by swiping right or left on other users' goals.
6. **Earn Rewards**: Users who meet step goals for 7 days straight are eligible for weekly rewards, such as free basename registration via **SponsoredBasenameRegistration**.

## References
- [Reclaim Protocol's zkFetch Documentation](https://docs.reclaimprotocol.org/zkfetch)
- [Coinbase Smart Wallet Session Keys Documentation](https://smart-wallet-docs-git-conner-session-keys-coinbase-vercel.vercel.app/guides/session-keys)
- [Base.org Basenames Repository](https://github.com/base-org/basenames)

## Inspirations
- [Kyle Samani on Twitter](https://x.com/KyleSamani/status/1844772950773530938)
- [0xDesigner on Twitter](https://x.com/0xDesigner/status/1741511185567269217)
- [Sodofi on Twitter](https://x.com/sodofi_/status/1844456514888794367)
