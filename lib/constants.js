export const USER_REGISTRY_ADDRESS =
  "0xbEE0aD02CEBa21911690A76FC90475B63C4068A3";

export const USER_REGISTRY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newMinSteps",
        type: "uint256",
      },
    ],
    name: "MinStepsUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_userAddress",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_hashGmail",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_minSteps",
        type: "uint256",
      },
    ],
    name: "registerUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newMinSteps",
        type: "uint256",
      },
    ],
    name: "updateMinSteps",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "hashGmail",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minSteps",
        type: "uint256",
      },
    ],
    name: "UserRegistered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_userAddress",
        type: "address",
      },
    ],
    name: "getUser",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const PERSONAL_ACCOUNTABILTY_ADDRESS =
  "0xE627eE9e5d181888110C11e2eF1513A64001a031";

export const PERSONAL_ACCOUNTABILTY_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_reclaimVerifierAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "betId",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "minSteps",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTimestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTimestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stake",
        type: "uint256",
      },
    ],
    name: "CreatedBetEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "betId",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "bool",
        name: "successful",
        type: "bool",
      },
    ],
    name: "ResolvedBetEvent",
    type: "event",
  },
  {
    inputs: [],
    name: "betIdCounter",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "bets",
    outputs: [
      { internalType: "uint256", name: "betId", type: "uint256" },
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "minSteps", type: "uint256" },
      { internalType: "uint256", name: "startTimestamp", type: "uint256" },
      { internalType: "uint256", name: "endTimestamp", type: "uint256" },
      { internalType: "bool", name: "resolved", type: "bool" },
      { internalType: "bool", name: "successful", type: "bool" },
      { internalType: "uint256", name: "stake", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "endTimestamp", type: "uint256" },
      { internalType: "uint256", name: "minSteps", type: "uint256" },
    ],
    name: "createBet",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "data", type: "string" },
      { internalType: "string", name: "target", type: "string" },
    ],
    name: "extractFieldFromContext",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "data", type: "string" }],
    name: "getStartTimeMillis",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "data", type: "string" }],
    name: "getStepCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "reclaimAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "reclaimVerifier",
    outputs: [
      { internalType: "contract IReclaimVerifier", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "betId", type: "uint256" },
      {
        components: [
          {
            components: [
              { internalType: "string", name: "provider", type: "string" },
              { internalType: "string", name: "parameters", type: "string" },
              { internalType: "string", name: "context", type: "string" },
            ],
            internalType: "struct ClaimInfo",
            name: "claimInfo",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "bytes32",
                    name: "identifier",
                    type: "bytes32",
                  },
                  { internalType: "address", name: "owner", type: "address" },
                  {
                    internalType: "uint32",
                    name: "timestampS",
                    type: "uint32",
                  },
                  { internalType: "uint32", name: "epoch", type: "uint32" },
                ],
                internalType: "struct Claim",
                name: "claim",
                type: "tuple",
              },
              { internalType: "bytes[]", name: "signatures", type: "bytes[]" },
            ],
            internalType: "struct SignedClaim",
            name: "signedClaim",
            type: "tuple",
          },
        ],
        internalType: "struct Proof",
        name: "proof",
        type: "tuple",
      },
    ],
    name: "resolveBet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "userBets",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export const clickAddress = "0xD1745144846169764A26BE5904A06037Af672df8";
export const clickAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_reclaimVerifierAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "target", type: "address" }],
    name: "AddressEmptyCode",
    type: "error",
  },
  { inputs: [], name: "FailedCall", type: "error" },
  {
    inputs: [{ internalType: "bytes4", name: "selector", type: "bytes4" }],
    name: "NotPermissionCallable",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "better",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "betAboveTarget",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BetPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "proposer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "targetSteps",
        type: "uint256",
      },
    ],
    name: "MarketCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      { indexed: false, internalType: "bool", name: "result", type: "bool" },
    ],
    name: "MarketResolved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "targetSteps", type: "uint256" }],
    name: "createMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "data", type: "string" },
      { internalType: "string", name: "target", type: "string" },
    ],
    name: "extractFieldFromContext",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "marketId", type: "uint256" }],
    name: "getMarket",
    outputs: [
      {
        components: [
          { internalType: "address", name: "marketProposer", type: "address" },
          {
            components: [
              { internalType: "address", name: "better", type: "address" },
              { internalType: "bool", name: "betAboveTarget", type: "bool" },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            internalType: "struct StepCountPredictionMarket.Prediction[]",
            name: "predictions",
            type: "tuple[]",
          },
          { internalType: "uint256", name: "targetSteps", type: "uint256" },
          { internalType: "bool", name: "resolved", type: "bool" },
          { internalType: "bool", name: "result", type: "bool" },
          { internalType: "uint256", name: "totalPool", type: "uint256" },
          { internalType: "uint256", name: "totalBetsOnTrue", type: "uint256" },
          {
            internalType: "uint256",
            name: "totalBetsOnFalse",
            type: "uint256",
          },
        ],
        internalType: "struct StepCountPredictionMarket.Market",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "hash", type: "bytes32" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "getRequestAuthorization",
    outputs: [
      {
        internalType: "enum IOffchainAuthorization.Authorization",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "data", type: "string" }],
    name: "getStepCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "marketCounter",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "markets",
    outputs: [
      { internalType: "address", name: "marketProposer", type: "address" },
      { internalType: "uint256", name: "targetSteps", type: "uint256" },
      { internalType: "bool", name: "resolved", type: "bool" },
      { internalType: "bool", name: "result", type: "bool" },
      { internalType: "uint256", name: "totalPool", type: "uint256" },
      { internalType: "uint256", name: "totalBetsOnTrue", type: "uint256" },
      { internalType: "uint256", name: "totalBetsOnFalse", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "call", type: "bytes" }],
    name: "permissionedCall",
    outputs: [{ internalType: "bytes", name: "res", type: "bytes" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "marketId", type: "uint256" },
      { internalType: "bool", name: "betAboveTarget", type: "bool" },
    ],
    name: "placeBet",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "reclaimVerifier",
    outputs: [
      { internalType: "contract IReclaimVerifier", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "marketId", type: "uint256" },
      {
        components: [
          {
            components: [
              { internalType: "string", name: "provider", type: "string" },
              { internalType: "string", name: "parameters", type: "string" },
              { internalType: "string", name: "context", type: "string" },
            ],
            internalType: "struct ClaimInfo",
            name: "claimInfo",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "bytes32",
                    name: "identifier",
                    type: "bytes32",
                  },
                  { internalType: "address", name: "owner", type: "address" },
                  {
                    internalType: "uint32",
                    name: "timestampS",
                    type: "uint32",
                  },
                  { internalType: "uint32", name: "epoch", type: "uint32" },
                ],
                internalType: "struct Claim",
                name: "claim",
                type: "tuple",
              },
              { internalType: "bytes[]", name: "signatures", type: "bytes[]" },
            ],
            internalType: "struct SignedClaim",
            name: "signedClaim",
            type: "tuple",
          },
        ],
        internalType: "struct Proof",
        name: "proof",
        type: "tuple",
      },
    ],
    name: "resolveMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
    name: "supportsPermissionedCallSelector",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const SponsoredBasenameRegistrationAddress =
  "0x7676b92e214306a48daa2F153ad05F39E781AF2E";
