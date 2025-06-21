// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ScamDomainRegistry {
    address public admin;
    mapping(string => bool) public scamDomains;
    mapping(string => uint256) public reportedAt;
    string[] public allScamDomains;
    
    event DomainAdded(string domain, uint256 timestamp);
    event DomainRemoved(string domain, uint256 timestamp);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
    }
    
    function addScamDomain(string memory _domain) public onlyAdmin {
        require(bytes(_domain).length > 0, "Domain cannot be empty");
        require(!scamDomains[_domain], "Domain already exists");
        
        scamDomains[_domain] = true;
        reportedAt[_domain] = block.timestamp;
        allScamDomains.push(_domain);
        
        emit DomainAdded(_domain, block.timestamp);
    }
    
    function removeScamDomain(string memory _domain) public onlyAdmin {
        require(scamDomains[_domain], "Domain not found");
        
        scamDomains[_domain] = false;
        
        emit DomainRemoved(_domain, block.timestamp);
    }
    
    function isScam(string memory _domain) public view returns (bool) {
        return scamDomains[_domain];
    }
    
    function getAllScamDomains() public view returns (string[] memory) {
        return allScamDomains;
    }
    
    function transferAdmin(address _newAdmin) public onlyAdmin {
        require(_newAdmin != address(0), "Invalid admin address");
        admin = _newAdmin;
    }
}