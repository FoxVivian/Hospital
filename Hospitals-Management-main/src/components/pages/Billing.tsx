import React, { useState } from 'react';
import { CreditCard, Search, Plus, Eye, Edit, DollarSign, FileText, Calendar, User, X, Save, Receipt, AlertCircle, CheckCircle } from 'lucide-react';
import { Invoice, PaymentTransaction, InvoiceItem } from '../../types';
import { useDataManager } from '../../hooks/useDataManager';

export const Billing: React.FC = () => {
  const { 
    invoices, 
    setInvoices, 
    paymentTransactions, 
    setPaymentTransactions, 
    patients, 
    medicines, 
    servicePrices 
  } = useDataManager();

  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Form states
  const [invoiceForm, setInvoiceForm] = useState({
    patientId: '',
    services: [] as InvoiceItem[],
    medicines: [] as InvoiceItem[],
    labTests: [] as InvoiceItem[],
    discountPercent: 0,
    taxPercent: 0,
    notes: '',
    dueDate: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    invoiceId: '',
    amount: 0,
    paymentMethod: 'cash' as 'cash' | 'card' | 'transfer' | 'insurance',
    paymentReference: '',
    cardNumber: '',
    bankName: '',
    notes: ''
  });

  const [serviceInput, setServiceInput] = useState({
    serviceId: '',
    quantity: 1,
    discountPercent: 0
  });

  const [medicineInput, setMedicineInput] = useState({
    medicineId: '',
    quantity: 1,
    discountPercent: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter data
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPayments = paymentTransactions.filter(payment =>
    payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const lastInvoice = invoices[invoices.length - 1];
    const lastNumber = lastInvoice ? parseInt(lastInvoice.invoiceNumber.split('-')[1]) : 0;
    return `HD${year}-${String(lastNumber + 1).padStart(3, '0')}`;
  };

  // Calculate totals
  const calculateInvoiceTotals = () => {
    const servicesTotal = invoiceForm.services.reduce((sum, item) => sum + item.totalPrice, 0);
    const medicinesTotal = invoiceForm.medicines.reduce((sum, item) => sum + item.totalPrice, 0);
    const labTestsTotal = invoiceForm.labTests.reduce((sum, item) => sum + item.totalPrice, 0);
    
    const subtotal = servicesTotal + medicinesTotal + labTestsTotal;
    const discountAmount = (subtotal * invoiceForm.discountPercent) / 100;
    const taxAmount = ((subtotal - discountAmount) * invoiceForm.taxPercent) / 100;
    const totalAmount = subtotal - discountAmount + taxAmount;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount
    };
  };

  // Reset forms
  const resetInvoiceForm = () => {
    setInvoiceForm({
      patientId: '',
      services: [],
      medicines: [],
      labTests: [],
      discountPercent: 0,
      taxPercent: 0,
      notes: '',
      dueDate: ''
    });
    setServiceInput({ serviceId: '', quantity: 1, discountPercent: 0 });
    setMedicineInput({ medicineId: '', quantity: 1, discountPercent: 0 });
    setEditingInvoice(null);
    setErrors({});
  };

  const resetPaymentForm = () => {
    setPaymentForm({
      invoiceId: '',
      amount: 0,
      paymentMethod: 'cash',
      paymentReference: '',
      cardNumber: '',
      bankName: '',
      notes: ''
    });
    setErrors({});
  };

  // Add items to invoice
  const addService = () => {
    const service = servicePrices.find(s => s.id === serviceInput.serviceId);
    if (!service) return;

    const discountAmount = (service.price * serviceInput.quantity * serviceInput.discountPercent) / 100;
    const totalPrice = (service.price * serviceInput.quantity) - discountAmount;

    const newService: InvoiceItem = {
      id: String(Date.now()),
      type: 'service',
      code: service.code,
      name: service.name,
      description: service.description,
      quantity: serviceInput.quantity,
      unitPrice: service.price,
      discountPercent: serviceInput.discountPercent,
      discountAmount,
      totalPrice,
      department: service.department
    };

    setInvoiceForm({
      ...invoiceForm,
      services: [...invoiceForm.services, newService]
    });

    setServiceInput({ serviceId: '', quantity: 1, discountPercent: 0 });
  };

  const addMedicine = () => {
    const medicine = medicines.find(m => m.id === medicineInput.medicineId);
    if (!medicine) return;

    const discountAmount = (medicine.price * medicineInput.quantity * medicineInput.discountPercent) / 100;
    const totalPrice = (medicine.price * medicineInput.quantity) - discountAmount;

    const newMedicine: InvoiceItem = {
      id: String(Date.now()),
      type: 'medicine',
      code: medicine.code,
      name: medicine.name,
      description: medicine.description,
      quantity: medicineInput.quantity,
      unitPrice: medicine.price,
      discountPercent: medicineInput.discountPercent,
      discountAmount,
      totalPrice
    };

    setInvoiceForm({
      ...invoiceForm,
      medicines: [...invoiceForm.medicines, newMedicine]
    });

    setMedicineInput({ medicineId: '', quantity: 1, discountPercent: 0 });
  };

  const removeItem = (type: 'services' | 'medicines' | 'labTests', index: number) => {
    setInvoiceForm({
      ...invoiceForm,
      [type]: invoiceForm[type].filter((_, i) => i !== index)
    });
  };

  // Handle form submissions
  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const patient = patients.find(p => p.id === invoiceForm.patientId);
    if (!patient) return;

    const totals = calculateInvoiceTotals();

    if (editingInvoice) {
      // Update existing invoice
      setInvoices(prevInvoices => 
        prevInvoices.map(invoice => 
          invoice.id === editingInvoice.id 
            ? { 
                ...invoice, 
                ...invoiceForm,
                ...totals,
                remainingAmount: totals.totalAmount - invoice.paidAmount,
                updatedAt: new Date().toISOString()
              }
            : invoice
        )
      );
    } else {
      // Create new invoice
      const newInvoice: Invoice = {
        id: String(Date.now()),
        invoiceNumber: generateInvoiceNumber(),
        patientId: patient.id,
        patientName: patient.fullName,
        patientPhone: patient.phone,
        patientAddress: patient.address,
        insuranceId: patient.insuranceId,
        ...invoiceForm,
        ...totals,
        paidAmount: 0,
        remainingAmount: totals.totalAmount,
        status: 'pending',
        createdBy: 'Current User', // In real app, get from auth
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setInvoices(prevInvoices => [...prevInvoices, newInvoice]);
    }

    setShowInvoiceModal(false);
    resetInvoiceForm();
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const invoice = invoices.find(inv => inv.id === paymentForm.invoiceId);
    if (!invoice) return;

    const newPayment: PaymentTransaction = {
      id: String(Date.now()),
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      patientId: invoice.patientId,
      patientName: invoice.patientName,
      amount: paymentForm.amount,
      paymentMethod: paymentForm.paymentMethod,
      paymentReference: paymentForm.paymentReference,
      cardNumber: paymentForm.cardNumber,
      bankName: paymentForm.bankName,
      status: 'completed',
      processedBy: 'Current User', // In real app, get from auth
      processedAt: new Date().toISOString(),
      notes: paymentForm.notes,
      receiptNumber: `BT${Date.now()}`
    };

    setPaymentTransactions(prevPayments => [...prevPayments, newPayment]);

    // Update invoice
    const newPaidAmount = invoice.paidAmount + paymentForm.amount;
    const newRemainingAmount = invoice.totalAmount - newPaidAmount;
    const newStatus = newRemainingAmount <= 0 ? 'paid' : 'partial';

    setInvoices(prevInvoices => 
      prevInvoices.map(inv => 
        inv.id === invoice.id 
          ? { 
              ...inv, 
              paidAmount: newPaidAmount,
              remainingAmount: newRemainingAmount,
              status: newStatus,
              paidDate: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : inv.paidDate
            }
          : inv
      )
    );

    setShowPaymentModal(false);
    resetPaymentForm();
  };

  // Open modals
  const openAddInvoiceModal = () => {
    resetInvoiceForm();
    setShowInvoiceModal(true);
  };

  const openEditInvoiceModal = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setInvoiceForm({
      patientId: invoice.patientId,
      services: invoice.services,
      medicines: invoice.medicines,
      labTests: invoice.labTests,
      discountPercent: invoice.discountPercent,
      taxPercent: invoice.taxPercent,
      notes: invoice.notes || '',
      dueDate: invoice.dueDate || ''
    });
    setShowInvoiceModal(true);
  };

  const openPaymentModal = (invoice: Invoice) => {
    resetPaymentForm();
    setPaymentForm({
      ...paymentForm,
      invoiceId: invoice.id,
      amount: invoice.remainingAmount
    });
    setShowPaymentModal(true);
  };

  const openDetailModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  // Status helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'partial': return 'Thanh toán một phần';
      case 'pending': return 'Chờ thanh toán';
      case 'overdue': return 'Quá hạn';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash': return 'Tiền mặt';
      case 'card': return 'Thẻ';
      case 'transfer': return 'Chuyển khoản';
      case 'insurance': return 'Bảo hiểm';
      default: return method;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Thanh toán</h2>
          <p className="text-gray-600">Quản lý hóa đơn và giao dịch thanh toán</p>
        </div>
        <div className="flex space-x-3">
          {activeTab === 'invoices' && (
            <button 
              onClick={openAddInvoiceModal}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Tạo hóa đơn</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'invoices', label: 'Hóa đơn', icon: FileText },
              { id: 'payments', label: 'Giao dịch', icon: CreditCard }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
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

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={`Tìm kiếm ${activeTab === 'invoices' ? 'hóa đơn' : 'giao dịch'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            {activeTab === 'invoices' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ thanh toán</option>
                <option value="partial">Thanh toán một phần</option>
                <option value="paid">Đã thanh toán</option>
                <option value="overdue">Quá hạn</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Không có hóa đơn nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredInvoices.map((invoice) => (
                    <div key={invoice.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{invoice.invoiceNumber}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                              {getStatusText(invoice.status)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Bệnh nhân:</span> {invoice.patientName}
                            </div>
                            <div>
                              <span className="font-medium">Tổng tiền:</span> {invoice.totalAmount.toLocaleString()} VNĐ
                            </div>
                            <div>
                              <span className="font-medium">Đã thanh toán:</span> {invoice.paidAmount.toLocaleString()} VNĐ
                            </div>
                            <div>
                              <span className="font-medium">Còn lại:</span> {invoice.remainingAmount.toLocaleString()} VNĐ
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openDetailModal(invoice)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                            <>
                              <button
                                onClick={() => openEditInvoiceModal(invoice)}
                                className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openPaymentModal(invoice)}
                                className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                                title="Thanh toán"
                              >
                                Thanh toán
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
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              {filteredPayments.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Không có giao dịch nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPayments.map((payment) => (
                    <div key={payment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{payment.receiptNumber}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              payment.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Hóa đơn:</span> {payment.invoiceNumber}
                            </div>
                            <div>
                              <span className="font-medium">Bệnh nhân:</span> {payment.patientName}
                            </div>
                            <div>
                              <span className="font-medium">Số tiền:</span> {payment.amount.toLocaleString()} VNĐ
                            </div>
                            <div>
                              <span className="font-medium">Phương thức:</span> {getPaymentMethodText(payment.paymentMethod)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(payment.processedAt).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-xs text-gray-400">
                            {payment.processedBy}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingInvoice ? 'Chỉnh sửa hóa đơn' : 'Tạo hóa đơn mới'}
                </h3>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleInvoiceSubmit} className="p-6 space-y-6">
              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bệnh nhân <span className="text-red-500">*</span>
                </label>
                <select
                  value={invoiceForm.patientId}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value="">Chọn bệnh nhân</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.fullName} - {patient.code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Dịch vụ</h4>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <select
                        value={serviceInput.serviceId}
                        onChange={(e) => setServiceInput({ ...serviceInput, serviceId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      >
                        <option value="">Chọn dịch vụ</option>
                        {servicePrices.map(service => (
                          <option key={service.id} value={service.id}>
                            {service.name} - {service.price.toLocaleString()} VNĐ
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Số lượng"
                        value={serviceInput.quantity}
                        onChange={(e) => setServiceInput({ ...serviceInput, quantity: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Giảm giá (%)"
                        value={serviceInput.discountPercent}
                        onChange={(e) => setServiceInput({ ...serviceInput, discountPercent: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={addService}
                        className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>

                {invoiceForm.services.length > 0 && (
                  <div className="space-y-2">
                    {invoiceForm.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{service.name}</p>
                          <p className="text-sm text-gray-600">
                            {service.quantity} x {service.unitPrice.toLocaleString()} VNĐ
                            {service.discountPercent > 0 && ` (Giảm ${service.discountPercent}%)`}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{service.totalPrice.toLocaleString()} VNĐ</span>
                          <button
                            type="button"
                            onClick={() => removeItem('services', index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Medicines */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Thuốc</h4>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <select
                        value={medicineInput.medicineId}
                        onChange={(e) => setMedicineInput({ ...medicineInput, medicineId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      >
                        <option value="">Chọn thuốc</option>
                        {medicines.map(medicine => (
                          <option key={medicine.id} value={medicine.id}>
                            {medicine.name} - {medicine.price.toLocaleString()} VNĐ
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Số lượng"
                        value={medicineInput.quantity}
                        onChange={(e) => setMedicineInput({ ...medicineInput, quantity: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Giảm giá (%)"
                        value={medicineInput.discountPercent}
                        onChange={(e) => setMedicineInput({ ...medicineInput, discountPercent: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={addMedicine}
                        className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>

                {invoiceForm.medicines.length > 0 && (
                  <div className="space-y-2">
                    {invoiceForm.medicines.map((medicine, index) => (
                      <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{medicine.name}</p>
                          <p className="text-sm text-gray-600">
                            {medicine.quantity} x {medicine.unitPrice.toLocaleString()} VNĐ
                            {medicine.discountPercent > 0 && ` (Giảm ${medicine.discountPercent}%)`}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{medicine.totalPrice.toLocaleString()} VNĐ</span>
                          <button
                            type="button"
                            onClick={() => removeItem('medicines', index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totals and Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giảm giá tổng (%)
                    </label>
                    <input
                      type="number"
                      value={invoiceForm.discountPercent}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, discountPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thuế (%)
                    </label>
                    <input
                      type="number"
                      value={invoiceForm.taxPercent}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, taxPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hạn thanh toán
                    </label>
                    <input
                      type="date"
                      value={invoiceForm.dueDate}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Tổng kết</h4>
                  {(() => {
                    const totals = calculateInvoiceTotals();
                    return (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Tạm tính:</span>
                          <span>{totals.subtotal.toLocaleString()} VNĐ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Giảm giá:</span>
                          <span>-{totals.discountAmount.toLocaleString()} VNĐ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Thuế:</span>
                          <span>{totals.taxAmount.toLocaleString()} VNĐ</span>
                        </div>
                        <div className="flex justify-between font-medium text-lg border-t pt-2">
                          <span>Tổng cộng:</span>
                          <span>{totals.totalAmount.toLocaleString()} VNĐ</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  rows={3}
                  value={invoiceForm.notes}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Ghi chú thêm..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingInvoice ? 'Cập nhật' : 'Tạo hóa đơn'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Thanh toán hóa đơn</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tiền <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phương thức thanh toán <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="cash">Tiền mặt</option>
                    <option value="card">Thẻ</option>
                    <option value="transfer">Chuyển khoản</option>
                    <option value="insurance">Bảo hiểm</option>
                  </select>
                </div>

                {paymentForm.paymentMethod === 'card' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số thẻ
                      </label>
                      <input
                        type="text"
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        placeholder="**** **** **** 1234"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngân hàng
                      </label>
                      <input
                        type="text"
                        value={paymentForm.bankName}
                        onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        placeholder="Tên ngân hàng"
                      />
                    </div>
                  </>
                )}

                {(paymentForm.paymentMethod === 'transfer' || paymentForm.paymentMethod === 'insurance') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã tham chiếu
                    </label>
                    <input
                      type="text"
                      value={paymentForm.paymentReference}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentReference: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="Mã giao dịch hoặc mã bảo hiểm"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  rows={3}
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Ghi chú về thanh toán..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <Receipt className="h-4 w-4" />
                  <span>Xác nhận thanh toán</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Chi tiết hóa đơn</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Invoice Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin hóa đơn</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số hóa đơn:</span>
                      <span className="font-medium">{selectedInvoice.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày tạo:</span>
                      <span>{new Date(selectedInvoice.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                        {getStatusText(selectedInvoice.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin bệnh nhân</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Họ tên:</span>
                      <span className="font-medium">{selectedInvoice.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SĐT:</span>
                      <span>{selectedInvoice.patientPhone}</span>
                    </div>
                    {selectedInvoice.insuranceId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">BHYT:</span>
                        <span>{selectedInvoice.insuranceId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              {selectedInvoice.services.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Dịch vụ</h4>
                  <div className="space-y-2">
                    {selectedInvoice.services.map((service, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-600">
                            {service.quantity} x {service.unitPrice.toLocaleString()} VNĐ
                          </p>
                        </div>
                        <span className="font-medium">{service.totalPrice.toLocaleString()} VNĐ</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedInvoice.medicines.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Thuốc</h4>
                  <div className="space-y-2">
                    {selectedInvoice.medicines.map((medicine, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                        <div>
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-sm text-gray-600">
                            {medicine.quantity} x {medicine.unitPrice.toLocaleString()} VNĐ
                          </p>
                        </div>
                        <span className="font-medium">{medicine.totalPrice.toLocaleString()} VNĐ</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Totals */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Tổng kết</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{selectedInvoice.subtotal.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giảm giá:</span>
                    <span>-{selectedInvoice.discountAmount.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế:</span>
                    <span>{selectedInvoice.taxAmount.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg border-t pt-2">
                    <span>Tổng cộng:</span>
                    <span>{selectedInvoice.totalAmount.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Đã thanh toán:</span>
                    <span>{selectedInvoice.paidAmount.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Còn lại:</span>
                    <span>{selectedInvoice.remainingAmount.toLocaleString()} VNĐ</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              {selectedInvoice.status !== 'paid' && selectedInvoice.status !== 'cancelled' && (
                <button 
                  onClick={() => {
                    setShowDetailModal(false);
                    openPaymentModal(selectedInvoice);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Thanh toán
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};