import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AlertTriangle, Shield, TrendingUp, Download, Plus, Edit2, Trash2 } from 'lucide-react';
import type { RiskAnalysis as RiskAnalysisType } from '../../hooks/useRiskAnalysis';
import { useRiskAnalysis } from '../../hooks/useRiskAnalysis';
import { toast } from 'sonner';

interface RiskFormData {
  risk_category: RiskAnalysisType['risk_category'];
  risk_description: string;
  likelihood: number;
  impact: number;
  mitigation_strategy: string;
  mitigation_status: RiskAnalysisType['mitigation_status'];
}

export const RiskAnalysis: React.FC = () => {
  const { bidId } = useParams<{ bidId: string }>();
  const {
    risks,
    riskMatrix,
    loading,
    error,
    fetchRisks,
    fetchRiskMatrix,
    createRisk,
    updateRisk,
    deleteRisk,
    generateRiskReport,
    exportRiskRegister,
  } = useRiskAnalysis();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRisk, setEditingRisk] = useState<RiskAnalysisType | null>(null);
  const [formData, setFormData] = useState<RiskFormData>({
    risk_category: 'operational',
    risk_description: '',
    likelihood: 3,
    impact: 3,
    mitigation_strategy: '',
    mitigation_status: 'not_started',
  });

  useEffect(() => {
    if (bidId) {
      fetchRisks(bidId);
      fetchRiskMatrix(bidId);
    }
  }, [bidId, fetchRisks, fetchRiskMatrix]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bidId) {
      toast.error('No bid ID provided');
      return;
    }

    if (editingRisk) {
      const success = await updateRisk(editingRisk.id, formData);
      if (success) {
        setEditingRisk(null);
        setFormData({
          risk_category: 'operational',
          risk_description: '',
          likelihood: 3,
          impact: 3,
          mitigation_strategy: '',
          mitigation_status: 'not_started',
        });
      }
    } else {
      const newRisk = await createRisk({
        bid_id: bidId,
        submission_id: '', // This should be provided based on the context
        ...formData,
        identified_by: 'current_user', // This should come from auth context
        identified_at: new Date().toISOString(),
      });
      
      if (newRisk) {
        setShowAddForm(false);
        setFormData({
          risk_category: 'operational',
          risk_description: '',
          likelihood: 3,
          impact: 3,
          mitigation_strategy: '',
          mitigation_status: 'not_started',
        });
      }
    }
  };

  const handleEdit = (risk: RiskAnalysisType) => {
    setEditingRisk(risk);
    setFormData({
      risk_category: risk.risk_category,
      risk_description: risk.risk_description,
      likelihood: risk.likelihood,
      impact: risk.impact,
      mitigation_strategy: risk.mitigation_strategy,
      mitigation_status: risk.mitigation_status,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this risk?')) {
      await deleteRisk(id);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMitigationStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'monitoring': return 'bg-purple-100 text-purple-800';
      case 'not_started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading risk analysis...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">Error loading risk analysis: {error}</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Risk Analysis</h2>
        <div className="flex gap-2">
          <button
            onClick={() => bidId && generateRiskReport(bidId)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Generate Report
          </button>
          <button
            onClick={() => bidId && exportRiskRegister(bidId, 'excel')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Register
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Risk
          </button>
        </div>
      </div>

      {/* Risk Matrix Summary */}
      {riskMatrix && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Risks</h3>
              <AlertTriangle className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{riskMatrix.total_risks}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Average Risk Score</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{riskMatrix.average_risk_score.toFixed(1)}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Mitigation Coverage</h3>
              <Shield className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{riskMatrix.mitigation_coverage.toFixed(0)}%</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Risk Distribution</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-red-600">Critical</span>
                <span className="font-medium">{riskMatrix.risk_distribution.critical}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-600">High</span>
                <span className="font-medium">{riskMatrix.risk_distribution.high}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600">Medium</span>
                <span className="font-medium">{riskMatrix.risk_distribution.medium}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Low</span>
                <span className="font-medium">{riskMatrix.risk_distribution.low}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingRisk ? 'Edit Risk' : 'Add New Risk'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Category
                </label>
                <select
                  value={formData.risk_category}
                  onChange={(e) => setFormData({ ...formData, risk_category: e.target.value as RiskAnalysisType['risk_category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="financial">Financial</option>
                  <option value="technical">Technical</option>
                  <option value="legal">Legal</option>
                  <option value="operational">Operational</option>
                  <option value="reputational">Reputational</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mitigation Status
                </label>
                <select
                  value={formData.mitigation_status}
                  onChange={(e) => setFormData({ ...formData, mitigation_status: e.target.value as RiskAnalysisType['mitigation_status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="implemented">Implemented</option>
                  <option value="monitoring">Monitoring</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Risk Description
              </label>
              <textarea
                value={formData.risk_description}
                onChange={(e) => setFormData({ ...formData, risk_description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Likelihood (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.likelihood}
                  onChange={(e) => setFormData({ ...formData, likelihood: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impact (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mitigation Strategy
              </label>
              <textarea
                value={formData.mitigation_strategy}
                onChange={(e) => setFormData({ ...formData, mitigation_strategy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingRisk ? 'Update Risk' : 'Add Risk'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingRisk(null);
                  setFormData({
                    risk_category: 'operational',
                    risk_description: '',
                    likelihood: 3,
                    impact: 3,
                    mitigation_strategy: '',
                    mitigation_status: 'not_started',
                  });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Risk List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Risk Register</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mitigation Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {risks.map((risk) => (
                <tr key={risk.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {risk.risk_category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate" title={risk.risk_description}>
                      {risk.risk_description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(risk.risk_level)}`}>
                      {risk.risk_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {risk.risk_score} ({risk.likelihood}×{risk.impact})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMitigationStatusColor(risk.mitigation_status)}`}>
                      {risk.mitigation_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(risk)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(risk.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {risks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No risks identified yet. Click "Add Risk" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
