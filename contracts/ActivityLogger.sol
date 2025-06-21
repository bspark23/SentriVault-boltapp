// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ActivityLogger {
    struct ActivityLog {
        address user;
        string actionType;
        bytes32 contentHash;
        uint256 timestamp;
        string metadata;
    }
    
    mapping(address => ActivityLog[]) public userActivities;
    mapping(bytes32 => bool) public logExists;
    ActivityLog[] public allActivities;
    
    event ActivityLogged(
        address indexed user,
        string indexed actionType,
        bytes32 indexed contentHash,
        uint256 timestamp,
        string metadata
    );
    
    event BatchActivitiesLogged(
        address indexed user,
        uint256 count,
        uint256 timestamp
    );
    
    modifier validUser() {
        require(msg.sender != address(0), "Invalid user address");
        _;
    }
    
    modifier validAction(string memory _actionType) {
        require(bytes(_actionType).length > 0, "Action type cannot be empty");
        _;
    }
    
    function logActivity(
        string memory _actionType,
        bytes32 _contentHash,
        string memory _metadata
    ) public validUser validAction(_actionType) {
        require(_contentHash != bytes32(0), "Content hash cannot be empty");
        
        ActivityLog memory newLog = ActivityLog({
            user: msg.sender,
            actionType: _actionType,
            contentHash: _contentHash,
            timestamp: block.timestamp,
            metadata: _metadata
        });
        
        userActivities[msg.sender].push(newLog);
        allActivities.push(newLog);
        logExists[_contentHash] = true;
        
        emit ActivityLogged(
            msg.sender,
            _actionType,
            _contentHash,
            block.timestamp,
            _metadata
        );
    }
    
    function logMultipleActivities(
        string[] memory _actionTypes,
        bytes32[] memory _contentHashes,
        string[] memory _metadatas
    ) public validUser {
        require(
            _actionTypes.length == _contentHashes.length && 
            _contentHashes.length == _metadatas.length,
            "Arrays length mismatch"
        );
        require(_actionTypes.length > 0, "No activities to log");
        require(_actionTypes.length <= 50, "Too many activities at once");
        
        for (uint256 i = 0; i < _actionTypes.length; i++) {
            require(bytes(_actionTypes[i]).length > 0, "Action type cannot be empty");
            require(_contentHashes[i] != bytes32(0), "Content hash cannot be empty");
            
            ActivityLog memory newLog = ActivityLog({
                user: msg.sender,
                actionType: _actionTypes[i],
                contentHash: _contentHashes[i],
                timestamp: block.timestamp,
                metadata: _metadatas[i]
            });
            
            userActivities[msg.sender].push(newLog);
            allActivities.push(newLog);
            logExists[_contentHashes[i]] = true;
            
            emit ActivityLogged(
                msg.sender,
                _actionTypes[i],
                _contentHashes[i],
                block.timestamp,
                _metadatas[i]
            );
        }
        
        emit BatchActivitiesLogged(msg.sender, _actionTypes.length, block.timestamp);
    }
    
    function getUserActivities(address _user) public view returns (ActivityLog[] memory) {
        return userActivities[_user];
    }
    
    function getUserActivityCount(address _user) public view returns (uint256) {
        return userActivities[_user].length;
    }
    
    function getUserRecentActivities(address _user, uint256 _limit) public view returns (ActivityLog[] memory) {
        ActivityLog[] memory activities = userActivities[_user];
        uint256 length = activities.length;
        
        if (length == 0) {
            return new ActivityLog[](0);
        }
        
        uint256 limit = _limit > length ? length : _limit;
        ActivityLog[] memory recentActivities = new ActivityLog[](limit);
        
        for (uint256 i = 0; i < limit; i++) {
            recentActivities[i] = activities[length - 1 - i];
        }
        
        return recentActivities;
    }
    
    function getActivityByHash(bytes32 _contentHash) public view returns (ActivityLog[] memory) {
        uint256 count = 0;
        
        // First pass: count matching activities
        for (uint256 i = 0; i < allActivities.length; i++) {
            if (allActivities[i].contentHash == _contentHash) {
                count++;
            }
        }
        
        // Second pass: collect matching activities
        ActivityLog[] memory matchingActivities = new ActivityLog[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allActivities.length; i++) {
            if (allActivities[i].contentHash == _contentHash) {
                matchingActivities[index] = allActivities[i];
                index++;
            }
        }
        
        return matchingActivities;
    }
    
    function verifyActivityExists(bytes32 _contentHash) public view returns (bool) {
        return logExists[_contentHash];
    }
    
    function getActivityStats(address _user) public view returns (
        uint256 totalActivities,
        uint256 lastActivityTime,
        string memory mostRecentAction
    ) {
        ActivityLog[] memory activities = userActivities[_user];
        totalActivities = activities.length;
        
        if (totalActivities > 0) {
            ActivityLog memory lastActivity = activities[totalActivities - 1];
            lastActivityTime = lastActivity.timestamp;
            mostRecentAction = lastActivity.actionType;
        } else {
            lastActivityTime = 0;
            mostRecentAction = "";
        }
    }
    
    function getGlobalStats() public view returns (
        uint256 totalLogs,
        uint256 uniqueUsers,
        uint256 totalContentHashes
    ) {
        totalLogs = allActivities.length;
        
        // Count unique users (simplified approach)
        address[] memory users = new address[](totalLogs);
        uint256 userCount = 0;
        
        for (uint256 i = 0; i < totalLogs; i++) {
            address user = allActivities[i].user;
            bool isNewUser = true;
            
            for (uint256 j = 0; j < userCount; j++) {
                if (users[j] == user) {
                    isNewUser = false;
                    break;
                }
            }
            
            if (isNewUser) {
                users[userCount] = user;
                userCount++;
            }
        }
        
        uniqueUsers = userCount;
        totalContentHashes = totalLogs; // Simplified - each log has a unique hash
    }
    
    function getActivitiesByTimeRange(
        address _user,
        uint256 _startTime,
        uint256 _endTime
    ) public view returns (ActivityLog[] memory) {
        require(_startTime <= _endTime, "Invalid time range");
        
        ActivityLog[] memory userLogs = userActivities[_user];
        uint256 count = 0;
        
        // Count activities in range
        for (uint256 i = 0; i < userLogs.length; i++) {
            if (userLogs[i].timestamp >= _startTime && userLogs[i].timestamp <= _endTime) {
                count++;
            }
        }
        
        // Collect activities in range
        ActivityLog[] memory rangeActivities = new ActivityLog[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < userLogs.length; i++) {
            if (userLogs[i].timestamp >= _startTime && userLogs[i].timestamp <= _endTime) {
                rangeActivities[index] = userLogs[i];
                index++;
            }
        }
        
        return rangeActivities;
    }
    
    function getActivitiesByType(
        address _user,
        string memory _actionType
    ) public view returns (ActivityLog[] memory) {
        ActivityLog[] memory userLogs = userActivities[_user];
        uint256 count = 0;
        
        // Count activities of specific type
        for (uint256 i = 0; i < userLogs.length; i++) {
            if (keccak256(bytes(userLogs[i].actionType)) == keccak256(bytes(_actionType))) {
                count++;
            }
        }
        
        // Collect activities of specific type
        ActivityLog[] memory typeActivities = new ActivityLog[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < userLogs.length; i++) {
            if (keccak256(bytes(userLogs[i].actionType)) == keccak256(bytes(_actionType))) {
                typeActivities[index] = userLogs[i];
                index++;
            }
        }
        
        return typeActivities;
    }
}