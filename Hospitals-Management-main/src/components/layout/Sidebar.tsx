import React from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  Package, 
  CreditCard, 
  TestTube, 
  BarChart3, 
  Settings,
  LogOut,
  Activity,
  Home
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: User & { userType?: string; department?: string };
  onLogout: () => void;
  allowedSections: string[];
}

const menuItems = [
  { id: 'dashboard', label: 'Tổng quan', icon: Home },
  { id: 'patients', label: 'Bệnh nhân', icon: Users },
  { id: 'appointments', label: 'Lịch hẹn', icon: Calendar },
  { id: 'medical-records', label: 'Bệnh án', icon: FileText },
  { id: 'pharmacy', label: 'Kho thuốc', icon: Package },
  { id: 'billing', label: 'Thanh toán', icon: CreditCard },
  { id: 'lab', label: 'Xét nghiệm', icon: TestTube },
  { id: 'reports', label: 'Báo cáo', icon: BarChart3 },
  { id: 'admin', label: 'Quản trị', icon: Settings },
];

const getRoleDisplayName = (role: string) => {
  switch (role) {
    case 'admin': return 'Quản trị viên';
    case 'doctor': return 'Bác sĩ';
    case 'nurse': return 'Y tá';
    case 'pharmacist': return 'Dược sĩ';
    case 'lab_technician': return 'KTV Xét nghiệm';
    case 'staff': return 'Nhân viên';
    default: return role;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  user, 
  onLogout,
  allowedSections 
}) => {
  // Filter menu items based on allowed sections
  const filteredMenuItems = menuItems.filter(item => allowedSections.includes(item.id));

  return (
    <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">MediCare</h1>
            <p className="text-sm text-gray-500">Hệ thống quản lý</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar || 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500">{getRoleDisplayName(user.role)}</p>
            {user.department && (
              <p className="text-xs text-gray-400">{user.department}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Role Badge */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">Vai trò hiện tại</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              user.role === 'admin' ? 'bg-red-100 text-red-800' :
              user.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
              user.role === 'nurse' ? 'bg-green-100 text-green-800' :
              user.role === 'pharmacist' ? 'bg-purple-100 text-purple-800' :
              user.role === 'lab_technician' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {getRoleDisplayName(user.role)}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};