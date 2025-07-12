import { Patient, Appointment, Medicine, Invoice, LabTest, DashboardStats, MedicalRecord, Supplier, StockTransaction, StockAlert, PaymentTransaction, ServicePrice, InsuranceProvider, LabTestTemplate, LabParameter, LabNormalRange, LabWorkflow, LabEquipment, LabQualityControl } from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    code: 'BN001',
    fullName: 'Nguyễn Văn Nam',
    dateOfBirth: '1985-03-15',
    gender: 'male',
    phone: '0901234567',
    email: 'nam.nguyen@email.com',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    identityCard: '025123456789',
    insuranceId: 'HS4010012345678',
    emergencyContact: {
      name: 'Nguyễn Thị Lan',
      phone: '0907654321',
      relationship: 'Vợ'
    },
    medicalHistory: ['Cao huyết áp', 'Tiểu đường type 2'],
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    code: 'BN002',
    fullName: 'Trần Thị Mai',
    dateOfBirth: '1990-07-22',
    gender: 'female',
    phone: '0912345678',
    address: '456 Đường Nguyễn Huệ, Quận 3, TP.HCM',
    identityCard: '025987654321',
    emergencyContact: {
      name: 'Trần Văn Hùng',
      phone: '0908765432',
      relationship: 'Chồng'
    },
    medicalHistory: [],
    status: 'active',
    createdAt: '2024-02-01'
  },
  {
    id: '3',
    code: 'BN003',
    fullName: 'Lê Văn Hùng',
    dateOfBirth: '1978-11-08',
    gender: 'male',
    phone: '0923456789',
    address: '789 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM',
    identityCard: '025111222333',
    insuranceId: 'HS4010087654321',
    emergencyContact: {
      name: 'Lê Thị Hương',
      phone: '0934567890',
      relationship: 'Vợ'
    },
    medicalHistory: ['Dạ dày'],
    status: 'active',
    createdAt: '2024-03-10'
  },
  {
    id: '4',
    code: 'BN004',
    fullName: 'Phạm Thị Hoa',
    dateOfBirth: '1995-12-03',
    gender: 'female',
    phone: '0934567890',
    address: '321 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
    identityCard: '025444555666',
    emergencyContact: {
      name: 'Phạm Văn Tùng',
      phone: '0945678901',
      relationship: 'Anh trai'
    },
    medicalHistory: [],
    status: 'active',
    createdAt: '2024-04-20'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Nguyễn Văn Nam',
    doctorId: '1',
    doctorName: 'BS. Nguyễn Văn A',
    department: 'Nội khoa',
    date: '2024-12-31',
    time: '09:00',
    type: 'checkup',
    status: 'scheduled',
    notes: 'Khám định kỳ'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Trần Thị Mai',
    doctorId: '2',
    doctorName: 'BS. Lê Thị B',
    department: 'Sản khoa',
    date: '2024-12-31',
    time: '10:30',
    type: 'followup',
    status: 'confirmed'
  }
];

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    appointmentId: '1',
    patientId: '1',
    patientName: 'Nguyễn Văn Nam',
    doctorId: '1',
    doctorName: 'BS. Nguyễn Văn A',
    department: 'Nội khoa',
    visitDate: '2024-12-30',
    visitTime: '09:00',
    chiefComplaint: 'Đau đầu, chóng mặt',
    symptoms: 'Bệnh nhân than phiền đau đầu kéo dài 3 ngày, kèm theo chóng mặt nhẹ',
    vitalSigns: {
      temperature: '37.2',
      bloodPressure: '140/90',
      heartRate: '85',
      respiratoryRate: '18',
      weight: '70',
      height: '170'
    },
    physicalExamination: 'Tim phổi bình thường, huyết áp cao',
    diagnosis: 'Tăng huyết áp nguyên phát',
    icdCode: 'I10',
    treatment: 'Thuốc hạ huyết áp, chế độ ăn ít muối',
    prescription: [
      {
        id: '1',
        medicineId: '1',
        medicineName: 'Amlodipine 5mg',
        dosage: '5mg',
        frequency: '1 lần/ngày',
        duration: '30 ngày',
        instructions: 'Uống sau ăn sáng',
        quantity: 30
      }
    ],
    labTests: ['Xét nghiệm máu tổng quát', 'Đo điện tim'],
    followUpDate: '2025-01-30',
    followUpInstructions: 'Tái khám sau 1 tháng, theo dõi huyết áp tại nhà',
    status: 'completed',
    createdAt: '2024-12-30T09:00:00Z',
    updatedAt: '2024-12-30T10:30:00Z'
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    code: 'NCC001',
    name: 'Công ty Dược phẩm ABC',
    contactPerson: 'Nguyễn Văn Tùng',
    phone: '0283456789',
    email: 'contact@abc-pharma.vn',
    address: '123 Đường Pasteur, Quận 1, TP.HCM',
    taxCode: '0123456789',
    bankAccount: '1234567890',
    bankName: 'Vietcombank',
    paymentTerms: '30 ngày',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    code: 'NCC002',
    name: 'Công ty Dược phẩm XYZ',
    contactPerson: 'Trần Thị Hoa',
    phone: '0287654321',
    email: 'info@xyz-pharma.vn',
    address: '456 Đường Võ Văn Tần, Quận 3, TP.HCM',
    taxCode: '0987654321',
    bankAccount: '0987654321',
    bankName: 'Techcombank',
    paymentTerms: '15 ngày',
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    code: 'NCC003',
    name: 'Công ty TNHH Dược Việt',
    contactPerson: 'Lê Văn Minh',
    phone: '0281234567',
    email: 'sales@duocviet.com.vn',
    address: '789 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM',
    taxCode: '0456789123',
    status: 'active',
    createdAt: '2024-02-01'
  }
];

