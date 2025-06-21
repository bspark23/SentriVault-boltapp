import { ethers } from 'ethers';
import deployments from '../contracts/deployments.json';

// Contract ABIs
const RESUME_VERIFIER_ABI = [
  "function storeResume(string memory _ipfsHash) public",
  "function verifyResume(string memory _ipfsHash) public view returns (bool, address, uint256)",
  "function getUserResumes(address _user) public view returns (string[] memory)",
  "function getResumeDetails(string memory _ipfsHash) public view returns (tuple(string ipfsHash, address owner, uint256 timestamp, bool isVerified))",
  "event ResumeStored(string indexed ipfsHash, address indexed owner, uint256 timestamp)"
];

const SCAM_DOMAIN_REGISTRY_ABI = [
  "function addScamDomain(string memory _domain) public",
  "function removeScamDomain(string memory _domain) public",
  "function isScam(string memory _domain) public view returns (bool)",
  "function getAllScamDomains() public view returns (string[] memory)",
  "function admin() public view returns (address)",
  "event DomainAdded(string domain, uint256 timestamp)"
];

// Network configuration
const SEPOLIA_NETWORK = {
  chainId: '0xaa36a7', // 11155111 in hex
  chainName: 'Sepolia Test Network',
  nativeCurrency: {
    name: 'SepoliaETH',
    symbol: 'SEP',
    decimals: 18
  },
  rpcUrls: ['https://sepolia.infura.io/v3/5be7608016db4b69ae24ee8aa7897443'],
  blockExplorerUrls: ['https://sepolia.etherscan.io/']
};

// Get provider and signer
export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error('MetaMask not detected');
};

export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
};

// Connect wallet
export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    // Switch to Sepolia network
    await switchToSepolia();

    return accounts[0];
  } catch (error) {
    console.error('Wallet connection failed:', error);
    throw error;
  }
};

// Switch to Sepolia network
export const switchToSepolia = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_NETWORK.chainId }]
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SEPOLIA_NETWORK]
        });
      } catch (addError) {
        throw new Error('Failed to add Sepolia network');
      }
    } else {
      throw switchError;
    }
  }
};

// Get contract instances
export const getResumeVerifierContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(
    deployments.contracts.ResumeVerifier.address,
    RESUME_VERIFIER_ABI,
    signer
  );
};

export const getScamDomainRegistryContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(
    deployments.contracts.ScamDomainRegistry.address,
    SCAM_DOMAIN_REGISTRY_ABI,
    signer
  );
};

// Resume Verifier functions
export const storeResumeOnBlockchain = async (ipfsHash) => {
  try {
    const contract = await getResumeVerifierContract();
    const tx = await contract.storeResume(ipfsHash);
    const receipt = await tx.wait();
    
    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    console.error('Failed to store resume on blockchain:', error);
    throw error;
  }
};

export const verifyResumeOnBlockchain = async (ipfsHash) => {
  try {
    const contract = await getResumeVerifierContract();
    const [isVerified, owner, timestamp] = await contract.verifyResume(ipfsHash);
    
    return {
      isVerified,
      owner,
      timestamp: new Date(Number(timestamp) * 1000).toISOString(),
      etherscanUrl: `https://sepolia.etherscan.io/address/${deployments.contracts.ResumeVerifier.address}`
    };
  } catch (error) {
    console.error('Failed to verify resume on blockchain:', error);
    throw error;
  }
};

export const getUserResumesFromBlockchain = async (userAddress) => {
  try {
    const contract = await getResumeVerifierContract();
    const resumes = await contract.getUserResumes(userAddress);
    return resumes;
  } catch (error) {
    console.error('Failed to get user resumes from blockchain:', error);
    throw error;
  }
};

// Scam Domain Registry functions
export const addScamDomain = async (domain) => {
  try {
    const contract = await getScamDomainRegistryContract();
    const tx = await contract.addScamDomain(domain);
    const receipt = await tx.wait();
    
    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Failed to add scam domain:', error);
    throw error;
  }
};

export const checkScamDomain = async (domain) => {
  try {
    const contract = await getScamDomainRegistryContract();
    const isScam = await contract.isScam(domain);
    return isScam;
  } catch (error) {
    console.error('Failed to check scam domain:', error);
    throw error;
  }
};

export const getAllScamDomains = async () => {
  try {
    const contract = await getScamDomainRegistryContract();
    const domains = await contract.getAllScamDomains();
    return domains;
  } catch (error) {
    console.error('Failed to get all scam domains:', error);
    throw error;
  }
};

export const getAdminAddress = async () => {
  try {
    const contract = await getScamDomainRegistryContract();
    const admin = await contract.admin();
    return admin;
  } catch (error) {
    console.error('Failed to get admin address:', error);
    throw error;
  }
};

// Utility functions
export const getTransactionUrl = (txHash) => {
  return `https://sepolia.etherscan.io/tx/${txHash}`;
};

export const getAddressUrl = (address) => {
  return `https://sepolia.etherscan.io/address/${address}`;
};

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getNetworkInfo = () => {
  return {
    name: 'Sepolia Testnet',
    chainId: 11155111,
    explorer: 'https://sepolia.etherscan.io',
    rpc: 'https://sepolia.infura.io/v3/5be7608016db4b69ae24ee8aa7897443'
  };
};

export default {
  connectWallet,
  switchToSepolia,
  getProvider,
  getSigner,
  getResumeVerifierContract,
  getScamDomainRegistryContract,
  storeResumeOnBlockchain,
  verifyResumeOnBlockchain,
  getUserResumesFromBlockchain,
  addScamDomain,
  checkScamDomain,
  getAllScamDomains,
  getAdminAddress,
  getTransactionUrl,
  getAddressUrl,
  formatAddress,
  getNetworkInfo
};