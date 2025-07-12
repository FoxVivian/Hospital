import React from 'react';
import { StatCard } from '../ui/StatCard';
import { Users, Calendar, TestTube, DollarSign, Bed, Clock } from 'lucide-react';
import { useDataManager } from '../../hooks/useDataManager';

export const Dashboard: React.FC = () => {
  const { patients, appointments, labTests } = useDataManager();
  
  // Calculate dashboard statistics from actual data
  const todayAppointments = appointments.filter(apt => apt.date === '2025-06-19');
  const recentPatients = patients.slice(0, 5);
  const pendingTests = labTests.filter(test => test.status === 'in-progress');

  const stats = {
    totalPatients: patients.length,
    todayAppointments: todayAppointments.length,
    pendingTests: pendingTests.length,
    revenue: 45600000, 
    occupancyRate: 78, 
    avgWaitTime: 25 
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Tổng số bệnh nhân"
          value={stats.totalPatients.toLocaleString()}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Lịch hẹn hôm nay"
          value={stats.todayAppointments}
          icon={Calendar}
          color="green"
        />
        <StatCard
          title="Xét nghiệm chờ"
          value={stats.pendingTests}
          icon={TestTube}
          color="yellow"
        />
        <StatCard
          title="Doanh thu tháng"
          value={`${(stats.revenue / 1000000).toFixed(1)}M VNĐ`}
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Tỷ lệ lấp đầy"
          value={`${stats.occupancyRate}%`}
          icon={Bed}
          color="purple"
        />
        <StatCard
          title="Thời gian chờ TB"
          value={`${stats.avgWaitTime} phút`}
          icon={Clock}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Lịch hẹn hôm nay</h3>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {todayAppointments.length} lịch hẹn
            </span>
          </div>
          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{appointment.patientName}</p>
                  <p className="text-sm text-gray-600">{appointment.doctorName} - {appointment.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status === 'confirmed' ? 'Đã xác nhận' : 'Đã lên lịch'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Bệnh nhân mới</h3>
            <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {recentPatients.length} bệnh nhân
            </span>
          </div>
          <div className="space-y-3">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{patient.fullName}</p>
                  <p className="text-sm text-gray-600">{patient.code} - {patient.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(patient.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Đang hoạt động
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Tests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Xét nghiệm đang chờ</h3>
          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {pendingTests.length} xét nghiệm
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-600">Bệnh nhân</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Loại xét nghiệm</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Bác sĩ chỉ định</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Ngày chỉ định</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {pendingTests.map((test) => (
                <tr key={test.id} className="border-b border-gray-100">
                  <td className="py-3 px-2 font-medium text-gray-900">{test.patientName}</td>
                  <td className="py-3 px-2 text-gray-600">{test.testType}</td>
                  <td className="py-3 px-2 text-gray-600">{test.orderedBy}</td>
                  <td className="py-3 px-2 text-gray-600">
                    {new Date(test.orderedDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-3 px-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Đang thực hiện
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};