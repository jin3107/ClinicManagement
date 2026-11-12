import "./prescription.scss";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
  message,
  Spin,
} from "antd";
import {
  searchDanhMucThuoc,
  searchPhieuKham,
  searchDonThuoc,
  searchLichHen,
  searchBenhNhan,
  createDonThuoc,
  updateDonThuoc,
  updatePhieuKham,
} from "../../../apis";
import { createFilter, toLocalDateString } from "../../../helpers";
import {
  createChiTietDonThuocRequest,
  createDonThuocRequest,
  createPhieuKhamRequest,
} from "../../../interfaces";
import {
  normalizeDanhMucThuoc,
  normalizePhieuKham,
  normalizeDonThuoc,
  normalizeLichHen,
  normalizeBenhNhan,
} from "../../../models";

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

const formatTime = (value) => {
  const date = toDateValue(value);
  if (!date || Number.isNaN(date.getTime())) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function Prescription() {
  const [addForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [phieuKhams, setPhieuKhams] = useState([]);
  const [donThuocs, setDonThuocs] = useState([]);
  const [lichHens, setLichHens] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPhieuKhamId, setSelectedPhieuKhamId] = useState(
    sessionStorage.getItem("currentPhieuKhamId") || "",
  );
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const loadData = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const [thuocRes, phieuKhamRes, donThuocRes, lichHenRes, benhNhanRes] = await Promise.all([
        searchDanhMucThuoc(null, 1, 2000),
        searchPhieuKham([createFilter("Ngày khám", toLocalDateString(today))], 1, 2000),
        searchDonThuoc(null, 1, 2000),
        searchLichHen([createFilter("Thời gian khám", toLocalDateString(today))], 1, 2000),
        searchBenhNhan(null, 1, 2000),
      ]);

      const thuocRows = getSearchRows(thuocRes);
      const phieuKhamRows = getSearchRows(phieuKhamRes);
      const donThuocRows = getSearchRows(donThuocRes);
      const lichHenRows = getSearchRows(lichHenRes);
      const benhNhanRows = getSearchRows(benhNhanRes);

      setMedicines(Array.isArray(thuocRows) ? thuocRows.map(normalizeDanhMucThuoc) : []);
      setPhieuKhams(Array.isArray(phieuKhamRows) ? phieuKhamRows.map(normalizePhieuKham) : []);
      setDonThuocs(Array.isArray(donThuocRows) ? donThuocRows.map(normalizeDonThuoc) : []);
      setLichHens(Array.isArray(lichHenRows) ? lichHenRows.map(normalizeLichHen) : []);
      setPatients(Array.isArray(benhNhanRows) ? benhNhanRows.map(normalizeBenhNhan) : []);
    } catch {
      messageApi.error("Không tải được danh mục thuốc.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const phieuKhamOptions = useMemo(() => {
    return phieuKhams.map((item) => ({
      value: item.maPK,
      label: `${item.tenBenhNhan || "Bệnh nhân"} - ${formatDate(item.ngayKham)}`,
    }));
  }, [phieuKhams]);

  const currentPhieuKham = useMemo(() => {
    if (!selectedPhieuKhamId) return null;
    return phieuKhams.find((item) => item.maPK === selectedPhieuKhamId) || null;
  }, [phieuKhams, selectedPhieuKhamId]);

  const currentAppointment = useMemo(() => {
    if (!currentPhieuKham?.maLH) return null;
    return lichHens.find((item) => item.maLH === currentPhieuKham.maLH) || null;
  }, [currentPhieuKham, lichHens]);

  const currentPatient = useMemo(() => {
    if (!currentAppointment?.maBN) return null;
    return patients.find((item) => item.maBN === currentAppointment.maBN) || null;
  }, [currentAppointment, patients]);

  const currentDonThuoc = useMemo(() => {
    if (!currentPhieuKham?.maPK) return null;
    return donThuocs.find((item) => item.maPK === currentPhieuKham.maPK) || null;
  }, [currentPhieuKham, donThuocs]);

  useEffect(() => {
    if (!currentDonThuoc) {
      setPrescriptionItems([]);
      return;
    }
    const normalized = (currentDonThuoc.chiTietDonThuocs || []).map((item) => ({
      maThuoc: item.maThuoc,
      tenThuoc: item.tenThuoc,
      soLuong: item.soLuong,
      lieuDung: item.lieuDung,
      donGia: item.donGia,
      donVi: "Viên",
    }));
    setPrescriptionItems(normalized);
  }, [currentDonThuoc]);

  const columns = [
    { title: "Tên thuốc", dataIndex: "tenThuoc", key: "tenThuoc" },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
      render: (value, record) => `${value} ${record.donVi || ""}`,
    },
    { title: "Liều dùng", dataIndex: "lieuDung", key: "lieuDung" },
  ];

  const handleAddMedicine = (values) => {
    const medicine = medicines.find((item) => item.maThuoc === values.medicine);
    if (!medicine) return;

    if (prescriptionItems.some((item) => item.maThuoc === medicine.maThuoc)) {
      messageApi.warning(
        `${medicine.tenThuoc} đã có trong toa. Vui lòng sửa số lượng ở dòng hiện có thay vì thêm mới.`,
      );
      return;
    }

    const newItem = {
      maThuoc: medicine.maThuoc,
      tenThuoc: medicine.tenThuoc,
      soLuong: values.quantity,
      lieuDung: values.lieuDung,
      donGia: medicine.donGia,
      donVi: values.unit,
    };

    setPrescriptionItems((prev) => [...prev, newItem]);
    addForm.resetFields();
  };

  const handleSave = async () => {
    if (!currentPhieuKham?.maPK) {
      messageApi.error("Vui lòng chọn phiếu khám trước.");
      return;
    }
    if (!prescriptionItems.length) {
      messageApi.error("Vui lòng thêm ít nhất một thuốc.");
      return;
    }

    setLoading(true);
    try {
      const chiTiet = prescriptionItems.map((item) =>
        createChiTietDonThuocRequest("", item.maThuoc, item.soLuong, item.lieuDung),
      );
      const request = createDonThuocRequest(
        currentDonThuoc?.maDT || "",
        currentPhieuKham.maPK,
        chiTiet,
      );

      const response = currentDonThuoc
        ? await updateDonThuoc(request)
        : await createDonThuoc(request);

      const payload = response?.data ?? {};
      const isSuccess = payload?.isSuccess ?? payload?.IsSuccess ?? true;
      const msg = payload?.message ?? payload?.Message;

      if (!isSuccess) {
        messageApi.error(msg || "Không thể lưu toa thuốc.");
        return;
      }

      messageApi.success(msg || "Đã lưu toa thuốc.");
      await loadData();
    } catch (error) {
      const msg = error?.response?.data?.message ?? error?.response?.data?.Message;
      messageApi.error(msg || "Không thể lưu toa thuốc.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinishExam = async () => {
    if (!currentPhieuKham) {
      messageApi.error("Chưa có phiếu khám để hoàn tất.");
      return;
    }

    setLoading(true);
    try {
      const request = createPhieuKhamRequest(
        currentPhieuKham.maPK,
        currentPhieuKham.ngayKham,
        currentPhieuKham.trieuChung,
        currentPhieuKham.chuanDoan,
        currentPhieuKham.huongDieuTri,
        "Đã khám",
        currentPhieuKham.maLH,
        currentPhieuKham.maBS,
      );
      const response = await updatePhieuKham(request);
      const payload = response?.data ?? {};
      const isSuccess = payload?.isSuccess ?? payload?.IsSuccess ?? true;
      const msg = payload?.message ?? payload?.Message;

      if (!isSuccess) {
        messageApi.error(msg || "Không thể cập nhật trạng thái khám.");
        return;
      }

      messageApi.success(msg || "Đã hoàn tất khám.");
      await loadData();
    } catch (error) {
      const msg = error?.response?.data?.message ?? error?.response?.data?.Message;
      messageApi.error(msg || "Không thể cập nhật trạng thái khám.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-prescription-page">
      {contextHolder}
      <div className="doctor-page-header">
        <div>
          <p>
            Lập toa thuốc cho bệnh nhân, gồm tên thuốc, số lượng và ghi chú liều
            dùng theo đúng đặc tả màn hình.
          </p>
        </div>
      </div>

      <Spin spinning={loading} description="Đang tải...">
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={9}>
            <Card title="Thông tin toa thuốc" className="doctor-card">
              <div className="note-group">
                <label>Phiếu khám</label>
                <Select
                  placeholder="Chọn phiếu khám"
                  options={phieuKhamOptions}
                  value={selectedPhieuKhamId || undefined}
                  onChange={(value) => {
                    setSelectedPhieuKhamId(value);
                    sessionStorage.setItem("currentPhieuKhamId", value);
                  }}
                />
              </div>

              <div className="medical-ticket">
                <div className="ticket-row">
                  <span>
                    Họ và tên: <strong>{currentPatient?.hoTen || currentPhieuKham?.tenBenhNhan || "--"}</strong>
                  </span>
                </div>
                <div className="ticket-row">
                  <span>
                    Số điện thoại: <strong>{currentPatient?.soDienThoai || "--"}</strong>
                  </span>
                </div>
                <div className="ticket-row">
                  <span>
                    Mã BHYT: <strong>{currentPatient?.soBHYT || "--"}</strong>
                  </span>
                </div>
                <div className="ticket-row">
                  <span>
                    Giờ khám: <strong>{currentAppointment ? `${formatDate(currentAppointment.thoiGianKham)} ${formatTime(currentAppointment.thoiGianKham)}` : "--"}</strong>
                  </span>
                </div>
                <div className="ticket-row">
                  <span>
                    Bác sĩ: <strong>{currentPhieuKham?.tenBacSi || "--"}</strong>
                  </span>
                </div>
              </div>

              <Form
                className="doctor-form add-medicine-form"
                layout="vertical"
                form={addForm}
                onFinish={handleAddMedicine}
              >
                <div className="note-group">
                  <label>Tên Thuốc</label>
                  <Form.Item
                    name="medicine"
                    rules={[{ required: true, message: "Chọn thuốc" }]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      options={medicines.map((item) => ({
                        value: item.maThuoc,
                        label: item.tenThuoc,
                      }))}
                    />
                  </Form.Item>
                </div>

                <Row gutter={12}>
                  <Col xs={12}>
                    <div className="note-group">
                      <label>Số lượng</label>
                      <Form.Item
                        name="quantity"
                        rules={[{ required: true, message: "Nhập số lượng" }]}
                      >
                        <InputNumber min={1} className="full-width" />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="note-group">
                      <label>Đơn vị</label>
                      <Form.Item
                        name="unit"
                        rules={[{ required: true, message: "Chọn đơn vị" }]}
                      >
                        <Select
                          options={[
                            { value: "Viên", label: "Viên" },
                            { value: "Gói", label: "Gói" },
                            { value: "Chai", label: "Chai" },
                            { value: "Hộp", label: "Hộp" },
                          ]}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
                <div className="note-group">
                  <label>Liều dùng</label>
                  <Form.Item name="lieuDung">
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </div>
                <Button type="primary" block htmlType="submit">
                  Thêm vào toa thuốc
                </Button>
              </Form>
            </Card>
          </Col>

          <Col xs={24} xl={15}>
            <Card title="Danh sách thuốc đã kê" className="doctor-card">
              <Table
                className="doctor-table"
                columns={columns}
                dataSource={prescriptionItems.map((item, index) => ({
                  key: `${item.maThuoc}-${index}`,
                  ...item,
                }))}
                pagination={false}
                scroll={{ x: 720 }}
                locale={{ emptyText: "Chưa có thuốc." }}
              />
              <div className="prescription-note">
                <strong>Lưu ý:</strong> Uống thuốc đúng liều lượng
              </div>
              <Space wrap className="prescription-actions">
                <Button type="primary" onClick={handleSave}>
                  Lưu toa thuốc
                </Button>
                <Button onClick={handleFinishExam}>Hoàn tất khám</Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}
