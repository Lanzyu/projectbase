import React, { useState, useEffect } from 'react';
import { X, Upload, File, Calendar } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface DispositionFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
}

export function DispositionForm({ isOpen, onClose, editData }: DispositionFormProps) {
  const { addReport, updateReport } = useAppContext();
  const [formData, setFormData] = useState({
    noSurat: '',
    hal: '',
    asalSurat: '',
    sifat: [],
    derajat: [],
    noAgenda: '',
    kelompokAsalSurat: '',
    agendaSestama: '',
    dari: '',
    tglAgenda: '',
    tanggalSurat: '',
    status: 'draft',
    assignedCoordinators: [],
    assignedStaff: [],
    todoList: [],
    notes: '',
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  const sifatOptions = ['Biasa', 'Penting', 'Rahasia'];
  const derajatOptions = ['Biasa', 'Segera', 'Kilat'];

  const handleCheckbox = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reportData = {
      ...formData,
      createdBy: 'Administrator TU',
      fileUrl: file ? URL.createObjectURL(file) : undefined,
      fileName: file?.name
    };

    if (editData) {
      updateReport(editData.id, reportData);
    } else {
      addReport(reportData);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {editData ? 'Edit' : 'Buat'} Lembar Disposisi
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sifat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sifat
              </label>
              <div className="space-y-2">
                {sifatOptions.map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sifat.includes(option)}
                      onChange={() => handleCheckbox('sifat', option)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Derajat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Derajat
              </label>
              <div className="space-y-2">
                {derajatOptions.map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.derajat.includes(option)}
                      onChange={() => handleCheckbox('derajat', option)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No. Agenda
              </label>
              <input
                type="text"
                value={formData.noAgenda}
                onChange={(e) => setFormData(prev => ({ ...prev, noAgenda: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kelompok Asal Surat
              </label>
              <input
                type="text"
                value={formData.kelompokAsalSurat}
                onChange={(e) => setFormData(prev => ({ ...prev, kelompokAsalSurat: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agenda Sestama
              </label>
              <input
                type="text"
                value={formData.agendaSestama}
                onChange={(e) => setFormData(prev => ({ ...prev, agendaSestama: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No. Surat *
              </label>
              <input
                type="text"
                value={formData.noSurat}
                onChange={(e) => setFormData(prev => ({ ...prev, noSurat: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hal *
            </label>
            <input
              type="text"
              value={formData.hal}
              onChange={(e) => setFormData(prev => ({ ...prev, hal: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dari *
              </label>
              <input
                type="text"
                value={formData.dari}
                onChange={(e) => setFormData(prev => ({ ...prev, dari: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asal Surat *
              </label>
              <input
                type="text"
                value={formData.asalSurat}
                onChange={(e) => setFormData(prev => ({ ...prev, asalSurat: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Tgl. Agenda
              </label>
              <input
                type="date"
                value={formData.tglAgenda}
                onChange={(e) => setFormData(prev => ({ ...prev, tglAgenda: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Tanggal Surat
              </label>
              <input
                type="date"
                value={formData.tanggalSurat}
                onChange={(e) => setFormData(prev => ({ ...prev, tanggalSurat: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File (JPG, PNG, PDF)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Klik untuk upload file atau drag & drop
                </p>
                <p className="text-xs text-gray-500">JPG, PNG, PDF hingga 10MB</p>
              </label>
              {file && (
                <div className="mt-4 flex items-center justify-center">
                  <File className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-900">{file.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editData ? 'Update' : 'Simpan'} Laporan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}