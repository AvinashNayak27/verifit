// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

// Structs to represent the nested tuple structure
struct ClaimInfo {
    string provider;
    string parameters;
    string context;
}

struct Claim {
    bytes32 identifier;
    address owner;
    uint32 timestampS;
    uint32 epoch;
}

struct SignedClaim {
    Claim claim;
    bytes[] signatures;
}

struct Proof {
    ClaimInfo claimInfo;
    SignedClaim signedClaim;
}

// Interface for ReclaimVerifier contract
interface IReclaimVerifier {
    function verifyProof(Proof memory proof) external view;
}

contract GoalBetting {
    struct Bet {
        uint256 betId;
        address user;
        uint256 minSteps;
        uint256 startTimestamp;
        uint256 endTimestamp;
        bool resolved;
        bool successful;
    }

    mapping(uint256 => Bet) public bets;
    mapping(address => uint256[]) public userBets;
    address public reclaimAddress;
    uint256 public betIdCounter;

    event CreatedBetEvent(
        uint256 indexed betId,
        address indexed user,
        uint256 minSteps,
        uint256 startTimestamp,
        uint256 endTimestamp
    );

    event ResolvedBetEvent(
        uint256 indexed betId,
        address indexed user,
        bool successful
    );

    IReclaimVerifier public reclaimVerifier;

    constructor(address _reclaimVerifierAddress) {
        reclaimVerifier = IReclaimVerifier(_reclaimVerifierAddress);
        betIdCounter = 1;
    }

    function createBet(uint256 endTimestamp, uint256 minSteps) external {
        require(
            endTimestamp > block.timestamp,
            "End timestamp must be in the future"
        );

        uint256 betId = betIdCounter;
        betIdCounter++;

        Bet memory newBet = Bet({
            betId: betId,
            user: msg.sender,
            minSteps: minSteps,
            startTimestamp: block.timestamp,
            endTimestamp: endTimestamp,
            resolved: false,
            successful: false
        });

        bets[betId] = newBet;
        userBets[msg.sender].push(betId);

        emit CreatedBetEvent(
            betId,
            msg.sender,
            minSteps,
            block.timestamp,
            endTimestamp
        );
    }

    function resolveBet(uint256 betId, Proof memory proof) external {
        Bet storage bet = bets[betId];
        require(!bet.resolved, "Bet already resolved");
        require(msg.sender == bet.user, "Only the bet creator can resolve");

        try reclaimVerifier.verifyProof(proof) {
            uint256 proofStartTimestampMillis = getStartTimeMillis(
                proof.claimInfo.parameters
            );
            uint256 proofStartTimestamp = proofStartTimestampMillis / 1000; // Convert millis to seconds
            uint256 steps = getStepCount(proof.claimInfo.parameters);
            require(
                proofStartTimestamp == bet.startTimestamp,
                "Invalid start timestamp in proof"
            );

            if (steps >= bet.minSteps) {
                bet.successful = true;
            }

            bet.resolved = true;

            emit ResolvedBetEvent(betId, bet.user, bet.successful);
        } catch {
            revert("Invalid proof");
        }
    }

    function extractFieldFromContext(string memory data, string memory target)
        public
        pure
        returns (uint256)
    {
        bytes memory dataBytes = bytes(data);
        bytes memory targetBytes = bytes(target);

        require(
            dataBytes.length >= targetBytes.length,
            "target is longer than data"
        );
        uint256 start = 0;
        bool foundStart = false;

        for (uint256 i = 0; i <= dataBytes.length - targetBytes.length; i++) {
            bool isMatch = true;

            for (uint256 j = 0; j < targetBytes.length && isMatch; j++) {
                if (dataBytes[i + j] != targetBytes[j]) {
                    isMatch = false;
                }
            }

            if (isMatch) {
                start = i + targetBytes.length;
                foundStart = true;
                break;
            }
        }

        if (!foundStart) {
            return 0; // Malformed or missing message
        }

        uint256 end = start;
        while (
            end < dataBytes.length &&
            !(dataBytes[end] == '"' && dataBytes[end - 1] != "\\")
        ) {
            end++;
        }
        if (end <= start) {
            return 0; // Malformed or missing message
        }

        bytes memory contextMessage = new bytes(end - start);
        for (uint256 i = start; i < end; i++) {
            contextMessage[i - start] = dataBytes[i];
        }
        return parseStringToInt(string(contextMessage));
    }

    function parseStringToInt(string memory str)
        internal
        pure
        returns (uint256)
    {
        bytes memory strBytes = bytes(str);
        uint256 number = 0;
        bool parsing = false;

        for (uint256 i = 0; i < strBytes.length; i++) {
            bytes1 b = strBytes[i];

            if (b >= "0" && b <= "9") {
                parsing = true;
                number = number * 10 + (uint8(b) - 48);
            } else if (parsing) {
                break;
            }
        }

        return number;
    }

    function getStepCount(string memory data) public pure returns (uint256) {
        uint256 stepCount = extractFieldFromContext(data, "intVal");
        return stepCount;
    }

    function getStartTimeMillis(string memory data)
        public
        pure
        returns (uint256)
    {
        uint256 startTimeMillis = extractFieldFromContext(
            data,
            "startTimeMillis"
        );
        return startTimeMillis;
    }
}
