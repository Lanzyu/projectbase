import React from 'react';
import { Send, Clock, CheckCircle, FileText, User } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export function StaffDashboard() {
  const { reports, updateReport, currentUser, addTimelineEntry } = useAppContext();

  const staffReports = reports.filter(report => 
    report.assignedStaff.includes(currentUser?.name) &&
    (report.status === 'assigned_to_staff' || report.status === 'revision_needed')
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'assigned_to_staff': { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Ditugaskan' },
      'revision_needed': { color: 'bg-red-100 text-red-800', icon: Clock, text: 'Perlu Revisi' }
    };

    const config = statusConfig[status] || statusConfig.assigned_to_staff;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const handleComplete = (reportId: string) => {
    updateReport(reportId, { status: 'completed_by_staff' });
    addTimelineEntry(reportId, {
      action: 'Diselesaikan dan dikirim ke Koordinator',
      user: currentUser?.name || 'Staff',
      status: 'completed_by_staff'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Staff</h1>
        <p className="mt-2 text-gray-600">Kelola tugas yang diberikan oleh koordinator</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Tugas Saya</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {staffReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {report.noSurat}
                    </h3>
                    {getStatusBadge(report.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Hal:</strong> {report.hal}
                  </p>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Dari:</strong> {report.dari}
                  </p>

                  {report.todoList.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">To-Do List:</h4>
                      <div className="space-y-2">
                        {report.todoList.map((todo, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{todo}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.notes && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Catatan:</h4>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{report.notes}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <User className="h-4 w-4 mr-1" />
                    <span>Koordinator: {report.assignedCoordinators.join(', ')}</span>
                  </div>
                </div>

                <div className="ml-6">
                  <button
                    onClick={() => handleComplete(report.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Kirim ke Koordinator
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {staffReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada tugas</h3>
              <p className="mt-1 text-sm text-gray-500">Belum ada tugas yang ditugaskan kepada Anda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}