import React, { useState } from 'react';
import { Plus, Search, Download, Eye, Clock, CheckCircle, AlertCircle, FileText, Send } from 'lucide-react';

interface PrivacyRequest {
  id: string;
  company: string;
  type: 'access' | 'delete' | 'portability' | 'rectification';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  submittedDate: string;
  responseDate?: string;
  description: string;
  blockchainHash?: string;
}

const PrivacyRequests: React.FC = () => {
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [requests] = useState<PrivacyRequest[]>([
    {
      id: '1',
      company: 'Facebook/Meta',
      type: 'access',
      status: 'completed',
      submittedDate: '2024-01-15',
      responseDate: '2024-01-25',
      description: 'Request for all personal data collected',
      blockchainHash: '0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730'
    },
    {
      id: '2',
      company: 'Google',
      type: 'delete',
      status: 'in_progress',
      submittedDate: '2024-01-20',
      description: 'Request to delete search history and location data'
    },
    {
      id: '3',
      company: 'Amazon',
      type: 'portability',
      status: 'pending',
      submittedDate: '2024-01-22',
      description: 'Request for data export in machine-readable format'
    },
    {
      id: '4',
      company: 'LinkedIn',
      type: 'rectification',
      status: 'rejected',
      submittedDate: '2024-01-10',
      responseDate: '2024-01-18',
      description: 'Request to correct inaccurate profile information'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'in_progress': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'pending': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'rejected': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'access': return 'Data Access';
      case 'delete': return 'Data Deletion';
      case 'portability': return 'Data Portability';
      case 'rectification': return 'Data Correction';
      default: return type;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const NewRequestModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 max-w-2xl w-full mx-4">
        <h3 className="text-2xl font-semibold text-white mb-6">Submit New Privacy Request</h3>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
            <input
              type="text"
              placeholder="e.g., Google, Facebook, Amazon"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Request Type</label>
            <select className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none">
              <option value="access">Data Access Request</option>
              <option value="delete">Data Deletion Request</option>
              <option value="portability">Data Portability Request</option>
              <option value="rectification">Data Correction Request</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea
              rows={4}
              placeholder="Describe what specific data you're requesting access to, deletion of, etc."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Your Email</label>
            <input
              type="email"
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowNewRequestModal(false)}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Submit Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Privacy Requests</h1>
            <p className="text-gray-400">Track and manage your data privacy requests with blockchain verification</p>
          </div>
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 px-6 py-3 rounded-lg font-semibold text-black hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Request</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{requests.length}</h3>
                <p className="text-gray-400 text-sm">Total Requests</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {requests.filter(r => r.status === 'pending' || r.status === 'in_progress').length}
                </h3>
                <p className="text-gray-400 text-sm">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {requests.filter(r => r.status === 'completed').length}
                </h3>
                <p className="text-gray-400 text-sm">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {requests.filter(r => r.blockchainHash).length}
                </h3>
                <p className="text-gray-400 text-sm">Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Requests List */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-xl font-semibold text-white">Your Privacy Requests</h3>
          </div>
          <div className="divide-y divide-gray-800">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{request.company}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span>{request.status.replace('_', ' ').toUpperCase()}</span>
                      </span>
                      <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded-full border border-cyan-400/30">
                        {getTypeLabel(request.type)}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-3">{request.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>Submitted: {new Date(request.submittedDate).toLocaleDateString()}</span>
                      {request.responseDate && (
                        <span>Responded: {new Date(request.responseDate).toLocaleDateString()}</span>
                      )}
                      {request.blockchainHash && (
                        <span className="text-green-400">✓ Blockchain Verified</span>
                      )}
                    </div>
                    {request.blockchainHash && (
                      <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
                        <span className="text-gray-400">Hash: </span>
                        <span className="text-cyan-400 font-mono">{request.blockchainHash}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-cyan-400 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-400 transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No requests found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* New Request Modal */}
        {showNewRequestModal && <NewRequestModal />}
      </div>
    </div>
  );
};

export default PrivacyRequests;