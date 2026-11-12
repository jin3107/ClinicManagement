import "./patientview.scss";
import { useEffect, useMemo, useState } from "react";
import { Descriptions, Tabs, Table, Card, Col, Row, Select, message, Spin } from "antd";
import { searchBenhNhan, searchPhieuKham, searchDonThuoc } from "../../../apis";
import { normalizeBenhNhan, normalizePhieuKham, normalizeDonThuoc } from "../../../models";

const getSearchRows = (response) => {
  const payload = response?.data ?? {};
  const searchData = payload?.data ?? payload?.Data ?? {};
  return searchData?.data ?? searchData?.Data ?? [];
};

const toDateValue = (value) => {
  if (!value) return null;
  if (value?.toDate) return value.toDate();
  return new Date(value);
};

const formatDate = (value) => {
  const date = toDateValue(value);
  if (!date || Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN");
};

export default function PatientView() {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [phieuKhams, setPhieuKhams] = useState([]);
  const [donThuocs, setDonThuocs] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(
    sessionStorage.getItem("patientId") || "",
  );
  const [messageApi, contextHolder] = message.useMessage();

  const loadData = async () => {
    setLoading(true);
    try {
      const [benhNhanRes, phieuKhamRes, donThuocRes] = await Promise.all([
        searchBenhNhan(null, 1, 2000),
        searchPhieuKham(null, 1, 2000),
        searchDonThuoc(null, 1, 2000),
      ]);

      const benhNhanRows = getSearchRows(benhNhanRes);
      const phieuKhamRows = getSearchRows(phieuKhamRes);
      const donThuocRows = getSearchRows(donThuocRes);

      setPatients(Array.isArray(benhNhanRows) ? benhNhanRows.map(normalizeBenhNhan) : []);
      setPhieuKhams(Array.isArray(phieuKhamRows) ? phieuKhamRows.map(normalizePhieuKham) : []);
      setDonThuocs(Array.isArray(donThuocRows) ? donThuocRows.map(normalizeDonThuoc) : []);
    } catch {
      messageApi.error("Không tải được dữ liệu bệnh nhân.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedPatient = useMemo(() => {
    if (!selectedPatientId) return null;
    return patients.find((item) => item.maBN === selectedPatientId) || null;
  }, [patients, selectedPatientId]);

  const patientOptions = useMemo(() => {
    return patients.map((patient) => ({
      value: patient.maBN,
      label: patient.hoTen,
    }));
  }, [patients]);

  const historyRows = useMemo(() => {
    if (!selectedPatient) return [];
    const filtered = phieuKhams.filter(
      (item) => item.tenBenhNhan === selectedPatient.hoTen,
    );
    return filtered.map((item) => ({
      key: item.maPK,
      date: formatDate(item.ngayKham),
      doctor: item.tenBacSi || "Chưa cập nhật",
      diagnosis: item.chuanDoan || "Chưa cập nhật",
      service: item.trangThaiTiepNhan || "Chưa cập nhật",
      maPK: item.maPK,
    }));
  }, [phieuKhams, selectedPatient]);

  const latestPrescription = useMemo(() => {
    if (!selectedPatient) return null;
    const relatedPhieuKhams = phieuKhams.filter(
      (item) => item.tenBenhNhan === selectedPatient.hoTen,
    );
    const maPKSet = new Set(relatedPhieuKhams.map((item) => item.maPK));
    const relatedDonThuocs = donThuocs.filter((item) => maPKSet.has(item.maPK));
    if (!relatedDonThuocs.length) return null;
    return relatedDonThuocs.sort((a, b) => {
      const dateA = toDateValue(a.ngayKe)?.getTime() || 0;
      const dateB = toDateValue(b.ngayKe)?.getTime() || 0;
      return dateB - dateA;
    })[0];
  }, [donThuocs, phieuKhams, selectedPatient]);

  const columns = [
    { title: "Ngày khám", dataIndex: "date", key: "date", width: 130 },
    { title: "Bác sĩ", dataIndex: "doctor", key: "doctor" },
    { title: "Chẩn đoán", dataIndex: "diagnosis", key: "diagnosis" },
    { title: "Trạng thái", dataIndex: "service", key: "service" },
  ];

  return (
    <div className="doctor-patient-view-page">
      {contextHolder}
      <div className="doctor-page-header">
        <div>
          <p>
            Tra cứu hồ sơ cá nhân, lịch sử khám, chẩn đoán, toa thuốc và dịch vụ
            đã sử dụng.
          </p>
        </div>
      </div>

      <div className="note-group">
        <Select
          placeholder="Tìm kiếm bệnh nhân"
          showSearch
          options={patientOptions}
          optionFilterProp="label"
          value={selectedPatientId || undefined}
          onChange={(value) => {
            setSelectedPatientId(value);
            sessionStorage.setItem("patientId", value);
          }}
        />
      </div>

      <Spin spinning={loading} description="Đang tải...">
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={15}>
            <Card className="doctor-card">
              <Tabs
                defaultActiveKey="history"
                items={[
                  {
                    key: "history",
                    label: "Lịch sử khám",
                    children: (
                      <Table
                        className="doctor-table"
                        columns={columns}
                        dataSource={historyRows}
                        pagination={false}
                        scroll={{ x: 720 }}
                        locale={{ emptyText: "Chưa có lịch sử khám." }}
                      />
                    ),
                  },
                  {
                    key: "medicine",
                    label: "Toa thuốc gần nhất",
                    children: latestPrescription ? (
                      <Card className="doctor-card">
                        <div className="prescription-paper">
                          <div className="prescription-header">
                            <h2>TOA THUỐC</h2>
                            <span>Ngày kê: {formatDate(latestPrescription.ngayKe)}</span>
                          </div>

                          <div className="prescription-patient">
                            <div className="patient-row">
                              <p><strong>Bệnh nhân:</strong> {selectedPatient?.hoTen}</p>
                              <p><strong>Giới tính:</strong> {selectedPatient?.gioiTinh ? "Nam" : "Nữ"}</p>
                            </div>

                            <div className="patient-row">
                              <p><strong>Ngày sinh:</strong> {formatDate(selectedPatient?.ngaySinh)}</p>
                              <p><strong>Số điện thoại:</strong> {selectedPatient?.soDienThoai || "--"}</p>
                            </div>

                            <div className="patient-row">
                              <p><strong>Địa chỉ:</strong> {selectedPatient?.diaChi || "--"}</p>
                            </div>
                          </div>
                          <div className="prescription-list">
                            {(latestPrescription.chiTietDonThuocs || []).map((item, index) => (
                              <div className="prescription-row" key={item.maCTDT || index}>
                                <div className="prescription-line">
                                  <span className="medicine-name">
                                    {index + 1}. {item.tenThuoc}
                                  </span>

                                  <span className="medicine-quantity">
                                    SL: {item.soLuong}
                                  </span>
                                </div>

                                <div className="medicine-dosage">
                                  {item.lieuDung}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="prescription-footer">
                            <p>Lưu ý: Uống thuốc đúng liều lượng.</p>

                            <div className="doctor-sign">
                              <strong>Bác sĩ điều trị</strong>
                              <span>{phieuKhams.find((pk) => pk.maPK === latestPrescription.maPK)?.tenBacSi || "--"}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <div className="empty-note">Chưa có toa thuốc.</div>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
          <Col xs={24} xl={9}>
            <Card title="Hồ sơ bệnh nhân" className="doctor-card">
              <Descriptions column={1} size="middle">
                <Descriptions.Item label="Họ tên">
                  {selectedPatient?.hoTen || "--"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">
                  {formatDate(selectedPatient?.ngaySinh) || "--"}
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  {selectedPatient ? (selectedPatient.gioiTinh ? "Nam" : "Nữ") : "--"}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {selectedPatient?.soDienThoai || "--"}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  {selectedPatient?.diaChi || "--"}
                </Descriptions.Item>
                <Descriptions.Item label="Số BHYT">
                  {selectedPatient?.soBHYT || "--"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}
