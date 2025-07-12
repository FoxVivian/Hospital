import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, Phone, Calendar, MapPin, ArrowLeft, Check } from 'lucide-react';

interface RegisterFormProps {
  onRegister: (userData: any) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onSwitchToLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    phone: '',
    email: '',
    
    // Step 2: Address & Contact
    address: '',
    identityCard: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    
    // Step 3: Medical & Account
    medicalHistory: [] as string[],
    insuranceId: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [medicalHistoryInput, setMedicalHistoryInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Họ tên là bắt buộc';
      }
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Số điện thoại là bắt buộc';
      } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
    }

    if (step === 2) {
      if (!formData.address.trim()) {
        newErrors.address = 'Địa chỉ là bắt buộc';
      }
      if (!formData.identityCard.trim()) {
        newErrors.identityCard = 'CMND/CCCD là bắt buộc';
      } else if (!/^[0-9]{9,12}$/.test(formData.identityCard)) {
        newErrors.identityCard = 'CMND/CCCD không hợp lệ';
      }
      if (!formData.emergencyContactName.trim()) {
        newErrors.emergencyContactName = 'Tên người liên hệ khẩn cấp là bắt buộc';
      }
      if (!formData.emergencyContactPhone.trim()) {
        newErrors.emergencyContactPhone = 'SĐT người liên hệ khẩn cấp là bắt buộc';
      }
      if (!formData.emergencyContactRelationship.trim()) {
        newErrors.emergencyContactRelationship = 'Mối quan hệ là bắt buộc';
      }
    }

    if (step === 3) {
      if (!formData.password) {
        newErrors.password = 'Mật khẩu là bắt buộc';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const addMedicalHistory = () => {
    if (medicalHistoryInput.trim()) {
      setFormData({
        ...formData,
        medicalHistory: [...formData.medicalHistory, medicalHistoryInput.trim()]
      });
      setMedicalHistoryInput('');
    }
  };

  const removeMedicalHistory = (index: number) => {
    setFormData({
      ...formData,
      medicalHistory: formData.medicalHistory.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate patient code
      const patientCode = `BN${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      const userData = {
        id: String(Date.now()),
        code: patientCode,
        ...formData,
        userType: 'patient',
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      onRegister(userData);
    } catch (error) {
      setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại' });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Thông tin cơ bản', description: 'Họ tên, ngày sinh, liên hệ' },
    { number: 2, title: 'Địa chỉ & Liên hệ', description: 'Địa chỉ, CMND, người liên hệ' },
    { number: 3, title: 'Tài khoản & Bảo mật', description: 'Mật khẩu và xác nhận' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-6 text-white">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={onSwitchToLogin}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Đăng ký Bệnh nhân</h1>
              <p className="text-emerald-100">Tạo tài khoản để tra cứu thông tin khám chữa bệnh</p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                  currentStep >= step.number 
                    ? 'bg-white text-emerald-600 border-white' 
                    : 'border-white/50 text-white/70'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-all ${
                    currentStep > step.number ? 'bg-white' : 'bg-white/30'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-3">
            <p className="text-sm font-medium">{steps[currentStep - 1].title}</p>
            <p className="text-xs text-emerald-100">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
                        errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Nhập họ và tên đầy đủ"
                    />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
                          errors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0901234567"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (tùy chọn)
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
                      placeholder="email@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Address & Contact */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                    <textarea
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
                        errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Nhập địa chỉ đầy đủ"
                    />
                  </div>
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CMND/CCCD <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.identityCard}
                    onChange={(e) => setFormData({ ...formData, identityCard: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
                      errors.identityCard ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Nhập số CMND/CCCD"
                  />
                  {errors.identityCard && <p className="text-red-500 text-xs mt-1">{errors.identityCard}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã BHYT (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={formData.insuranceId}
                    onChange={(e) => setFormData({ ...formData, insuranceId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Nhập mã BHYT (nếu có)"
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin liên hệ khẩn cấp</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
                          errors.emergencyContactName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Tên người liên hệ"
                      />
                      {errors.emergencyContactName && <p className="text-red-500 text-xs mt-1">{errors.emergencyContactName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
                          errors.emergencyContactPhone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="SĐT người liên hệ"
                      />
                      {errors.emergencyContactPhone && <p className="text-red-500 text-xs mt-1">{errors.emergencyContactPhone}</p>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mối quan hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContactRelationship}
                      onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
                        errors.emergencyContactRelationship ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="VD: Vợ, Con, Anh/Chị"
                    />
                    {errors.emergencyContactRelationship && <p className="text-red-500 text-xs mt-1">{errors.emergencyContactRelationship}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Medical & Account */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Tiền sử bệnh lý (tùy chọn)</h3>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={medicalHistoryInput}
                      onChange={(e) => setMedicalHistoryInput(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="VD: Cao huyết áp, Tiểu đường..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedicalHistory())}
                    />
                    <button
                      type="button"
                      onClick={addMedicalHistory}
                      className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Thêm
                    </button>
                  </div>
                  
                  {formData.medicalHistory.length > 0 && (
                    <div className="space-y-2">
                      {formData.medicalHistory.map((condition, index) => (
                        <div key={index} className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <span className="text-yellow-800">{condition}</span>
                          <button
                            type="button"
                            onClick={() => removeMedicalHistory(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Tạo tài khoản</h3>
                  
                  <div className="space-y-4">
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
                          placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
                            errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Nhập lại mật khẩu"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                        className={`mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 ${
                          errors.agreeTerms ? 'border-red-300' : ''
                        }`}
                      />
                      <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                        Tôi đồng ý với{' '}
                        <a href="#" className="text-emerald-600 hover:underline">Điều khoản sử dụng</a>
                        {' '}và{' '}
                        <a href="#" className="text-emerald-600 hover:underline">Chính sách bảo mật</a>
                        {' '}của bệnh viện <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {errors.agreeTerms && <p className="text-red-500 text-xs">{errors.agreeTerms}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Quay lại
                </button>
              )}
              
              <div className="ml-auto">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all"
                  >
                    Tiếp tục
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Đang tạo tài khoản...</span>
                      </>
                    ) : (
                      <span>Hoàn thành đăng ký</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};