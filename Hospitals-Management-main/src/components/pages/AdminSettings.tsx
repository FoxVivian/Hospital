// File: src/components/pages/AdminSettings.tsx

import React, { useState } from 'react';
import { Settings, Users, Shield, Database, Bell, Mail, Globe, Palette, Download, Upload, RotateCcw, Save, X, Plus, Edit, Trash2 } from 'lucide-react';
import { useDataManager } from '../../hooks/useDataManager';
import { User } from '../../types'; // Import User type

export const AdminSettings: React.FC = () => {
  const {
    patients,
    appointments,
    medicines,
    invoices,
    labTests,
    medicalRecords,
    resetAllData,
    clearAllData
  } = useDataManager();

  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'security' | 'data' | 'notifications'>('general');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null); // Dùng type User cho editingUser

  // Mock settings state
  const [settings, setSettings] = useState({
    general: {
      hospitalName: 'Bệnh viện Đa khoa MediCare',
      address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
      phone: '028-1234-5678',
      email: 'info@medicare.vn',
      website: 'https://medicare.vn',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi',
      currency: 'VND'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      stockAlerts: true,
      appointmentReminders: true,
      paymentReminders: true,
      lowStockThreshold: 10
    },
    security: {
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireSpecialChars: true,
      twoFactorAuth: false,
      loginAttempts: 5
    }
  });

  // Thay đổi `users` để có thể cập nhật
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Admin User', email: 'admin@medicare.vn', role: 'admin', is_active: true, avatar: 'https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
    { id: '2', name: 'BS. Nguyễn Văn A', email: 'doctor@medicare.vn', role: 'doctor', is_active: true, department: 'Nội khoa', avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
    { id: '3', name: 'Y tá Trần Thị B', email: 'nurse@medicare.vn', role: 'nurse', is_active: true, department: 'Khoa Nội', avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' }
  ]);

  // Form state cho người dùng
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '', // Chỉ dùng khi thêm mới, không hiển thị khi chỉnh sửa
    role: 'staff' as User['role'],
    phone: '',
    department: '',
    avatar: '',
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({}); // Lỗi của form

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleResetData = () => {
    resetAllData();
    setShowResetModal(false);
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearModal(false);
  };

  const exportData = () => {
    const data = {
      patients,
      appointments,
      medicines,
      invoices,
      labTests,
      medicalRecords,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medicare-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSystemStats = () => {
    return {
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      totalMedicines: medicines.length,
      totalInvoices: invoices.length,
      totalLabTests: labTests.length,
      totalMedicalRecords: medicalRecords.length,
      storageUsed: '2.5 MB', // Mock data
      lastBackup: '2024-12-30'
    };
  };

  const stats = getSystemStats();

  // --- Hàm xử lý modal người dùng ---
  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'staff',
      phone: '',
      department: '',
      avatar: '',
      is_active: true,
    });
    setFormErrors({});
    setEditingUser(null);
  };

  const openAddUserModal = () => {
    resetUserForm();
    setShowUserFormModal(true);
  };

  const openEditUserModal = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setUserForm({
      name: userToEdit.name,
      email: userToEdit.email,
      password: '', // Không tải mật khẩu khi chỉnh sửa
      role: userToEdit.role,
      phone: (userToEdit as any).phone || '', // phone và department có thể không có trong User type
      department: userToEdit.department || '',
      avatar: userToEdit.avatar || '',
      is_active: userToEdit.is_active || true,
    });
    setShowUserFormModal(true);
  };

  const closeUserFormModal = () => {
    setShowUserFormModal(false);
    resetUserForm();
  };

  const validateUserForm = () => {
    const newErrors: Record<string, string> = {};
    if (!userForm.name.trim()) newErrors.name = 'Tên là bắt buộc.';
    if (!userForm.email.trim()) {
      newErrors.email = 'Email là bắt buộc.';
    } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
      newErrors.email = 'Email không hợp lệ.';
    }
    if (!editingUser && !userForm.password.trim()) { // Mật khẩu chỉ bắt buộc khi thêm mới
      newErrors.password = 'Mật khẩu là bắt buộc.';
    } else if (!editingUser && userForm.password.trim().length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }
    if (!userForm.role) newErrors.role = 'Vai trò là bắt buộc.';

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUserForm()) {
      return;
    }

    if (editingUser) {
      // Cập nhật người dùng hiện có
      setUsers(prevUsers => prevUsers.map(user =>
        user.id === editingUser.id ? { ...user, ...userForm, id: user.id } : user
      ));
    } else {
      // Thêm người dùng mới
      const newUser: User = {
        id: String(Date.now()), // Tạo ID đơn giản
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        is_active: userForm.is_active,
        phone: userForm.phone || undefined,
        department: userForm.department || undefined,
        avatar: userForm.avatar || undefined,
        // password_hash sẽ được xử lý ở backend, ở đây chỉ là mock
      };
      setUsers(prevUsers => [...prevUsers, newUser]);
    }
    closeUserFormModal();
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản trị Hệ thống</h2>
          <p className="text-gray-600">Cấu hình và quản lý hệ thống</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Xuất dữ liệu</span>
          </button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng bệnh nhân</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng lịch hẹn</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
            </div>
            <Settings className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dung lượng sử dụng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.storageUsed}</p>
            </div>
            <Database className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sao lưu cuối</p>
              <p className="text-2xl font-bold text-gray-900">{new Date(stats.lastBackup).toLocaleDateString('vi-VN')}</p>
            </div>
            <Shield className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'general', label: 'Tổng quan', icon: Settings },
              { id: 'users', label: 'Người dùng', icon: Users },
              { id: 'security', label: 'Bảo mật', icon: Shield },
              { id: 'data', label: 'Dữ liệu', icon: Database },
              { id: 'notifications', label: 'Thông báo', icon: Bell }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bệnh viện</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên bệnh viện
                    </label>
                    <input
                      type="text"
                      value={settings.general.hospitalName}
                      onChange={(e) => handleSettingChange('general', 'hospitalName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={settings.general.phone}
                      onChange={(e) => handleSettingChange('general', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.general.email}
                      onChange={(e) => handleSettingChange('general', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={settings.general.website}
                      onChange={(e) => handleSettingChange('general', 'website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Múi giờ
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    >
                      <option value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</option>
                      <option value="Asia/Bangkok">Bangkok (UTC+7)</option>
                      <option value="Asia/Singapore">Singapore (UTC+8)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngôn ngữ
                    </label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <textarea
                    rows={3}
                    value={settings.general.address}
                    onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Users Management */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Quản lý người dùng</h3>
                <button
                  onClick={openAddUserModal} // Gắn hàm xử lý sự kiện openAddUserModal
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Thêm người dùng</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Tên</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Vai trò</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Trạng thái</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'nurse' ? 'bg-green-100 text-green-800' :
                            user.role === 'pharmacist' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'lab_technician' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role === 'admin' ? 'Quản trị' :
                             user.role === 'doctor' ? 'Bác sĩ' :
                             user.role === 'nurse' ? 'Y tá' :
                             user.role === 'pharmacist' ? 'Dược sĩ' :
                             user.role === 'lab_technician' ? 'KTV Xét nghiệm' :
                             'Nhân viên'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </td>
                        {/* Assuming lastLogin might not be part of User type or needs to be added */}
                        <td className="py-3 px-4">{(user as any).lastLogin ? new Date((user as any).lastLogin).toLocaleDateString('vi-VN') : 'N/A'}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditUserModal(user)} // Gắn hàm xử lý sự kiện openEditUserModal
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Xóa">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt bảo mật</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời gian hết hạn phiên (phút)
                      </label>
                      <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Độ dài mật khẩu tối thiểu
                      </label>
                      <input
                        type="number"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số lần đăng nhập sai tối đa
                      </label>
                      <input
                        type="number"
                        value={settings.security.loginAttempts}
                        onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Yêu cầu ký tự đặc biệt</p>
                        <p className="text-sm text-gray-600">Mật khẩu phải chứa ký tự đặc biệt</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.requireSpecialChars}
                          onChange={(e) => handleSettingChange('security', 'requireSpecialChars', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Xác thực hai yếu tố</p>
                        <p className="text-sm text-gray-600">Bật xác thực 2FA cho tất cả người dùng</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Management */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quản lý dữ liệu</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Sao lưu dữ liệu</h4>
                    <p className="text-sm text-blue-700 mb-4">Xuất toàn bộ dữ liệu hệ thống để sao lưu</p>
                    <button
                      onClick={exportData}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Xuất dữ liệu</span>
                    </button>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">Khôi phục dữ liệu</h4>
                    <p className="text-sm text-green-700 mb-4">Nhập dữ liệu từ file sao lưu</p>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>Nhập dữ liệu</span>
                    </button>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">Đặt lại dữ liệu</h4>
                    <p className="text-sm text-yellow-700 mb-4">Đặt lại về dữ liệu mẫu ban đầu</p>
                    <button
                      onClick={() => setShowResetModal(true)}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center space-x-2 transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Đặt lại</span>
                    </button>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">Xóa toàn bộ dữ liệu</h4>
                    <p className="text-sm text-red-700 mb-4">Xóa hoàn toàn tất cả dữ liệu (không thể khôi phục)</p>
                    <button
                      onClick={() => setShowClearModal(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Xóa tất cả</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Thống kê dữ liệu</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Bệnh nhân</p>
                      <p className="text-lg font-semibold">{stats.totalPatients}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Lịch hẹn</p>
                      <p className="text-lg font-semibold">{stats.totalAppointments}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Thuốc</p>
                      <p className="text-lg font-semibold">{stats.totalMedicines}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Hóa đơn</p>
                      <p className="text-lg font-semibold">{stats.totalInvoices}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Xét nghiệm</p>
                      <p className="text-lg font-semibold">{stats.totalLabTests}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Bệnh án</p>
                      <p className="text-lg font-semibold">{stats.totalMedicalRecords}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt thông báo</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Thông báo email</p>
                      <p className="text-sm text-gray-600">Gửi thông báo qua email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Thông báo SMS</p>
                      <p className="text-sm text-gray-600">Gửi thông báo qua tin nhắn</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Cảnh báo tồn kho</p>
                      <p className="text-sm text-gray-600">Thông báo khi thuốc sắp hết</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.stockAlerts}
                        onChange={(e) => handleSettingChange('notifications', 'stockAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Nhắc nhở lịch hẹn</p>
                      <p className="text-sm text-gray-600">Nhắc nhở bệnh nhân về lịch hẹn</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.appointmentReminders}
                        onChange={(e) => handleSettingChange('notifications', 'appointmentReminders', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Nhắc nhở thanh toán</p>
                      <p className="text-sm text-gray-600">Nhắc nhở về hóa đơn chưa thanh toán</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.paymentReminders}
                        onChange={(e) => handleSettingChange('notifications', 'paymentReminders', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngưỡng cảnh báo tồn kho
                    </label>
                    <input
                      type="number"
                      value={settings.notifications.lowStockThreshold}
                      onChange={(e) => handleSettingChange('notifications', 'lowStockThreshold', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="Số lượng tối thiểu"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 flex items-center space-x-2 transition-colors">
              <Save className="h-4 w-4" />
              <span>Lưu cài đặt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Data Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <RotateCcw className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Đặt lại dữ liệu</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn đặt lại tất cả dữ liệu về trạng thái ban đầu?
                Tất cả dữ liệu hiện tại sẽ bị thay thế bằng dữ liệu mẫu.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleResetData}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Đặt lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Xóa toàn bộ dữ liệu</h3>
              </div>
              <p className="text-gray-600 mb-6">
                <strong>CẢNH BÁO:</strong> Hành động này sẽ xóa hoàn toàn tất cả dữ liệu và không thể khôi phục.
                Bạn có chắc chắn muốn tiếp tục?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm/Chỉnh sửa người dùng */}
      {showUserFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                </h3>
                <button onClick={closeUserFormModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUserSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                      formErrors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Nguyễn Văn A"
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                      formErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="email@example.com"
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>

                {!editingUser && ( // Mật khẩu chỉ hiển thị khi thêm mới
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                        formErrors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Tối thiểu 6 ký tự"
                    />
                    {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as User['role'] })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                      formErrors.role ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="staff">Nhân viên</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="doctor">Bác sĩ</option>
                    <option value="nurse">Y tá</option>
                    <option value="pharmacist">Dược sĩ</option>
                    <option value="lab_technician">KTV Xét nghiệm</option>
                  </select>
                  {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="0912345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phòng ban
                  </label>
                  <input
                    type="text"
                    value={userForm.department}
                    onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="VD: Nội khoa, Dược"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Ảnh đại diện
                  </label>
                  <input
                    type="url"
                    value={userForm.avatar}
                    onChange={(e) => setUserForm({ ...userForm, avatar: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái hoạt động
                  </label>
                  <select
                    value={userForm.is_active ? 'true' : 'false'}
                    onChange={(e) => setUserForm({ ...userForm, is_active: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="true">Hoạt động</option>
                    <option value="false">Không hoạt động</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeUserFormModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingUser ? 'Cập nhật' : 'Thêm mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};