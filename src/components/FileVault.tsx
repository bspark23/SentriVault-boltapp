import React, { useState, useRef } from 'react';
import {
  Upload,
  File,
  Download,
  Trash2,
  Eye,
  Lock,
  FileText,
  Image,
  FileArchive
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  ipfsHash: string; // Assuming hash is used to fetch from IPFS
  encrypted: boolean;
  fileBlob?: Blob; // 👈 Store the actual file for viewing/downloading
}

const FileVault: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: FileItem[] = Array.from(fileList).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      type: file.type.includes('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'file',
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadDate: new Date().toISOString(),
      ipfsHash: URL.createObjectURL(file), // For demo use local object URL
      encrypted: true,
      fileBlob: file
    }));

    setFiles(prev => [...newFiles, ...prev]);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-8 h-8 text-red-400" />;
      case 'image': return <Image className="w-8 h-8 text-blue-400" />;
      case 'archive': return <FileArchive className="w-8 h-8 text-yellow-400" />;
      default: return <File className="w-8 h-8 text-gray-400" />;
    }
  };

  const viewFile = (url: string) => {
    window.open(url, '_blank');
  };

  const downloadFile = (file: FileItem) => {
    const link = document.createElement('a');
    link.href = file.ipfsHash;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">File Vault</h1>
          <p className="text-gray-400">Securely store files (demo version)</p>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-12 mb-8 text-center transition-all duration-200 ${
            dragActive ? 'border-cyan-400 bg-cyan-400/10' : 'border-gray-700 hover:border-gray-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Upload Files to Secure Vault</h3>
          <p className="text-gray-400 mb-6">Drag and drop files here or click to browse</p>
          <button
            className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200"
            onClick={() => inputRef.current?.click()}
          >
            Choose Files
          </button>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold">Your Files</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {files.map((file) => (
                <div key={file.id} className="p-6 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(file.type)}
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Lock className="w-3 h-3" />
                            <span>Encrypted</span>
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">IPFS (or local): {file.ipfsHash}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-cyan-400"
                        onClick={() => viewFile(file.ipfsHash)}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-green-400"
                        onClick={() => downloadFile(file)}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-400"
                        onClick={() => deleteFile(file.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileVault;
