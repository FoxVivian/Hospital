export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'staff' | 'pharmacist' | 'lab_technician';
  avatar?: string;
}

export interface Patient {
  id: string;
  code: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address: string;
  identityCard: string;
  insuranceId?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: 'checkup' | 'followup' | 'emergency' | 'consultation';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  visitDate: string;
  visitTime: string;
  chiefComplaint: string;
  symptoms: string;
  vitalSigns: {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    respiratoryRate: string;
    weight: string;
    height: string;
  };
  physicalExamination: string;
  diagnosis: string;
  icdCode?: string;
  treatment: string;
  prescription: Prescription[];
  labTests: string[];
  followUpDate?: string;
  followUpInstructions?: string;
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
}

export interface Medicine {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  stockQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  expiryDate: string;
  supplier: string;
  supplierId: string;
  batchNumber: string;
  location?: string;
  description?: string;
  activeIngredient?: string;
  concentration?: string;
  manufacturer?: string;
  registrationNumber?: string;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  taxCode: string;
  bankAccount?: string;
  bankName?: string;
  paymentTerms?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface StockTransaction {
  id: string;
  type: 'import' | 'export' | 'adjustment' | 'transfer';
  medicineId: string;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  unitPrice?: number;
  totalValue?: number;
  reason: string;
  supplierId?: string;
  supplierName?: string;
  expiryDate?: string;
  location?: string;
  performedBy: string;
  performedAt: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
  invoiceNumber?: string;
  referenceId?: string;
}

export interface StockAlert {
  id: string;
  medicineId: string;
  medicineName: string;
  alertType: 'low_stock' | 'expiry_warning' | 'expired' | 'out_of_stock';
  currentStock: number;
  minStock?: number;
  expiryDate?: string;
  daysToExpiry?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAddress: string;
  insuranceId?: string;
  appointmentId?: string;
  services: InvoiceItem[];
  medicines: InvoiceItem[];
  labTests: InvoiceItem[];
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  taxAmount: number;
  taxPercent: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'insurance' | 'mixed';
  status: 'draft' | 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  createdBy: string;
  createdAt: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
  insuranceCoverage?: number;
  insuranceClaimNumber?: string;
}

export interface InvoiceItem {
  id: string;
  type: 'service' | 'medicine' | 'lab_test';
  code: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  totalPrice: number;
  doctorId?: string;
  doctorName?: string;
  department?: string;
}

export interface PaymentTransaction {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'insurance';
  paymentReference?: string;
  cardNumber?: string;
  bankName?: string;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  processedBy: string;
  processedAt: string;
  notes?: string;
  receiptNumber: string;
}

export interface ServicePrice {
  id: string;
  code: string;
  name: string;
  category: string;
  department: string;
  price: number;
  insurancePrice?: number;
  description?: string;
  duration?: number;
  isActive: boolean;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceProvider {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  contractNumber: string;
  coveragePercent: number;
  maxCoverageAmount?: number;
  excludedServices: string[];
  status: 'active' | 'inactive';
  contractStartDate: string;
  contractEndDate: string;
  createdAt: string;
}

export interface LabTest {
  id: string;
  code: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  testType: string;
  testCategory: string;
  testCode: string;
  orderedBy: string;
  orderedById: string;
  department: string;
  orderedDate: string;
  orderedTime: string;
  sampleType: string;
  sampleCollectedDate?: string;
  sampleCollectedTime?: string;
  sampleCollectedBy?: string;
  priority: 'routine' | 'urgent' | 'stat';
  status: 'ordered' | 'sample-collected' | 'in-progress' | 'completed' | 'cancelled' | 'rejected';
  resultDate?: string;
  resultTime?: string;
  resultBy?: string;
  verifiedDate?: string;
  verifiedBy?: string;
  results?: LabResult[];
  normalRanges?: LabNormalRange[];
  interpretation?: string;
  technicalNotes?: string;
  clinicalNotes?: string;
  price: number;
  insurancePrice?: number;
  isUrgent: boolean;
  isCritical: boolean;
  reportUrl?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LabResult {
  id: string;
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'critical' | 'high' | 'low';
  flag?: string;
  method?: string;
  instrument?: string;
  notes?: string;
}

export interface LabNormalRange {
  parameter: string;
  minValue?: number;
  maxValue?: number;
  unit: string;
  ageGroup?: string;
  gender?: 'male' | 'female' | 'both';
  condition?: string;
}

export interface LabTestTemplate {
  id: string;
  code: string;
  name: string;
  category: string;
  department: string;
  sampleType: string;
  parameters: LabParameter[];
  price: number;
  insurancePrice?: number;
  turnaroundTime: number; // in hours
  preparationInstructions?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LabParameter {
  id: string;
  name: string;
  unit: string;
  method?: string;
  normalRanges: LabNormalRange[];
  criticalValues?: {
    low?: number;
    high?: number;
  };
  isRequired: boolean;
  order: number;
}

export interface LabWorkflow {
  id: string;
  testId: string;
  step: 'ordered' | 'sample_collection' | 'processing' | 'analysis' | 'verification' | 'reporting';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  assignedTo?: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  duration?: number; // in minutes
}

export interface LabEquipment {
  id: string;
  code: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  location: string;
  status: 'active' | 'maintenance' | 'out_of_order' | 'retired';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  calibrationDate?: string;
  nextCalibrationDate?: string;
  supportedTests: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabQualityControl {
  id: string;
  testType: string;
  controlLevel: 'low' | 'normal' | 'high';
  targetValue: number;
  measuredValue: number;
  unit: string;
  deviation: number;
  isWithinRange: boolean;
  performedBy: string;
  performedAt: string;
  equipmentId?: string;
  batchNumber?: string;
  notes?: string;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingTests: number;
  revenue: number;
  occupancyRate: number;
  avgWaitTime: number;
}