export const mockMedicines: Medicine[] = [
  {
    id: '1',
    code: 'MED001',
    name: 'Paracetamol 500mg',
    category: 'Giảm đau, hạ sốt',
    unit: 'Viên',
    price: 500,
    stockQuantity: 1200,
    minStockLevel: 100,
    maxStockLevel: 2000,
    expiryDate: '2025-12-31',
    supplier: 'Công ty Dược phẩm ABC',
    supplierId: '1',
    batchNumber: 'PA240101',
    location: 'Kệ A1-01',
    description: 'Thuốc giảm đau, hạ sốt',
    activeIngredient: 'Paracetamol',
    concentration: '500mg',
    manufacturer: 'Công ty Dược phẩm ABC',
    registrationNumber: 'VD-12345-18',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-12-30'
  },
  {
    id: '2',
    code: 'MED002',
    name: 'Amoxicillin 250mg',
    category: 'Kháng sinh',
    unit: 'Viên',
    price: 1200,
    stockQuantity: 45,
    minStockLevel: 50,
    maxStockLevel: 500,
    expiryDate: '2025-06-30',
    supplier: 'Công ty Dược phẩm XYZ',
    supplierId: '2',
    batchNumber: 'AM240205',
    location: 'Kệ B2-03',
    description: 'Kháng sinh nhóm Penicillin',
    activeIngredient: 'Amoxicillin',
    concentration: '250mg',
    manufacturer: 'Công ty Dược phẩm XYZ',
    registrationNumber: 'VD-67890-19',
    status: 'active',
    createdAt: '2024-02-05',
    updatedAt: '2024-12-30'
  },
  {
    id: '3',
    code: 'MED003',
    name: 'Amlodipine 5mg',
    category: 'Tim mạch',
    unit: 'Viên',
    price: 2000,
    stockQuantity: 200,
    minStockLevel: 50,
    maxStockLevel: 300,
    expiryDate: '2025-08-31',
    supplier: 'Công ty Dược phẩm ABC',
    supplierId: '1',
    batchNumber: 'AM240301',
    location: 'Kệ C1-05',
    description: 'Thuốc hạ huyết áp',
    activeIngredient: 'Amlodipine besylate',
    concentration: '5mg',
    manufacturer: 'Công ty Dược phẩm ABC',
    registrationNumber: 'VD-11111-20',
    status: 'active',
    createdAt: '2024-03-01',
    updatedAt: '2024-12-30'
  },
  {
    id: '4',
    code: 'MED004',
    name: 'Vitamin C 1000mg',
    category: 'Vitamin & Khoáng chất',
    unit: 'Viên',
    price: 800,
    stockQuantity: 15,
    minStockLevel: 30,
    maxStockLevel: 200,
    expiryDate: '2025-03-15',
    supplier: 'Công ty TNHH Dược Việt',
    supplierId: '3',
    batchNumber: 'VC240115',
    location: 'Kệ D1-02',
    description: 'Bổ sung Vitamin C',
    activeIngredient: 'Ascorbic acid',
    concentration: '1000mg',
    manufacturer: 'Công ty TNHH Dược Việt',
    registrationNumber: 'VD-22222-21',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-12-30'
  },
  {
    id: '5',
    code: 'MED005',
    name: 'Aspirin 100mg',
    category: 'Tim mạch',
    unit: 'Viên',
    price: 300,
    stockQuantity: 0,
    minStockLevel: 100,
    maxStockLevel: 500,
    expiryDate: '2025-01-10',
    supplier: 'Công ty Dược phẩm XYZ',
    supplierId: '2',
    batchNumber: 'AS240110',
    location: 'Kệ C2-01',
    description: 'Thuốc chống đông máu',
    activeIngredient: 'Acetylsalicylic acid',
    concentration: '100mg',
    manufacturer: 'Công ty Dược phẩm XYZ',
    registrationNumber: 'VD-33333-18',
    status: 'active',
    createdAt: '2024-01-10',
    updatedAt: '2024-12-30'
  }
];

