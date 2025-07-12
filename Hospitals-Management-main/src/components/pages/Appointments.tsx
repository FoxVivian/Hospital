import React, { useState } from 'react';
import { Calendar, Clock, Plus, Search, Filter, User, Stethoscope, X, Save, Edit, CheckCircle, XCircle, Eye, FileText } from 'lucide-react';
import { Appointment } from '../../types';
import { useDataManager } from '../../hooks/useDataManager';

export const Appointments: React.FC = () => {
  const { appointments, setAppointments, patients } = useDataManager();
  const [selectedDate, setSelectedDate] = useState('2025-06-19');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    doctorId: '',
    doctorName: '',
    department: '',
    date: '',
    time: '',
    type: 'checkup' as 'checkup' | 'followup' | 'emergency' | 'consultation',
    status: 'scheduled' as 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredAppointments = appointments.filter(appointment => {
    const dateMatch = appointment.date === selectedDate;
    const statusMatch = statusFilter === 'all' || appointment.status === statusFilter;
    return dateMatch && statusMatch;
  });

  const doctors = [
    { id: '1', name: 'BS. Nguyễn Văn A', department: 'Nội khoa' },
    { id: '2', name: 'BS. Lê Thị B', department: 'Sản khoa' },
    { id: '3', name: 'BS. Trần Văn C', department: 'Ngoại khoa' },
    { id: '4', name: 'BS. Phạm Thị D', department: 'Nhi khoa' },
    { id: '5', name: 'BS. Hoàng Văn E', department: 'Tim mạch' }
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:30', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30', '17:00'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'scheduled': return 'Đã lên lịch';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      case 'no-show': return 'Không đến';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'checkup': return 'Khám tổng quát';
      case 'followup': return 'Tái khám';
      case 'emergency': return 'Cấp cứu';
      case 'consultation': return 'Tư vấn';
      default: return type;
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      patientName: '',
      doctorId: '',
      doctorName: '',
      department: '',
      date: '',
      time: '',
      type: 'checkup',
      status: 'scheduled',
      notes: ''
    });
    setErrors({});
    setEditingAppointment(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Vui lòng chọn bệnh nhân';
    }

    if (!formData.doctorId) {
      newErrors.doctorId = 'Vui lòng chọn bác sĩ';
    }

    if (!formData.date) {
      newErrors.date = 'Vui lòng chọn ngày khám';
    }

    if (!formData.time) {
      newErrors.time = 'Vui lòng chọn giờ khám';
    }

    // Check for time conflicts
    const conflictingAppointment = appointments.find(apt => 
      apt.id !== editingAppointment?.id &&
      apt.doctorId === formData.doctorId &&
      apt.date === formData.date &&
      apt.time === formData.time &&
      apt.status !== 'cancelled'
    );

    if (conflictingAppointment) {
      newErrors.time = 'Bác sĩ đã có lịch hẹn vào thời gian này';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingAppointment) {
      // Update existing appointment
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === editingAppointment.id 
            ? { ...appointment, ...formData }
            : appointment
        )
      );
    } else {
      // Add new appointment
      const newAppointment: Appointment = {
        id: String(Date.now()),
        ...formData
      };
      setAppointments(prevAppointments => [...prevAppointments, newAppointment]);
    }

    setShowFormModal(false);
    resetForm();
  };

  const openAddModal = () => {
    resetForm();
    setFormData({ ...formData, date: selectedDate });
    setShowFormModal(true);
  };

  const openEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctorName,
      department: appointment.department,
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes || ''
    });
    setShowFormModal(true);
  };

  const openDetailModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setFormData({
        ...formData,
        patientId,
        patientName: patient.fullName
      });
    }
  };

  const handleDoctorSelect = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      setFormData({
        ...formData,
        doctorId,
        doctorName: doctor.name,
        department: doctor.department
      });
    }
  };

  const confirmAppointment = (appointmentId: string) => {
    setAppointments(prevAppointments => 
      prevAppointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'confirmed' as const }
          : appointment
      )
    );
  };

  const cancelAppointment = (appointmentId: string) => {
    setAppointments(prevAppointments => 
      prevAppointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'cancelled' as const }
          : appointment
      )
    );
  };

  const completeAppointment = (appointmentId: string) => {
    setAppointments(prevAppointments => 
      prevAppointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'completed' as const }
          : appointment
      )
    );
  };

  const createMedicalRecord = (appointment: Appointment) => {
    // This would typically navigate to the medical records page with the appointment data
    // For now, we'll just show an alert
    alert(`Tạo phiếu khám cho bệnh nhân: ${appointment.patientName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn</h2>
          <p className="text-gray-600">Quản lý và theo dõi lịch hẹn khám bệnh</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Đặt lịch hẹn</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày khám</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bác sĩ</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
              <option value="">Tất cả bác sĩ</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tên bệnh nhân..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng lịch hẹn</p>
              <p className="text-2xl font-bold text-gray-900">{filteredAppointments.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã xác nhận</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredAppointments.filter(a => a.status === 'confirmed').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-yellow-600">
                {filteredAppointments.filter(a => a.status === 'scheduled').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hoàn thành</p>
              <p className="text-2xl font-bold text-gray-600">
                {filteredAppointments.filter(a => a.status === 'completed').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Lịch hẹn ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
          </h3>
        </div>
        
        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không có lịch hẹn nào cho ngày này</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <User className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {appointment.patientName}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Stethoscope className="h-4 w-4" />
                          <span>{appointment.doctorName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {getTypeText(appointment.type)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{appointment.department}</p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-500 mt-1 italic">{appointment.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openDetailModal(appointment)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() => confirmAppointment(appointment.id)}
                        className="px-3 py-1 text-sm text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors"
                        title="Xác nhận"
                      >
                        Xác nhận
                      </button>
                    )}
                    
                    {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                      <>
                        <button
                          onClick={() => openEditModal(appointment)}
                          className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => cancelAppointment(appointment.id)}
                          className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
                          title="Hủy lịch"
                        >
                          Hủy
                        </button>
                      </>
                    )}
                    
                    {appointment.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => createMedicalRecord(appointment)}
                          className="px-3 py-1 text-sm text-purple-600 border border-purple-600 rounded hover:bg-purple-50 transition-colors flex items-center space-x-1"
                          title="Tạo phiếu khám"
                        >
                          <FileText className="h-3 w-3" />
                          <span>Phiếu khám</span>
                        </button>
                        <button
                          onClick={() => completeAppointment(appointment.id)}
                          className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                          title="Hoàn thành"
                        >
                          Hoàn thành
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Appointment Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingAppointment ? 'Chỉnh sửa lịch hẹn' : 'Đặt lịch hẹn mới'}
                </h3>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bệnh nhân <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.patientId}
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                    errors.patientId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn bệnh nhân</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.fullName} - {patient.code}
                    </option>
                  ))}
                </select>
                {errors.patientId && <p className="text-red-500 text-xs mt-1">{errors.patientId}</p>}
              </div>

              {/* Doctor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bác sĩ <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => handleDoctorSelect(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                    errors.doctorId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Chọn bác sĩ</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.department}
                    </option>
                  ))}
                </select>
                {errors.doctorId && <p className="text-red-500 text-xs mt-1">{errors.doctorId}</p>}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày khám <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                      errors.date ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giờ khám <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                      errors.time ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Chọn giờ khám</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                </div>
              </div>

              {/* Type and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại khám
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="checkup">Khám tổng quát</option>
                    <option value="followup">Tái khám</option>
                    <option value="emergency">Cấp cứu</option>
                    <option value="consultation">Tư vấn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="scheduled">Đã lên lịch</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Ghi chú thêm về lịch hẹn..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
                  <span>{editingAppointment ? 'Cập nhật' : 'Đặt lịch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Chi tiết lịch hẹn</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin bệnh nhân</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Họ tên</label>
                      <p className="text-gray-900">{selectedAppointment.patientName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                        {getStatusText(selectedAppointment.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin khám</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Bác sĩ</label>
                      <p className="text-gray-900">{selectedAppointment.doctorName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Khoa</label>
                      <p className="text-gray-900">{selectedAppointment.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Ngày giờ</label>
                      <p className="text-gray-900">
                        {new Date(selectedAppointment.date).toLocaleDateString('vi-VN')} - {selectedAppointment.time}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Loại khám</label>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {getTypeText(selectedAppointment.type)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Ghi chú</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedAppointment.notes}</p>
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
              {(selectedAppointment.status === 'scheduled' || selectedAppointment.status === 'confirmed') && (
                <button 
                  onClick={() => {
                    setShowDetailModal(false);
                    openEditModal(selectedAppointment);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};