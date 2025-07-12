// File: src/hooks/useDataManager.ts

import { useState, useEffect } from 'react';
import { Patient, Appointment, Medicine, Invoice, LabTest, MedicalRecord, Supplier, StockTransaction, StockAlert, PaymentTransaction, ServicePrice, InsuranceProvider, LabTestTemplate } from '../types';
import {
  mockPatients as initialPatients,
  mockAppointments as initialAppointments,
  mockMedicines as initialMedicines,
  mockInvoices as initialInvoices,
  mockLabTests as initialLabTests,
  mockMedicalRecords as initialMedicalRecords,
  mockSuppliers as initialSuppliers,
  mockStockTransactions as initialStockTransactions,
  mockStockAlerts as initialStockAlerts,
  mockPaymentTransactions as initialPaymentTransactions,
  mockServicePrices as initialServicePrices,
  mockInsuranceProviders as initialInsuranceProviders,
  mockLabTestTemplates as initialLabTestTemplates
} from '../data/mockData';

// Storage keys
const STORAGE_KEYS = {
  PATIENTS: 'medicare_patients',
  APPOINTMENTS: 'medicare_appointments',
  MEDICINES: 'medicare_medicines',
  INVOICES: 'medicare_invoices',
  LAB_TESTS: 'medicare_lab_tests',
  MEDICAL_RECORDS: 'medicare_medical_records',
  SUPPLIERS: 'medicare_suppliers',
  STOCK_TRANSACTIONS: 'medicare_stock_transactions',
  STOCK_ALERTS: 'medicare_stock_alerts',
  PAYMENT_TRANSACTIONS: 'medicare_payment_transactions',
  SERVICE_PRICES: 'medicare_service_prices',
  INSURANCE_PROVIDERS: 'medicare_insurance_providers',
  LAB_TEST_TEMPLATES: 'medicare_lab_test_templates'
};

// Helper functions for localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    console.log(`[FROM STORAGE] Key: ${key}, Value:`, item ? JSON.parse(item) : defaultValue); // Thêm log này
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    console.log(`[TO STORAGE] Saved key "${key}". Data:`, value); // Thêm log này
    console.log(`[TO STORAGE] Serialized value length: ${serializedValue.length}`); // Thêm log này
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error); // Log lỗi nếu có
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('Local Storage Quota Exceeded! Data might not be saved.');
    }
  }
};

