// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import {Multicall} from "@openzeppelin/contracts/utils/Multicall.sol";

interface IPermissionCallable {
    /// @notice Wrap a call to the contract with a new selector.
    ///
    /// @dev Call data exactly matches valid selector+arguments on this contract.
    /// @dev Call data matching required because this performs a self-delegatecall.
    ///
    /// @param call Call data exactly matching valid selector+arguments on this contract.
    ///
    /// @return res data returned from the inner self-delegatecall.
    function permissionedCall(bytes calldata call)
        external
        payable
        returns (bytes memory res);

    /// @notice Determine if a function selector is allowed via permissionedCall on this contract.
    ///
    /// @param selector the specific function to check support for.
    ///
    /// @return supported indicator if the selector is supported.
    function supportsPermissionedCallSelector(bytes4 selector)
        external
        view
        returns (bool supported);
}

/// @title PermissionCallable
///
/// @notice Abstract contract to add permissioned userOp support to smart contracts.
///
/// @author Coinbase (https://github.com/coinbase/smart-wallet-permissions)
abstract contract PermissionCallable is IPermissionCallable {
    /// @notice Call not enabled through permissionedCall and smart wallet permissions systems.
    ///
    /// @param selector The function that was attempting to go through permissionedCall.
    error NotPermissionCallable(bytes4 selector);

    /// @inheritdoc IPermissionCallable
    function permissionedCall(bytes calldata call)
        external
        payable
        returns (bytes memory res)
    {
        // check if call selector is allowed through permissionedCall
        if (!supportsPermissionedCallSelector(bytes4(call)))
            revert NotPermissionCallable(bytes4(call));
        // make self-delegatecall with provided call data
        return Address.functionDelegateCall(address(this), call);
    }

    /// @inheritdoc IPermissionCallable
    function supportsPermissionedCallSelector(bytes4 selector)
        public
        view
        virtual
        returns (bool);
}

interface IOffchainAuthorization {
    /// @notice Indicate if an offchain request comes from a signer authorized by this contract.
    enum Authorization {
        UNAUTHORIZED, // show warning + reject request
        UNVERIFIED, // show caution
        VERIFIED // show okay
    }

    /// @notice Verify offchain if a request is authorized by this contract.
    ///
    /// @param hash Hash of the request
    /// @param authData Arbitrary data used to validate authorization
    function getRequestAuthorization(bytes32 hash, bytes calldata authData)
        external
        view
        returns (Authorization);
}

// Structs to represent the nested tuple structure for zkProof verification
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

