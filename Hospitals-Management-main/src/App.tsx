import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/pages/Dashboard';
import { Patients } from './components/pages/Patients';
import { Appointments } from './components/pages/Appointments';
import { MedicalRecords } from './components/pages/MedicalRecords';
import { Pharmacy } from './components/pages/Pharmacy';
import { Billing } from './components/pages/Billing';
import { LabTests } from './components/pages/LabTests';
import { Reports } from './components/pages/Reports';
import { AdminSettings } from './components/pages/AdminSettings';

const sectionTitles = {
  dashboard: 'Tổng quan',
  patients: 'Quản lý Bệnh nhân',
  appointments: 'Quản lý Lịch hẹn',
  'medical-records': 'Bệnh án Điện tử',
  pharmacy: 'Quản lý Kho thuốc',
  billing: 'Quản lý Thanh toán',
  lab: 'Quản lý Xét nghiệm',
  reports: 'Báo cáo & Phân tích',
  admin: 'Quản trị Hệ thống'
};

// Define permissions for each role
const rolePermissions = {
  admin: ['dashboard', 'patients', 'appointments', 'medical-records', 'pharmacy', 'billing', 'lab', 'reports', 'admin'],
  doctor: ['dashboard', 'patients', 'appointments', 'medical-records', 'lab', 'reports'],
  nurse: ['dashboard', 'patients', 'appointments', 'medical-records'],
  pharmacist: ['dashboard', 'pharmacy', 'billing'],
  lab_technician: ['dashboard', 'lab', 'reports'],
  staff: ['dashboard', 'patients', 'appointments', 'billing']
};

function App() {
  const { user, isLoading, login, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [userType, setUserType] = useState<'staff' | 'patient'>('staff');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // If no user is logged in, show auth forms
  if (!user) {
    if (authMode === 'register' && userType === 'patient') {
      return (
        <RegisterForm
          onRegister={(userData) => {
            login(userData);
          }}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    }

    return (
      <LoginForm
        userType={userType}
        onLogin={(credentials) => {
          login(credentials);
        }}
        onSwitchToRegister={userType === 'patient' ? () => setAuthMode('register') : undefined}
        onSwitchUserType={setUserType}
      />
    );
  }

  // If user is a patient, show patient dashboard
  if (user.userType === 'patient') {
    return <PatientDashboard user={user} onLogout={logout} />;
  }

  // Staff interface with role-based access
  const allowedSections = rolePermissions[user.role as keyof typeof rolePermissions] || ['dashboard'];
  
  // If current section is not allowed for this role, redirect to dashboard
  if (!allowedSections.includes(activeSection)) {
    setActiveSection('dashboard');
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return allowedSections.includes('patients') ? <Patients /> : <Dashboard />;
      case 'appointments':
        return allowedSections.includes('appointments') ? <Appointments /> : <Dashboard />;
      case 'medical-records':
        return allowedSections.includes('medical-records') ? <MedicalRecords /> : <Dashboard />;
      case 'pharmacy':
        return allowedSections.includes('pharmacy') ? <Pharmacy /> : <Dashboard />;
      case 'billing':
        return allowedSections.includes('billing') ? <Billing /> : <Dashboard />;
      case 'lab':
        return allowedSections.includes('lab') ? <LabTests /> : <Dashboard />;
      case 'reports':
        return allowedSections.includes('reports') ? <Reports /> : <Dashboard />;
      case 'admin':
        return allowedSections.includes('admin') ? <AdminSettings /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        user={user}
        onLogout={logout}
        allowedSections={allowedSections}
      />
      
      <div className="ml-64">
        <Header title={sectionTitles[activeSection as keyof typeof sectionTitles] || 'Tổng quan'} />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;