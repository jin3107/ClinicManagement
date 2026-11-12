-- Dữ liệu mẫu cho bảng `medicines` (Danh mục thuốc) và `medicalservices` (Danh mục dịch vụ)
-- Chạy trực tiếp trên database clinicmanagement (sau khi đã migrate schema mới).

INSERT INTO `medicines`
  (`MaThuoc`, `TenThuoc`, `DonGia`, `ChongChiDinh`, `CreatedOn`, `CreatedBy`, `ModifiedOn`, `ModifiedBy`, `IsDeleted`)
VALUES
  ('6f370d68-be2f-4bdd-b0e2-52390662728f', 'Paracetamol 500mg', 2000, 'Suy gan nặng', '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('6a477966-7524-4950-8513-9571ebf71774', 'Amoxicillin 500mg', 3500, 'Dị ứng nhóm Penicillin', '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('c0daf6c9-08d7-4069-80c7-230f75b0efdb', 'Vitamin C 500mg', 1500, NULL, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('c4e4a10b-e48e-4acf-b895-be22463b9c29', 'Omeprazole 20mg', 4000, NULL, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('48a415b9-df7c-41f8-90c9-4dd25f5029cf', 'Cetirizine 10mg', 2500, NULL, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('88de36db-6f0f-4a62-9f90-2e44e1b520b0', 'Ibuprofen 400mg', 3000, 'Loét dạ dày, hen suyễn', '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('0fc9bb20-f2b0-4c6d-baa2-f480bd68be77', 'Loratadine 10mg', 2800, NULL, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('e409ca8a-fbe7-4eec-be67-8839e4bdaa8e', 'Metformin 500mg', 3200, 'Suy thận nặng', '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('eee96a10-5e9f-4a33-bbd2-aaf96b6b295a', 'Salbutamol (dạng xịt)', 45000, 'Rối loạn nhịp tim', '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('0b43b00e-8cc8-4c55-951b-8e047d3a90cb', 'Berberin 100mg', 1200, NULL, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('39caf772-df92-4306-86c6-160e8e3f94c0', 'Oresol (bù nước điện giải)', 5000, NULL, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('4778e633-936f-475e-863b-c9920eba3a39', 'Clorpheniramine 4mg', 1000, NULL, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('7481b620-082b-4deb-8d8d-d64c8494ea41', 'Diclofenac 50mg', 2500, 'Loét dạ dày tá tràng', '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('f3d9448c-4faf-4e1f-bda5-7f291f70817a', 'Domperidone 10mg', 3000, NULL, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('3eb7fd76-98d4-44e3-a444-56dbe15e48ae', 'Amlodipine 5mg', 3500, 'Hạ huyết áp nặng', '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0);

INSERT INTO `medicalservices`
  (`MaDV`, `TenDV`, `DonGia`, `CreatedOn`, `CreatedBy`, `ModifiedOn`, `ModifiedBy`, `IsDeleted`)
VALUES
  ('5f26a867-9ab4-4e20-8297-8433c2be46c2', 'Khám tổng quát', 100000, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('8705a172-802f-4cba-bfab-59616c326155', 'Xét nghiệm máu tổng quát', 150000, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('12bdb561-6342-4a3f-ad4d-ffe747c1a947', 'Xét nghiệm nước tiểu', 80000, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('6152fed4-206d-40ea-a8ed-fe025a3a62d5', 'Chụp X-quang ngực', 200000, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('3c5c0906-8f73-4ab0-b3b0-643033141a87', 'Siêu âm bụng tổng quát', 250000, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('f7b0ec0e-6868-4aab-ae97-fd363b9b68fd', 'Đo điện tâm đồ (ECG)', 120000, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('457885a7-0116-47f8-a043-dfdccbd3da1f', 'Xét nghiệm đường huyết', 50000, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('be290a97-2bdc-46db-8169-6611363f24b2', 'Nội soi tai mũi họng', 180000, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('f5efcb33-c921-487f-b5cf-cf22cc505108', 'Xét nghiệm chức năng gan', 130000, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('3648ae09-0e7b-4262-9d77-61c95e54b2c7', 'Xét nghiệm chức năng thận', 130000, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('4aa4535f-04bb-41d9-a830-9550964eed84', 'Chích ngừa (tiêm chủng)', 90000, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('f971a21d-eeab-4e00-995d-f73960362d3f', 'Thay băng, cắt chỉ', 60000, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('9bd84e77-2ffb-40ab-a304-585dcffb2b8c', 'Đo huyết áp', 20000, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('03605ec0-bb3f-4edd-9ae7-e90948979785', 'Xét nghiệm HbA1c', 160000, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0),
  ('9d98df72-c090-4108-b8ec-7873d95d6f0c', 'Khám da liễu chuyên sâu', 150000, '2026-08-29 20:00:00.000000', 'tanchuonghuynh3@gmail.com', NULL, NULL, 0);
