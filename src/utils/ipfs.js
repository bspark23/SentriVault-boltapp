import { Web3Storage } from 'web3.storage';

// Web3.Storage client
const WEB3_STORAGE_TOKEN = 'z6MkkmLxi4t4Le2ZDzghALXX347dHJPvZzHC9zUxJzFdXz6Q';
const client = new Web3Storage({ token: WEB3_STORAGE_TOKEN });

// Upload file to IPFS via Web3.Storage
export const uploadToIPFS = async (file) => {
  try {
    console.log('Uploading file to IPFS:', file.name);
    
    // Create a File object if it's not already
    const fileToUpload = file instanceof File ? file : new File([file], 'upload');
    
    // Upload to Web3.Storage
    const cid = await client.put([fileToUpload], {
      name: fileToUpload.name,
      maxRetries: 3
    });
    
    console.log('File uploaded successfully. CID:', cid);
    
    return {
      cid,
      ipfsUrl: `https://ipfs.io/ipfs/${cid}/${fileToUpload.name}`,
      web3StorageUrl: `https://${cid}.ipfs.w3s.link/${fileToUpload.name}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${cid}/${fileToUpload.name}`
    };
  } catch (error) {
    console.error('IPFS upload failed:', error);
    throw new Error(`IPFS upload failed: ${error.message}`);
  }
};

// Upload JSON data to IPFS
export const uploadJSONToIPFS = async (data, filename = 'data.json') => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], filename);
    
    return await uploadToIPFS(file);
  } catch (error) {
    console.error('JSON upload to IPFS failed:', error);
    throw error;
  }
};

// Retrieve file from IPFS
export const retrieveFromIPFS = async (cid, filename) => {
  try {
    const response = await fetch(`https://ipfs.io/ipfs/${cid}/${filename}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error('IPFS retrieval failed:', error);
    throw error;
  }
};

// Get file info from Web3.Storage
export const getFileInfo = async (cid) => {
  try {
    const status = await client.status(cid);
    return status;
  } catch (error) {
    console.error('Failed to get file info:', error);
    throw error;
  }
};

// List all uploads
export const listUploads = async () => {
  try {
    const uploads = [];
    for await (const upload of client.list()) {
      uploads.push(upload);
    }
    return uploads;
  } catch (error) {
    console.error('Failed to list uploads:', error);
    throw error;
  }
};

// Pin file to ensure persistence
export const pinFile = async (cid) => {
  try {
    // Web3.Storage automatically pins files, but we can check status
    const status = await client.status(cid);
    return status.pins;
  } catch (error) {
    console.error('Failed to pin file:', error);
    throw error;
  }
};

// Generate IPFS URLs for different gateways
export const generateIPFSUrls = (cid, filename) => {
  return {
    ipfs: `https://ipfs.io/ipfs/${cid}/${filename}`,
    web3Storage: `https://${cid}.ipfs.w3s.link/${filename}`,
    pinata: `https://gateway.pinata.cloud/ipfs/${cid}/${filename}`,
    cloudflare: `https://cloudflare-ipfs.com/ipfs/${cid}/${filename}`,
    dweb: `https://dweb.link/ipfs/${cid}/${filename}`
  };
};

export default {
  uploadToIPFS,
  uploadJSONToIPFS,
  retrieveFromIPFS,
  getFileInfo,
  listUploads,
  pinFile,
  generateIPFSUrls
};