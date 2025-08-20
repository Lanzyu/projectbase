import React, { useState } from 'react';
import { Search, FileText, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function PublicTracking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const { reports } = useAppContext();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const foundReport = reports.find(report => 
      report.noSurat.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResult(foundReport || null);
  };

  const getStatusIcon = (status: string) => {
    const statusConfig = {
      'draft': { icon: FileText, color: 'text-gray-500', text: 'Draft' },
      'sent_to_coordinator': { icon: Clock, color: 'text-yellow-500', text: 'Dikirim ke Koordinator' },
      'assigned_to_staff': { icon: User, color: 'text-blue-500', text: 'Ditugaskan ke Staff' },
      'completed_by_staff': { icon: AlertCircle, color: 'text-purple-500', text: 'Selesai dari Staff' },
      'approved': { icon: CheckCircle, color: 'text-green-500', text: 'Disetujui' },
      'revision_needed': { icon: AlertCircle, color: 'text-red-500', text: 'Perlu Revisi' }
    };

    return statusConfig[status] || statusConfig.draft;
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    }).format(new Date(date));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tracking Laporan
        </h1>
        <p className="text-gray-600">
          Lacak status laporan Anda dengan memasukkan nomor surat
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Nomor Surat
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nomor surat (contoh: SPT/001/2024)"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {searchResult ? (
            <div className="p-6">
              {/* Report Header */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {searchResult.noSurat}
                    </h2>
                    <p className="text-lg text-gray-700 mb-2">
                      <strong>Hal:</strong> {searchResult.hal}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Dari:</strong> {searchResult.dari}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      searchResult.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : searchResult.status === 'revision_needed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {(() => {
                        const statusConfig = getStatusIcon(searchResult.status);
                        const Icon = statusConfig.icon;
                        return (
                          <>
                            <Icon className="h-4 w-4 mr-1" />
                            {statusConfig.text}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment Info */}
              {(searchResult.assignedStaff.length > 0 || searchResult.todoList.length > 0 || searchResult.notes) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Penugasan</h3>
                  
                  {searchResult.assignedStaff.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Staff yang Mengerjakan:</h4>
                      <div className="flex flex-wrap gap-2">
                        {searchResult.assignedStaff.map((staff, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            <User className="h-3 w-3 mr-1" />
                            {staff}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResult.todoList.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">To-Do List:</h4>
                      <ul className="space-y-1">
                        {searchResult.todoList.map((todo, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {todo}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {searchResult.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Catatan:</h4>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{searchResult.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Laporan</h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {searchResult.timeline.map((entry, index) => {
                      const statusConfig = getStatusIcon(entry.status);
                      const Icon = statusConfig.icon;
                      const isLast = index === searchResult.timeline.length - 1;

                      return (
                        <li key={entry.id}>
                          <div className="relative pb-8">
                            {!isLast && (
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            )}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  entry.status === 'approved' 
                                    ? 'bg-green-500'
                                    : entry.status === 'revision_needed'
                                    ? 'bg-red-500'
                                    : entry.status === 'draft'
                                    ? 'bg-gray-500'
                                    : 'bg-blue-500'
                                }`}>
                                  <Icon className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-900">
                                    {entry.action}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    oleh <span className="font-medium">{entry.user}</span>
                                  </p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  <Clock className="h-4 w-4 inline mr-1" />
                                  {formatTimestamp(entry.timestamp)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Laporan tidak ditemukan</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tidak ada laporan dengan nomor surat "{searchQuery}". Pastikan nomor surat yang Anda masukkan benar.
              </p>
            </div>
          )}
        </div>
      )}

      {!searchQuery && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Mulai pencarian</h3>
          <p className="mt-1 text-sm text-gray-500">
            Masukkan nomor surat untuk melihat status dan timeline laporan Anda.
          </p>
        </div>
      )}
    </div>
  );
}