export const mockStockTransactions: StockTransaction[] = [
  {
    id: '1',
    type: 'import',
    medicineId: '1',
    medicineName: 'Paracetamol 500mg',
    batchNumber: 'PA240101',
    quantity: 500,
    unitPrice: 450,
    totalValue: 225000,
    reason: 'Nhập kho định kỳ',
    supplierId: '1',
    supplierName: 'Công ty Dược phẩm ABC',
    expiryDate: '2025-12-31',
    location: 'Kệ A1-01',
    performedBy: 'Dược sĩ Nguyễn Thị Lan',
    performedAt: '2024-12-28T08:30:00Z',
    notes: 'Nhập theo hợp đồng tháng 12',
    status: 'completed',
    invoiceNumber: 'HD001-2024'
  },
  {
    id: '2',
    type: 'export',
    medicineId: '2',
    medicineName: 'Amoxicillin 250mg',
    batchNumber: 'AM240205',
    quantity: 20,
    reason: 'Cấp phát theo đơn thuốc',
    performedBy: 'Dược sĩ Trần Văn Minh',
    performedAt: '2024-12-30T14:15:00Z',
    notes: 'Đơn thuốc BN001',
    status: 'completed',
    referenceId: 'DT001'
  },
  {
    id: '3',
    type: 'import',
    medicineId: '4',
    medicineName: 'Vitamin C 1000mg',
    batchNumber: 'VC240115',
    quantity: 100,
    unitPrice: 700,
    totalValue: 70000,
    reason: 'Bổ sung tồn kho',
    supplierId: '3',
    supplierName: 'Công ty TNHH Dược Việt',
    expiryDate: '2025-03-15',
    location: 'Kệ D1-02',
    performedBy: 'Dược sĩ Nguyễn Thị Lan',
    performedAt: '2024-12-29T10:00:00Z',
    status: 'completed',
    invoiceNumber: 'HD002-2024'
  }
];

export const mockStockAlerts: StockAlert[] = [
  {
    id: '1',
    medicineId: '2',
    medicineName: 'Amoxicillin 250mg',
    alertType: 'low_stock',
    currentStock: 45,
    minStock: 50,
    severity: 'medium',
    isRead: false,
    createdAt: '2024-12-30T15:00:00Z'
  },
  {
    id: '2',
    medicineId: '4',
    medicineName: 'Vitamin C 1000mg',
    alertType: 'low_stock',
    currentStock: 15,
    minStock: 30,
    severity: 'high',
    isRead: false,
    createdAt: '2024-12-30T16:00:00Z'
  },
  {
    id: '3',
    medicineId: '5',
    medicineName: 'Aspirin 100mg',
    alertType: 'out_of_stock',
    currentStock: 0,
    minStock: 100,
    severity: 'critical',
    isRead: false,
    createdAt: '2024-12-30T17:00:00Z'
  },
  {
    id: '4',
    medicineId: '5',
    medicineName: 'Aspirin 100mg',
    alertType: 'expiry_warning',
    currentStock: 0,
    expiryDate: '2025-01-10',
    daysToExpiry: 11,
    severity: 'medium',
    isRead: true,
    createdAt: '2024-12-30T18:00:00Z'
  }
];

