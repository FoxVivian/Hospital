-- Migration: Insert sample data for hospital management system
-- Description: Populate database with comprehensive sample data for all modules

-- 1. INSERT USERS (Nhân viên y tế)
INSERT INTO users (id, email, password_hash, user_type, role, name, phone, department, avatar) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@hospital.com', '$2a$10$example', 'staff', 'admin', 'Quản trị viên', '0281234567', 'IT', 'https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'),
  ('22222222-2222-2222-2222-222222222222', 'doctor@hospital.com', '$2a$10$example', 'staff', 'doctor', 'BS. Nguyễn Văn A', '0901234567', 'Nội khoa', 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'),
  ('33333333-3333-3333-3333-333333333333', 'nurse@hospital.com', '$2a$10$example', 'staff', 'nurse', 'Y tá Trần Thị B', '0912345678', 'Khoa Nội', 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'),
  ('44444444-4444-4444-4444-444444444444', 'pharmacist@hospital.com', '$2a$10$example', 'staff', 'pharmacist', 'Dược sĩ Lê Văn C', '0923456789', 'Dược', 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'),
  ('55555555-5555-5555-5555-555555555555', 'lab@hospital.com', '$2a$10$example', 'staff', 'lab_technician', 'KTV Phạm Thị D', '0934567890', 'Xét nghiệm', 'https://images.pexels.com/photos/5452299/pexels-photo-5452299.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'),
  ('66666666-6666-6666-6666-666666666666', 'doctor2@hospital.com', '$2a$10$example', 'staff', 'doctor', 'BS. Lê Thị B', '0945678901', 'Sản khoa', 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'),
  ('77777777-7777-7777-7777-777777777777', 'doctor3@hospital.com', '$2a$10$example', 'staff', 'doctor', 'BS. Trần Văn C', '0956789012', 'Ngoại khoa', 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2');

-- 2. INSERT PATIENT USERS
INSERT INTO users (id, email, password_hash, user_type, name, phone) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, '$2a$10$example', 'patient', 'Nguyễn Văn Nam', '0901234567'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'mai.tran@email.com', '$2a$10$example', 'patient', 'Trần Thị Mai', '0912345678'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', NULL, '$2a$10$example', 'patient', 'Lê Văn Hùng', '0923456789'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'hoa.pham@email.com', '$2a$10$example', 'patient', 'Phạm Thị Hoa', '0934567890');

-- 3. INSERT PATIENTS
INSERT INTO patients (id, user_id, code, full_name, date_of_birth, gender, phone, email, address, identity_card, insurance_id, emergency_contact, medical_history, status) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'BN001', 'Nguyễn Văn Nam', '1985-03-15', 'male', '0901234567', 'nam.nguyen@email.com', '123 Đường Lê Lợi, Quận 1, TP.HCM', '025123456789', 'HS4010012345678', '{"name": "Nguyễn Thị Lan", "phone": "0907654321", "relationship": "Vợ"}', '{"Cao huyết áp", "Tiểu đường type 2"}', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'BN002', 'Trần Thị Mai', '1990-07-22', 'female', '0912345678', 'mai.tran@email.com', '456 Đường Nguyễn Huệ, Quận 3, TP.HCM', '025987654321', NULL, '{"name": "Trần Văn Hùng", "phone": "0908765432", "relationship": "Chồng"}', '{}', 'active'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'BN003', 'Lê Văn Hùng', '1978-11-08', 'male', '0923456789', NULL, '789 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM', '025111222333', 'HS4010087654321', '{"name": "Lê Thị Hương", "phone": "0934567890", "relationship": "Vợ"}', '{"Dạ dày"}', 'active'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'BN004', 'Phạm Thị Hoa', '1995-12-03', 'female', '0934567890', 'hoa.pham@email.com', '321 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM', '025444555666', NULL, '{"name": "Phạm Văn Tùng", "phone": "0945678901", "relationship": "Anh trai"}', '{}', 'active');

-- 4. INSERT SUPPLIERS
INSERT INTO suppliers (id, code, name, contact_person, phone, email, address, tax_code, bank_account, bank_name, payment_terms, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'NCC001', 'Công ty Dược phẩm ABC', 'Nguyễn Văn Tùng', '0283456789', 'contact@abc-pharma.vn', '123 Đường Pasteur, Quận 1, TP.HCM', '0123456789', '1234567890', 'Vietcombank', '30 ngày', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'NCC002', 'Công ty Dược phẩm XYZ', 'Trần Thị Hoa', '0287654321', 'info@xyz-pharma.vn', '456 Đường Võ Văn Tần, Quận 3, TP.HCM', '0987654321', '0987654321', 'Techcombank', '15 ngày', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'NCC003', 'Công ty TNHH Dược Việt', 'Lê Văn Minh', '0281234567', 'sales@duocviet.com.vn', '789 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM', '0456789123', NULL, NULL, NULL, 'active');

-- 5. INSERT MEDICINES
INSERT INTO medicines (id, code, name, category, unit, price, stock_quantity, min_stock_level, max_stock_level, expiry_date, supplier_id, batch_number, location, description, active_ingredient, concentration, manufacturer, registration_number, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'MED001', 'Paracetamol 500mg', 'Giảm đau, hạ sốt', 'Viên', 500, 1200, 100, 2000, '2025-12-31', '11111111-1111-1111-1111-111111111111', 'PA240101', 'Kệ A1-01', 'Thuốc giảm đau, hạ sốt', 'Paracetamol', '500mg', 'Công ty Dược phẩm ABC', 'VD-12345-18', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'MED002', 'Amoxicillin 250mg', 'Kháng sinh', 'Viên', 1200, 45, 50, 500, '2025-06-30', '22222222-2222-2222-2222-222222222222', 'AM240205', 'Kệ B2-03', 'Kháng sinh nhóm Penicillin', 'Amoxicillin', '250mg', 'Công ty Dược phẩm XYZ', 'VD-67890-19', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'MED003', 'Amlodipine 5mg', 'Tim mạch', 'Viên', 2000, 200, 50, 300, '2025-08-31', '11111111-1111-1111-1111-111111111111', 'AM240301', 'Kệ C1-05', 'Thuốc hạ huyết áp', 'Amlodipine besylate', '5mg', 'Công ty Dược phẩm ABC', 'VD-11111-20', 'active'),
  ('44444444-4444-4444-4444-444444444444', 'MED004', 'Vitamin C 1000mg', 'Vitamin & Khoáng chất', 'Viên', 800, 15, 30, 200, '2025-03-15', '33333333-3333-3333-3333-333333333333', 'VC240115', 'Kệ D1-02', 'Bổ sung Vitamin C', 'Ascorbic acid', '1000mg', 'Công ty TNHH Dược Việt', 'VD-22222-21', 'active'),
  ('55555555-5555-5555-5555-555555555555', 'MED005', 'Aspirin 100mg', 'Tim mạch', 'Viên', 300, 0, 100, 500, '2025-01-10', '22222222-2222-2222-2222-222222222222', 'AS240110', 'Kệ C2-01', 'Thuốc chống đông máu', 'Acetylsalicylic acid', '100mg', 'Công ty Dược phẩm XYZ', 'VD-33333-18', 'active');

-- 6. INSERT SERVICE PRICES
INSERT INTO service_prices (id, code, name, category, department, price, insurance_price, description, duration, is_active, effective_date) VALUES
  ('11111111-1111-1111-1111-111111111111', 'SV001', 'Khám nội khoa', 'Khám bệnh', 'Nội khoa', 200000, 150000, 'Khám bệnh nội khoa tổng quát', 30, true, '2024-01-01'),
  ('22222222-2222-2222-2222-222222222222', 'SV002', 'Khám sản khoa', 'Khám bệnh', 'Sản khoa', 250000, 200000, 'Khám bệnh sản khoa', 45, true, '2024-01-01'),
  ('33333333-3333-3333-3333-333333333333', 'XN001', 'Xét nghiệm máu tổng quát', 'Xét nghiệm', 'Xét nghiệm', 150000, 120000, 'Xét nghiệm công thức máu', NULL, true, '2024-01-01'),
  ('44444444-4444-4444-4444-444444444444', 'XN002', 'Xét nghiệm nước tiểu', 'Xét nghiệm', 'Xét nghiệm', 80000, 60000, 'Xét nghiệm tổng quát nước tiểu', NULL, true, '2024-01-01'),
  ('55555555-5555-5555-5555-555555555555', 'CLS001', 'Chụp X-quang ngực', 'Chẩn đoán hình ảnh', 'Chẩn đoán hình ảnh', 300000, 250000, 'Chụp X-quang ngực thẳng', NULL, true, '2024-01-01');

-- 7. INSERT LAB TEST TEMPLATES
INSERT INTO lab_test_templates (id, code, name, category, department, sample_type, parameters, price, insurance_price, turnaround_time, preparation_instructions, description, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'CBC', 'Công thức máu toàn phần', 'Huyết học', 'Xét nghiệm', 'Máu tĩnh mạch', '[
    {"id": "1", "name": "Hồng cầu (RBC)", "unit": "10^12/L", "normalRanges": [{"parameter": "Hồng cầu (RBC)", "minValue": 4.5, "maxValue": 5.5, "unit": "10^12/L", "gender": "male"}, {"parameter": "Hồng cầu (RBC)", "minValue": 4.0, "maxValue": 5.0, "unit": "10^12/L", "gender": "female"}], "criticalValues": {"low": 2.5, "high": 7.0}, "isRequired": true, "order": 1},
    {"id": "2", "name": "Bạch cầu (WBC)", "unit": "10^9/L", "normalRanges": [{"parameter": "Bạch cầu (WBC)", "minValue": 4.0, "maxValue": 10.0, "unit": "10^9/L", "gender": "both"}], "criticalValues": {"low": 2.0, "high": 30.0}, "isRequired": true, "order": 2},
    {"id": "3", "name": "Tiểu cầu (PLT)", "unit": "10^9/L", "normalRanges": [{"parameter": "Tiểu cầu (PLT)", "minValue": 150, "maxValue": 450, "unit": "10^9/L", "gender": "both"}], "criticalValues": {"low": 50, "high": 1000}, "isRequired": true, "order": 3},
    {"id": "4", "name": "Hemoglobin (Hb)", "unit": "g/L", "normalRanges": [{"parameter": "Hemoglobin (Hb)", "minValue": 130, "maxValue": 170, "unit": "g/L", "gender": "male"}, {"parameter": "Hemoglobin (Hb)", "minValue": 120, "maxValue": 150, "unit": "g/L", "gender": "female"}], "criticalValues": {"low": 70, "high": 200}, "isRequired": true, "order": 4},
    {"id": "5", "name": "Hematocrit (Hct)", "unit": "%", "normalRanges": [{"parameter": "Hematocrit (Hct)", "minValue": 40, "maxValue": 50, "unit": "%", "gender": "male"}, {"parameter": "Hematocrit (Hct)", "minValue": 36, "maxValue": 46, "unit": "%", "gender": "female"}], "isRequired": true, "order": 5}
  ]', 150000, 120000, 2, 'Không cần nhịn ăn', 'Xét nghiệm đánh giá tình trạng máu tổng quát', true),
  
  ('22222222-2222-2222-2222-222222222222', 'URINE', 'Tổng phân tích nước tiểu', 'Sinh hóa nước tiểu', 'Xét nghiệm', 'Nước tiểu', '[
    {"id": "6", "name": "Protein", "unit": "mg/dL", "normalRanges": [{"parameter": "Protein", "minValue": 0, "maxValue": 15, "unit": "mg/dL", "gender": "both"}], "isRequired": true, "order": 1},
    {"id": "7", "name": "Glucose", "unit": "mg/dL", "normalRanges": [{"parameter": "Glucose", "minValue": 0, "maxValue": 15, "unit": "mg/dL", "gender": "both"}], "isRequired": true, "order": 2},
    {"id": "8", "name": "Ketones", "unit": "mg/dL", "normalRanges": [{"parameter": "Ketones", "minValue": 0, "maxValue": 5, "unit": "mg/dL", "gender": "both"}], "isRequired": true, "order": 3}
  ]', 80000, 60000, 1, 'Lấy nước tiểu giữa dòng, buổi sáng', 'Xét nghiệm tổng quát nước tiểu', true),
  
  ('33333333-3333-3333-3333-333333333333', 'LIPID', 'Lipid máu', 'Sinh hóa máu', 'Xét nghiệm', 'Máu tĩnh mạch', '[
    {"id": "9", "name": "Cholesterol toàn phần", "unit": "mg/dL", "normalRanges": [{"parameter": "Cholesterol toàn phần", "minValue": 0, "maxValue": 200, "unit": "mg/dL", "gender": "both"}], "criticalValues": {"high": 300}, "isRequired": true, "order": 1},
    {"id": "10", "name": "HDL-Cholesterol", "unit": "mg/dL", "normalRanges": [{"parameter": "HDL-Cholesterol", "minValue": 40, "maxValue": 999, "unit": "mg/dL", "gender": "male"}, {"parameter": "HDL-Cholesterol", "minValue": 50, "maxValue": 999, "unit": "mg/dL", "gender": "female"}], "isRequired": true, "order": 2},
    {"id": "11", "name": "LDL-Cholesterol", "unit": "mg/dL", "normalRanges": [{"parameter": "LDL-Cholesterol", "minValue": 0, "maxValue": 100, "unit": "mg/dL", "gender": "both"}], "criticalValues": {"high": 190}, "isRequired": true, "order": 3},
    {"id": "12", "name": "Triglycerides", "unit": "mg/dL", "normalRanges": [{"parameter": "Triglycerides", "minValue": 0, "maxValue": 150, "unit": "mg/dL", "gender": "both"}], "criticalValues": {"high": 500}, "isRequired": true, "order": 4}
  ]', 200000, 160000, 4, 'Nhịn ăn 12 giờ trước khi lấy máu', 'Xét nghiệm mỡ máu đánh giá nguy cơ tim mạch', true);

-- 8. INSERT INSURANCE PROVIDERS
INSERT INTO insurance_providers (id, code, name, contact_person, phone, email, address, contract_number, coverage_percent, max_coverage_amount, excluded_services, status, contract_start_date, contract_end_date) VALUES
  ('11111111-1111-1111-1111-111111111111', 'BHXH', 'Bảo hiểm Xã hội Việt Nam', 'Nguyễn Văn Thành', '0281234567', 'contact@baohiemxahoi.gov.vn', 'Số 170 Đường Đề Thám, Quận 1, TP.HCM', 'HĐ-BHXH-2024-001', 80, 50000000, '{}', 'active', '2024-01-01', '2024-12-31'),
  ('22222222-2222-2222-2222-222222222222', 'BHTN', 'Bảo hiểm Bảo Việt', 'Trần Thị Hương', '0287654321', 'healthcare@baoviet.com.vn', 'Số 8 Lê Thánh Tôn, Quận 1, TP.HCM', 'HĐ-BV-2024-002', 70, 100000000, '{"Thẩm mỹ", "Điều trị không cần thiết"}', 'active', '2024-01-01', '2024-12-31');

-- 9. INSERT APPOINTMENTS
INSERT INTO appointments (id, patient_id, doctor_id, department, appointment_date, appointment_time, type, status, notes) VALUES
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Nội khoa', '2024-12-31', '09:00', 'checkup', 'scheduled', 'Khám định kỳ'),
  ('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '66666666-6666-6666-6666-666666666666', 'Sản khoa', '2024-12-31', '10:30', 'followup', 'confirmed', NULL),
  ('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Nội khoa', '2024-12-15', '14:30', 'followup', 'completed', 'Tái khám huyết áp'),
  ('44444444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '77777777-7777-7777-7777-777777777777', 'Ngoại khoa', '2024-12-20', '08:30', 'checkup', 'completed', NULL);

-- 10. INSERT MEDICAL RECORDS
INSERT INTO medical_records (id, appointment_id, patient_id, doctor_id, department, visit_date, visit_time, chief_complaint, symptoms, vital_signs, physical_examination, diagnosis, icd_code, treatment, prescription, lab_tests, follow_up_date, follow_up_instructions, status) VALUES
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Nội khoa', '2024-12-15', '14:30', 'Đau đầu, chóng mặt', 'Bệnh nhân than phiền đau đầu kéo dài 3 ngày, kèm theo chóng mặt nhẹ', '{"temperature": "37.2", "bloodPressure": "140/90", "heartRate": "85", "respiratoryRate": "18", "weight": "70", "height": "170"}', 'Tim phổi bình thường, huyết áp cao', 'Tăng huyết áp nguyên phát', 'I10', 'Thuốc hạ huyết áp, chế độ ăn ít muối', '[{"id": "1", "medicineId": "33333333-3333-3333-3333-333333333333", "medicineName": "Amlodipine 5mg", "dosage": "5mg", "frequency": "1 lần/ngày", "duration": "30 ngày", "instructions": "Uống sau ăn sáng", "quantity": 30}]', '{"Xét nghiệm máu tổng quát", "Đo điện tim"}', '2025-01-15', 'Tái khám sau 1 tháng, theo dõi huyết áp tại nhà', 'completed');

-- 11. INSERT LAB TESTS
INSERT INTO lab_tests (id, code, patient_id, template_id, ordered_by, department, ordered_date, ordered_time, sample_type, sample_collected_date, sample_collected_time, sample_collected_by, priority, status, result_date, result_time, result_by, verified_date, verified_by, results, interpretation, technical_notes, price, insurance_price, is_urgent, is_critical) VALUES
  ('11111111-1111-1111-1111-111111111111', 'XN2024-001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Nội khoa', '2024-12-15', '09:30', 'Máu tĩnh mạch', '2024-12-15', '10:00', 'KTV. Trần Thị Hoa', 'routine', 'completed', '2024-12-15', '14:30', 'KTV. Lê Văn Minh', '2024-12-15', 'BS. Phạm Thị Lan', '[
    {"id": "1", "parameter": "Hồng cầu (RBC)", "value": "4.8", "unit": "10^12/L", "referenceRange": "4.5-5.5", "status": "normal", "method": "Flow cytometry", "instrument": "Sysmex XN-1000"},
    {"id": "2", "parameter": "Bạch cầu (WBC)", "value": "7.2", "unit": "10^9/L", "referenceRange": "4.0-10.0", "status": "normal", "method": "Flow cytometry", "instrument": "Sysmex XN-1000"},
    {"id": "3", "parameter": "Tiểu cầu (PLT)", "value": "280", "unit": "10^9/L", "referenceRange": "150-450", "status": "normal", "method": "Flow cytometry", "instrument": "Sysmex XN-1000"},
    {"id": "4", "parameter": "Hemoglobin (Hb)", "value": "145", "unit": "g/L", "referenceRange": "130-170", "status": "normal", "method": "Spectrophotometry", "instrument": "Sysmex XN-1000"},
    {"id": "5", "parameter": "Hematocrit (Hct)", "value": "42", "unit": "%", "referenceRange": "40-50", "status": "normal", "method": "Calculated", "instrument": "Sysmex XN-1000"}
  ]', 'Kết quả xét nghiệm trong giới hạn bình thường', 'Mẫu đạt chất lượng, không có hiện tượng đông máu', 150000, 120000, false, false),
  
  ('22222222-2222-2222-2222-222222222222', 'XN2024-002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'Sản khoa', '2024-12-29', '11:00', 'Nước tiểu', '2024-12-29', '11:30', 'Điều dưỡng Nguyễn Thị Hương', 'routine', 'completed', '2024-12-29', '15:00', 'KTV. Võ Thị Nga', '2024-12-29', 'BS. Phạm Thị Lan', '[
    {"id": "6", "parameter": "Protein", "value": "Âm tính", "unit": "", "referenceRange": "Âm tính", "status": "normal", "method": "Dipstick"},
    {"id": "7", "parameter": "Glucose", "value": "Âm tính", "unit": "", "referenceRange": "Âm tính", "status": "normal", "method": "Dipstick"},
    {"id": "8", "parameter": "Ketones", "value": "Âm tính", "unit": "", "referenceRange": "Âm tính", "status": "normal", "method": "Dipstick"},
    {"id": "9", "parameter": "Bạch cầu", "value": "2-3", "unit": "/HPF", "referenceRange": "0-5", "status": "normal", "method": "Microscopy"},
    {"id": "10", "parameter": "Hồng cầu", "value": "0-1", "unit": "/HPF", "referenceRange": "0-2", "status": "normal", "method": "Microscopy"}
  ]', 'Kết quả xét nghiệm nước tiểu bình thường', 'Mẫu nước tiểu trong, không có tạp chất', 80000, 60000, false, false),
  
  ('33333333-3333-3333-3333-333333333333', 'XN2024-003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Nội khoa', '2024-12-31', '08:00', 'Máu tĩnh mạch', '2024-12-31', '08:30', 'KTV. Trần Thị Hoa', 'routine', 'in-progress', NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL, 200000, 160000, false, false);

-- 12. INSERT INVOICES (Fixed payment_method values)
INSERT INTO invoices (id, invoice_number, patient_id, appointment_id, services, medicines, lab_tests, subtotal, discount_amount, discount_percent, tax_amount, tax_percent, total_amount, paid_amount, remaining_amount, payment_method, status, created_by, due_date, paid_date, insurance_coverage, insurance_claim_number) VALUES
  ('11111111-1111-1111-1111-111111111111', 'HD2024-001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', '[
    {"id": "1", "type": "service", "code": "SV001", "name": "Khám nội khoa", "description": "Khám bệnh nội khoa tổng quát", "quantity": 1, "unitPrice": 200000, "discountPercent": 0, "discountAmount": 0, "totalPrice": 200000, "doctorId": "22222222-2222-2222-2222-222222222222", "doctorName": "BS. Nguyễn Văn A", "department": "Nội khoa"}
  ]', '[
    {"id": "2", "type": "medicine", "code": "MED003", "name": "Amlodipine 5mg", "description": "Thuốc hạ huyết áp", "quantity": 30, "unitPrice": 2000, "discountPercent": 0, "discountAmount": 0, "totalPrice": 60000}
  ]', '[
    {"id": "3", "type": "lab_test", "code": "XN001", "name": "Xét nghiệm máu tổng quát", "description": "Xét nghiệm công thức máu", "quantity": 1, "unitPrice": 150000, "discountPercent": 0, "discountAmount": 0, "totalPrice": 150000}
  ]', 410000, 0, 0, 0, 0, 410000, 410000, 0, 'insurance', 'paid', '33333333-3333-3333-3333-333333333333', '2024-12-15', '2024-12-15', 328000, 'BH2024-001'),
  
  ('22222222-2222-2222-2222-222222222222', 'HD2024-002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '[
    {"id": "4", "type": "service", "code": "SV002", "name": "Khám sản khoa", "description": "Khám bệnh sản khoa", "quantity": 1, "unitPrice": 250000, "discountPercent": 10, "discountAmount": 25000, "totalPrice": 225000, "doctorId": "66666666-6666-6666-6666-666666666666", "doctorName": "BS. Lê Thị B", "department": "Sản khoa"}
  ]', '[]', '[
    {"id": "5", "type": "lab_test", "code": "XN002", "name": "Xét nghiệm nước tiểu", "description": "Xét nghiệm tổng quát nước tiểu", "quantity": 1, "unitPrice": 80000, "discountPercent": 0, "discountAmount": 0, "totalPrice": 80000}
  ]', 330000, 25000, 7.6, 0, 0, 305000, 150000, 155000, 'mixed', 'partial', '33333333-3333-3333-3333-333333333333', '2025-01-05', NULL, NULL, NULL),
  
  ('33333333-3333-3333-3333-333333333333', 'HD2024-003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NULL, '[
    {"id": "6", "type": "service", "code": "SV001", "name": "Khám nội khoa", "description": "Khám bệnh nội khoa tổng quát", "quantity": 1, "unitPrice": 200000, "discountPercent": 0, "discountAmount": 0, "totalPrice": 200000, "doctorId": "22222222-2222-2222-2222-222222222222", "doctorName": "BS. Nguyễn Văn A", "department": "Nội khoa"}
  ]', '[
    {"id": "7", "type": "medicine", "code": "MED001", "name": "Paracetamol 500mg", "description": "Thuốc giảm đau, hạ sốt", "quantity": 20, "unitPrice": 500, "discountPercent": 0, "discountAmount": 0, "totalPrice": 10000}
  ]', '[
    {"id": "8", "type": "lab_test", "code": "CLS001", "name": "Chụp X-quang ngực", "description": "Chụp X-quang ngực thẳng", "quantity": 1, "unitPrice": 300000, "discountPercent": 0, "discountAmount": 0, "totalPrice": 300000}
  ]', 510000, 0, 0, 0, 0, 510000, 0, 510000, 'cash', 'pending', '33333333-3333-3333-3333-333333333333', '2025-01-07', NULL, 408000, 'BH2024-003');

-- 13. INSERT PAYMENT TRANSACTIONS
INSERT INTO payment_transactions (id, invoice_id, amount, payment_method, payment_reference, status, processed_by, processed_at, notes, receipt_number) VALUES
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 82000, 'cash', NULL, 'completed', '33333333-3333-3333-3333-333333333333', '2024-12-15 10:30:00+07', 'Thanh toán phần tự trả sau bảo hiểm', 'BT2024-001'),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 150000, 'card', 'VCB20241229001', 'completed', '33333333-3333-3333-3333-333333333333', '2024-12-29 15:45:00+07', 'Thanh toán một phần bằng thẻ', 'BT2024-002'),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 328000, 'insurance', 'BH2024-001', 'completed', '33333333-3333-3333-3333-333333333333', '2024-12-15 10:30:00+07', 'Thanh toán qua bảo hiểm xã hội', 'BT2024-003');

-- 14. INSERT STOCK TRANSACTIONS
INSERT INTO stock_transactions (id, type, medicine_id, batch_number, quantity, unit_price, total_value, reason, supplier_id, expiry_date, location, performed_by, performed_at, notes, status, invoice_number) VALUES
  ('11111111-1111-1111-1111-111111111111', 'import', '11111111-1111-1111-1111-111111111111', 'PA240101', 500, 450, 225000, 'Nhập kho định kỳ', '11111111-1111-1111-1111-111111111111', '2025-12-31', 'Kệ A1-01', '44444444-4444-4444-4444-444444444444', '2024-12-28 08:30:00+07', 'Nhập theo hợp đồng tháng 12', 'completed', 'HD001-2024'),
  ('22222222-2222-2222-2222-222222222222', 'export', '22222222-2222-2222-2222-222222222222', 'AM240205', 20, NULL, NULL, 'Cấp phát theo đơn thuốc', NULL, NULL, NULL, '44444444-4444-4444-4444-444444444444', '2024-12-30 14:15:00+07', 'Đơn thuốc BN001', 'completed', NULL),
  ('33333333-3333-3333-3333-333333333333', 'import', '44444444-4444-4444-4444-444444444444', 'VC240115', 100, 700, 70000, 'Bổ sung tồn kho', '33333333-3333-3333-3333-333333333333', '2025-03-15', 'Kệ D1-02', '44444444-4444-4444-4444-444444444444', '2024-12-29 10:00:00+07', NULL, 'completed', 'HD002-2024');

-- 15. INSERT STOCK ALERTS
INSERT INTO stock_alerts (id, medicine_id, alert_type, current_stock, min_stock, expiry_date, days_to_expiry, severity, is_read) VALUES
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'low_stock', 45, 50, NULL, NULL, 'medium', false),
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'low_stock', 15, 30, NULL, NULL, 'high', false),
  ('33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'out_of_stock', 0, 100, NULL, NULL, 'critical', false),
  ('44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'expiry_warning', 0, NULL, '2025-01-10', 11, 'medium', true);