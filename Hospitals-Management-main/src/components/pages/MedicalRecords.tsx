import React, { useState } from 'react';
import { FileText, Search, Plus, Eye, Edit, Save, X, User, Stethoscope, Calendar, Clock, Thermometer, Heart, Activity, Weight, Ruler, Pill, TestTube, ClipboardList } from 'lucide-react';
import { MedicalRecord, Appointment } from '../../types';
import { useDataManager } from '../../hooks/useDataManager';

export const MedicalRecords: React.FC = () => {
  const { medicalRecords, setMedicalRecords, appointments, patients, medicines } = useDataManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    symptoms: '',
    vitalSigns: {
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      weight: '',
      height: ''
    },
    physicalExamination: '',
    diagnosis: '',
    icdCode: '',
    treatment: '',
    prescription: [] as any[],
    labTests: [] as string[],
    followUpDate: '',
    followUpInstructions: '',
    status: 'draft' as 'draft' | 'completed'
  });

  const [prescriptionInput, setPrescriptionInput] = useState({
    medicineId: '',
    medicineName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    quantity: 1
  });

  const [labTestInput, setLabTestInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get confirmed appointments that don't have medical records yet
  const availableAppointments = appointments.filter(appointment => 
    appointment.status === 'confirmed' && 
    !medicalRecords.some(record => record.appointmentId === appointment.id)
  );

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      chiefComplaint: '',
      symptoms: '',
      vitalSigns: {
        temperature: '',
        bloodPressure: '',
        heartRate: '',
        respiratoryRate: '',
        weight: '',
        height: ''
      },
      physicalExamination: '',
      diagnosis: '',
      icdCode: '',
      treatment: '',
      prescription: [],
      labTests: [],
      followUpDate: '',
      followUpInstructions: '',
      status: 'draft'
    });
    setPrescriptionInput({
      medicineId: '',
      medicineName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      quantity: 1
    });
    setLabTestInput('');
    setErrors({});
    setEditingRecord(null);
    setSelectedAppointment(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.chiefComplaint.trim()) {
      newErrors.chiefComplaint = 'Lý do khám là bắt buộc';
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Chẩn đoán là bắt buộc';
    }

    if (!formData.treatment.trim()) {
      newErrors.treatment = 'Phương pháp điều trị là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingRecord) {
      // Update existing record
      setMedicalRecords(prevRecords => 
        prevRecords.map(record => 
          record.id === editingRecord.id 
            ? { 
                ...record, 
                ...formData,
                updatedAt: new Date().toISOString()
              }
            : record
        )
      );
    } else if (selectedAppointment) {
      // Create new record from appointment
      const newRecord: MedicalRecord = {
        id: String(Date.now()),
        appointmentId: selectedAppointment.id,
        patientId: selectedAppointment.patientId,
        patientName: selectedAppointment.patientName,
        doctorId: selectedAppointment.doctorId,
        doctorName: selectedAppointment.doctorName,
        department: selectedAppointment.department,
        visitDate: selectedAppointment.date,
        visitTime: selectedAppointment.time,
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setMedicalRecords(prevRecords => [...prevRecords, newRecord]);
    }

    setShowFormModal(false);
    resetForm();
  };

  const openFormFromAppointment = (appointment: Appointment) => {
    resetForm();
    setSelectedAppointment(appointment);
    setShowFormModal(true);
  };

  const openEditModal = (record: MedicalRecord) => {
    setEditingRecord(record);
    setFormData({
      chiefComplaint: record.chiefComplaint,
      symptoms: record.symptoms,
      vitalSigns: record.vitalSigns,
      physicalExamination: record.physicalExamination,
      diagnosis: record.diagnosis,
      icdCode: record.icdCode || '',
      treatment: record.treatment,
      prescription: record.prescription,
      labTests: record.labTests,
      followUpDate: record.followUpDate || '',
      followUpInstructions: record.followUpInstructions || '',
      status: record.status
    });
    setShowFormModal(true);
  };

  const openDetailModal = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const addPrescription = () => {
    if (prescriptionInput.medicineId && prescriptionInput.dosage && prescriptionInput.frequency) {
      const newPrescription = {
        id: String(Date.now()),
        ...prescriptionInput
      };
      setFormData({
        ...formData,
        prescription: [...formData.prescription, newPrescription]
      });
      setPrescriptionInput({
        medicineId: '',
        medicineName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        quantity: 1
      });
    }
  };

  const removePrescription = (index: number) => {
    setFormData({
      ...formData,
      prescription: formData.prescription.filter((_, i) => i !== index)
    });
  };

  const addLabTest = () => {
    if (labTestInput.trim()) {
      setFormData({
        ...formData,
        labTests: [...formData.labTests, labTestInput.trim()]
      });
      setLabTestInput('');
    }
  };

  const removeLabTest = (index: number) => {
    setFormData({
      ...formData,
      labTests: formData.labTests.filter((_, i) => i !== index)
    });
  };

  const handleMedicineSelect = (medicineId: string) => {
    const medicine = medicines.find(m => m.id === medicineId);
    if (medicine) {
      setPrescriptionInput({
        ...prescriptionInput,
        medicineId,
        medicineName: medicine.name
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bệnh án Điện tử</h2>
          <p className="text-gray-600">Quản lý phiếu khám và hồ sơ bệnh án</p>
        </div>
      </div>

      {/* Available Appointments for Medical Records */}
      {availableAppointments.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-medium text-blue-800">Lịch hẹn chờ tạo phiếu khám</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patientName}</p>
                    <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(appointment.date).toLocaleDateString('vi-VN')} - {appointment.time}
                    </p>
                  </div>
                  <button
                    onClick={() => openFormFromAppointment(appointment)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Tạo phiếu khám
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm theo tên bệnh nhân, bác sĩ hoặc chẩn đoán..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="draft">Bản nháp</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Medical Records List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách bệnh án</h3>
        </div>
        
        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có bệnh án nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredRecords.map((record) => (
              <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {record.patientName}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          record.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status === 'completed' ? 'Hoàn thành' : 'Bản nháp'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="font-medium text-gray-900">{record.doctorName}</p>
                          <p className="text-gray-500">{record.department}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(record.visitDate).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-gray-500">{record.visitTime}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{record.diagnosis}</p>
                          <p className="text-gray-500">Chẩn đoán</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{record.chiefComplaint}</p>
                          <p className="text-gray-500">Lý do khám</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openDetailModal(record)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(record)}
                      className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Medical Record Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editingRecord ? 'Chỉnh sửa bệnh án' : 'Tạo phiếu khám mới'}
                  </h3>
                  {selectedAppointment && (
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedAppointment.patientName} - {selectedAppointment.doctorName} - {selectedAppointment.department}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Chief Complaint & Symptoms */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lý do khám <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.chiefComplaint}
                    onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                      errors.chiefComplaint ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Mô tả lý do bệnh nhân đến khám..."
                  />
                  {errors.chiefComplaint && <p className="text-red-500 text-xs mt-1">{errors.chiefComplaint}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Triệu chứng
                  </label>
                  <textarea
                    rows={3}
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Mô tả chi tiết các triệu chứng..."
                  />
                </div>
              </div>

              {/* Vital Signs */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Dấu hiệu sinh tồn</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Thermometer className="h-4 w-4 inline mr-1" />
                      Nhiệt độ (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.vitalSigns.temperature}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, temperature: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="36.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Heart className="h-4 w-4 inline mr-1" />
                      Huyết áp (mmHg)
                    </label>
                    <input
                      type="text"
                      value={formData.vitalSigns.bloodPressure}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, bloodPressure: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="120/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Heart className="h-4 w-4 inline mr-1" />
                      Mạch (lần/phút)
                    </label>
                    <input
                      type="number"
                      value={formData.vitalSigns.heartRate}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, heartRate: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="72"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Activity className="h-4 w-4 inline mr-1" />
                      Nhịp thở (lần/phút)
                    </label>
                    <input
                      type="number"
                      value={formData.vitalSigns.respiratoryRate}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, respiratoryRate: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="16"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Weight className="h-4 w-4 inline mr-1" />
                      Cân nặng (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.vitalSigns.weight}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, weight: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Ruler className="h-4 w-4 inline mr-1" />
                      Chiều cao (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.vitalSigns.height}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, height: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="170"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Examination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Stethoscope className="h-4 w-4 inline mr-1" />
                  Khám thể lực
                </label>
                <textarea
                  rows={4}
                  value={formData.physicalExamination}
                  onChange={(e) => setFormData({ ...formData, physicalExamination: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Kết quả khám thể lực chi tiết..."
                />
              </div>

              {/* Diagnosis & Treatment */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chẩn đoán <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                      errors.diagnosis ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Chẩn đoán bệnh..."
                  />
                  {errors.diagnosis && <p className="text-red-500 text-xs mt-1">{errors.diagnosis}</p>}
                  
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã ICD-10
                    </label>
                    <input
                      type="text"
                      value={formData.icdCode}
                      onChange={(e) => setFormData({ ...formData, icdCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="VD: I10, E11..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phương pháp điều trị <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                      errors.treatment ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Phương pháp điều trị và hướng dẫn..."
                  />
                  {errors.treatment && <p className="text-red-500 text-xs mt-1">{errors.treatment}</p>}
                </div>
              </div>

              {/* Prescription */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                  <Pill className="h-5 w-5" />
                  <span>Đơn thuốc</span>
                </h4>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div>
                      <select
                        value={prescriptionInput.medicineId}
                        onChange={(e) => handleMedicineSelect(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      >
                        <option value="">Chọn thuốc</option>
                        {medicines.map(medicine => (
                          <option key={medicine.id} value={medicine.id}>
                            {medicine.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Liều dùng"
                        value={prescriptionInput.dosage}
                        onChange={(e) => setPrescriptionInput({ ...prescriptionInput, dosage: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Tần suất"
                        value={prescriptionInput.frequency}
                        onChange={(e) => setPrescriptionInput({ ...prescriptionInput, frequency: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Số lượng"
                        value={prescriptionInput.quantity}
                        onChange={(e) => setPrescriptionInput({ ...prescriptionInput, quantity: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Thời gian dùng"
                        value={prescriptionInput.duration}
                        onChange={(e) => setPrescriptionInput({ ...prescriptionInput, duration: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Hướng dẫn sử dụng"
                        value={prescriptionInput.instructions}
                        onChange={(e) => setPrescriptionInput({ ...prescriptionInput, instructions: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addPrescription}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Thêm thuốc
                  </button>
                </div>

                {formData.prescription.length > 0 && (
                  <div className="space-y-2">
                    {formData.prescription.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.medicineName}</p>
                          <p className="text-sm text-gray-600">
                            {item.dosage} - {item.frequency} - {item.duration} - SL: {item.quantity}
                          </p>
                          {item.instructions && (
                            <p className="text-sm text-gray-500 italic">{item.instructions}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removePrescription(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lab Tests */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                  <TestTube className="h-5 w-5" />
                  <span>Chỉ định xét nghiệm</span>
                </h4>
                
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={labTestInput}
                    onChange={(e) => setLabTestInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Nhập tên xét nghiệm..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLabTest())}
                  />
                  <button
                    type="button"
                    onClick={addLabTest}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Thêm
                  </button>
                </div>

                {formData.labTests.length > 0 && (
                  <div className="space-y-2">
                    {formData.labTests.map((test, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <span className="text-blue-800">{test}</span>
                        <button
                          type="button"
                          onClick={() => removeLabTest(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Follow-up */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Ngày tái khám
                  </label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'completed' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="completed">Hoàn thành</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <ClipboardList className="h-4 w-4 inline mr-1" />
                  Hướng dẫn tái khám
                </label>
                <textarea
                  rows={3}
                  value={formData.followUpInstructions}
                  onChange={(e) => setFormData({ ...formData, followUpInstructions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Hướng dẫn cho bệnh nhân về tái khám..."
                />
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
                  <span>{editingRecord ? 'Cập nhật' : 'Lưu phiếu khám'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medical Record Detail Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Chi tiết bệnh án</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Patient & Visit Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin bệnh nhân</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Họ tên</label>
                      <p className="text-gray-900">{selectedRecord.patientName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Ngày khám</label>
                      <p className="text-gray-900">
                        {new Date(selectedRecord.visitDate).toLocaleDateString('vi-VN')} - {selectedRecord.visitTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin khám</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Bác sĩ</label>
                      <p className="text-gray-900">{selectedRecord.doctorName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Khoa</label>
                      <p className="text-gray-900">{selectedRecord.department}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Information */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Lý do khám</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRecord.chiefComplaint}</p>
                </div>

                {selectedRecord.symptoms && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Triệu chứng</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRecord.symptoms}</p>
                  </div>
                )}

                {/* Vital Signs */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Dấu hiệu sinh tồn</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {selectedRecord.vitalSigns.temperature && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Nhiệt độ</p>
                        <p className="font-medium">{selectedRecord.vitalSigns.temperature}°C</p>
                      </div>
                    )}
                    {selectedRecord.vitalSigns.bloodPressure && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Huyết áp</p>
                        <p className="font-medium">{selectedRecord.vitalSigns.bloodPressure} mmHg</p>
                      </div>
                    )}
                    {selectedRecord.vitalSigns.heartRate && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Mạch</p>
                        <p className="font-medium">{selectedRecord.vitalSigns.heartRate} lần/phút</p>
                      </div>
                    )}
                    {selectedRecord.vitalSigns.respiratoryRate && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Nhịp thở</p>
                        <p className="font-medium">{selectedRecord.vitalSigns.respiratoryRate} lần/phút</p>
                      </div>
                    )}
                    {selectedRecord.vitalSigns.weight && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Cân nặng</p>
                        <p className="font-medium">{selectedRecord.vitalSigns.weight} kg</p>
                      </div>
                    )}
                    {selectedRecord.vitalSigns.height && (
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Chiều cao</p>
                        <p className="font-medium">{selectedRecord.vitalSigns.height} cm</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedRecord.physicalExamination && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Khám thể lực</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRecord.physicalExamination}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Chẩn đoán</h4>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-green-800 font-medium">{selectedRecord.diagnosis}</p>
                    {selectedRecord.icdCode && (
                      <p className="text-green-600 text-sm">Mã ICD-10: {selectedRecord.icdCode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Phương pháp điều trị</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRecord.treatment}</p>
                </div>

                {/* Prescription */}
                {selectedRecord.prescription.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Đơn thuốc</h4>
                    <div className="space-y-2">
                      {selectedRecord.prescription.map((item, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="font-medium text-blue-900">{item.medicineName}</p>
                          <p className="text-blue-700 text-sm">
                            {item.dosage} - {item.frequency} - {item.duration} - SL: {item.quantity}
                          </p>
                          {item.instructions && (
                            <p className="text-blue-600 text-sm italic">{item.instructions}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lab Tests */}
                {selectedRecord.labTests.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Chỉ định xét nghiệm</h4>
                    <div className="space-y-2">
                      {selectedRecord.labTests.map((test, index) => (
                        <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-yellow-800">{test}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up */}
                {(selectedRecord.followUpDate || selectedRecord.followUpInstructions) && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Tái khám</h4>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      {selectedRecord.followUpDate && (
                        <p className="text-purple-800">
                          <strong>Ngày tái khám:</strong> {new Date(selectedRecord.followUpDate).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                      {selectedRecord.followUpInstructions && (
                        <p className="text-purple-700 mt-2">{selectedRecord.followUpInstructions}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
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
                  openEditModal(selectedRecord);
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