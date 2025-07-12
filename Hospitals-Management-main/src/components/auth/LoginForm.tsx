import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, Phone, Calendar, MapPin, Users, Stethoscope, Activity } from 'lucide-react';

interface LoginFormProps {
  userType: 'staff' | 'patient';
  onLogin: (credentials: any) => void;
  onSwitchToRegister?: () => void;
  onSwitchUserType: (type: 'staff' | 'patient') => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  userType, 
  onLogin, 
  onSwitchToRegister, 
  onSwitchUserType 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    patientCode: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (userType === 'staff') {
      if (!formData.email) {
        newErrors.email = 'Email là bắt buộc';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
    } else {
      if (!formData.patientCode && !formData.phone) {
        newErrors.identifier = 'Vui lòng nhập mã bệnh nhân hoặc số điện thoại';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (userType === 'staff') {
        // Mock staff login
        const mockStaffUsers = {
          'doctor@hospital.com': { 
            id: '1', 
            name: 'BS. Nguyễn Văn A', 
            role: 'doctor', 
            department: 'Nội khoa',
            avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
          },
          'nurse@hospital.com': { 
            id: '2', 
            name: 'Y tá Trần Thị B', 
            role: 'nurse', 
            department: 'Khoa Nội',
            avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
          },
          'admin@hospital.com': { 
            id: '3', 
            name: 'Quản trị viên', 
            role: 'admin', 
            department: 'IT',
            avatar: 'https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
          },
          'pharmacist@hospital.com': { 
            id: '4', 
            name: 'Dược sĩ Lê Văn C', 
            role: 'pharmacist', 
            department: 'Dược',
            avatar: 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
          },
          'lab@hospital.com': { 
            id: '5', 
            name: 'KTV Phạm Thị D', 
            role: 'lab_technician', 
            department: 'Xét nghiệm',
            avatar: 'https://images.pexels.com/photos/5452299/pexels-photo-5452299.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
          }
        };
        
        const user = mockStaffUsers[formData.email as keyof typeof mockStaffUsers];
        if (user && formData.password === '123456') {
          onLogin({ ...user, email: formData.email, userType: 'staff' });
        } else {
          setErrors({ general: 'Email hoặc mật khẩu không đúng' });
        }
      } else {
        // Mock patient login
        const mockPatients = {
          'BN001': { 
            id: '1', 
            name: 'Nguyễn Văn Nam', 
            code: 'BN001', 
            phone: '0901234567',
            avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
          },
          '0901234567': { 
            id: '1', 
            name: 'Nguyễn Văn Nam', 
            code: 'BN001', 
            phone: '0901234567',
            avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
          }
        };
        
        const identifier = formData.patientCode || formData.phone;
        const patient = mockPatients[identifier as keyof typeof mockPatients];
        if (patient && formData.password === '123456') {
          onLogin({ ...patient, userType: 'patient' });
        } else {
          setErrors({ general: 'Thông tin đăng nhập không đúng' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-6 text-white">
          <div className="text-center mb-4">
            <div className="bg-white/20 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Activity className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">MediCare</h1>
            <p className="text-emerald-100">Hệ thống Quản lý Bệnh viện</p>
          </div>
          
          {/* User Type Switcher */}
          <div className="flex bg-white/20 rounded-lg p-1">
            <button
              type="button"
              onClick={() => onSwitchUserType('staff')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all ${
                userType === 'staff' 
                  ? 'bg-white text-emerald-600 shadow-md' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span className="text-sm font-medium">Nhân viên</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchUserType('patient')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all ${
                userType === 'patient' 
                  ? 'bg-white text-emerald-600 shadow-md' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Bệnh nhân</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {userType === 'staff' ? 'Đăng nhập Nhân viên' : 'Đăng nhập Bệnh nhân'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {userType === 'staff' 
                ? 'Dành cho bác sĩ, y tá và nhân viên y tế' 
                : 'Tra cứu thông tin khám chữa bệnh'
              }
            </p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {userType === 'staff' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="doctor@hospital.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã bệnh nhân
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      value={formData.patientCode}
                      onChange={(e) => setFormData({ ...formData, patientCode: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
                        errors.identifier ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="VD: BN001"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-gray-500 text-sm">hoặc</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
                        errors.identifier ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0901234567"
                    />
                  </div>
                </div>
                {errors.identifier && <p className="text-red-500 text-xs mt-1">{errors.identifier}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <span>Đăng nhập</span>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tài khoản demo:</h3>
            {userType === 'staff' ? (
              <div className="space-y-1 text-xs text-gray-600">
                <p><strong>Bác sĩ:</strong> doctor@hospital.com / 123456</p>
                <p><strong>Y tá:</strong> nurse@hospital.com / 123456</p>
                <p><strong>Admin:</strong> admin@hospital.com / 123456</p>
                <p><strong>Dược sĩ:</strong> pharmacist@hospital.com / 123456</p>
                <p><strong>KTV XN:</strong> lab@hospital.com / 123456</p>
              </div>
            ) : (
              <div className="space-y-1 text-xs text-gray-600">
                <p><strong>Bệnh nhân:</strong> BN001 hoặc 0901234567 / 123456</p>
              </div>
            )}
          </div>

          {/* Register Link for Patients */}
          {userType === 'patient' && onSwitchToRegister && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Chưa có tài khoản?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Bằng việc đăng nhập, bạn đồng ý với{' '}
              <a href="#" className="text-emerald-600 hover:underline">Điều khoản sử dụng</a>
              {' '}và{' '}
              <a href="#" className="text-emerald-600 hover:underline">Chính sách bảo mật</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};