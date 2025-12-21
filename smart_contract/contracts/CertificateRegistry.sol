// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    struct Certificate {
        string documentHash; // SHA-256 hash of the original file
        string fileUrl;      // IPFS CID or URL of encrypted file
        address issuer;
        bytes signature;     // Signature of the hash by the issuer
        uint256 timestamp;
        bool isValid;
        string revocationReason;
        bytes revocationSignature; // Signature authorizing revocation
    }

    mapping(bytes32 => Certificate) public certificates;
    
    address public owner;
    mapping(address => bool) public authorizedIssuers;

    event CertificateIssued(bytes32 indexed certificateId, address indexed issuer, string documentHash);
    event CertificateRevoked(bytes32 indexed certificateId, address indexed revoker, string reason);
    event IssuerStatusChanged(address indexed issuer, bool isAuthorized);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true; // Owner is default issuer
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyIssuer() {
        require(authorizedIssuers[msg.sender], "Only authorized issuers can perform this action");
        _;
    }

    function setOwner(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        emit OwnerChanged(owner, _newOwner);
        owner = _newOwner;
    }

    function addIssuer(address _issuer) external onlyOwner {
        authorizedIssuers[_issuer] = true;
        emit IssuerStatusChanged(_issuer, true);
    }

    function removeIssuer(address _issuer) external onlyOwner {
        authorizedIssuers[_issuer] = false;
        emit IssuerStatusChanged(_issuer, false);
    }

    function issueCertificate(
        string memory _documentHash,
        string memory _fileUrl,
        bytes memory _signature
    ) external onlyIssuer returns (bytes32) {
        // Use the document hash as the unique identifier for the certificate
        // Assuming SHA-256 hash is provided as a hex string or similar
        bytes32 certificateId = keccak256(abi.encodePacked(_documentHash));
        
        require(certificates[certificateId].timestamp == 0, "Certificate already exists");

        certificates[certificateId] = Certificate({
            documentHash: _documentHash,
            fileUrl: _fileUrl,
            issuer: msg.sender,
            signature: _signature,
            timestamp: block.timestamp,
            isValid: true,
            revocationReason: "",
            revocationSignature: ""
        });

        emit CertificateIssued(certificateId, msg.sender, _documentHash);
        return certificateId;
    }

    function revokeCertificate(
        bytes32 _certificateId,
        string memory _reason,
        bytes memory _signature
    ) external onlyIssuer {
        require(certificates[_certificateId].timestamp != 0, "Certificate does not exist");
        require(certificates[_certificateId].isValid, "Certificate already revoked");
        
        certificates[_certificateId].isValid = false;
        certificates[_certificateId].revocationReason = _reason;
        certificates[_certificateId].revocationSignature = _signature;

        emit CertificateRevoked(_certificateId, msg.sender, _reason);
    }

    function getCertificate(bytes32 _certificateId) external view returns (Certificate memory) {
        return certificates[_certificateId];
    }
}
