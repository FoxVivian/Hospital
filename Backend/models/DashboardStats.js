import mongoose from "mongoose";
const dashboardStatsSchema = new mongoose.Schema({
  totalPatients: { type: Number, required: true },
  todayAppointments: { type: Number, required: true },
  pendingTests: { type: Number, required: true },
  revenue: { type: Number, required: true },
  occupancyRate: { type: Number, required: true },
  avgWaitTime: { type: Number, required: true }
}, {
  timestamps: true
});
const DashboardStats = mongoose.model('DashboardStats', dashboardStatsSchema);
export default DashboardStats;