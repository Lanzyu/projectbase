import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  role: 'TU' | 'Coordinator' | 'Staff';
  name: string;
}

export interface Report {
  id: string;
  noSurat: string;
  hal: string;
  asalSurat: string;
  status: 'draft' | 'sent_to_coordinator' | 'assigned_to_staff' | 'completed_by_staff' | 'approved' | 'revision_needed';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  sifat: string[];
  derajat: string[];
  noAgenda: string;
  kelompokAsalSurat: string;
  agendaSestama: string;
  dari: string;
  tglAgenda: string;
  tanggalSurat: string;
  assignedCoordinators: string[];
  assignedStaff: string[];
  todoList: string[];
  notes: string;
  timeline: TimelineEntry[];
  fileUrl?: string;
  fileName?: string;
}

export interface TimelineEntry {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  status: string;
}

interface AppContextType {
  currentUser: User | null;
  currentView: string;
  reports: Report[];
  users: User[];
  coordinators: User[];
  staff: User[];
  setCurrentUser: (user: User | null) => void;
  setCurrentView: (view: string) => void;
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  getReportById: (id: string) => Report | undefined;
  addTimelineEntry: (reportId: string, entry: Omit<TimelineEntry, 'id' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const coordinatorList = [
  { id: 'coord1', username: 'suwati', role: 'Coordinator' as const, name: 'Suwati, S.h' },
  { id: 'coord2', username: 'achmad', role: 'Coordinator' as const, name: 'Achmad Evianto' },
  { id: 'coord3', username: 'adi', role: 'Coordinator' as const, name: 'Adi Sulaksono' },
];

const staffList = [
  { id: 'staff1', username: 'ahmad.fauzi', role: 'Staff' as const, name: 'Ahmad Fauzi' },
  { id: 'staff2', username: 'roza.erlinda', role: 'Staff' as const, name: 'Roza Erlinda' },
  { id: 'staff3', username: 'rita.juwita', role: 'Staff' as const, name: 'Rita Juwita' },
  { id: 'staff4', username: 'fanni.arlina', role: 'Staff' as const, name: 'Fanni Arlina Sutia' },
  { id: 'staff5', username: 'hendi.inda', role: 'Staff' as const, name: 'Hendi Inda Karnia' },
  { id: 'staff6', username: 'ainaya.octaviyanti', role: 'Staff' as const, name: 'Ainaya Octaviyanti' },
  { id: 'staff7', username: 'ade.ashriah', role: 'Staff' as const, name: 'Ade Ashriah' },
  { id: 'staff8', username: 'fajar.aris', role: 'Staff' as const, name: 'Fajar Aris K' },
  { id: 'staff9', username: 'arum.kesuma', role: 'Staff' as const, name: 'Arum Kesuma D' },
  { id: 'staff10', username: 'andryansyah', role: 'Staff' as const, name: 'Andryansyah' },
];

const allUsers = [
  { id: 'tu1', username: 'admin', role: 'TU' as const, name: 'Administrator TU' },
  ...coordinatorList,
  ...staffList,
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('login');
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      noSurat: 'SPT/001/2024',
      hal: 'Rapat Koordinasi Bulanan',
      asalSurat: 'Kepala Dinas',
      status: 'assigned_to_staff',
      createdBy: 'Administrator TU',
      createdAt: new Date('2024-01-15T09:00:00'),
      updatedAt: new Date('2024-01-15T11:30:00'),
      sifat: ['Penting'],
      derajat: ['Segera'],
      noAgenda: 'AG-001',
      kelompokAsalSurat: 'Sekretariat',
      agendaSestama: 'AS-001',
      dari: 'Kepala Dinas',
      tglAgenda: '2024-01-15',
      tanggalSurat: '2024-01-14',
      assignedCoordinators: ['Suwati, S.h'],
      assignedStaff: ['Ahmad Fauzi', 'Rita Juwita'],
      todoList: ['Jadwalkan/Agendakan', 'Siapkan bahan'],
      notes: 'Koordinasi agenda rapat dan persiapan materi',
      timeline: [
        { id: 't1', action: 'Report dibuat', user: 'Administrator TU', timestamp: new Date('2024-01-15T09:00:00'), status: 'draft' },
        { id: 't2', action: 'Diteruskan ke Koordinator', user: 'Administrator TU', timestamp: new Date('2024-01-15T09:15:00'), status: 'sent_to_coordinator' },
        { id: 't3', action: 'Ditugaskan ke Staff', user: 'Suwati, S.h', timestamp: new Date('2024-01-15T11:30:00'), status: 'assigned_to_staff' },
      ],
    },
  ]);

  const addReport = (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => {
    const now = new Date();
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: 't1',
          action: 'Report dibuat',
          user: currentUser?.name || 'System',
          timestamp: now,
          status: reportData.status
        }
      ]
    };
    setReports(prev => [newReport, ...prev]);
  };

  const updateReport = (id: string, updates: Partial<Report>) => {
    setReports(prev => prev.map(report => 
      report.id === id 
        ? { ...report, ...updates, updatedAt: new Date() }
        : report
    ));
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  const getReportById = (id: string) => {
    return reports.find(report => report.id === id);
  };

  const addTimelineEntry = (reportId: string, entry: Omit<TimelineEntry, 'id' | 'timestamp'>) => {
    const newEntry: TimelineEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            timeline: [...report.timeline, newEntry],
            updatedAt: new Date()
          }
        : report
    ));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      currentView,
      reports,
      users: allUsers,
      coordinators: coordinatorList,
      staff: staffList,
      setCurrentUser,
      setCurrentView,
      addReport,
      updateReport,
      deleteReport,
      getReportById,
      addTimelineEntry,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}