import { ethers } from 'ethers';
import { hashData } from './encryption.js';

// Activity Logger for blockchain integration
class ActivityLogger {
  constructor() {
    this.contractAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A'; // From deployments
    this.contractABI = [
      "function logActivity(string memory _actionType, bytes32 _contentHash, string memory _metadata) public",
      "function logMultipleActivities(string[] memory _actionTypes, bytes32[] memory _contentHashes, string[] memory _metadatas) public",
      "function getUserActivities(address _user) public view returns (tuple(address user, string actionType, bytes32 contentHash, uint256 timestamp, string metadata)[])",
      "function getUserActivityCount(address _user) public view returns (uint256)",
      "function verifyActivityExists(bytes32 _contentHash) public view returns (bool)",
      "event ActivityLogged(address indexed user, string indexed actionType, bytes32 indexed contentHash, uint256 timestamp, string metadata)"
    ];
    this.localStorageKey = 'sentrivault_activity_logs';
  }

  // Get provider and signer
  async getProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    throw new Error('MetaMask not detected');
  }

  async getSigner() {
    const provider = await this.getProvider();
    return await provider.getSigner();
  }

  // Get contract instance
  async getContract() {
    const signer = await this.getSigner();
    return new ethers.Contract(this.contractAddress, this.contractABI, signer);
  }

  // Log activity on blockchain
  async logOnChain(actionType, content, metadata = '') {
    try {
      const contract = await this.getContract();
      const contentHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(content)));
      
      const tx = await contract.logActivity(actionType, contentHash, metadata);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        contentHash
      };
    } catch (error) {
      console.error('Blockchain logging failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Log activity locally (backup)
  logLocally(actionType, content, metadata = '') {
    try {
      const logs = this.getLocalLogs();
      const newLog = {
        id: Date.now().toString(),
        actionType,
        content: hashData(content),
        metadata,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      logs.push(newLog);
      localStorage.setItem(this.localStorageKey, JSON.stringify(logs));
      
      return newLog;
    } catch (error) {
      console.error('Local logging failed:', error);
      throw error;
    }
  }

  // Get local logs
  getLocalLogs() {
    try {
      const stored = localStorage.getItem(this.localStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get local logs:', error);
      return [];
    }
  }

  // Log activity (both blockchain and local)
  async logActivity(actionType, content, metadata = '') {
    // Always log locally first
    const localLog = this.logLocally(actionType, content, metadata);
    
    // Try to log on blockchain
    try {
      const blockchainResult = await this.logOnChain(actionType, content, metadata);
      if (blockchainResult.success) {
        localLog.blockchainHash = blockchainResult.transactionHash;
        localLog.blockNumber = blockchainResult.blockNumber;
        localLog.verified = true;
        
        // Update local storage with blockchain info
        const logs = this.getLocalLogs();
        const logIndex = logs.findIndex(log => log.id === localLog.id);
        if (logIndex > -1) {
          logs[logIndex] = localLog;
          localStorage.setItem(this.localStorageKey, JSON.stringify(logs));
        }
      }
    } catch (error) {
      console.warn('Blockchain logging failed, using local only:', error);
      localLog.verified = false;
    }
    
    return localLog;
  }

  // Get user activities from blockchain
  async getUserActivitiesFromChain(userAddress) {
    try {
      const contract = await this.getContract();
      const activities = await contract.getUserActivities(userAddress);
      return activities.map(activity => ({
        user: activity.user,
        actionType: activity.actionType,
        contentHash: activity.contentHash,
        timestamp: new Date(Number(activity.timestamp) * 1000).toISOString(),
        metadata: activity.metadata
      }));
    } catch (error) {
      console.error('Failed to get blockchain activities:', error);
      return [];
    }
  }

  // Verify activity exists on blockchain
  async verifyActivity(contentHash) {
    try {
      const contract = await this.getContract();
      return await contract.verifyActivityExists(contentHash);
    } catch (error) {
      console.error('Failed to verify activity:', error);
      return false;
    }
  }

  // Clear local logs
  clearLocalLogs() {
    localStorage.removeItem(this.localStorageKey);
  }

  // Export logs
  exportLogs() {
    const logs = this.getLocalLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sentrivault_activity_logs_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance
const activityLogger = new ActivityLogger();

// Export functions
export const logActivity = (actionType, content, metadata) => 
  activityLogger.logActivity(actionType, content, metadata);

export const getLocalLogs = () => activityLogger.getLocalLogs();

export const getUserActivitiesFromChain = (userAddress) => 
  activityLogger.getUserActivitiesFromChain(userAddress);

export const verifyActivity = (contentHash) => 
  activityLogger.verifyActivity(contentHash);

export const exportLogs = () => activityLogger.exportLogs();

export const clearLocalLogs = () => activityLogger.clearLocalLogs();

export default activityLogger;