import React, { useState } from 'react';
import { X, Send, User, CheckSquare } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface ForwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any;
  type: 'to_coordinator' | 'to_staff';
}

export function ForwardModal({ isOpen, onClose, report, type }: ForwardModalProps) {
  const { coordinators, staff, updateReport, addTimelineEntry, currentUser } = useAppContext();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const users = type === 'to_coordinator' ? coordinators : staff;
  
  const todoOptions = [
    'Jadwalkan/Agendakan',
    'Bahas dengan saya',
    'Untuk ditindaklanjuti',
    'Untuk diketahui',
    'Siapkan bahan',
    'Siapkan Jawaban',
    'Diskusi dengan saya',
    'Hadir Mewakili',
    'Copy untuk saya',
    'Arsip/File'
  ];

  const handleUserToggle = (userName: string) => {
    setSelectedUsers(prev => 
      prev.includes(userName)
        ? prev.filter(name => name !== userName)
        : [...prev, userName]
    );
  };

  const handleTodoToggle = (todo: string) => {
    setSelectedTodos(prev => 
      prev.includes(todo)
        ? prev.filter(t => t !== todo)
        : [...prev, todo]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedUsers.length === 0) {
      alert(`Pilih minimal satu ${type === 'to_coordinator' ? 'koordinator' : 'staff'}!`);
      return;
    }

    const updates = {
      status: type === 'to_coordinator' ? 'sent_to_coordinator' : 'assigned_to_staff',
      assignedCoordinators: type === 'to_coordinator' ? selectedUsers : report.assignedCoordinators,
      assignedStaff: type === 'to_staff' ? selectedUsers : report.assignedStaff,
      todoList: selectedTodos,
      notes: notes
    };

    updateReport(report.id, updates);
    
    const action = type === 'to_coordinator' 
      ? 'Diteruskan ke Koordinator'
      : 'Ditugaskan ke Staff';
    
    addTimelineEntry(report.id, {
      action: `${action}: ${selectedUsers.join(', ')}`,
      user: currentUser?.name || 'System',
      status: updates.status
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Teruskan ke {type === 'to_coordinator' ? 'Koordinator' : 'Staff'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Detail Laporan:</h3>
            <p className="text-sm text-gray-600">
              <strong>No. Surat:</strong> {report.noSurat}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Hal:</strong> {report.hal}
            </p>
          </div>

          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <User className="h-4 w-4 inline mr-1" />
              Pilih {type === 'to_coordinator' ? 'Koordinator' : 'Staff'} *
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {users.map(user => (
                <label key={user.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.name)}
                    onChange={() => handleUserToggle(user.name)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{user.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Todo List - Only for staff assignment */}
          {type === 'to_staff' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <CheckSquare className="h-4 w-4 inline mr-1" />
                Isi Disposisi
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {todoOptions.map(todo => (
                  <label key={todo} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTodos.includes(todo)}
                      onChange={() => handleTodoToggle(todo)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{todo}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {type === 'to_staff' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tambahkan catatan atau instruksi khusus..."
              />
            </div>
          )}

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
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Teruskan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}