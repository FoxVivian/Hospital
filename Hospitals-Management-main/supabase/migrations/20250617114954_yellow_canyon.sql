/*
  # Tạo Database Hệ thống Quản lý Bệnh viện

  1. Bảng Users (Người dùng)
    - Quản lý tài khoản nhân viên y tế và bệnh nhân
    - Phân quyền theo vai trò
    - Thông tin cá nhân và liên hệ

  2. Bảng Patients (Bệnh nhân)
    - Thông tin chi tiết bệnh nhân
    - Tiền sử bệnh lý
    - Thông tin bảo hiểm

  3. Bảng Appointments (Lịch hẹn)
    - Quản lý lịch hẹn khám bệnh
    - Trạng thái và loại lịch hẹn
    - Liên kết bác sĩ và bệnh nhân

  4. Bảng Medical Records (Bệnh án)
    - Hồ sơ khám bệnh chi tiết
    - Chẩn đoán và điều trị
    - Đơn thuốc và chỉ định XN

  5. Bảng Medicines (Thuốc)
    - Quản lý kho thuốc
    - Thông tin thuốc và tồn kho
    - Nhà cung cấp

  6. Bảng Lab Tests (Xét nghiệm)
    - Quản lý xét nghiệm
    - Kết quả và tham số
    - Quy trình workflow

  7. Bảng Invoices (Hóa đơn)
    - Quản lý thanh toán
    - Chi tiết dịch vụ và thuốc
    - Bảo hiểm

  8. Các bảng hỗ trợ khác
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG USERS (Người dùng)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  password_hash text,
  user_type text NOT NULL CHECK (user_type IN ('staff', 'patient')),
  role text CHECK (role IN ('admin', 'doctor', 'nurse', 'pharmacist', 'lab_technician', 'staff')),
  name text NOT NULL,
  phone text,
  avatar text,
  department text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. BẢNG PATIENTS (Bệnh nhân)
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  full_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  phone text NOT NULL,
  email text,
  address text NOT NULL,
  identity_card text NOT NULL,
  insurance_id text,
  emergency_contact jsonb NOT NULL,
  medical_history text[],
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. BẢNG SUPPLIERS (Nhà cung cấp)
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  contact_person text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  tax_code text NOT NULL,
  bank_account text,
  bank_name text,
  payment_terms text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. BẢNG MEDICINES (Thuốc)
CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  unit text NOT NULL,
  price decimal(10,2) NOT NULL,
  stock_quantity integer DEFAULT 0,
  min_stock_level integer DEFAULT 0,
  max_stock_level integer DEFAULT 0,
  expiry_date date,
  supplier_id uuid REFERENCES suppliers(id),
  batch_number text,
  location text,
  description text,
  active_ingredient text,
  concentration text,
  manufacturer text,
  registration_number text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. BẢNG APPOINTMENTS (Lịch hẹn)
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES users(id),
  department text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  type text NOT NULL CHECK (type IN ('checkup', 'followup', 'emergency', 'consultation')),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. BẢNG MEDICAL_RECORDS (Bệnh án)
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES users(id),
  department text NOT NULL,
  visit_date date NOT NULL,
  visit_time time NOT NULL,
  chief_complaint text NOT NULL,
  symptoms text,
  vital_signs jsonb,
  physical_examination text,
  diagnosis text NOT NULL,
  icd_code text,
  treatment text NOT NULL,
  prescription jsonb DEFAULT '[]',
  lab_tests text[],
  follow_up_date date,
  follow_up_instructions text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. BẢNG LAB_TEST_TEMPLATES (Mẫu xét nghiệm)
CREATE TABLE IF NOT EXISTS lab_test_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  department text NOT NULL,
  sample_type text NOT NULL,
  parameters jsonb NOT NULL,
  price decimal(10,2) NOT NULL,
  insurance_price decimal(10,2),
  turnaround_time integer NOT NULL, -- in hours
  preparation_instructions text,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. BẢNG LAB_TESTS (Xét nghiệm)
CREATE TABLE IF NOT EXISTS lab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  template_id uuid REFERENCES lab_test_templates(id),
  ordered_by uuid REFERENCES users(id),
  department text NOT NULL,
  ordered_date date NOT NULL,
  ordered_time time NOT NULL,
  sample_type text NOT NULL,
  sample_collected_date date,
  sample_collected_time time,
  sample_collected_by text,
  priority text DEFAULT 'routine' CHECK (priority IN ('routine', 'urgent', 'stat')),
  status text DEFAULT 'ordered' CHECK (status IN ('ordered', 'sample-collected', 'in-progress', 'completed', 'cancelled', 'rejected')),
  result_date date,
  result_time time,
  result_by text,
  verified_date date,
  verified_by text,
  results jsonb DEFAULT '[]',
  interpretation text,
  technical_notes text,
  clinical_notes text,
  price decimal(10,2) NOT NULL,
  insurance_price decimal(10,2),
  is_urgent boolean DEFAULT false,
  is_critical boolean DEFAULT false,
  report_url text,
  attachments text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 9. BẢNG SERVICE_PRICES (Giá dịch vụ)
CREATE TABLE IF NOT EXISTS service_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  department text NOT NULL,
  price decimal(10,2) NOT NULL,
  insurance_price decimal(10,2),
  description text,
  duration integer, -- in minutes
  is_active boolean DEFAULT true,
  effective_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 10. BẢNG INSURANCE_PROVIDERS (Nhà bảo hiểm)
CREATE TABLE IF NOT EXISTS insurance_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  contact_person text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  contract_number text NOT NULL,
  coverage_percent decimal(5,2) NOT NULL,
  max_coverage_amount decimal(12,2),
  excluded_services text[],
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  contract_start_date date NOT NULL,
  contract_end_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 11. BẢNG INVOICES (Hóa đơn)
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES appointments(id),
  services jsonb DEFAULT '[]',
  medicines jsonb DEFAULT '[]',
  lab_tests jsonb DEFAULT '[]',
  subtotal decimal(12,2) NOT NULL,
  discount_amount decimal(12,2) DEFAULT 0,
  discount_percent decimal(5,2) DEFAULT 0,
  tax_amount decimal(12,2) DEFAULT 0,
  tax_percent decimal(5,2) DEFAULT 0,
  total_amount decimal(12,2) NOT NULL,
  paid_amount decimal(12,2) DEFAULT 0,
  remaining_amount decimal(12,2) NOT NULL,
  payment_method text CHECK (payment_method IN ('cash', 'card', 'transfer', 'insurance', 'mixed')),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'paid', 'partial', 'overdue', 'cancelled')),
  created_by uuid REFERENCES users(id),
  due_date date,
  paid_date date,
  notes text,
  insurance_coverage decimal(12,2),
  insurance_claim_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 12. BẢNG PAYMENT_TRANSACTIONS (Giao dịch thanh toán)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  amount decimal(12,2) NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'card', 'transfer', 'insurance')),
  payment_reference text,
  card_number text,
  bank_name text,
  transaction_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  processed_by uuid REFERENCES users(id),
  processed_at timestamptz,
  notes text,
  receipt_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 13. BẢNG STOCK_TRANSACTIONS (Giao dịch kho)
CREATE TABLE IF NOT EXISTS stock_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('import', 'export', 'adjustment', 'transfer')),
  medicine_id uuid REFERENCES medicines(id) ON DELETE CASCADE,
  batch_number text NOT NULL,
  quantity integer NOT NULL,
  unit_price decimal(10,2),
  total_value decimal(12,2),
  reason text NOT NULL,
  supplier_id uuid REFERENCES suppliers(id),
  expiry_date date,
  location text,
  performed_by uuid REFERENCES users(id),
  performed_at timestamptz DEFAULT now(),
  notes text,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  invoice_number text,
  reference_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 14. BẢNG STOCK_ALERTS (Cảnh báo kho)
CREATE TABLE IF NOT EXISTS stock_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id uuid REFERENCES medicines(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('low_stock', 'expiry_warning', 'expired', 'out_of_stock')),
  current_stock integer NOT NULL,
  min_stock integer,
  expiry_date date,
  days_to_expiry integer,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_test_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Staff can read all users" ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND user_type = 'staff'
    )
  );

-- RLS Policies for Patients
CREATE POLICY "Patients can read own data" ON patients
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND user_type = 'staff'
    )
  );

CREATE POLICY "Staff can manage patients" ON patients
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND user_type = 'staff'
    )
  );

-- RLS Policies for other tables (similar pattern)
CREATE POLICY "Staff can manage all data" ON appointments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND user_type = 'staff'
    )
  );

CREATE POLICY "Patients can read own appointments" ON appointments
  FOR SELECT TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

-- Apply similar policies to other tables
CREATE POLICY "Staff can manage medical records" ON medical_records
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND user_type = 'staff'
    )
  );

CREATE POLICY "Patients can read own medical records" ON medical_records
  FOR SELECT TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

-- Continue with other tables...
CREATE POLICY "Staff can manage medicines" ON medicines
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND user_type = 'staff'
    )
  );

CREATE POLICY "Staff can manage lab tests" ON lab_tests
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND user_type = 'staff'
    )
  );

CREATE POLICY "Patients can read own lab tests" ON lab_tests
  FOR SELECT TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage invoices" ON invoices
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND user_type = 'staff'
    )
  );

CREATE POLICY "Patients can read own invoices" ON invoices
  FOR SELECT TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_code ON patients(code);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_tests_patient ON lab_tests(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_tests_status ON lab_tests(status);
CREATE INDEX IF NOT EXISTS idx_medicines_code ON medicines(code);
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category);
CREATE INDEX IF NOT EXISTS idx_invoices_patient ON invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON medicines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_tests_updated_at BEFORE UPDATE ON lab_tests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();