// File: src/components/patient/PatientAppointmentBooking.tsx

import React, { useState } from 'react';
import { Calendar, Clock, User, Stethoscope, Plus, X, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useDataManager } from '../../hooks/useDataManager';
import { Appointment } from '../../types';

interface PatientAppointmentBookingProps {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const PatientAppointmentBooking: React.FC<PatientAppointmentBookingProps> = ({
  user,
  onClose,
  onSuccess
}) => {
  const { appointments, setAppointments } = useDataManager();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    department: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    type: 'checkup' as 'checkup' | 'followup' | 'emergency' | 'consultation',
    reason: '',
    symptoms: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for departments and doctors
  const departments = [
    { id: 'noi-khoa', name: 'Nội khoa', description: 'Khám và điều trị các bệnh nội khoa' },
    { id: 'ngoai-khoa', name: 'Ngoại khoa', description: 'Phẫu thuật và điều trị ngoại khoa' },
    { id: 'san-khoa', name: 'Sản khoa', description: 'Chăm sóc sức khỏe phụ nữ và thai sản' },
    { id: 'nhi-khoa', name: 'Nhi khoa', description: 'Khám và điều trị cho trẻ em' },
    { id: 'tim-mach', name: 'Tim mạch', description: 'Chuyên khoa tim mạch' },
    { id: 'than-kinh', name: 'Thần kinh', description: 'Chuyên khoa thần kinh' },
    { id: 'mat', name: 'Mắt', description: 'Chuyên khoa mắt' },
    { id: 'tai-mui-hong', name: 'Tai Mũi Họng', description: 'Chuyên khoa tai mũi họng' }
  ];

  const doctors = {
    'noi-khoa': [
      { id: '1', name: 'BS. Nguyễn Văn A', experience: '15 năm', specialization: 'Tiêu hóa, Gan mật' },
      { id: '2', name: 'BS. Trần Thị B', experience: '12 năm', specialization: 'Hô hấp, Phổi' },
      { id: '3', name: 'BS. Lê Văn C', experience: '10 năm', specialization: 'Thận, Tiết niệu' }
    ],
    'ngoai-khoa': [
      { id: '4', name: 'BS. Phạm Văn D', experience: '18 năm', specialization: 'Phẫu thuật tổng quát' },
      { id: '5', name: 'BS. Hoàng Thị E', experience: '14 năm', specialization: 'Phẫu thuật thẩm mỹ' }
    ],
    'san-khoa': [
      { id: '6', name: 'BS. Vũ Thị F', experience: '16 năm', specialization: 'Sản khoa, Phụ khoa' },
      { id: '7', name: 'BS. Đỗ Văn G', experience: '13 năm', specialization: 'Thai sản, Vô sinh' }
    ],
    'nhi-khoa': [
      { id: '8', name: 'BS. Bùi Thị H', experience: '11 năm', specialization: 'Nhi khoa tổng quát' },
      { id: '9', name: 'BS. Ngô Văn I', experience: '9 năm', specialization: 'Nhi tim mạch' }
    ],
    'tim-mach': [
      { id: '10', name: 'BS. Đinh Thị J', experience: '20 năm', specialization: 'Tim mạch can thiệp' },
      { id: '11', name: 'BS. Lý Văn K', experience: '17 năm', specialization: 'Siêu âm tim' }
    ],
    'than-kinh': [
      { id: '12', name: 'BS. Mai Thị L', experience: '14 năm', specialization: 'Thần kinh tổng quát' }
    ],
    'mat': [
      { id: '13', name: 'BS. Cao Văn M', experience: '12 năm', specialization: 'Khúc xạ, Cận thị' }
    ],
    'tai-mui-hong': [
      { id: '14', name: 'BS. Tô Thị N', experience: '10 năm', specialization: 'TMH tổng quát' }
    ]
  };

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    const morningSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
    const afternoonSlots = ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

    return [...morningSlots, ...afternoonSlots];
  };

  const timeSlots = generateTimeSlots();

