import React, { useState } from 'react';
import { Plus, Edit, Trash2, Send, FileText, Clock, CheckCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { DispositionForm } from '../forms/DispositionForm';
import { ForwardModal } from '../modals/ForwardModal';

export function TUDashboard() {
  const { reports, deleteReport, currentUser, addTimelineEntry } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [forwardingReport, setForwardingReport] = useState(null);

  const tuReports = reports.filter(report => 
    report.createdBy === currentUser?.name || 
    report.status === 'approved' ||
    report.status === 'draft'
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { color: 'bg-gray-100 text-gray-800', icon: FileText, text: 'Draft' },
      'sent_to_coordinator': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Dikirim ke Koordinator' },
      'assigned_to_staff': { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Ditugaskan ke Staff' },
      'completed_by_staff': { color: 'bg-purple-100 text-purple-800', icon: Clock, text: 'Selesai dari Staff' },
      'approved': { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Disetujui' },
      'revision_needed': { color: 'bg-red-100 text-red-800', icon: Clock, text: 'Perlu Revisi' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const handleDelete = (reportId: string) => {
    if (confirm('Yakin ingin menghapus laporan ini?')) {
      deleteReport(reportId);
    }
  };

  const handleForward = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setForwardingReport(report);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard TU</h1>
        <p className="mt-2 text-gray-600">Kelola laporan dan disposisi surat masuk</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Buat Laporan Baru
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Daftar Laporan</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Surat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asal Surat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tuReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.noSurat}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.hal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.asalSurat}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(report.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {report.status === 'draft' && (
                      <>
                        <button
                          onClick={() => {
                            setEditingReport(report);
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleForward(report.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Teruskan"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {report.status === 'approved' && (
                      <span className="text-green-600 text-sm">Selesai</span>
                    )}
                    {!['draft', 'approved'].includes(report.status) && (
                      <span className="text-blue-600 text-sm">Dalam Proses</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {tuReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada laporan</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan membuat laporan baru.</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <DispositionForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingReport(null);
          }}
          editData={editingReport}
        />
      )}

      {forwardingReport && (
        <ForwardModal
          isOpen={!!forwardingReport}
          onClose={() => setForwardingReport(null)}
          report={forwardingReport}
          type="to_coordinator"
        />
      )}
    </div>
  );
}