import React, { useState } from 'react';
import { TestTube, Search, Plus, Eye, Edit, Save, X, User, Calendar, Clock, FileText, CheckCircle, AlertCircle, Beaker, Microscope } from 'lucide-react';
import { LabTest, LabTestTemplate, LabResult } from '../../types';
import { useDataManager } from '../../hooks/useDataManager';

export const LabTests: React.FC = () => {
  const { 
    labTests, 
    setLabTests, 
    labTestTemplates, 
    setLabTestTemplates, 
    patients 
  } = useDataManager();

  const [activeTab, setActiveTab] = useState<'tests' | 'templates'>('tests');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showTestModal, setShowTestModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [editingTest, setEditingTest] = useState<LabTest | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<LabTestTemplate | null>(null);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);

  // Form states
  const [testForm, setTestForm] = useState({
    patientId: '',
    templateId: '',
    orderedBy: '',
    department: '',
    sampleType: '',
    priority: 'routine' as 'routine' | 'urgent' | 'stat',
    clinicalNotes: ''
  });

  const [templateForm, setTemplateForm] = useState({
    code: '',
    name: '',
    category: '',
    department: '',
    sampleType: '',
    price: 0,
    insurancePrice: 0,
    turnaroundTime: 0,
    preparationInstructions: '',
    description: '',
    parameters: [] as any[]
  });

  const [resultForm, setResultForm] = useState({
    results: [] as LabResult[],
    interpretation: '',
    technicalNotes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter data
  const filteredTests = labTests.filter(test => {
    const matchesSearch = test.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTemplates = labTestTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate codes
  const generateTestCode = () => {
    const year = new Date().getFullYear();
    const lastTest = labTests[labTests.length - 1];
    const lastNumber = lastTest ? parseInt(lastTest.code.split('-')[1]) : 0;
    return `XN${year}-${String(lastNumber + 1).padStart(3, '0')}`;
  };

  const generateTemplateCode = () => {
    const lastTemplate = labTestTemplates[labTestTemplates.length - 1];
    const lastCode = lastTemplate ? lastTemplate.code : 'XN000';
    const lastNumber = parseInt(lastCode.replace(/\D/g, '')) || 0;
    return `XN${String(lastNumber + 1).padStart(3, '0')}`;
  };

  // Reset forms
  const resetTestForm = () => {
    setTestForm({
      patientId: '',
      templateId: '',
      orderedBy: '',
      department: '',
      sampleType: '',
      priority: 'routine',
      clinicalNotes: ''
    });
    setEditingTest(null);
    setErrors({});
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      code: '',
      name: '',
      category: '',
      department: '',
      sampleType: '',
      price: 0,
      insurancePrice: 0,
      turnaroundTime: 0,
      preparationInstructions: '',
      description: '',
      parameters: []
    });
    setEditingTemplate(null);
    setErrors({});
  };

  const resetResultForm = () => {
    setResultForm({
      results: [],
      interpretation: '',
      technicalNotes: ''
    });
    setErrors({});
  };

  // Handle form submissions
  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const patient = patients.find(p => p.id === testForm.patientId);
    const template = labTestTemplates.find(t => t.id === testForm.templateId);
    if (!patient || !template) return;

    if (editingTest) {
      // Update existing test
      setLabTests(prevTests => 
        prevTests.map(test => 
          test.id === editingTest.id 
            ? { 
                ...test, 
                ...testForm,
                updatedAt: new Date().toISOString()
              }
            : test
        )
      );
    } else {
      // Create new test
      const newTest: LabTest = {
        id: String(Date.now()),
        code: generateTestCode(),
        patientId: patient.id,
        patientName: patient.fullName,
        patientCode: patient.code,
        patientPhone: patient.phone,
        patientAge: new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear(),
        patientGender: patient.gender,
        testType: template.name,
        testCategory: template.category,
        testCode: template.code,
        ...testForm,
        orderedDate: new Date().toISOString().split('T')[0],
        orderedTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
        price: template.price,
        insurancePrice: template.insurancePrice,
        status: 'ordered',
        isUrgent: testForm.priority === 'urgent' || testForm.priority === 'stat',
        isCritical: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setLabTests(prevTests => [...prevTests, newTest]);
    }

    setShowTestModal(false);
    resetTestForm();
  };

  const handleTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTemplate) {
      // Update existing template
      setLabTestTemplates(prevTemplates => 
        prevTemplates.map(template => 
          template.id === editingTemplate.id 
            ? { 
                ...template, 
                ...templateForm,
                updatedAt: new Date().toISOString()
              }
            : template
        )
      );
    } else {
      // Create new template
      const newTemplate: LabTestTemplate = {
        id: String(Date.now()),
        code: templateForm.code || generateTemplateCode(),
        ...templateForm,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setLabTestTemplates(prevTemplates => [...prevTemplates, newTemplate]);
    }

    setShowTemplateModal(false);
    resetTemplateForm();
  };

  const handleResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTest) return;

    setLabTests(prevTests => 
      prevTests.map(test => 
        test.id === selectedTest.id 
          ? { 
              ...test, 
              results: resultForm.results,
              interpretation: resultForm.interpretation,
              technicalNotes: resultForm.technicalNotes,
              status: 'completed',
              resultDate: new Date().toISOString().split('T')[0],
              resultTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
              resultBy: 'Current User', // In real app, get from auth
              updatedAt: new Date().toISOString()
            }
          : test
      )
    );

    setShowResultModal(false);
    resetResultForm();
    setSelectedTest(null);
  };

  // Open modals
  const openAddTestModal = () => {
    resetTestForm();
    setShowTestModal(true);
  };

  const openEditTestModal = (test: LabTest) => {
    setEditingTest(test);
    setTestForm({
      patientId: test.patientId,
      templateId: test.templateId || '',
      orderedBy: test.orderedBy || '',
      department: test.department,
      sampleType: test.sampleType,
      priority: test.priority,
      clinicalNotes: test.clinicalNotes || ''
    });
    setShowTestModal(true);
  };

  const openAddTemplateModal = () => {
    resetTemplateForm();
    setShowTemplateModal(true);
  };

  const openEditTemplateModal = (template: LabTestTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      code: template.code,
      name: template.name,
      category: template.category,
      department: template.department,
      sampleType: template.sampleType,
      price: template.price,
      insurancePrice: template.insurancePrice || 0,
      turnaroundTime: template.turnaroundTime,
      preparationInstructions: template.preparationInstructions || '',
      description: template.description || '',
      parameters: template.parameters
    });
    setShowTemplateModal(true);
  };

  const openResultModal = (test: LabTest) => {
    setSelectedTest(test);
    setResultForm({
      results: test.results || [],
      interpretation: test.interpretation || '',
      technicalNotes: test.technicalNotes || ''
    });
    setShowResultModal(true);
  };

  // Status helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'sample-collected': return 'bg-yellow-100 text-yellow-800';
      case 'ordered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'in-progress': return 'Đang thực hiện';
      case 'sample-collected': return 'Đã lấy mẫu';
      case 'ordered': return 'Đã chỉ định';
      case 'cancelled': return 'Đã hủy';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'stat': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-orange-100 text-orange-800';
      case 'routine': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'stat': return 'Cấp cứu';
      case 'urgent': return 'Khẩn';
      case 'routine': return 'Thường quy';
      default: return priority;
    }
  };

  const updateTestStatus = (testId: string, newStatus: string) => {
    setLabTests(prevTests => 
      prevTests.map(test => 
        test.id === testId 
          ? { 
              ...test, 
              status: newStatus,
              ...(newStatus === 'sample-collected' && {
                sampleCollectedDate: new Date().toISOString().split('T')[0],
                sampleCollectedTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
                sampleCollectedBy: 'Current User'
              }),
              updatedAt: new Date().toISOString()
            }
          : test
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Xét nghiệm</h2>
          <p className="text-gray-600">Quản lý xét nghiệm và mẫu xét nghiệm</p>
        </div>
        <div className="flex space-x-3">
          {activeTab === 'tests' && (
            <button 
              onClick={openAddTestModal}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Chỉ định XN</span>
            </button>
          )}
          {activeTab === 'templates' && (
            <button 
              onClick={openAddTemplateModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm mẫu XN</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'tests', label: 'Xét nghiệm', icon: TestTube },
              { id: 'templates', label: 'Mẫu xét nghiệm', icon: Beaker }
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
                placeholder={`Tìm kiếm ${activeTab === 'tests' ? 'xét nghiệm' : 'mẫu xét nghiệm'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            {activeTab === 'tests' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="ordered">Đã chỉ định</option>
                <option value="sample-collected">Đã lấy mẫu</option>
                <option value="in-progress">Đang thực hiện</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tests Tab */}
          {activeTab === 'tests' && (
            <div className="space-y-4">
              {filteredTests.length === 0 ? (
                <div className="text-center py-8">
                  <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Không có xét nghiệm nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTests.map((test) => (
                    <div key={test.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{test.code}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(test.status)}`}>
                              {getStatusText(test.status)}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(test.priority)}`}>
                              {getPriorityText(test.priority)}
                            </span>
                            {test.isUrgent && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Bệnh nhân:</span> {test.patientName}
                            </div>
                            <div>
                              <span className="font-medium">Loại XN:</span> {test.testType}
                            </div>
                            <div>
                              <span className="font-medium">Khoa:</span> {test.department}
                            </div>
                            <div>
                              <span className="font-medium">Ngày chỉ định:</span> {new Date(test.orderedDate).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditTestModal(test)}
                            className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          {test.status === 'ordered' && (
                            <button
                              onClick={() => updateTestStatus(test.id, 'sample-collected')}
                              className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                              title="Lấy mẫu"
                            >
                              Lấy mẫu
                            </button>
                          )}
                          
                          {test.status === 'sample-collected' && (
                            <button
                              onClick={() => updateTestStatus(test.id, 'in-progress')}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              title="Bắt đầu xét nghiệm"
                            >
                              Bắt đầu XN
                            </button>
                          )}
                          
                          {test.status === 'in-progress' && (
                            <button
                              onClick={() => openResultModal(test)}
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              title="Nhập kết quả"
                            >
                              Nhập KQ
                            </button>
                          )}
                          
                          {test.status === 'completed' && (
                            <button
                              onClick={() => openResultModal(test)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Xem kết quả"
                            >
                              <Eye className="h-4 w-4" />
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

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-8">
                  <Beaker className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Không có mẫu xét nghiệm nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTemplates.map((template) => (
                    <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{template.name}</h3>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {template.code}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {template.isActive ? 'Hoạt động' : 'Không hoạt động'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Danh mục:</span> {template.category}
                            </div>
                            <div>
                              <span className="font-medium">Khoa:</span> {template.department}
                            </div>
                            <div>
                              <span className="font-medium">Giá:</span> {template.price.toLocaleString()} VNĐ
                            </div>
                            <div>
                              <span className="font-medium">Thời gian:</span> {template.turnaroundTime}h
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditTemplateModal(template)}
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
        </div>
      </div>

      {/* Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingTest ? 'Chỉnh sửa xét nghiệm' : 'Chỉ định xét nghiệm mới'}
                </h3>
                <button
                  onClick={() => setShowTestModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleTestSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bệnh nhân <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={testForm.patientId}
                    onChange={(e) => setTestForm({ ...testForm, patientId: e.target.value })}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại xét nghiệm <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={testForm.templateId}
                    onChange={(e) => setTestForm({ ...testForm, templateId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="">Chọn loại xét nghiệm</option>
                    {labTestTemplates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name} - {template.price.toLocaleString()} VNĐ
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bác sĩ chỉ định
                  </label>
                  <input
                    type="text"
                    value={testForm.orderedBy}
                    onChange={(e) => setTestForm({ ...testForm, orderedBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Tên bác sĩ chỉ định"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khoa
                  </label>
                  <input
                    type="text"
                    value={testForm.department}
                    onChange={(e) => setTestForm({ ...testForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Khoa chỉ định"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại mẫu
                  </label>
                  <input
                    type="text"
                    value={testForm.sampleType}
                    onChange={(e) => setTestForm({ ...testForm, sampleType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="VD: Máu tĩnh mạch"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Độ ưu tiên
                  </label>
                  <select
                    value={testForm.priority}
                    onChange={(e) => setTestForm({ ...testForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="routine">Thường quy</option>
                    <option value="urgent">Khẩn</option>
                    <option value="stat">Cấp cứu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú lâm sàng
                </label>
                <textarea
                  rows={3}
                  value={testForm.clinicalNotes}
                  onChange={(e) => setTestForm({ ...testForm, clinicalNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Thông tin lâm sàng liên quan..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowTestModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingTest ? 'Cập nhật' : 'Chỉ định'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingTemplate ? 'Chỉnh sửa mẫu xét nghiệm' : 'Thêm mẫu xét nghiệm mới'}
                </h3>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleTemplateSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã xét nghiệm
                  </label>
                  <input
                    type="text"
                    value={templateForm.code}
                    onChange={(e) => setTemplateForm({ ...templateForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Để trống để tự động tạo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên xét nghiệm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Tên xét nghiệm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <input
                    type="text"
                    value={templateForm.category}
                    onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="VD: Huyết học, Sinh hóa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khoa thực hiện
                  </label>
                  <input
                    type="text"
                    value={templateForm.department}
                    onChange={(e) => setTemplateForm({ ...templateForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Khoa xét nghiệm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại mẫu
                  </label>
                  <input
                    type="text"
                    value={templateForm.sampleType}
                    onChange={(e) => setTemplateForm({ ...templateForm, sampleType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="VD: Máu tĩnh mạch, Nước tiểu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian thực hiện (giờ)
                  </label>
                  <input
                    type="number"
                    value={templateForm.turnaroundTime}
                    onChange={(e) => setTemplateForm({ ...templateForm, turnaroundTime: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Số giờ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={templateForm.price}
                    onChange={(e) => setTemplateForm({ ...templateForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Giá xét nghiệm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá BHYT (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={templateForm.insurancePrice}
                    onChange={(e) => setTemplateForm({ ...templateForm, insurancePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Giá bảo hiểm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hướng dẫn chuẩn bị
                </label>
                <textarea
                  rows={3}
                  value={templateForm.preparationInstructions}
                  onChange={(e) => setTemplateForm({ ...templateForm, preparationInstructions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Hướng dẫn chuẩn bị cho bệnh nhân..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Mô tả chi tiết về xét nghiệm..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingTemplate ? 'Cập nhật' : 'Thêm mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedTest.status === 'completed' ? 'Kết quả xét nghiệm' : 'Nhập kết quả xét nghiệm'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedTest.code} - {selectedTest.patientName}
                  </p>
                </div>
                <button
                  onClick={() => setShowResultModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {selectedTest.status === 'completed' ? (
                // View results
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin xét nghiệm</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loại xét nghiệm:</span>
                          <span className="font-medium">{selectedTest.testType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày thực hiện:</span>
                          <span>{selectedTest.resultDate && new Date(selectedTest.resultDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Người thực hiện:</span>
                          <span>{selectedTest.resultBy}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin bệnh nhân</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Họ tên:</span>
                          <span className="font-medium">{selectedTest.patientName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tuổi:</span>
                          <span>{selectedTest.patientAge}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Giới tính:</span>
                          <span>{selectedTest.patientGender === 'male' ? 'Nam' : 'Nữ'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedTest.results && selectedTest.results.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Kết quả</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left py-3 px-4 font-medium text-gray-600">Chỉ số</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-600">Kết quả</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-600">Đơn vị</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-600">Giá trị tham chiếu</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-600">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedTest.results.map((result, index) => (
                              <tr key={index} className="border-t border-gray-100">
                                <td className="py-3 px-4 font-medium">{result.parameter}</td>
                                <td className="py-3 px-4">{result.value}</td>
                                <td className="py-3 px-4">{result.unit}</td>
                                <td className="py-3 px-4">{result.referenceRange}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    result.status === 'normal' ? 'bg-green-100 text-green-800' :
                                    result.status === 'abnormal' ? 'bg-yellow-100 text-yellow-800' :
                                    result.status === 'critical' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {result.status === 'normal' ? 'Bình thường' :
                                     result.status === 'abnormal' ? 'Bất thường' :
                                     result.status === 'critical' ? 'Nguy hiểm' :
                                     result.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {selectedTest.interpretation && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Kết luận</h4>
                      <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{selectedTest.interpretation}</p>
                    </div>
                  )}

                  {selectedTest.technicalNotes && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Ghi chú kỹ thuật</h4>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedTest.technicalNotes}</p>
                    </div>
                  )}
                </div>
              ) : (
                // Input results form
                <form onSubmit={handleResultSubmit} className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Nhập kết quả xét nghiệm</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Vui lòng nhập kết quả cho từng chỉ số xét nghiệm
                    </p>
                    
                    {/* This would be dynamically generated based on the test template */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Chức năng nhập kết quả chi tiết sẽ được phát triển dựa trên mẫu xét nghiệm đã chọn.
                        Hiện tại có thể nhập kết luận và ghi chú.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kết luận
                    </label>
                    <textarea
                      rows={4}
                      value={resultForm.interpretation}
                      onChange={(e) => setResultForm({ ...resultForm, interpretation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="Nhập kết luận xét nghiệm..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú kỹ thuật
                    </label>
                    <textarea
                      rows={3}
                      value={resultForm.technicalNotes}
                      onChange={(e) => setResultForm({ ...resultForm, technicalNotes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="Ghi chú về quá trình thực hiện..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowResultModal(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Hoàn thành xét nghiệm</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};