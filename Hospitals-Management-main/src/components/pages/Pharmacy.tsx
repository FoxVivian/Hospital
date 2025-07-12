import React, { useState } from 'react';
import { Package, Search, Plus, Edit, Eye, AlertTriangle, TrendingDown, TrendingUp, Calendar, X, Save, Truck, ShoppingCart } from 'lucide-react';
import { Medicine, Supplier, StockTransaction, StockAlert } from '../../types';
import { useDataManager } from '../../hooks/useDataManager';

export const Pharmacy: React.FC = () => {
  const { 
    medicines, 
    setMedicines, 
    suppliers, 
    setSuppliers, 
    stockTransactions, 
    setStockTransactions, 
    stockAlerts, 
    setStockAlerts 
  } = useDataManager();

  const [activeTab, setActiveTab] = useState<'medicines' | 'suppliers' | 'transactions' | 'alerts'>('medicines');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  // Form states
  const [medicineForm, setMedicineForm] = useState({
    code: '',
    name: '',
    category: '',
    unit: '',
    price: 0,
    stockQuantity: 0,
    minStockLevel: 0,
    maxStockLevel: 0,
    expiryDate: '',
    supplierId: '',
    batchNumber: '',
    location: '',
    description: '',
    activeIngredient: '',
    concentration: '',
    manufacturer: '',
    registrationNumber: '',
    status: 'active' as 'active' | 'inactive' | 'discontinued'
  });

  const [supplierForm, setSupplierForm] = useState({
    code: '',
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    taxCode: '',
    bankAccount: '',
    bankName: '',
    paymentTerms: '',
    status: 'active' as 'active' | 'inactive'
  });

  const [transactionForm, setTransactionForm] = useState({
    type: 'import' as 'import' | 'export' | 'adjustment' | 'transfer',
    medicineId: '',
    batchNumber: '',
    quantity: 0,
    unitPrice: 0,
    reason: '',
    supplierId: '',
    expiryDate: '',
    location: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter data
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.activeIngredient?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || medicine.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = stockTransactions.filter(transaction =>
    transaction.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAlerts = stockAlerts.filter(alert =>
    alert.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique categories
  const categories = [...new Set(medicines.map(med => med.category))];

  // Generate codes
  const generateMedicineCode = () => {
    const lastMedicine = medicines[medicines.length - 1];
    const lastNumber = lastMedicine ? parseInt(lastMedicine.code.replace('MED', '')) : 0;
    return `MED${String(lastNumber + 1).padStart(3, '0')}`;
  };

  const generateSupplierCode = () => {
    const lastSupplier = suppliers[suppliers.length - 1];
    const lastNumber = lastSupplier ? parseInt(lastSupplier.code.replace('NCC', '')) : 0;
    return `NCC${String(lastNumber + 1).padStart(3, '0')}`;
  };

  // Reset forms
  const resetMedicineForm = () => {
    setMedicineForm({
      code: '',
      name: '',
      category: '',
      unit: '',
      price: 0,
      stockQuantity: 0,
      minStockLevel: 0,
      maxStockLevel: 0,
      expiryDate: '',
      supplierId: '',
      batchNumber: '',
      location: '',
      description: '',
      activeIngredient: '',
      concentration: '',
      manufacturer: '',
      registrationNumber: '',
      status: 'active'
    });
    setEditingMedicine(null);
    setErrors({});
  };

  const resetSupplierForm = () => {
    setSupplierForm({
      code: '',
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      taxCode: '',
      bankAccount: '',
      bankName: '',
      paymentTerms: '',
      status: 'active'
    });
    setEditingSupplier(null);
    setErrors({});
  };

  const resetTransactionForm = () => {
    setTransactionForm({
      type: 'import',
      medicineId: '',
      batchNumber: '',
      quantity: 0,
      unitPrice: 0,
      reason: '',
      supplierId: '',
      expiryDate: '',
      location: '',
      notes: ''
    });
    setErrors({});
  };

  // Handle form submissions
  const handleMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMedicine) {
      // Update existing medicine
      setMedicines(prevMedicines => 
        prevMedicines.map(medicine => 
          medicine.id === editingMedicine.id 
            ? { 
                ...medicine, 
                ...medicineForm,
                supplier: suppliers.find(s => s.id === medicineForm.supplierId)?.name || '',
                updatedAt: new Date().toISOString()
              }
            : medicine
        )
      );
    } else {
      // Create new medicine
      const newMedicine: Medicine = {
        id: String(Date.now()),
        code: medicineForm.code || generateMedicineCode(),
        ...medicineForm,
        supplier: suppliers.find(s => s.id === medicineForm.supplierId)?.name || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setMedicines(prevMedicines => [...prevMedicines, newMedicine]);
    }

    setShowMedicineModal(false);
    resetMedicineForm();
  };

  const handleSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSupplier) {
      // Update existing supplier
      setSuppliers(prevSuppliers => 
        prevSuppliers.map(supplier => 
          supplier.id === editingSupplier.id 
            ? { ...supplier, ...supplierForm }
            : supplier
        )
      );
    } else {
      // Create new supplier
      const newSupplier: Supplier = {
        id: String(Date.now()),
        code: supplierForm.code || generateSupplierCode(),
        ...supplierForm,
        createdAt: new Date().toISOString()
      };

      setSuppliers(prevSuppliers => [...prevSuppliers, newSupplier]);
    }

    setShowSupplierModal(false);
    resetSupplierForm();
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const medicine = medicines.find(m => m.id === transactionForm.medicineId);
    if (!medicine) return;

    const newTransaction: StockTransaction = {
      id: String(Date.now()),
      ...transactionForm,
      medicineName: medicine.name,
      totalValue: transactionForm.quantity * transactionForm.unitPrice,
      supplierName: suppliers.find(s => s.id === transactionForm.supplierId)?.name,
      performedBy: 'Current User', // In real app, get from auth
      performedAt: new Date().toISOString(),
      status: 'completed'
    };

    setStockTransactions(prevTransactions => [...prevTransactions, newTransaction]);

    // Update medicine stock
    if (transactionForm.type === 'import') {
      setMedicines(prevMedicines => 
        prevMedicines.map(med => 
          med.id === transactionForm.medicineId 
            ? { ...med, stockQuantity: med.stockQuantity + transactionForm.quantity }
            : med
        )
      );
    } else if (transactionForm.type === 'export') {
      setMedicines(prevMedicines => 
        prevMedicines.map(med => 
          med.id === transactionForm.medicineId 
            ? { ...med, stockQuantity: Math.max(0, med.stockQuantity - transactionForm.quantity) }
            : med
        )
      );
    }

    setShowTransactionModal(false);
    resetTransactionForm();
  };

  // Open modals
  const openAddMedicineModal = () => {
    resetMedicineForm();
    setShowMedicineModal(true);
  };

  const openEditMedicineModal = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setMedicineForm({
      code: medicine.code,
      name: medicine.name,
      category: medicine.category,
      unit: medicine.unit,
      price: medicine.price,
      stockQuantity: medicine.stockQuantity,
      minStockLevel: medicine.minStockLevel,
      maxStockLevel: medicine.maxStockLevel,
      expiryDate: medicine.expiryDate || '',
      supplierId: medicine.supplierId,
      batchNumber: medicine.batchNumber || '',
      location: medicine.location || '',
      description: medicine.description || '',
      activeIngredient: medicine.activeIngredient || '',
      concentration: medicine.concentration || '',
      manufacturer: medicine.manufacturer || '',
      registrationNumber: medicine.registrationNumber || '',
      status: medicine.status
    });
    setShowMedicineModal(true);
  };

  const openAddSupplierModal = () => {
    resetSupplierForm();
    setShowSupplierModal(true);
  };

  const openEditSupplierModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setSupplierForm({
      code: supplier.code,
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      taxCode: supplier.taxCode,
      bankAccount: supplier.bankAccount || '',
      bankName: supplier.bankName || '',
      paymentTerms: supplier.paymentTerms || '',
      status: supplier.status
    });
    setShowSupplierModal(true);
  };

  const openTransactionModal = (medicine?: Medicine) => {
    resetTransactionForm();
    if (medicine) {
      setTransactionForm({
        ...transactionForm,
        medicineId: medicine.id,
        batchNumber: medicine.batchNumber || '',
        location: medicine.location || ''
      });
    }
    setShowTransactionModal(true);
  };

  // Status helpers
  const getStockStatus = (medicine: Medicine) => {
    if (medicine.stockQuantity === 0) {
      return { status: 'out-of-stock', color: 'bg-red-100 text-red-800', text: 'Hết hàng' };
    } else if (medicine.stockQuantity <= medicine.minStockLevel) {
      return { status: 'low-stock', color: 'bg-yellow-100 text-yellow-800', text: 'Sắp hết' };
    } else {
      return { status: 'in-stock', color: 'bg-green-100 text-green-800', text: 'Còn hàng' };
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const markAlertAsRead = (alertId: string) => {
    setStockAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, isRead: true }
          : alert
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Kho thuốc</h2>
          <p className="text-gray-600">Quản lý thuốc, nhà cung cấp và xuất nhập kho</p>
        </div>
        <div className="flex space-x-3">
          {activeTab === 'medicines' && (
            <button 
              onClick={openAddMedicineModal}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm thuốc</span>
            </button>
          )}
          {activeTab === 'suppliers' && (
            <button 
              onClick={openAddSupplierModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm NCC</span>
            </button>
          )}
          {activeTab === 'transactions' && (
            <button 
              onClick={() => openTransactionModal()}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Giao dịch</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'medicines', label: 'Thuốc', icon: Package },
              { id: 'suppliers', label: 'Nhà cung cấp', icon: Truck },
              { id: 'transactions', label: 'Xuất nhập kho', icon: ShoppingCart },
              { id: 'alerts', label: 'Cảnh báo', icon: AlertTriangle }
            ].map((tab) => {
              const Icon = tab.icon;
              const alertCount = tab.id === 'alerts' ? stockAlerts.filter(alert => !alert.isRead).length : 0;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {alertCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {alertCount}
                    </span>
                  )}
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
                placeholder={`Tìm kiếm ${
                  activeTab === 'medicines' ? 'thuốc' :
                  activeTab === 'suppliers' ? 'nhà cung cấp' :
                  activeTab === 'transactions' ? 'giao dịch' : 'cảnh báo'
                }...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            {activeTab === 'medicines' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Medicines Tab */}
          {activeTab === 'medicines' && (
            <div className="space-y-4">
              {filteredMedicines.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Không có thuốc nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMedicines.map((medicine) => {
                    const stockStatus = getStockStatus(medicine);
                    return (
                      <div key={medicine.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{medicine.name}</h3>
                            <p className="text-sm text-gray-600">{medicine.code}</p>
                            <p className="text-xs text-gray-500">{medicine.activeIngredient} {medicine.concentration}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tồn kho:</span>
                            <span className="font-medium">{medicine.stockQuantity} {medicine.unit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Giá:</span>
                            <span className="font-medium">{medicine.price.toLocaleString()} VNĐ</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Danh mục:</span>
                            <span>{medicine.category}</span>
                          </div>
                          {medicine.expiryDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">HSD:</span>
                              <span>{new Date(medicine.expiryDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditMedicineModal(medicine)}
                              className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setSelectedMedicine(medicine)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => openTransactionModal(medicine)}
                            className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                          >
                            Nhập/Xuất
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Suppliers Tab */}
          {activeTab === 'suppliers' && (
            <div className="space-y-4">
              {filteredSuppliers.length === 0 ? (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Không có nhà cung cấp nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSuppliers.map((supplier) => (
                    <div key={supplier.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                            <span className="text-sm text-gray-500">{supplier.code}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              supplier.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {supplier.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Người liên hệ:</span> {supplier.contactPerson}
                            </div>
                            <div>
                              <span className="font-medium">SĐT:</span> {supplier.phone}
                            </div>
                            <div>
                              <span className="font-medium">Email:</span> {supplier.email}
                            </div>
                            <div>
                              <span className="font-medium">Mã số thuế:</span> {supplier.taxCode}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditSupplierModal(supplier)}
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
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Không có giao dịch nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`p-2 rounded-full ${
                              transaction.type === 'import' ? 'bg-green-100' :
                              transaction.type === 'export' ? 'bg-red-100' :
                              'bg-blue-100'
                            }`}>
                              {transaction.type === 'import' ? (
                                <TrendingUp className={`h-4 w-4 ${
                                  transaction.type === 'import' ? 'text-green-600' : 'text-red-600'
                                }`} />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{transaction.medicineName}</h3>
                              <p className="text-sm text-gray-600">
                                {transaction.type === 'import' ? 'Nhập kho' :
                                 transaction.type === 'export' ? 'Xuất kho' :
                                 transaction.type === 'adjustment' ? 'Điều chỉnh' : 'Chuyển kho'}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Số lượng:</span> {transaction.quantity}
                            </div>
                            <div>
                              <span className="font-medium">Lô:</span> {transaction.batchNumber}
                            </div>
                            <div>
                              <span className="font-medium">Ngày:</span> {new Date(transaction.performedAt).toLocaleDateString('vi-VN')}
                            </div>
                            <div>
                              <span className="font-medium">Người thực hiện:</span> {transaction.performedBy}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {transaction.totalValue && (
                            <p className="font-medium text-gray-900">
                              {transaction.totalValue.toLocaleString()} VNĐ
                            </p>
                          )}
                          <p className="text-sm text-gray-500">{transaction.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Không có cảnh báo nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAlerts.map((alert) => (
                    <div key={alert.id} className={`border rounded-lg p-4 ${getAlertColor(alert.severity)} ${
                      !alert.isRead ? 'ring-2 ring-offset-2 ring-red-200' : ''
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <AlertTriangle className={`h-5 w-5 ${
                              alert.severity === 'critical' ? 'text-red-600' :
                              alert.severity === 'high' ? 'text-orange-600' :
                              alert.severity === 'medium' ? 'text-yellow-600' :
                              'text-blue-600'
                            }`} />
                            <h3 className="font-medium">{alert.medicineName}</h3>
                            {!alert.isRead && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Mới</span>
                            )}
                          </div>
                          <div className="text-sm">
                            {alert.alertType === 'low_stock' && (
                              <p>Tồn kho thấp: {alert.currentStock} (tối thiểu: {alert.minStock})</p>
                            )}
                            {alert.alertType === 'out_of_stock' && (
                              <p>Hết hàng: {alert.currentStock}</p>
                            )}
                            {alert.alertType === 'expiry_warning' && (
                              <p>Sắp hết hạn: còn {alert.daysToExpiry} ngày</p>
                            )}
                            {alert.alertType === 'expired' && (
                              <p>Đã hết hạn: {alert.expiryDate && new Date(alert.expiryDate).toLocaleDateString('vi-VN')}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {new Date(alert.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                          {!alert.isRead && (
                            <button
                              onClick={() => markAlertAsRead(alert.id)}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              Đánh dấu đã đọc
                            </button>
                          )}
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

      {/* Medicine Modal */}
      {showMedicineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingMedicine ? 'Chỉnh sửa thuốc' : 'Thêm thuốc mới'}
                </h3>
                <button
                  onClick={() => setShowMedicineModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleMedicineSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã thuốc
                  </label>
                  <input
                    type="text"
                    value={medicineForm.code}
                    onChange={(e) => setMedicineForm({ ...medicineForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Để trống để tự động tạo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên thuốc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={medicineForm.name}
                    onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Tên thuốc"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <input
                    type="text"
                    value={medicineForm.category}
                    onChange={(e) => setMedicineForm({ ...medicineForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="VD: Giảm đau, Kháng sinh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn vị
                  </label>
                  <input
                    type="text"
                    value={medicineForm.unit}
                    onChange={(e) => setMedicineForm({ ...medicineForm, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="VD: Viên, Chai, Hộp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={medicineForm.price}
                    onChange={(e) => setMedicineForm({ ...medicineForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Giá bán"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tồn kho hiện tại
                  </label>
                  <input
                    type="number"
                    value={medicineForm.stockQuantity}
                    onChange={(e) => setMedicineForm({ ...medicineForm, stockQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Số lượng hiện có"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mức tồn kho tối thiểu
                  </label>
                  <input
                    type="number"
                    value={medicineForm.minStockLevel}
                    onChange={(e) => setMedicineForm({ ...medicineForm, minStockLevel: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Mức cảnh báo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mức tồn kho tối đa
                  </label>
                  <input
                    type="number"
                    value={medicineForm.maxStockLevel}
                    onChange={(e) => setMedicineForm({ ...medicineForm, maxStockLevel: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Mức tối đa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nhà cung cấp
                  </label>
                  <select
                    value={medicineForm.supplierId}
                    onChange={(e) => setMedicineForm({ ...medicineForm, supplierId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="">Chọn nhà cung cấp</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hạn sử dụng
                  </label>
                  <input
                    type="date"
                    value={medicineForm.expiryDate}
                    onChange={(e) => setMedicineForm({ ...medicineForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lô
                  </label>
                  <input
                    type="text"
                    value={medicineForm.batchNumber}
                    onChange={(e) => setMedicineForm({ ...medicineForm, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Số lô sản xuất"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vị trí lưu trữ
                  </label>
                  <input
                    type="text"
                    value={medicineForm.location}
                    onChange={(e) => setMedicineForm({ ...medicineForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="VD: Kệ A1-01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hoạt chất
                  </label>
                  <input
                    type="text"
                    value={medicineForm.activeIngredient}
                    onChange={(e) => setMedicineForm({ ...medicineForm, activeIngredient: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Tên hoạt chất"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nồng độ
                  </label>
                  <input
                    type="text"
                    value={medicineForm.concentration}
                    onChange={(e) => setMedicineForm({ ...medicineForm, concentration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="VD: 500mg, 5%"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nhà sản xuất
                  </label>
                  <input
                    type="text"
                    value={medicineForm.manufacturer}
                    onChange={(e) => setMedicineForm({ ...medicineForm, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Tên nhà sản xuất"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số đăng ký
                  </label>
                  <input
                    type="text"
                    value={medicineForm.registrationNumber}
                    onChange={(e) => setMedicineForm({ ...medicineForm, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Số đăng ký lưu hành"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={medicineForm.status}
                    onChange={(e) => setMedicineForm({ ...medicineForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="discontinued">Ngừng sản xuất</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  value={medicineForm.description}
                  onChange={(e) => setMedicineForm({ ...medicineForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Mô tả chi tiết về thuốc..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowMedicineModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingMedicine ? 'Cập nhật' : 'Thêm mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingSupplier ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
                </h3>
                <button
                  onClick={() => setShowSupplierModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSupplierSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã NCC
                  </label>
                  <input
                    type="text"
                    value={supplierForm.code}
                    onChange={(e) => setSupplierForm({ ...supplierForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Để trống để tự động tạo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên công ty <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={supplierForm.name}
                    onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Tên nhà cung cấp"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Người liên hệ
                  </label>
                  <input
                    type="text"
                    value={supplierForm.contactPerson}
                    onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Tên người liên hệ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã số thuế
                  </label>
                  <input
                    type="text"
                    value={supplierForm.taxCode}
                    onChange={(e) => setSupplierForm({ ...supplierForm, taxCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Mã số thuế"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tài khoản
                  </label>
                  <input
                    type="text"
                    value={supplierForm.bankAccount}
                    onChange={(e) => setSupplierForm({ ...supplierForm, bankAccount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Số tài khoản ngân hàng"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngân hàng
                  </label>
                  <input
                    type="text"
                    value={supplierForm.bankName}
                    onChange={(e) => setSupplierForm({ ...supplierForm, bankName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Tên ngân hàng"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Điều kiện thanh toán
                  </label>
                  <input
                    type="text"
                    value={supplierForm.paymentTerms}
                    onChange={(e) => setSupplierForm({ ...supplierForm, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="VD: 30 ngày"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={supplierForm.status}
                    onChange={(e) => setSupplierForm({ ...supplierForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <textarea
                  rows={3}
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Địa chỉ đầy đủ"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingSupplier ? 'Cập nhật' : 'Thêm mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Giao dịch kho</h3>
                <button
                  onClick={() => setShowTransactionModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleTransactionSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại giao dịch
                  </label>
                  <select
                    value={transactionForm.type}
                    onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="import">Nhập kho</option>
                    <option value="export">Xuất kho</option>
                    <option value="adjustment">Điều chỉnh</option>
                    <option value="transfer">Chuyển kho</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thuốc <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={transactionForm.medicineId}
                    onChange={(e) => setTransactionForm({ ...transactionForm, medicineId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    required
                  >
                    <option value="">Chọn thuốc</option>
                    {medicines.map(medicine => (
                      <option key={medicine.id} value={medicine.id}>
                        {medicine.name} - {medicine.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={transactionForm.quantity}
                    onChange={(e) => setTransactionForm({ ...transactionForm, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Số lượng"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn giá
                  </label>
                  <input
                    type="number"
                    value={transactionForm.unitPrice}
                    onChange={(e) => setTransactionForm({ ...transactionForm, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Đơn giá"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lô
                  </label>
                  <input
                    type="text"
                    value={transactionForm.batchNumber}
                    onChange={(e) => setTransactionForm({ ...transactionForm, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Số lô"
                  />
                </div>

                {transactionForm.type === 'import' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nhà cung cấp
                    </label>
                    <select
                      value={transactionForm.supplierId}
                      onChange={(e) => setTransactionForm({ ...transactionForm, supplierId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    >
                      <option value="">Chọn nhà cung cấp</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hạn sử dụng
                  </label>
                  <input
                    type="date"
                    value={transactionForm.expiryDate}
                    onChange={(e) => setTransactionForm({ ...transactionForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vị trí
                  </label>
                  <input
                    type="text"
                    value={transactionForm.location}
                    onChange={(e) => setTransactionForm({ ...transactionForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Vị trí lưu trữ"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lý do <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={transactionForm.reason}
                  onChange={(e) => setTransactionForm({ ...transactionForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Lý do thực hiện giao dịch"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  rows={3}
                  value={transactionForm.notes}
                  onChange={(e) => setTransactionForm({ ...transactionForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Ghi chú thêm..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowTransactionModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Thực hiện</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};