export const useDataManager = () => {
  // Initialize state with data from localStorage or default mock data
  const [patients, setPatientsState] = useState<Patient[]>(() =>
    getFromStorage(STORAGE_KEYS.PATIENTS, initialPatients)
  );

  const [appointments, setAppointmentsState] = useState<Appointment[]>(() =>
    getFromStorage(STORAGE_KEYS.APPOINTMENTS, initialAppointments)
  );

  const [medicines, setMedicinesState] = useState<Medicine[]>(() =>
    getFromStorage(STORAGE_KEYS.MEDICINES, initialMedicines)
  );

  const [invoices, setInvoicesState] = useState<Invoice[]>(() =>
    getFromStorage(STORAGE_KEYS.INVOICES, initialInvoices)
  );

  const [labTests, setLabTestsState] = useState<LabTest[]>(() =>
    getFromStorage(STORAGE_KEYS.LAB_TESTS, initialLabTests)
  );

  const [medicalRecords, setMedicalRecordsState] = useState<MedicalRecord[]>(() =>
    getFromStorage(STORAGE_KEYS.MEDICAL_RECORDS, initialMedicalRecords)
  );

  const [suppliers, setSuppliersState] = useState<Supplier[]>(() =>
    getFromStorage(STORAGE_KEYS.SUPPLIERS, initialSuppliers)
  );

  const [stockTransactions, setStockTransactionsState] = useState<StockTransaction[]>(() =>
    getFromStorage(STORAGE_KEYS.STOCK_TRANSACTIONS, initialStockTransactions)
  );

  const [stockAlerts, setStockAlertsState] = useState<StockAlert[]>(() =>
    getFromStorage(STORAGE_KEYS.STOCK_ALERTS, initialStockAlerts)
  );

  const [paymentTransactions, setPaymentTransactionsState] = useState<PaymentTransaction[]>(() =>
    getFromStorage(STORAGE_KEYS.PAYMENT_TRANSACTIONS, initialPaymentTransactions)
  );

  const [servicePrices, setServicePricesState] = useState<ServicePrice[]>(() =>
    getFromStorage(STORAGE_KEYS.SERVICE_PRICES, initialServicePrices)
  );

  const [insuranceProviders, setInsuranceProvidersState] = useState<InsuranceProvider[]>(() =>
    getFromStorage(STORAGE_KEYS.INSURANCE_PROVIDERS, initialInsuranceProviders)
  );

  const [labTestTemplates, setLabTestTemplatesState] = useState<LabTestTemplate[]>(() =>
    getFromStorage(STORAGE_KEYS.LAB_TEST_TEMPLATES, initialLabTestTemplates)
  );

  // Wrapper functions that update both state and localStorage
  const setPatients = (newPatients: Patient[] | ((prev: Patient[]) => Patient[])) => {
    setPatientsState(prev => {
      const updated = typeof newPatients === 'function' ? newPatients(prev) : newPatients;
      saveToStorage(STORAGE_KEYS.PATIENTS, updated);
      return updated;
    });
  };

  const setAppointments = (newAppointments: Appointment[] | ((prev: Appointment[]) => Appointment[])) => {
    setAppointmentsState(prev => {
      const updated = typeof newAppointments === 'function' ? newAppointments(prev) : newAppointments;
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, updated);
      return updated;
    });
  };

  const setMedicines = (newMedicines: Medicine[] | ((prev: Medicine[]) => Medicine[])) => {
    setMedicinesState(prev => {
      const updated = typeof newMedicines === 'function' ? newMedicines(prev) : newMedicines;
      saveToStorage(STORAGE_KEYS.MEDICINES, updated);
      return updated;
    });
  };

  const setInvoices = (newInvoices: Invoice[] | ((prev: Invoice[]) => Invoice[])) => {
    setInvoicesState(prev => {
      const updated = typeof newInvoices === 'function' ? newInvoices(prev) : newInvoices;
      saveToStorage(STORAGE_KEYS.INVOICES, updated);
      return updated;
    });
  };

  const setLabTests = (newLabTests: LabTest[] | ((prev: LabTest[]) => LabTest[])) => {
    setLabTestsState(prev => {
      const updated = typeof newLabTests === 'function' ? newLabTests(prev) : newLabTests;
      saveToStorage(STORAGE_KEYS.LAB_TESTS, updated);
      return updated;
    });
  };

  const setMedicalRecords = (newMedicalRecords: MedicalRecord[] | ((prev: MedicalRecord[]) => MedicalRecord[])) => {
    setMedicalRecordsState(prev => {
      const updated = typeof newMedicalRecords === 'function' ? newMedicalRecords(prev) : newMedicalRecords;
      saveToStorage(STORAGE_KEYS.MEDICAL_RECORDS, updated);
      return updated;
    });
  };

  const setSuppliers = (newSuppliers: Supplier[] | ((prev: Supplier[]) => Supplier[])) => {
    setSuppliersState(prev => {
      const updated = typeof newSuppliers === 'function' ? newSuppliers(prev) : newSuppliers;
      saveToStorage(STORAGE_KEYS.SUPPLIERS, updated);
      return updated;
    });
  };

  const setStockTransactions = (newStockTransactions: StockTransaction[] | ((prev: StockTransaction[]) => StockTransaction[])) => {
    setStockTransactionsState(prev => {
      const updated = typeof newStockTransactions === 'function' ? newStockTransactions(prev) : newStockTransactions;
      saveToStorage(STORAGE_KEYS.STOCK_TRANSACTIONS, updated);
      return updated;
    });
  };

  const setStockAlerts = (newStockAlerts: StockAlert[] | ((prev: StockAlert[]) => StockAlert[])) => {
    setStockAlertsState(prev => {
      const updated = typeof newStockAlerts === 'function' ? newStockAlerts(prev) : newStockAlerts;
      saveToStorage(STORAGE_KEYS.STOCK_ALERTS, updated);
      return updated;
    });
  };

  const setPaymentTransactions = (newPaymentTransactions: PaymentTransaction[] | ((prev: PaymentTransaction[]) => PaymentTransaction[])) => {
    setPaymentTransactionsState(prev => {
      const updated = typeof newPaymentTransactions === 'function' ? newPaymentTransactions(prev) : newPaymentTransactions;
      saveToStorage(STORAGE_KEYS.PAYMENT_TRANSACTIONS, updated);
      return updated;
    });
  };

  const setServicePrices = (newServicePrices: ServicePrice[] | ((prev: ServicePrice[]) => ServicePrice[])) => {
    setServicePricesState(prev => {
      const updated = typeof newServicePrices === 'function' ? newServicePrices(prev) : newServicePrices;
      saveToStorage(STORAGE_KEYS.SERVICE_PRICES, updated);
      return updated;
    });
  };

  const setInsuranceProviders = (newInsuranceProviders: InsuranceProvider[] | ((prev: InsuranceProvider[]) => InsuranceProvider[])) => {
    setInsuranceProvidersState(prev => {
      const updated = typeof newInsuranceProviders === 'function' ? newInsuranceProviders(prev) : newInsuranceProviders;
      saveToStorage(STORAGE_KEYS.INSURANCE_PROVIDERS, updated);
      return updated;
    });
  };

  const setLabTestTemplates = (newLabTestTemplates: LabTestTemplate[] | ((prev: LabTestTemplate[]) => LabTestTemplate[])) => {
    setLabTestTemplatesState(prev => {
      const updated = typeof newLabTestTemplates === 'function' ? newLabTestTemplates(prev) : newLabTestTemplates;
      saveToStorage(STORAGE_KEYS.LAB_TEST_TEMPLATES, updated);
      return updated;
    });
  };

  // Reset all data to initial state
  const resetAllData = () => {
    setPatients(initialPatients);
    setAppointments(initialAppointments);
    setMedicines(initialMedicines);
    setInvoices(initialInvoices);
    setLabTests(initialLabTests);
    setMedicalRecords(initialMedicalRecords);
    setSuppliers(initialSuppliers);
    setStockTransactions(initialStockTransactions);
    setStockAlerts(initialStockAlerts);
    setPaymentTransactions(initialPaymentTransactions);
    setServicePrices(initialServicePrices);
    setInsuranceProviders(initialInsuranceProviders);
    setLabTestTemplates(initialLabTestTemplates);
  };

  // Clear all localStorage data
  const clearAllData = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    resetAllData();
  };

  return {
    // Data
    patients,
    appointments,
    medicines,
    invoices,
    labTests,
    medicalRecords,
    suppliers,
    stockTransactions,
    stockAlerts,
    paymentTransactions,
    servicePrices,
    insuranceProviders,
    labTestTemplates,

    // Setters
    setPatients,
    setAppointments,
    setMedicines,
    setInvoices,
    setLabTests,
    setMedicalRecords,
    setSuppliers,
    setStockTransactions,
    setStockAlerts,
    setPaymentTransactions,
    setServicePrices,
    setInsuranceProviders,
    setLabTestTemplates,

    // Utility functions
    resetAllData,
    clearAllData
  };
};