// Main contract to handle the prediction market and proof attestation
contract StepCountPredictionMarket is
    PermissionCallable,
    IOffchainAuthorization,
    Ownable
{
    IReclaimVerifier public reclaimVerifier;
    uint256 public marketCounter; // To track the current marketId

    // Structure to store a prediction made by a user
    struct Prediction {
        address better;
        bool betAboveTarget; // true if betting the user will walk above target steps
        uint256 amount;
    }

    // Market information
    struct Market {
        address marketProposer; // Address of the user who proposed the market
        Prediction[] predictions; // List of predictions
        uint256 targetSteps; // Target number of steps to bet on
        bool resolved; // Whether the market has been resolved
        bool result; // Result of the market (true if steps >= target)
        uint256 totalPool; // Total pool of bets
        uint256 totalBetsOnTrue; // Total bet amount on "above target"
        uint256 totalBetsOnFalse; // Total bet amount on "below target"
    }

    // Mapping from market id to Market structure
    mapping(uint256 => Market) public markets;

    // Event emitted when a bet is placed
    event BetPlaced(
        uint256 marketId,
        address better,
        bool betAboveTarget,
        uint256 amount
    );

    // Event emitted when the market is resolved
    event MarketResolved(uint256 marketId, bool result);

    // Event emitted when a market is created
    event MarketCreated(address indexed proposer, uint256 marketId, uint256 targetSteps);

    constructor(address _reclaimVerifierAddress) Ownable(msg.sender) {
        reclaimVerifier = IReclaimVerifier(_reclaimVerifierAddress);
        marketCounter = 0; // Initialize the marketCounter
    }

    // Public function to create a prediction market
    // Can be called directly or through permissionedCall
    function createMarket(uint256 targetSteps) public {
        marketCounter++; // Increment the market counter
        Market storage newMarket = markets[marketCounter];
        newMarket.marketProposer = msg.sender; // Set the market proposer
        newMarket.targetSteps = targetSteps;

        emit MarketCreated(msg.sender, marketCounter, targetSteps); // Emit event with proposer, marketId, and targetSteps
    }

    // Public function to place a bet on a specific market
    // Can be called directly or through permissionedCall
    function placeBet(uint256 marketId, bool betAboveTarget) public payable {
        Market storage market = markets[marketId];
        require(!market.resolved, "Market already resolved");
        require(msg.value > 0, "Must bet a positive amount");

        market.predictions.push(
            Prediction({
                better: msg.sender,
                betAboveTarget: betAboveTarget,
                amount: msg.value
            })
        );

        market.totalPool += msg.value;
        if (betAboveTarget) {
            market.totalBetsOnTrue += msg.value;
        } else {
            market.totalBetsOnFalse += msg.value;
        }

        emit BetPlaced(marketId, msg.sender, betAboveTarget, msg.value);
    }

    // Public function to resolve the market based on zkProof
    // Can be called directly or through permissionedCall
    function resolveMarket(uint256 marketId, Proof memory proof) public {
        Market storage market = markets[marketId];
        require(!market.resolved, "Market already resolved");

        // Verify the zkProof using the ReclaimVerifier
        try reclaimVerifier.verifyProof(proof) {
            // Extract step count from the claimInfo.parameters field
            uint256 stepCount = getStepCount(proof.claimInfo.parameters);

            // Market result is true if the verified step count is greater than or equal to the target steps
            market.result = stepCount >= market.targetSteps;
            market.resolved = true;

            emit MarketResolved(marketId, market.result);
            distributeWinnings(marketId);
        } catch {
            revert("Failed to verify zkProof");
        }
    }

    // Internal function to distribute winnings after market resolution
    function distributeWinnings(uint256 marketId) internal {
        Market storage market = markets[marketId];
        uint256 totalWinnings = 0;

        // Winners are those who correctly predicted the outcome
        for (uint256 i = 0; i < market.predictions.length; i++) {
            Prediction storage prediction = market.predictions[i];
            if (prediction.betAboveTarget == market.result) {
                uint256 share = (
                    prediction.betAboveTarget
                        ? (market.totalPool * prediction.amount) /
                            market.totalBetsOnTrue
                        : (market.totalPool * prediction.amount) /
                            market.totalBetsOnFalse
                );
                totalWinnings += share;
                (bool success, ) = prediction.better.call{value: share}("");
                require(success, "Transfer failed.");
            }
        }
    }

    function getMarket(uint256 marketId) public view returns (Market memory) {
        return markets[marketId];
    }

    // Public function to extract the step count from the proof's claimInfo.parameters
    // Can be called directly or through permissionedCall
    function getStepCount(string memory data) public pure returns (uint256) {
        return extractFieldFromContext(data, "intVal");
    }

    // Extract field from context message
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

        // Find start of "target" (e.g., "intVal")
        for (uint256 i = 0; i <= dataBytes.length - targetBytes.length; i++) {
            bool isMatch = true;

            for (uint256 j = 0; j < targetBytes.length && isMatch; j++) {
                if (dataBytes[i + j] != targetBytes[j]) {
                    isMatch = false;
                }
            }

            if (isMatch) {
                start = i + targetBytes.length; // Move start to the end of the target (e.g., after "intVal:")
                foundStart = true;
                break;
            }
        }

        if (!foundStart) {
            return 0; // Malformed or missing message
        }

        // Find the end of the message, assuming it ends with a quote not preceded by a backslash
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

        // Extract the substring between start and end
        bytes memory contextMessage = new bytes(end - start);
        for (uint256 i = start; i < end; i++) {
            contextMessage[i - start] = dataBytes[i];
        }

        // Parse the extracted string to a uint256
        return parseStringToInt(string(contextMessage));
    }

    // Parse string to integer
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

    function supportsPermissionedCallSelector(
        bytes4 /*selector*/
    ) public pure override returns (bool) {
        return true;
    }

    function getRequestAuthorization(bytes32 hash, bytes calldata signature)
        external
        view
        returns (Authorization)
    {
        if (!SignatureChecker.isValidSignatureNow(owner(), hash, signature)) {
            return Authorization.UNVERIFIED;
        } else {
            return Authorization.VERIFIED;
        }
    }
}
