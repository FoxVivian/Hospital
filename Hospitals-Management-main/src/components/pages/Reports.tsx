import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, TestTube, FileText, Download, Filter, Eye } from 'lucide-react';
import { useDataManager } from '../../hooks/useDataManager';

export const Reports: React.FC = () => {
  const { 
    patients, 
    appointments, 
    invoices, 
    labTests, 
    medicines, 
    paymentTransactions 
  } = useDataManager();

  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Calculate statistics
  const calculateStats = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Filter data by period
    const filterByPeriod = (dateString: string) => {
      const date = new Date(dateString);
      switch (selectedPeriod) {
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return date >= weekAgo;
        case 'month':
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        case 'quarter':
          const quarter = Math.floor(currentMonth / 3);
          const quarterStart = quarter * 3;
          return date.getMonth() >= quarterStart && date.getMonth() < quarterStart + 3 && date.getFullYear() === currentYear;
        case 'year':
          return date.getFullYear() === currentYear;
        default:
          return true;
      }
    };

    const filteredAppointments = appointments.filter(apt => filterByPeriod(apt.date));
    const filteredInvoices = invoices.filter(inv => filterByPeriod(inv.createdAt));
    const filteredLabTests = labTests.filter(test => filterByPeriod(test.createdAt));
    const filteredPayments = paymentTransactions.filter(payment => filterByPeriod(payment.processedAt));

    return {
      totalPatients: patients.length,
      newPatients: patients.filter(p => filterByPeriod(p.createdAt)).length,
      totalAppointments: filteredAppointments.length,
      completedAppointments: filteredAppointments.filter(apt => apt.status === 'completed').length,
      cancelledAppointments: filteredAppointments.filter(apt => apt.status === 'cancelled').length,
      totalRevenue: filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      paidRevenue: filteredInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
      pendingRevenue: filteredInvoices.reduce((sum, inv) => sum + inv.remainingAmount, 0),
      totalLabTests: filteredLabTests.length,
      completedLabTests: filteredLabTests.filter(test => test.status === 'completed').length,
      pendingLabTests: filteredLabTests.filter(test => test.status !== 'completed' && test.status !== 'cancelled').length,
      totalPayments: filteredPayments.length,
      paymentAmount: filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)
    };
  };

  const stats = calculateStats();

  // Department statistics
  const getDepartmentStats = () => {
    const departments = [...new Set(appointments.map(apt => apt.department))];
    return departments.map(dept => {
      const deptAppointments = appointments.filter(apt => apt.department === dept);
      return {
        name: dept,
        appointments: deptAppointments.length,
        completed: deptAppointments.filter(apt => apt.status === 'completed').length,
        revenue: invoices
          .filter(inv => inv.services.some(service => service.department === dept))
          .reduce((sum, inv) => sum + inv.totalAmount, 0)
      };
    });
  };

  // Medicine usage statistics
  const getMedicineStats = () => {
    const medicineUsage = new Map();
    
    invoices.forEach(invoice => {
      invoice.medicines.forEach(medicine => {
        const current = medicineUsage.get(medicine.name) || { quantity: 0, revenue: 0 };
        medicineUsage.set(medicine.name, {
          quantity: current.quantity + medicine.quantity,
          revenue: current.revenue + medicine.totalPrice
        });
      });
    });

    return Array.from(medicineUsage.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  };

  // Lab test statistics
  const getLabTestStats = () => {
    const testTypes = [...new Set(labTests.map(test => test.testType))];
    return testTypes.map(type => {
      const typeTests = labTests.filter(test => test.testType === type);
      return {
        name: type,
        total: typeTests.length,
        completed: typeTests.filter(test => test.status === 'completed').length,
        pending: typeTests.filter(test => test.status !== 'completed' && test.status !== 'cancelled').length,
        revenue: typeTests.reduce((sum, test) => sum + test.price, 0)
      };
    });
  };

  const departmentStats = getDepartmentStats();
  const medicineStats = getMedicineStats();
  const labTestStats = getLabTestStats();

  const getPeriodText = () => {
    switch (selectedPeriod) {
      case 'week': return 'tuần này';
      case 'month': return 'tháng này';
      case 'quarter': return 'quý này';
      case 'year': return 'năm này';
      default: return 'tất cả';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Báo cáo & Phân tích</h2>
          <p className="text-gray-600">Thống kê và phân tích hoạt động bệnh viện</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm này</option>
          </select>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center space-x-2 transition-colors">
            <Download className="h-4 w-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
              { id: 'financial', label: 'Tài chính', icon: DollarSign },
              { id: 'clinical', label: 'Lâm sàng', icon: TestTube },
              { id: 'operational', label: 'Vận hành', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedReport(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    selectedReport === tab.id
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
          {/* Overview Report */}
          {selectedReport === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tổng quan hoạt động {getPeriodText()}
                </h3>
                
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Tổng bệnh nhân</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.totalPatients}</p>
                        <p className="text-xs text-blue-600">+{stats.newPatients} mới</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">Lịch hẹn</p>
                        <p className="text-2xl font-bold text-green-900">{stats.totalAppointments}</p>
                        <p className="text-xs text-green-600">{stats.completedAppointments} hoàn thành</p>
                      </div>
                      <Calendar className="h-8 w-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Doanh thu</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {(stats.totalRevenue / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-xs text-purple-600">{(stats.paidRevenue / 1000000).toFixed(1)}M đã thu</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-yellow-600 font-medium">Xét nghiệm</p>
                        <p className="text-2xl font-bold text-yellow-900">{stats.totalLabTests}</p>
                        <p className="text-xs text-yellow-600">{stats.completedLabTests} hoàn thành</p>
                      </div>
                      <TestTube className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                </div>

                {/* Department Performance */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Hiệu suất theo khoa</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2">Khoa</th>
                          <th className="text-right py-2">Lịch hẹn</th>
                          <th className="text-right py-2">Hoàn thành</th>
                          <th className="text-right py-2">Doanh thu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departmentStats.map((dept, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-2 font-medium">{dept.name}</td>
                            <td className="text-right py-2">{dept.appointments}</td>
                            <td className="text-right py-2">{dept.completed}</td>
                            <td className="text-right py-2">{formatCurrency(dept.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Report */}
          {selectedReport === 'financial' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Báo cáo tài chính {getPeriodText()}
                </h3>

                {/* Revenue Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-600 mb-2">Tổng doanh thu</h4>
                    <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-600 mb-2">Đã thu</h4>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(stats.paidRevenue)}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-red-600 mb-2">Còn nợ</h4>
                    <p className="text-2xl font-bold text-red-900">{formatCurrency(stats.pendingRevenue)}</p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Phương thức thanh toán</h4>
                  <div className="space-y-3">
                    {['cash', 'card', 'transfer', 'insurance'].map(method => {
                      const methodPayments = paymentTransactions.filter(p => p.paymentMethod === method);
                      const methodAmount = methodPayments.reduce((sum, p) => sum + p.amount, 0);
                      const methodText = {
                        cash: 'Tiền mặt',
                        card: 'Thẻ',
                        transfer: 'Chuyển khoản',
                        insurance: 'Bảo hiểm'
                      }[method];
                      
                      return (
                        <div key={method} className="flex justify-between items-center">
                          <span className="text-gray-700">{methodText}</span>
                          <div className="text-right">
                            <span className="font-medium">{formatCurrency(methodAmount)}</span>
                            <span className="text-sm text-gray-500 ml-2">({methodPayments.length} giao dịch)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clinical Report */}
          {selectedReport === 'clinical' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Báo cáo lâm sàng {getPeriodText()}
                </h3>

                {/* Lab Tests Summary */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Thống kê xét nghiệm</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2">Loại xét nghiệm</th>
                          <th className="text-right py-2">Tổng số</th>
                          <th className="text-right py-2">Hoàn thành</th>
                          <th className="text-right py-2">Đang chờ</th>
                          <th className="text-right py-2">Doanh thu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labTestStats.map((test, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-2 font-medium">{test.name}</td>
                            <td className="text-right py-2">{test.total}</td>
                            <td className="text-right py-2">{test.completed}</td>
                            <td className="text-right py-2">{test.pending}</td>
                            <td className="text-right py-2">{formatCurrency(test.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Medicine Usage */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Top 10 thuốc sử dụng nhiều nhất</h4>
                  <div className="space-y-3">
                    {medicineStats.map((medicine, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-gray-900">{medicine.name}</span>
                          <span className="text-sm text-gray-500 ml-2">({medicine.quantity} đơn vị)</span>
                        </div>
                        <span className="font-medium">{formatCurrency(medicine.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Operational Report */}
          {selectedReport === 'operational' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Báo cáo vận hành {getPeriodText()}
                </h3>

                {/* Appointment Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Thống kê lịch hẹn</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng lịch hẹn:</span>
                        <span className="font-medium">{stats.totalAppointments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hoàn thành:</span>
                        <span className="font-medium text-green-600">{stats.completedAppointments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Đã hủy:</span>
                        <span className="font-medium text-red-600">{stats.cancelledAppointments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tỷ lệ hoàn thành:</span>
                        <span className="font-medium">
                          {stats.totalAppointments > 0 
                            ? ((stats.completedAppointments / stats.totalAppointments) * 100).toFixed(1)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Thống kê bệnh nhân</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng bệnh nhân:</span>
                        <span className="font-medium">{stats.totalPatients}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bệnh nhân mới:</span>
                        <span className="font-medium text-blue-600">{stats.newPatients}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Có bảo hiểm:</span>
                        <span className="font-medium">
                          {patients.filter(p => p.insuranceId).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tỷ lệ BHYT:</span>
                        <span className="font-medium">
                          {stats.totalPatients > 0 
                            ? ((patients.filter(p => p.insuranceId).length / stats.totalPatients) * 100).toFixed(1)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Alerts */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Cảnh báo tồn kho</h4>
                  <div className="space-y-3">
                    {medicines.filter(med => med.stockQuantity <= med.minStockLevel).map((medicine, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <div>
                          <span className="font-medium text-red-900">{medicine.name}</span>
                          <span className="text-sm text-red-600 ml-2">
                            (Còn {medicine.stockQuantity} {medicine.unit})
                          </span>
                        </div>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          Sắp hết
                        </span>
                      </div>
                    ))}
                    {medicines.filter(med => med.stockQuantity <= med.minStockLevel).length === 0 && (
                      <p className="text-gray-500 text-center py-4">Không có cảnh báo tồn kho</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};