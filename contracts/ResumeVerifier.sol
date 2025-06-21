// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ResumeVerifier {
    struct Resume {
        string ipfsHash;
        address owner;
        uint256 timestamp;
        bool isVerified;
    }
    
    mapping(string => Resume) public resumes;
    mapping(address => string[]) public userResumes;
    
    event ResumeStored(string indexed ipfsHash, address indexed owner, uint256 timestamp);
    event ResumeVerified(string indexed ipfsHash, bool isValid);
    
    function storeResume(string memory _ipfsHash) public {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(resumes[_ipfsHash].owner == address(0), "Resume already exists");
        
        resumes[_ipfsHash] = Resume({
            ipfsHash: _ipfsHash,
            owner: msg.sender,
            timestamp: block.timestamp,
            isVerified: true
        });
        
        userResumes[msg.sender].push(_ipfsHash);
        
        emit ResumeStored(_ipfsHash, msg.sender, block.timestamp);
    }
    
    function verifyResume(string memory _ipfsHash) public view returns (bool, address, uint256) {
        Resume memory resume = resumes[_ipfsHash];
        return (resume.isVerified, resume.owner, resume.timestamp);
    }
    
    function getUserResumes(address _user) public view returns (string[] memory) {
        return userResumes[_user];
    }
    
    function getResumeDetails(string memory _ipfsHash) public view returns (Resume memory) {
        return resumes[_ipfsHash];
    }
}