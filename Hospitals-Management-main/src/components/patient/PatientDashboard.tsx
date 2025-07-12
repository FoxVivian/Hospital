import React, { useState } from 'react';
import { Calendar, FileText, TestTube, CreditCard, User, Phone, Mail, MapPin, Heart, LogOut, Plus, Eye, Clock, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { PatientAppointmentBooking } from './PatientAppointmentBooking';
import { useDataManager } from '../../hooks/useDataManager';

interface PatientDashboardProps {
  user: any;
  onLogout: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, onLogout }) => {
  const { 
    appointments, 
    setAppointments, 
    medicalRecords, 
    labTests, 
    invoices, 
    paymentTransactions 
  } = useDataManager();

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Filter data for current patient
  const patientAppointments = appointments.filter(apt => apt.patientName === user.name);
  const patientMedicalRecords = medicalRecords.filter(record => record.patientName === user.name);
  const patientLabTests = labTests.filter(test => test.patientName === user.name);
  const patientInvoices = invoices.filter(invoice => invoice.patientName === user.name);
  const patientPayments = paymentTransactions.filter(payment => payment.patientName === user.name);

  // Get upcoming appointments
  const upcomingAppointments = patientAppointments.filter(apt => {
  const appointmentDate = new Date(apt.date);
  const today = new Date();
  const isFutureOrToday = appointmentDate.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0);
  return isFutureOrToday && apt.status !== 'cancelled';
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get recent medical records
  const recentMedicalRecords = patientMedicalRecords
    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
    .slice(0, 5);

  // Get pending lab tests
  const pendingLabTests = patientLabTests.filter(test => 
    test.status !== 'completed' && test.status !== 'cancelled'
  );

  // Get unpaid invoices
  const unpaidInvoices = patientInvoices.filter(invoice => 
    invoice.status !== 'paid' && invoice.status !== 'cancelled'
  );

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    // Refresh appointments data would happen automatically due to localStorage integration
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'scheduled': return 'Đã lên lịch';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getLabStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'sample-collected': return 'bg-yellow-100 text-yellow-800';
      case 'ordered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLabStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'in-progress': return 'Đang thực hiện';
      case 'sample-collected': return 'Đã lấy mẫu';
      case 'ordered': return 'Đã chỉ định';
      default: return status;
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvoiceStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'partial': return 'Thanh toán một phần';
      case 'pending': return 'Chờ thanh toán';
      case 'overdue': return 'Quá hạn';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MediCare</h1>
                <p className="text-sm text-gray-500">Cổng thông tin bệnh nhân</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.code}</p>
              </div>
              <img
                src={user.avatar || 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Tổng quan', icon: User },
              { id: 'appointments', label: 'Lịch hẹn', icon: Calendar },
              { id: 'medical-records', label: 'Bệnh án', icon: FileText },
              { id: 'lab-tests', label: 'Xét nghiệm', icon: TestTube },
              { id: 'billing', label: 'Thanh toán', icon: CreditCard }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Xin chào, {user.name}!</h2>
                  <p className="text-emerald-100">Chào mừng bạn đến với cổng thông tin bệnh nhân MediCare</p>
                </div>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Đặt lịch hẹn</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Lịch hẹn sắp tới</p>
                    <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Bệnh án</p>
                    <p className="text-2xl font-bold text-gray-900">{patientMedicalRecords.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">XN chờ kết quả</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingLabTests.length}</p>
                  </div>
                  <TestTube className="h-8 w-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">HĐ chưa thanh toán</p>
                    <p className="text-2xl font-bold text-gray-900">{unpaidInvoices.length}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Patient Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Mã bệnh nhân</p>
                      <p className="font-medium">{user.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Số điện thoại</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{user.email || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Trạng thái</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Đang hoạt động
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Lịch hẹn sắp tới</h3>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  Đặt lịch mới
                </button>
              </div>
              
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Bạn chưa có lịch hẹn nào sắp tới</p>
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Đặt lịch hẹn ngay
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-emerald-100 p-2 rounded-full">
                          <Calendar className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                          <p className="text-sm text-gray-600">{appointment.department}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.date).toLocaleDateString('vi-VN')} - {appointment.time}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Medical Records */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bệnh án gần đây</h3>
              
              {recentMedicalRecords.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có bệnh án nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentMedicalRecords.slice(0, 3).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{record.diagnosis}</p>
                          <p className="text-sm text-gray-600">{record.doctorName} - {record.department}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(record.visitDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        record.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status === 'completed' ? 'Hoàn thành' : 'Bản nháp'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments Section */}
        {activeSection === 'appointments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Lịch hẹn của tôi</h2>
              <button
                onClick={() => setShowBookingModal(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Đặt lịch hẹn</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {patientAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Bạn chưa có lịch hẹn nào</p>
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Đặt lịch hẹn đầu tiên
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {patientAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="bg-emerald-100 p-3 rounded-full">
                            <Calendar className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{appointment.doctorName}</h3>
                            <p className="text-gray-600">{appointment.department}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(appointment.date).toLocaleDateString('vi-VN')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{appointment.time}</span>
                              </div>
                            </div>
                            {appointment.notes && (
                              <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                            )}
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medical Records Section */}
        {activeSection === 'medical-records' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Bệnh án của tôi</h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {patientMedicalRecords.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có bệnh án nào</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {patientMedicalRecords.map((record) => (
                    <div key={record.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{record.diagnosis}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              record.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {record.status === 'completed' ? 'Hoàn thành' : 'Bản nháp'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{record.doctorName} - {record.department}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Ngày khám:</span> {new Date(record.visitDate).toLocaleDateString('vi-VN')}
                            </div>
                            <div>
                              <span className="font-medium">Lý do khám:</span> {record.chiefComplaint}
                            </div>
                          </div>
                          {record.treatment && (
                            <div className="mt-3">
                              <span className="font-medium text-gray-700">Điều trị:</span>
                              <p className="text-gray-600 mt-1">{record.treatment}</p>
                            </div>
                          )}
                          {record.prescription.length > 0 && (
                            <div className="mt-3">
                              <span className="font-medium text-gray-700">Đơn thuốc:</span>
                              <div className="mt-2 space-y-1">
                                {record.prescription.map((med, index) => (
                                  <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                                    <span className="font-medium">{med.medicineName}</span> - {med.dosage} - {med.frequency}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lab Tests Section */}
        {activeSection === 'lab-tests' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Kết quả xét nghiệm</h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {patientLabTests.length === 0 ? (
                <div className="text-center py-12">
                  <TestTube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có xét nghiệm nào</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {patientLabTests.map((test) => (
                    <div key={test.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-yellow-100 p-3 rounded-full">
                          <TestTube className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{test.testType}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${getLabStatusColor(test.status)}`}>
                              {getLabStatusText(test.status)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{test.orderedBy} - {test.department}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Ngày chỉ định:</span> {new Date(test.orderedDate).toLocaleDateString('vi-VN')}
                            </div>
                            <div>
                              <span className="font-medium">Loại mẫu:</span> {test.sampleType}
                            </div>
                          </div>
                          {test.status === 'completed' && test.results && (
                            <div className="mt-4">
                              <h4 className="font-medium text-gray-700 mb-2">Kết quả:</h4>
                              <div className="space-y-2">
                                {test.results.map((result, index) => (
                                  <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                                    <span>{result.parameter}</span>
                                    <div className="text-right">
                                      <span className="font-medium">{result.value} {result.unit}</span>
                                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                        result.status === 'normal' ? 'bg-green-100 text-green-800' :
                                        result.status === 'abnormal' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                      }`}>
                                        {result.status === 'normal' ? 'Bình thường' :
                                         result.status === 'abnormal' ? 'Bất thường' : 'Nguy hiểm'}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {test.interpretation && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <span className="font-medium text-blue-900">Kết luận:</span>
                                  <p className="text-blue-800 mt-1">{test.interpretation}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Billing Section */}
        {activeSection === 'billing' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Thanh toán & Hóa đơn</h2>

            {/* Unpaid Invoices */}
            {unpaidInvoices.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-medium text-red-800">Hóa đơn chưa thanh toán</h3>
                </div>
                <p className="text-red-700 text-sm">Bạn có {unpaidInvoices.length} hóa đơn chưa thanh toán</p>
              </div>
            )}

            {/* Invoices */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Hóa đơn</h3>
              </div>
              
              {patientInvoices.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có hóa đơn nào</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {patientInvoices.map((invoice) => (
                    <div key={invoice.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{invoice.invoiceNumber}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${getInvoiceStatusColor(invoice.status)}`}>
                              {getInvoiceStatusText(invoice.status)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Ngày tạo:</span> {new Date(invoice.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                            <div>
                              <span className="font-medium">Tổng tiền:</span> {invoice.totalAmount.toLocaleString()} VNĐ
                            </div>
                            <div>
                              <span className="font-medium">Còn lại:</span> {invoice.remainingAmount.toLocaleString()} VNĐ
                            </div>
                          </div>
                        </div>
                        {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                            Thanh toán
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Lịch sử thanh toán</h3>
              </div>
              
              {patientPayments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có giao dịch thanh toán nào</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {patientPayments.map((payment) => (
                    <div key={payment.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{payment.receiptNumber}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mt-2">
                            <div>
                              <span className="font-medium">Hóa đơn:</span> {payment.invoiceNumber}
                            </div>
                            <div>
                              <span className="font-medium">Ngày:</span> {new Date(payment.processedAt).toLocaleDateString('vi-VN')}
                            </div>
                            <div>
                              <span className="font-medium">Phương thức:</span> {
                                payment.paymentMethod === 'cash' ? 'Tiền mặt' :
                                payment.paymentMethod === 'card' ? 'Thẻ' :
                                payment.paymentMethod === 'transfer' ? 'Chuyển khoản' : 'Bảo hiểm'
                              }
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{payment.amount.toLocaleString()} VNĐ</p>
                          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Hoàn thành
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Appointment Booking Modal */}
      {showBookingModal && (
        <PatientAppointmentBooking
          user={user}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
};