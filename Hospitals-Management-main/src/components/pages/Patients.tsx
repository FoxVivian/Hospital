import React, { useState } from 'react';
import { Search, Plus, Edit, Eye, Phone, Mail, Calendar, User, X, Save } from 'lucide-react';
import { Patient } from '../../types';
import { useDataManager } from '../../hooks/useDataManager';

export const Patients: React.FC = () => {
  const { patients, setPatients } = useDataManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    phone: '',
    email: '',
    address: '',
    identityCard: '',
    insuranceId: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    medicalHistory: [] as string[],
    status: 'active' as 'active' | 'inactive'
  });

  const [medicalHistoryInput, setMedicalHistoryInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredPatients = patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const getAgeFromBirthDate = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const generatePatientCode = () => {
    const lastPatient = patients[patients.length - 1];
    const lastCode = lastPatient ? parseInt(lastPatient.code.replace('BN', '')) : 0;
    return `BN${String(lastCode + 1).padStart(3, '0')}`;
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      dateOfBirth: '',
      gender: 'male',
      phone: '',
      email: '',
      address: '',
      identityCard: '',
      insuranceId: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      },
      medicalHistory: [],
      status: 'active'
    });
    setMedicalHistoryInput('');
    setErrors({});
    setEditingPatient(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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

    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    if (!formData.identityCard.trim()) {
      newErrors.identityCard = 'CMND/CCCD là bắt buộc';
    } else if (!/^[0-9]{9,12}$/.test(formData.identityCard)) {
      newErrors.identityCard = 'CMND/CCCD không hợp lệ';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.emergencyContact.name.trim()) {
      newErrors.emergencyContactName = 'Tên người liên hệ khẩn cấp là bắt buộc';
    }

    if (!formData.emergencyContact.phone.trim()) {
      newErrors.emergencyContactPhone = 'SĐT người liên hệ khẩn cấp là bắt buộc';
    }

    if (!formData.emergencyContact.relationship.trim()) {
      newErrors.emergencyContactRelationship = 'Mối quan hệ là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingPatient) {
      // Update existing patient
      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient.id === editingPatient.id 
            ? { ...editingPatient, ...formData }
            : patient
        )
      );
    } else {
      // Add new patient
      const newPatient: Patient = {
        id: String(Date.now()),
        code: generatePatientCode(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPatients(prevPatients => [...prevPatients, newPatient]);
    }

    setShowFormModal(false);
    resetForm();
  };

  const openAddModal = () => {
    resetForm();
    setShowFormModal(true);
  };

  const openEditModal = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      fullName: patient.fullName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email || '',
      address: patient.address,
      identityCard: patient.identityCard,
      insuranceId: patient.insuranceId || '',
      emergencyContact: patient.emergencyContact,
      medicalHistory: patient.medicalHistory,
      status: patient.status
    });
    setShowFormModal(true);
  };

  const openPatientDetail = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowDetailModal(true);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Bệnh nhân</h2>
          <p className="text-gray-600">Quản lý thông tin và hồ sơ bệnh nhân</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm bệnh nhân</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã bệnh nhân hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Mã BN</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Họ tên</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Tuổi/Giới tính</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Liên hệ</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Bảo hiểm</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Trạng thái</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <span className="font-medium text-emerald-600">{patient.code}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient.fullName}</p>
                        <p className="text-sm text-gray-500">{patient.identityCard}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{getAgeFromBirthDate(patient.dateOfBirth)} tuổi</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {patient.gender === 'male' ? 'Nam' : patient.gender === 'female' ? 'Nữ' : 'Khác'}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{patient.phone}</span>
                      </div>
                      {patient.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{patient.email}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      patient.insuranceId 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {patient.insuranceId ? 'Có BHYT' : 'Không BHYT'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      patient.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {patient.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openPatientDetail(patient)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(patient)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Patient Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingPatient ? 'Chỉnh sửa thông tin bệnh nhân' : 'Thêm bệnh nhân mới'}
                </h3>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                        errors.fullName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Nhập họ và tên"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                        errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CMND/CCCD <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.identityCard}
                      onChange={(e) => setFormData({ ...formData, identityCard: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                        errors.identityCard ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Nhập số CMND/CCCD"
                    />
                    {errors.identityCard && <p className="text-red-500 text-xs mt-1">{errors.identityCard}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã BHYT
                    </label>
                    <input
                      type="text"
                      value={formData.insuranceId}
                      onChange={(e) => setFormData({ ...formData, insuranceId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="Nhập mã BHYT (nếu có)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin liên hệ</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Nhập số điện thoại"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Nhập email (tùy chọn)"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Nhập địa chỉ đầy đủ"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Liên hệ khẩn cấp</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                      })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                        errors.emergencyContactName ? 'border-red-300' : 'border-gray-300'
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
                      value={formData.emergencyContact.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                      })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                        errors.emergencyContactPhone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="SĐT người liên hệ"
                    />
                    {errors.emergencyContactPhone && <p className="text-red-500 text-xs mt-1">{errors.emergencyContactPhone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mối quan hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                      })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                        errors.emergencyContactRelationship ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="VD: Vợ, Con, Anh/Chị"
                    />
                    {errors.emergencyContactRelationship && <p className="text-red-500 text-xs mt-1">{errors.emergencyContactRelationship}</p>}
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Tiền sử bệnh lý</h4>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={medicalHistoryInput}
                      onChange={(e) => setMedicalHistoryInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="Nhập tiền sử bệnh lý (VD: Cao huyết áp, Tiểu đường...)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedicalHistory())}
                    />
                    <button
                      type="button"
                      onClick={addMedicalHistory}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingPatient ? 'Cập nhật' : 'Thêm mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Detail Modal */}
      {showDetailModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Chi tiết bệnh nhân</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Mã bệnh nhân</label>
                      <p className="text-gray-900">{selectedPatient.code}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Họ và tên</label>
                      <p className="text-gray-900">{selectedPatient.fullName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Ngày sinh</label>
                        <p className="text-gray-900">
                          {new Date(selectedPatient.dateOfBirth).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Giới tính</label>
                        <p className="text-gray-900 capitalize">
                          {selectedPatient.gender === 'male' ? 'Nam' : selectedPatient.gender === 'female' ? 'Nữ' : 'Khác'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">CMND/CCCD</label>
                      <p className="text-gray-900">{selectedPatient.identityCard}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin liên hệ</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                      <p className="text-gray-900">{selectedPatient.phone}</p>
                    </div>
                    {selectedPatient.email && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-900">{selectedPatient.email}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-600">Địa chỉ</label>
                      <p className="text-gray-900">{selectedPatient.address}</p>
                    </div>
                    {selectedPatient.insuranceId && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Mã BHYT</label>
                        <p className="text-gray-900">{selectedPatient.insuranceId}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Liên hệ khẩn cấp</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Họ tên</label>
                    <p className="text-gray-900">{selectedPatient.emergencyContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                    <p className="text-gray-900">{selectedPatient.emergencyContact.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mối quan hệ</label>
                    <p className="text-gray-900">{selectedPatient.emergencyContact.relationship}</p>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              {selectedPatient.medicalHistory.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Tiền sử bệnh lý</h4>
                  <div className="space-y-2">
                    {selectedPatient.medicalHistory.map((condition, index) => (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-800">{condition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              <button 
                onClick={() => {
                  setShowDetailModal(false);
                  openEditModal(selectedPatient);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};