import React, { useState } from 'react';
import { Send, CheckCircle, XCircle, Clock, User, FileText } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { ForwardModal } from '../modals/ForwardModal';

export function CoordinatorDashboard() {
  const { reports, updateReport, currentUser, addTimelineEntry } = useAppContext();
  const [assigningReport, setAssigningReport] = useState(null);

  const coordinatorReports = reports.filter(report => 
    report.assignedCoordinators.includes(currentUser?.name) ||
    (report.status === 'sent_to_coordinator' && report.assignedCoordinators.length === 0)
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'sent_to_coordinator': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Menunggu Penugasan' },
      'assigned_to_staff': { color: 'bg-blue-100 text-blue-800', icon: User, text: 'Ditugaskan ke Staff' },
      'completed_by_staff': { color: 'bg-purple-100 text-purple-800', icon: CheckCircle, text: 'Selesai dari Staff' },
      'revision_needed': { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Perlu Revisi' }
    };

    const config = statusConfig[status] || statusConfig.sent_to_coordinator;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const handleAssign = (report) => {
    setAssigningReport(report);
  };

  const handleApprove = (reportId: string) => {
    updateReport(reportId, { status: 'approved' });
    addTimelineEntry(reportId, {
      action: 'Disetujui dan diteruskan ke TU',
      user: currentUser?.name || 'Koordinator',
      status: 'approved'
    });
  };

  const handleRevision = (reportId: string) => {
    updateReport(reportId, { status: 'revision_needed' });
    addTimelineEntry(reportId, {
      action: 'Dikembalikan untuk revisi',
      user: currentUser?.name || 'Koordinator',
      status: 'revision_needed'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Koordinator</h1>
        <p className="mt-2 text-gray-600">Kelola penugasan laporan kepada staff</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Laporan yang Ditugaskan</h2>
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Ditugaskan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coordinatorReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.noSurat}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.hal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {report.assignedStaff.length > 0 ? (
                      <div className="space-y-1">
                        {report.assignedStaff.map((staff, index) => (
                          <div key={index} className="inline-block mr-2 mb-1">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {staff}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">Belum ditugaskan</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {report.status === 'sent_to_coordinator' && (
                      <button
                        onClick={() => handleAssign(report)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Tugaskan
                      </button>
                    )}
                    {report.status === 'completed_by_staff' && (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleApprove(report.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Setujui
                        </button>
                        <button
                          onClick={() => handleRevision(report.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Revisi
                        </button>
                      </div>
                    )}
                    {report.status === 'assigned_to_staff' && (
                      <span className="text-blue-600 text-xs">Menunggu Staff</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {coordinatorReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada laporan</h3>
              <p className="mt-1 text-sm text-gray-500">Belum ada laporan yang ditugaskan kepada Anda.</p>
            </div>
          )}
        </div>
      </div>

      {assigningReport && (
        <ForwardModal
          isOpen={!!assigningReport}
          onClose={() => setAssigningReport(null)}
          report={assigningReport}
          type="to_staff"
        />
      )}
    </div>
  );
}