export const mockServicePrices: ServicePrice[] = [
  {
    id: '1',
    code: 'SV001',
    name: 'Khám nội khoa',
    category: 'Khám bệnh',
    department: 'Nội khoa',
    price: 200000,
    insurancePrice: 150000,
    description: 'Khám bệnh nội khoa tổng quát',
    duration: 30,
    isActive: true,
    effectiveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    code: 'SV002',
    name: 'Khám sản khoa',
    category: 'Khám bệnh',
    department: 'Sản khoa',
    price: 250000,
    insurancePrice: 200000,
    description: 'Khám bệnh sản khoa',
    duration: 45,
    isActive: true,
    effectiveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    code: 'XN001',
    name: 'Xét nghiệm máu tổng quát',
    category: 'Xét nghiệm',
    department: 'Xét nghiệm',
    price: 150000,
    insurancePrice: 120000,
    description: 'Xét nghiệm công thức máu',
    isActive: true,
    effectiveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '4',
    code: 'XN002',
    name: 'Xét nghiệm nước tiểu',
    category: 'Xét nghiệm',
    department: 'Xét nghiệm',
    price: 80000,
    insurancePrice: 60000,
    description: 'Xét nghiệm tổng quát nước tiểu',
    isActive: true,
    effectiveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '5',
    code: 'CLS001',
    name: 'Chụp X-quang ngực',
    category: 'Chẩn đoán hình ảnh',
    department: 'Chẩn đoán hình ảnh',
    price: 300000,
    insurancePrice: 250000,
    description: 'Chụp X-quang ngực thẳng',
    isActive: true,
    effectiveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

export const mockInsuranceProviders: InsuranceProvider[] = [
  {
    id: '1',
    code: 'BHXH',
    name: 'Bảo hiểm Xã hội Việt Nam',
    contactPerson: 'Nguyễn Văn Thành',
    phone: '0281234567',
    email: 'contact@baohiemxahoi.gov.vn',
    address: 'Số 170 Đường Đề Thám, Quận 1, TP.HCM',
    contractNumber: 'HĐ-BHXH-2024-001',
    coveragePercent: 80,
    maxCoverageAmount: 50000000,
    excludedServices: [],
    status: 'active',
    contractStartDate: '2024-01-01',
    contractEndDate: '2024-12-31',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    code: 'BHTN',
    name: 'Bảo hiểm Bảo Việt',
    contactPerson: 'Trần Thị Hương',
    phone: '0287654321',
    email: 'healthcare@baoviet.com.vn',
    address: 'Số 8 Lê Thánh Tôn, Quận 1, TP.HCM',
    contractNumber: 'HĐ-BV-2024-002',
    coveragePercent: 70,
    maxCoverageAmount: 100000000,
    excludedServices: ['Thẩm mỹ', 'Điều trị không cần thiết'],
    status: 'active',
    contractStartDate: '2024-01-01',
    contractEndDate: '2024-12-31',
    createdAt: '2024-01-01'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'HD2024-001',
    patientId: '1',
    patientName: 'Nguyễn Văn Nam',
    patientPhone: '0901234567',
    patientAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    insuranceId: 'HS4010012345678',
    appointmentId: '1',
    services: [
      { 
        id: '1', 
        type: 'service',
        code: 'SV001',
        name: 'Khám nội khoa', 
        description: 'Khám bệnh nội khoa tổng quát',
        quantity: 1, 
        unitPrice: 200000, 
        discountPercent: 0,
        discountAmount: 0,
        totalPrice: 200000,
        doctorId: '1',
        doctorName: 'BS. Nguyễn Văn A',
        department: 'Nội khoa'
      }
    ],
    medicines: [
      { 
        id: '2', 
        type: 'medicine',
        code: 'MED003',
        name: 'Amlodipine 5mg', 
        description: 'Thuốc hạ huyết áp',
        quantity: 30, 
        unitPrice: 2000, 
        discountPercent: 0,
        discountAmount: 0,
        totalPrice: 60000
      }
    ],
    labTests: [
      { 
        id: '3', 
        type: 'lab_test',
        code: 'XN001',
        name: 'Xét nghiệm máu tổng quát', 
        description: 'Xét nghiệm công thức máu',
        quantity: 1, 
        unitPrice: 150000, 
        discountPercent: 0,
        discountAmount: 0,
        totalPrice: 150000
      }
    ],
    subtotal: 410000,
    discountAmount: 0,
    discountPercent: 0,
    taxAmount: 0,
    taxPercent: 0,
    totalAmount: 410000,
    paidAmount: 410000,
    remainingAmount: 0,
    paymentMethod: 'insurance',
    status: 'paid',
    createdBy: 'Thu ngân Nguyễn Thị Lan',
    createdAt: '2024-12-30',
    dueDate: '2024-12-30',
    paidDate: '2024-12-30',
    insuranceCoverage: 328000,
    insuranceClaimNumber: 'BH2024-001'
  },
  {
    id: '2',
    invoiceNumber: 'HD2024-002',
    patientId: '2',
    patientName: 'Trần Thị Mai',
    patientPhone: '0912345678',
    patientAddress: '456 Đường Nguyễn Huệ, Quận 3, TP.HCM',
    services: [
      { 
        id: '4', 
        type: 'service',
        code: 'SV002',
        name: 'Khám sản khoa', 
        description: 'Khám bệnh sản khoa',
        quantity: 1, 
        unitPrice: 250000, 
        discountPercent: 10,
        discountAmount: 25000,
        totalPrice: 225000,
        doctorId: '2',
        doctorName: 'BS. Lê Thị B',
        department: 'Sản khoa'
      }
    ],
    medicines: [],
    labTests: [
      { 
        id: '5', 
        type: 'lab_test',
        code: 'XN002',
        name: 'Xét nghiệm nước tiểu', 
        description: 'Xét nghiệm tổng quát nước tiểu',
        quantity: 1, 
        unitPrice: 80000, 
        discountPercent: 0,
        discountAmount: 0,
        totalPrice: 80000
      }
    ],
    subtotal: 330000,
    discountAmount: 25000,
    discountPercent: 7.6,
    taxAmount: 0,
    taxPercent: 0,
    totalAmount: 305000,
    paidAmount: 150000,
    remainingAmount: 155000,
    paymentMethod: 'partial',
    status: 'partial',
    createdBy: 'Thu ngân Trần Văn Minh',
    createdAt: '2024-12-29',
    dueDate: '2025-01-05',
    notes: 'Bệnh nhân thanh toán một phần, hẹn thanh toán phần còn lại'
  },
  {
    id: '3',
    invoiceNumber: 'HD2024-003',
    patientId: '3',
    patientName: 'Lê Văn Hùng',
    patientPhone: '0923456789',
    patientAddress: '789 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM',
    insuranceId: 'HS4010087654321',
    services: [
      { 
        id: '6', 
        type: 'service',
        code: 'SV001',
        name: 'Khám nội khoa', 
        description: 'Khám bệnh nội khoa tổng quát',
        quantity: 1, 
        unitPrice: 200000, 
        discountPercent: 0,
        discountAmount: 0,
        totalPrice: 200000,
        doctorId: '1',
        doctorName: 'BS. Nguyễn Văn A',
        department: 'Nội khoa'
      }
    ],
    medicines: [
      { 
        id: '7', 
        type: 'medicine',
        code: 'MED001',
        name: 'Paracetamol 500mg', 
        description: 'Thuốc giảm đau, hạ sốt',
        quantity: 20, 
        unitPrice: 500, 
        discountPercent: 0,
        discountAmount: 0,
        totalPrice: 10000
      }
    ],
    labTests: [
      { 
        id: '8', 
        type: 'lab_test',
        code: 'CLS001',
        name: 'Chụp X-quang ngực', 
        description: 'Chụp X-quang ngực thẳng',
        quantity: 1, 
        unitPrice: 300000, 
        discountPercent: 0,
        discountAmount: 0,
        totalPrice: 300000
      }
    ],
    subtotal: 510000,
    discountAmount: 0,
    discountPercent: 0,
    taxAmount: 0,
    taxPercent: 0,
    totalAmount: 510000,
    paidAmount: 0,
    remainingAmount: 510000,
    paymentMethod: 'pending',
    status: 'pending',
    createdBy: 'Thu ngân Nguyễn Thị Lan',
    createdAt: '2024-12-31',
    dueDate: '2025-01-07',
    insuranceCoverage: 408000,
    insuranceClaimNumber: 'BH2024-003'
  }
];

export const mockPaymentTransactions: PaymentTransaction[] = [
  {
    id: '1',
    invoiceId: '1',
    invoiceNumber: 'HD2024-001',
    patientId: '1',
    patientName: 'Nguyễn Văn Nam',
    amount: 82000,
    paymentMethod: 'cash',
    status: 'completed',
    processedBy: 'Thu ngân Nguyễn Thị Lan',
    processedAt: '2024-12-30T10:30:00Z',
    notes: 'Thanh toán phần tự trả sau bảo hiểm',
    receiptNumber: 'BT2024-001'
  },
  {
    id: '2',
    invoiceId: '2',
    invoiceNumber: 'HD2024-002',
    patientId: '2',
    patientName: 'Trần Thị Mai',
    amount: 150000,
    paymentMethod: 'card',
    cardNumber: '**** **** **** 1234',
    bankName: 'Vietcombank',
    transactionId: 'VCB20241229001',
    status: 'completed',
    processedBy: 'Thu ngân Trần Văn Minh',
    processedAt: '2024-12-29T15:45:00Z',
    notes: 'Thanh toán một phần bằng thẻ',
    receiptNumber: 'BT2024-002'
  },
  {
    id: '3',
    invoiceId: '1',
    invoiceNumber: 'HD2024-001',
    patientId: '1',
    patientName: 'Nguyễn Văn Nam',
    amount: 328000,
    paymentMethod: 'insurance',
    paymentReference: 'BH2024-001',
    status: 'completed',
    processedBy: 'Thu ngân Nguyễn Thị Lan',
    processedAt: '2024-12-30T10:30:00Z',
    notes: 'Thanh toán qua bảo hiểm xã hội',
    receiptNumber: 'BT2024-003'
  }
];

export const mockLabTestTemplates: LabTestTemplate[] = [
  {
    id: '1',
    code: 'CBC',
    name: 'Công thức máu toàn phần',
    category: 'Huyết học',
    department: 'Xét nghiệm',
    sampleType: 'Máu tĩnh mạch',
    parameters: [
      {
        id: '1',
        name: 'Hồng cầu (RBC)',
        unit: '10^12/L',
        normalRanges: [
          { parameter: 'Hồng cầu (RBC)', minValue: 4.5, maxValue: 5.5, unit: '10^12/L', gender: 'male' },
          { parameter: 'Hồng cầu (RBC)', minValue: 4.0, maxValue: 5.0, unit: '10^12/L', gender: 'female' }
        ],
        criticalValues: { low: 2.5, high: 7.0 },
        isRequired: true,
        order: 1
      },
      {
        id: '2',
        name: 'Bạch cầu (WBC)',
        unit: '10^9/L',
        normalRanges: [
          { parameter: 'Bạch cầu (WBC)', minValue: 4.0, maxValue: 10.0, unit: '10^9/L', gender: 'both' }
        ],
        criticalValues: { low: 2.0, high: 30.0 },
        isRequired: true,
        order: 2
      },
      {
        id: '3',
        name: 'Tiểu cầu (PLT)',
        unit: '10^9/L',
        normalRanges: [
          { parameter: 'Tiểu cầu (PLT)', minValue: 150, maxValue: 450, unit: '10^9/L', gender: 'both' }
        ],
        criticalValues: { low: 50, high: 1000 },
        isRequired: true,
        order: 3
      },
      {
        id: '4',
        name: 'Hemoglobin (Hb)',
        unit: 'g/L',
        normalRanges: [
          { parameter: 'Hemoglobin (Hb)', minValue: 130, maxValue: 170, unit: 'g/L', gender: 'male' },
          { parameter: 'Hemoglobin (Hb)', minValue: 120, maxValue: 150, unit: 'g/L', gender: 'female' }
        ],
        criticalValues: { low: 70, high: 200 },
        isRequired: true,
        order: 4
      },
      {
        id: '5',
        name: 'Hematocrit (Hct)',
        unit: '%',
        normalRanges: [
          { parameter: 'Hematocrit (Hct)', minValue: 40, maxValue: 50, unit: '%', gender: 'male' },
          { parameter: 'Hematocrit (Hct)', minValue: 36, maxValue: 46, unit: '%', gender: 'female' }
        ],
        isRequired: true,
        order: 5
      }
    ],
    price: 150000,
    insurancePrice: 120000,
    turnaroundTime: 2,
    preparationInstructions: 'Không cần nhịn ăn',
    description: 'Xét nghiệm đánh giá tình trạng máu tổng quát',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    code: 'URINE',
    name: 'Tổng phân tích nước tiểu',
    category: 'Sinh hóa nước tiểu',
    department: 'Xét nghiệm',
    sampleType: 'Nước tiểu',
    parameters: [
      {
        id: '6',
        name: 'Protein',
        unit: 'mg/dL',
        normalRanges: [
          { parameter: 'Protein', minValue: 0, maxValue: 15, unit: 'mg/dL', gender: 'both' }
        ],
        isRequired: true,
        order: 1
      },
      {
        id: '7',
        name: 'Glucose',
        unit: 'mg/dL',
        normalRanges: [
          { parameter: 'Glucose', minValue: 0, maxValue: 15, unit: 'mg/dL', gender: 'both' }
        ],
        isRequired: true,
        order: 2
      },
      {
        id: '8',
        name: 'Ketones',
        unit: 'mg/dL',
        normalRanges: [
          { parameter: 'Ketones', minValue: 0, maxValue: 5, unit: 'mg/dL', gender: 'both' }
        ],
        isRequired: true,
        order: 3
      }
    ],
    price: 80000,
    insurancePrice: 60000,
    turnaroundTime: 1,
    preparationInstructions: 'Lấy nước tiểu giữa dòng, buổi sáng',
    description: 'Xét nghiệm tổng quát nước tiểu',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    code: 'LIPID',
    name: 'Lipid máu',
    category: 'Sinh hóa máu',
    department: 'Xét nghiệm',
    sampleType: 'Máu tĩnh mạch',
    parameters: [
      {
        id: '9',
        name: 'Cholesterol toàn phần',
        unit: 'mg/dL',
        normalRanges: [
          { parameter: 'Cholesterol toàn phần', minValue: 0, maxValue: 200, unit: 'mg/dL', gender: 'both' }
        ],
        criticalValues: { high: 300 },
        isRequired: true,
        order: 1
      },
      {
        id: '10',
        name: 'HDL-Cholesterol',
        unit: 'mg/dL',
        normalRanges: [
          { parameter: 'HDL-Cholesterol', minValue: 40, maxValue: 999, unit: 'mg/dL', gender: 'male' },
          { parameter: 'HDL-Cholesterol', minValue: 50, maxValue: 999, unit: 'mg/dL', gender: 'female' }
        ],
        isRequired: true,
        order: 2
      },
      {
        id: '11',
        name: 'LDL-Cholesterol',
        unit: 'mg/dL',
        normalRanges: [
          { parameter: 'LDL-Cholesterol', minValue: 0, maxValue: 100, unit: 'mg/dL', gender: 'both' }
        ],
        criticalValues: { high: 190 },
        isRequired: true,
        order: 3
      },
      {
        id: '12',
        name: 'Triglycerides',
        unit: 'mg/dL',
        normalRanges: [
          { parameter: 'Triglycerides', minValue: 0, maxValue: 150, unit: 'mg/dL', gender: 'both' }
        ],
        criticalValues: { high: 500 },
        isRequired: true,
        order: 4
      }
    ],
    price: 200000,
    insurancePrice: 160000,
    turnaroundTime: 4,
    preparationInstructions: 'Nhịn ăn 12 giờ trước khi lấy máu',
    description: 'Xét nghiệm mỡ máu đánh giá nguy cơ tim mạch',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '4',
    code: 'GLUCOSE',
    name: 'Glucose máu lúc đói',
    category: 'Sinh hóa máu',
    department: 'Xét nghiệm',
    sampleType: 'Máu tĩnh mạch',
    parameters: [
      {
        id: '13',
        name: 'Glucose',
        unit: 'mg/dL',
        normalRanges: [
          { parameter: 'Glucose', minValue: 70, maxValue: 100, unit: 'mg/dL', gender: 'both' }
        ],
        criticalValues: { low: 40, high: 400 },
        isRequired: true,
        order: 1
      }
    ],
    price: 50000,
    insurancePrice: 40000,
    turnaroundTime: 1,
    preparationInstructions: 'Nhịn ăn 8-12 giờ trước khi lấy máu',
    description: 'Xét nghiệm đường huyết lúc đói',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '5',
    code: 'LIVER',
    name: 'Chức năng gan',
    category: 'Sinh hóa máu',
    department: 'Xét nghiệm',
    sampleType: 'Máu tĩnh mạch',
    parameters: [
      {
        id: '14',
        name: 'ALT (SGPT)',
        unit: 'U/L',
        normalRanges: [
          { parameter: 'ALT (SGPT)', minValue: 0, maxValue: 40, unit: 'U/L', gender: 'both' }
        ],
        criticalValues: { high: 200 },
        isRequired: true,
        order: 1
      },
      {
        id: '15',
        name: 'AST (SGOT)',
        unit: 'U/L',
        normalRanges: [
          { parameter: 'AST (SGOT)', minValue: 0, maxValue: 40, unit: 'U/L', gender: 'both' }
        ],
        criticalValues: { high: 200 },
        isRequired: true,
        order: 2
      },
      {
        id: '16',
        name: 'Bilirubin toàn phần',
        unit: 'mg/dL',
        normalRanges: [
          { parameter: 'Bilirubin toàn phần', minValue: 0.2, maxValue: 1.2, unit: 'mg/dL', gender: 'both' }
        ],
        criticalValues: { high: 5.0 },
        isRequired: true,
        order: 3
      }
    ],
    price: 180000,
    insurancePrice: 144000,
    turnaroundTime: 3,
    preparationInstructions: 'Không cần nhịn ăn',
    description: 'Xét nghiệm đánh giá chức năng gan',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

export const mockLabTests: LabTest[] = [
  {
    id: '1',
    code: 'XN2024-001',
    patientId: '1',
    patientName: 'Nguyễn Văn Nam',
    patientCode: 'BN001',
    patientPhone: '0901234567',
    patientAge: 39,
    patientGender: 'male',
    testType: 'Công thức máu toàn phần',
    testCategory: 'Huyết học',
    testCode: 'CBC',
    orderedBy: 'BS. Nguyễn Văn A',
    orderedById: '1',
    department: 'Nội khoa',
    orderedDate: '2024-12-30',
    orderedTime: '09:30',
    sampleType: 'Máu tĩnh mạch',
    sampleCollectedDate: '2024-12-30',
    sampleCollectedTime: '10:00',
    sampleCollectedBy: 'KTV. Trần Thị Hoa',
    priority: 'routine',
    status: 'completed',
    resultDate: '2024-12-30',
    resultTime: '14:30',
    resultBy: 'KTV. Lê Văn Minh',
    verifiedDate: '2024-12-30',
    verifiedBy: 'BS. Phạm Thị Lan',
    results: [
      { 
        id: '1', 
        parameter: 'Hồng cầu (RBC)', 
        value: '4.8', 
        unit: '10^12/L', 
        referenceRange: '4.5-5.5', 
        status: 'normal',
        method: 'Flow cytometry',
        instrument: 'Sysmex XN-1000'
      },
      { 
        id: '2', 
        parameter: 'Bạch cầu (WBC)', 
        value: '7.2', 
        unit: '10^9/L', 
        referenceRange: '4.0-10.0', 
        status: 'normal',
        method: 'Flow cytometry',
        instrument: 'Sysmex XN-1000'
      },
      { 
        id: '3', 
        parameter: 'Tiểu cầu (PLT)', 
        value: '280', 
        unit: '10^9/L', 
        referenceRange: '150-450', 
        status: 'normal',
        method: 'Flow cytometry',
        instrument: 'Sysmex XN-1000'
      },
      { 
        id: '4', 
        parameter: 'Hemoglobin (Hb)', 
        value: '145', 
        unit: 'g/L', 
        referenceRange: '130-170', 
        status: 'normal',
        method: 'Spectrophotometry',
        instrument: 'Sysmex XN-1000'
      },
      { 
        id: '5', 
        parameter: 'Hematocrit (Hct)', 
        value: '42', 
        unit: '%', 
        referenceRange: '40-50', 
        status: 'normal',
        method: 'Calculated',
        instrument: 'Sysmex XN-1000'
      }
    ],
    interpretation: 'Kết quả xét nghiệm trong giới hạn bình thường',
    technicalNotes: 'Mẫu đạt chất lượng, không có hiện tượng đông máu',
    price: 150000,
    insurancePrice: 120000,
    isUrgent: false,
    isCritical: false,
    createdAt: '2024-12-30T09:30:00Z',
    updatedAt: '2024-12-30T14:30:00Z'
  },
  {
    id: '2',
    code: 'XN2024-002',
    patientId: '2',
    patientName: 'Trần Thị Mai',
    patientCode: 'BN002',
    patientPhone: '0912345678',
    patientAge: 34,
    patientGender: 'female',
    testType: 'Tổng phân tích nước tiểu',
    testCategory: 'Sinh hóa nước tiểu',
    testCode: 'URINE',
    orderedBy: 'BS. Lê Thị B',
    orderedById: '2',
    department: 'Sản khoa',
    orderedDate: '2024-12-29',
    orderedTime: '11:00',
    sampleType: 'Nước tiểu',
    sampleCollectedDate: '2024-12-29',
    sampleCollectedTime: '11:30',
    sampleCollectedBy: 'Điều dưỡng Nguyễn Thị Hương',
    priority: 'routine',
    status: 'completed',
    resultDate: '2024-12-29',
    resultTime: '15:00',
    resultBy: 'KTV. Võ Thị Nga',
    verifiedDate: '2024-12-29',
    verifiedBy: 'BS. Phạm Thị Lan',
    results: [
      { 
        id: '6', 
        parameter: 'Protein', 
        value: 'Âm tính', 
        unit: '', 
        referenceRange: 'Âm tính', 
        status: 'normal',
        method: 'Dipstick'
      },
      { 
        id: '7', 
        parameter: 'Glucose', 
        value: 'Âm tính', 
        unit: '', 
        referenceRange: 'Âm tính', 
        status: 'normal',
        method: 'Dipstick'
      },
      { 
        id: '8', 
        parameter: 'Ketones', 
        value: 'Âm tính', 
        unit: '', 
        referenceRange: 'Âm tính', 
        status: 'normal',
        method: 'Dipstick'
      },
      { 
        id: '9', 
        parameter: 'Bạch cầu', 
        value: '2-3', 
        unit: '/HPF', 
        referenceRange: '0-5', 
        status: 'normal',
        method: 'Microscopy'
      },
      { 
        id: '10', 
        parameter: 'Hồng cầu', 
        value: '0-1', 
        unit: '/HPF', 
        referenceRange: '0-2', 
        status: 'normal',
        method: 'Microscopy'
      }
    ],
    interpretation: 'Kết quả xét nghiệm nước tiểu bình thường',
    technicalNotes: 'Mẫu nước tiểu trong, không có tạp chất',
    price: 80000,
    insurancePrice: 60000,
    isUrgent: false,
    isCritical: false,
    createdAt: '2024-12-29T11:00:00Z',
    updatedAt: '2024-12-29T15:00:00Z'
  },
  {
    id: '3',
    code: 'XN2024-003',
    patientId: '3',
    patientName: 'Lê Văn Hùng',
    patientCode: 'BN003',
    patientPhone: '0923456789',
    patientAge: 46,
    patientGender: 'male',
    testType: 'Lipid máu',
    testCategory: 'Sinh hóa máu',
    testCode: 'LIPID',
    orderedBy: 'BS. Nguyễn Văn A',
    orderedById: '1',
    department: 'Nội khoa',
    orderedDate: '2024-12-31',
    orderedTime: '08:00',
    sampleType: 'Máu tĩnh mạch',
    sampleCollectedDate: '2024-12-31',
    sampleCollectedTime: '08:30',
    sampleCollectedBy: 'KTV. Trần Thị Hoa',
    priority: 'routine',
    status: 'in-progress',
    price: 200000,
    insurancePrice: 160000,
    isUrgent: false,
    isCritical: false,
    createdAt: '2024-12-31T08:00:00Z',
    updatedAt: '2024-12-31T08:30:00Z'
  },
  {
    id: '4',
    code: 'XN2024-004',
    patientId: '4',
    patientName: 'Phạm Thị Hoa',
    patientCode: 'BN004',
    patientPhone: '0934567890',
    patientAge: 29,
    patientGender: 'female',
    testType: 'Glucose máu lúc đói',
    testCategory: 'Sinh hóa máu',
    testCode: 'GLUCOSE',
    orderedBy: 'BS. Trần Văn C',
    orderedById: '3',
    department: 'Nội khoa',
    orderedDate: '2024-12-31',
    orderedTime: '07:30',
    sampleType: 'Máu tĩnh mạch',
    priority: 'urgent',
    status: 'sample-collected',
    sampleCollectedDate: '2024-12-31',
    sampleCollectedTime: '08:00',
    sampleCollectedBy: 'KTV. Trần Thị Hoa',
    price: 50000,
    insurancePrice: 40000,
    isUrgent: true,
    isCritical: false,
    createdAt: '2024-12-31T07:30:00Z',
    updatedAt: '2024-12-31T08:00:00Z'
  },
  {
    id: '5',
    code: 'XN2024-005',
    patientId: '1',
    patientName: 'Nguyễn Văn Nam',
    patientCode: 'BN001',
    patientPhone: '0901234567',
    patientAge: 39,
    patientGender: 'male',
    testType: 'Chức năng gan',
    testCategory: 'Sinh hóa máu',
    testCode: 'LIVER',
    orderedBy: 'BS. Nguyễn Văn A',
    orderedById: '1',
    department: 'Nội khoa',
    orderedDate: '2024-12-31',
    orderedTime: '09:00',
    sampleType: 'Máu tĩnh mạch',
    priority: 'routine',
    status: 'ordered',
    price: 180000,
    insurancePrice: 144000,
    isUrgent: false,
    isCritical: false,
    createdAt: '2024-12-31T09:00:00Z',
    updatedAt: '2024-12-31T09:00:00Z'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalPatients: 1250,
  todayAppointments: 28,
  pendingTests: 15,
  revenue: 45600000,
  occupancyRate: 78,
  avgWaitTime: 25
};