  // Get next 30 days (excluding Sundays)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip Sundays (0 = Sunday)
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }

    return dates;
  };

  const availableDates = getAvailableDates();

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.department) {
        newErrors.department = 'Vui lòng chọn khoa khám';
      }
      if (!formData.doctorId) {
        newErrors.doctorId = 'Vui lòng chọn bác sĩ';
      }
    }

    if (step === 2) {
      if (!formData.appointmentDate) {
        newErrors.appointmentDate = 'Vui lòng chọn ngày khám';
      }
      if (!formData.appointmentTime) {
        newErrors.appointmentTime = 'Vui lòng chọn giờ khám';
      }
    }

    if (step === 3) {
      if (!formData.reason.trim()) {
        newErrors.reason = 'Vui lòng nhập lý do khám';
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

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const selectedDoctor = doctors[formData.department as keyof typeof doctors]?.find(d => d.id === formData.doctorId);
      const selectedDepartment = departments.find(d => d.id === formData.department);

      if (!selectedDoctor || !selectedDepartment) {
        throw new Error('Không tìm thấy thông tin bác sĩ hoặc khoa');
      }

      const conflictingAppointment = appointments.find(apt =>
        apt.doctorId === formData.doctorId &&
        apt.date === formData.appointmentDate &&
        apt.time === formData.appointmentTime &&
        apt.status !== 'cancelled'
      );

      if (conflictingAppointment) {
        setErrors({ general: 'Bác sĩ đã có lịch hẹn vào thời gian này. Vui lòng chọn thời gian khác.' });
        return;
      }

      const newAppointment: Appointment = {
        id: String(Date.now()),
        patientId: user.id,
        patientName: user.name,
        doctorId: formData.doctorId,
        doctorName: selectedDoctor.name,
        department: selectedDepartment.name,
        date: formData.appointmentDate,
        time: formData.appointmentTime,
        type: formData.type,
        status: 'scheduled',
        notes: [
          `Lý do khám: ${formData.reason}`,
          formData.symptoms ? `Triệu chứng: ${formData.symptoms}` : '',
          formData.notes ? `Ghi chú: ${formData.notes}` : ''
        ].filter(Boolean).join(' | ')
      };

      console.log('Creating new appointment:', newAppointment);
      console.log('Attempting to call setAppointments to save new appointment...');

      setAppointments(prevAppointments => {
          const updatedAppointments = [...prevAppointments, newAppointment];
          console.log('Updated appointments state (in memory only, localStorage might not be updated reliably):', updatedAppointments);
          return updatedAppointments;
      });

      console.log('setAppointments call initiated. Now forcing a page refresh.');

      window.location.reload();

    } catch (error) {
      console.error('Error creating appointment:', error);
      setErrors({ general: 'Có lỗi xảy ra khi đặt lịch hẹn. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedDoctor = () => {
    if (!formData.department || !formData.doctorId) return null;
    const departmentDoctors = doctors[formData.department as keyof typeof doctors] || [];
    return departmentDoctors.find(doctor => doctor.id === formData.doctorId);
  };

  const getSelectedDepartment = () => {
    return departments.find(dept => dept.id === formData.department);
  };

  const steps = [
    { number: 1, title: 'Chọn khoa & bác sĩ', description: 'Chọn khoa khám và bác sĩ phù hợp' },
    { number: 2, title: 'Chọn thời gian', description: 'Chọn ngày và giờ khám' },
    { number: 3, title: 'Thông tin khám', description: 'Nhập lý do và triệu chứng' },
    { number: 4, title: 'Xác nhận', description: 'Xem lại và xác nhận đặt lịch' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Đặt lịch hẹn khám</h2>
              <p className="text-emerald-100">Đặt lịch hẹn khám bệnh trực tuyến</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
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
                    <CheckCircle className="w-4 h-4" />
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

        {/* Content */}
        <div className="p-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Step 1: Choose Department & Doctor */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Chọn khoa khám</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {departments.map((department) => (
                    <div
                      key={department.id}
                      onClick={() => setFormData({ ...formData, department: department.id, doctorId: '' })}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.department === department.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <h4 className="font-medium text-gray-900">{department.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{department.description}</p>
                    </div>
                  ))}
                </div>
                {errors.department && <p className="text-red-500 text-sm mt-2">{errors.department}</p>}
              </div>

              {formData.department && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Chọn bác sĩ</h3>
                  <div className="space-y-3">
                    {(doctors[formData.department as keyof typeof doctors] || []).map((doctor) => (
                      <div
                        key={doctor.id}
                        onClick={() => setFormData({ ...formData, doctorId: doctor.id })}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.doctorId === doctor.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Stethoscope className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                            <p className="text-sm text-gray-600">Kinh nghiệm: {doctor.experience}</p>
                            <p className="text-sm text-blue-600">{doctor.specialization}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.doctorId && <p className="text-red-500 text-sm mt-2">{errors.doctorId}</p>}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Choose Date & Time */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Chọn ngày khám</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {availableDates.slice(0, 14).map((date) => {
                    const dateObj = new Date(date);
                    const dayName = dateObj.toLocaleDateString('vi-VN', { weekday: 'short' });
                    const dayNumber = dateObj.getDate();
                    const monthName = dateObj.toLocaleDateString('vi-VN', { month: 'short' });

                    return (
                      <div
                        key={date}
                        onClick={() => setFormData({ ...formData, appointmentDate: date, appointmentTime: '' })}
                        className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${
                          formData.appointmentDate === date
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="text-xs text-gray-500 uppercase">{dayName}</div>
                        <div className="text-lg font-medium text-gray-900">{dayNumber}</div>
                        <div className="text-xs text-gray-500">{monthName}</div>
                      </div>
                    );
                  })}
                </div>
                {errors.appointmentDate && <p className="text-red-500 text-sm mt-2">{errors.appointmentDate}</p>}
              </div>

              {formData.appointmentDate && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Chọn giờ khám</h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {timeSlots.map((time) => {
                      // Check if this time slot is already booked
                      const isBooked = appointments.some(apt =>
                        apt.doctorId === formData.doctorId &&
                        apt.date === formData.appointmentDate &&
                        apt.time === time &&
                        apt.status !== 'cancelled'
                      );

                      return (
                        <button
                          key={time}
                          onClick={() => !isBooked && setFormData({ ...formData, appointmentTime: time })}
                          disabled={isBooked}
                          className={`p-3 border-2 rounded-lg transition-all ${
                            isBooked
                              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                              : formData.appointmentTime === time
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-gray-200 hover:border-emerald-300 text-gray-700'
                          }`}
                        >
                          <Clock className="h-4 w-4 mx-auto mb-1" />
                          <div className="text-sm font-medium">{time}</div>
                          {isBooked && <div className="text-xs text-red-500">Đã đặt</div>}
                        </button>
                      );
                    })}
                  </div>
                  {errors.appointmentTime && <p className="text-red-500 text-sm mt-2">{errors.appointmentTime}</p>}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Medical Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại khám <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value="checkup">Khám tổng quát</option>
                  <option value="followup">Tái khám</option>
                  <option value="consultation">Tư vấn</option>
                  <option value="emergency">Cấp cứu</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lý do khám <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                    errors.reason ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Mô tả lý do bạn muốn khám bệnh..."
                />
                {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Triệu chứng hiện tại
                </label>
                <textarea
                  rows={4}
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Mô tả các triệu chứng bạn đang gặp phải (nếu có)..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú thêm
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Thông tin bổ sung khác (nếu có)..."
                />
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Xác nhận thông tin đặt lịch</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Thông tin bệnh nhân</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Họ tên:</span>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mã BN:</span>
                        <span className="font-medium">{user.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">SĐT:</span>
                        <span className="font-medium">{user.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Thông tin khám</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Khoa:</span>
                        <span className="font-medium">{getSelectedDepartment()?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bác sĩ:</span>
                        <span className="font-medium">{getSelectedDoctor()?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày:</span>
                        <span className="font-medium">
                          {new Date(formData.appointmentDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giờ:</span>
                        <span className="font-medium">{formData.appointmentTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loại khám:</span>
                        <span className="font-medium">
                          {formData.type === 'checkup' ? 'Khám tổng quát' :
                           formData.type === 'followup' ? 'Tái khám' :
                           formData.type === 'consultation' ? 'Tư vấn' : 'Cấp cứu'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Lý do khám</h4>
                  <p className="text-gray-700 bg-white p-3 rounded border">{formData.reason}</p>
                </div>

                {formData.symptoms && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Triệu chứng</h4>
                    <p className="text-gray-700 bg-white p-3 rounded border">{formData.symptoms}</p>
                  </div>
                )}

                {formData.notes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Ghi chú</h4>
                    <p className="text-gray-700 bg-white p-3 rounded border">{formData.notes}</p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Vui lòng đến trước giờ hẹn 15-30 phút để làm thủ tục</li>
                      <li>• Mang theo CMND/CCCD và thẻ BHYT (nếu có)</li>
                      <li>• Liên hệ hotline 1900 1234 nếu cần thay đổi lịch hẹn</li>
                      <li>• Lịch hẹn sẽ được xác nhận qua SMS trong vòng 30 phút</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Quay lại
                </button>
              )}
            </div>

            <div>
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all"
                >
                  Tiếp tục
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang đặt lịch...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Xác nhận đặt lịch</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};