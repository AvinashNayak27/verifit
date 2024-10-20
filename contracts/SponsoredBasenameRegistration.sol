// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IL2Resolver {
    function setAddr(bytes32 node, address a) external;

    function setName(bytes32 node, string memory newName) external;
}

interface IRegistrarController {
    struct RegisterRequest {
        string name;
        address owner;
        uint256 duration;
        address resolver;
        bytes[] data;
        bool reverseRecord;
    }

    function register(RegisterRequest calldata request) external payable;
}

interface IReverseRegistrar {
    function setName(string calldata name) external returns (bytes32);
}

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

contract SponsoredBasenameRegistration {
    IRegistrarController public immutable registrarController;
    IL2Resolver public immutable l2Resolver;
    IReverseRegistrar public immutable reverseRegistrar;
    address public owner;
    uint256 public constant REGISTRATION_COST = 0.002 ether;
    bool public registrationsPaused;
    IReclaimVerifier public reclaimVerifier;

    event RegistrationSponsored(
        address indexed user,
        string name,
        uint256 timestamp
    );
    event FundsDeposited(address indexed depositor, uint256 amount);
    event FundsWithdrawn(address indexed receiver, uint256 amount);
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    event RegistrationsPaused(bool paused);
    event ReverseRegistrationSet(address indexed user, string name);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier whenNotPaused() {
        require(!registrationsPaused, "Registrations are paused");
        _;
    }

    // Base Sepolia addresses
    constructor() {
        registrarController = IRegistrarController(
            0x49aE3cC2e3AA768B1e5654f5D3C6002144A59581
        );
        l2Resolver = IL2Resolver(0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA);
        reverseRegistrar = IReverseRegistrar(
            0xa0A8401ECF248a9375a0a71C4dedc263dA18dCd7
        );
        reclaimVerifier = IReclaimVerifier(
            0xF90085f5Fd1a3bEb8678623409b3811eCeC5f6A5
        );

        owner = msg.sender;
    }

    function namehash(string memory name) public pure returns (bytes32) {
        bytes32 node = 0x0000000000000000000000000000000000000000000000000000000000000000;
        string[] memory labels = split(name, ".");

        for (uint256 i = labels.length; i > 0; i--) {
            node = keccak256(
                abi.encodePacked(node, keccak256(bytes(labels[i - 1])))
            );
        }

        return node;
    }

    function split(string memory str, string memory delimiter)
        internal
        pure
        returns (string[] memory)
    {
        uint256 count = 1;
        for (uint256 i = 0; i < bytes(str).length; i++) {
            if (bytes(str)[i] == bytes(delimiter)[0]) count++;
        }

        string[] memory result = new string[](count);
        uint256 index = 0;
        uint256 lastIndex = 0;

        for (uint256 i = 0; i < bytes(str).length; i++) {
            if (bytes(str)[i] == bytes(delimiter)[0]) {
                result[index] = substring(str, lastIndex, i);
                lastIndex = i + 1;
                index++;
            }
        }
        result[index] = substring(str, lastIndex, bytes(str).length);
        return result;
    }

    function substring(
        string memory str,
        uint256 startIndex,
        uint256 endIndex
    ) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }

    function registerBasename(string memory name, Proof[] memory proofs) external whenNotPaused {
        require(proofs.length == 7, "Proofs array must have exactly 7 elements");

        uint256[] memory stepCounts = bundleAttest(proofs);
        for (uint256 i = 0; i < stepCounts.length; i++) {
            require(stepCounts[i] > 1000, "Each step count must be greater than 1000");
        }

        require(
            address(this).balance >= REGISTRATION_COST,
            "Contract has insufficient funds"
        );

        string memory fullName = string(
            abi.encodePacked(name, ".basetest.eth")
        );
        bytes32 nameHash = namehash(fullName);

        // Create resolver data
        bytes[] memory data = new bytes[](2);
        data[0] = abi.encodeWithSelector(
            IL2Resolver.setAddr.selector,
            nameHash,
            msg.sender
        );
        data[1] = abi.encodeWithSelector(
            IL2Resolver.setName.selector,
            nameHash,
            fullName
        );

        // Create registration request
        IRegistrarController.RegisterRequest
            memory request = IRegistrarController.RegisterRequest({
                name: name,
                owner: msg.sender,
                duration: 31557600, // 1 year in seconds
                resolver: address(l2Resolver),
                data: data,
                reverseRecord: true
            });

        // Register the name
        registrarController.register{value: REGISTRATION_COST}(request);

        // Set reverse record
        bytes32 reverseNode = reverseRegistrar.setName(fullName);
        emit ReverseRegistrationSet(msg.sender, fullName);

        emit RegistrationSponsored(msg.sender, name, block.timestamp);
    }


    // Administrative functions

    function depositFunds() external payable onlyOwner {
        emit FundsDeposited(msg.sender, msg.value);
    }

    function withdrawFunds(uint256 amount) external onlyOwner {
        require(
            address(this).balance >= amount,
            "Insufficient contract balance"
        );
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");
        emit FundsWithdrawn(owner, amount);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    function toggleRegistrations() external onlyOwner {
        registrationsPaused = !registrationsPaused;
        emit RegistrationsPaused(registrationsPaused);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Proof Verfications

    // Function to attest proof by calling verifyProof from ReclaimVerifier
    function attest(Proof memory proof) public view returns (uint256) {
        try reclaimVerifier.verifyProof(proof) {
            // If no error occurs, consider the proof valid and extract step count
            return getStepCount(proof.claimInfo.parameters);
        } catch {
            // Handle any exception by reverting with an error message
            revert("Failed to verify proof");
        }
    }

    // Function to attest multiple proofs and return an array of step counts
    function bundleAttest(Proof[] memory proofs)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory stepCounts = new uint256[](proofs.length);
        for (uint256 i = 0; i < proofs.length; i++) {
            stepCounts[i] = attest(proofs[i]);
        }
        return stepCounts;
    }

    // Public function to extract the step count from the proof's claimInfo.parameters
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

    // Allow the contract to receive ETH
    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }
}