export const SponsoredBasenameRegistrationAbi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FundsDeposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FundsWithdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "RegistrationSponsored",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bool", name: "paused", type: "bool" },
    ],
    name: "RegistrationsPaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
    ],
    name: "ReverseRegistrationSet",
    type: "event",
  },
  {
    inputs: [],
    name: "REGISTRATION_COST",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "string", name: "provider", type: "string" },
              { internalType: "string", name: "parameters", type: "string" },
              { internalType: "string", name: "context", type: "string" },
            ],
            internalType: "struct ClaimInfo",
            name: "claimInfo",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "bytes32",
                    name: "identifier",
                    type: "bytes32",
                  },
                  { internalType: "address", name: "owner", type: "address" },
                  {
                    internalType: "uint32",
                    name: "timestampS",
                    type: "uint32",
                  },
                  { internalType: "uint32", name: "epoch", type: "uint32" },
                ],
                internalType: "struct Claim",
                name: "claim",
                type: "tuple",
              },
              { internalType: "bytes[]", name: "signatures", type: "bytes[]" },
            ],
            internalType: "struct SignedClaim",
            name: "signedClaim",
            type: "tuple",
          },
        ],
        internalType: "struct Proof",
        name: "proof",
        type: "tuple",
      },
    ],
    name: "attest",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "string", name: "provider", type: "string" },
              { internalType: "string", name: "parameters", type: "string" },
              { internalType: "string", name: "context", type: "string" },
            ],
            internalType: "struct ClaimInfo",
            name: "claimInfo",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "bytes32",
                    name: "identifier",
                    type: "bytes32",
                  },
                  { internalType: "address", name: "owner", type: "address" },
                  {
                    internalType: "uint32",
                    name: "timestampS",
                    type: "uint32",
                  },
                  { internalType: "uint32", name: "epoch", type: "uint32" },
                ],
                internalType: "struct Claim",
                name: "claim",
                type: "tuple",
              },
              { internalType: "bytes[]", name: "signatures", type: "bytes[]" },
            ],
            internalType: "struct SignedClaim",
            name: "signedClaim",
            type: "tuple",
          },
        ],
        internalType: "struct Proof[]",
        name: "proofs",
        type: "tuple[]",
      },
    ],
    name: "bundleAttest",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "depositFunds",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "data", type: "string" },
      { internalType: "string", name: "target", type: "string" },
    ],
    name: "extractFieldFromContext",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "data", type: "string" }],
    name: "getStepCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "l2Resolver",
    outputs: [
      { internalType: "contract IL2Resolver", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "name", type: "string" }],
    name: "namehash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "reclaimVerifier",
    outputs: [
      { internalType: "contract IReclaimVerifier", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      {
        components: [
          {
            components: [
              { internalType: "string", name: "provider", type: "string" },
              { internalType: "string", name: "parameters", type: "string" },
              { internalType: "string", name: "context", type: "string" },
            ],
            internalType: "struct ClaimInfo",
            name: "claimInfo",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "bytes32",
                    name: "identifier",
                    type: "bytes32",
                  },
                  { internalType: "address", name: "owner", type: "address" },
                  {
                    internalType: "uint32",
                    name: "timestampS",
                    type: "uint32",
                  },
                  { internalType: "uint32", name: "epoch", type: "uint32" },
                ],
                internalType: "struct Claim",
                name: "claim",
                type: "tuple",
              },
              { internalType: "bytes[]", name: "signatures", type: "bytes[]" },
            ],
            internalType: "struct SignedClaim",
            name: "signedClaim",
            type: "tuple",
          },
        ],
        internalType: "struct Proof[]",
        name: "proofs",
        type: "tuple[]",
      },
    ],
    name: "registerBasename",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "registrarController",
    outputs: [
      {
        internalType: "contract IRegistrarController",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "registrationsPaused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "reverseRegistrar",
    outputs: [
      { internalType: "contract IReverseRegistrar", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "toggleRegistrations",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];
