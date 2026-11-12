import { useEffect, useMemo, useState } from "react";
import "./cancellation.scss";
import doctorImage from "../../../assets/image/doctor.jpg";
import {
  Alert,
  Table,
  Tag,
  Row,
  Col,
  Button,
  Popconfirm,
  message,
  Typography,
  Card,
  Steps,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  PhoneOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  searchLichHen,
  updateLichHen,
  searchBacSi,
  searchBenhNhan,
} from "../../../apis";
import { createLichHenRequest } from "../../../interfaces";
import {
  normalizeBacSi,
  normalizeBenhNhan,
  normalizeLichHen,
} from "../../../models";

const { Title } = Typography;

const STATUS_COLORS = {
  "Đã hủy": "red",
  "Chờ xác nhận": "blue",
  "Đã xác nhận": "green",
  "Đã đặt": "blue",
};

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

const getCurrentPhoneNumber = () =>
  sessionStorage.getItem("phoneNumber") || "";

export default function Cancellation() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [noPatientProfile, setNoPatientProfile] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const features = [
    "Lưu ý: Chỉ có thể hủy lịch trước giờ khám ít nhất 5 tiếng.",
    "Gợi ý: Bạn có thể đổi lịch thay vì hủy để giữ quyền lợi và tránh mất phí.",
    "Hỗ trợ: Liên hệ hotline nếu gặp vấn đề về thủ tục.",
  ];

  const resolvePatientId = (items) => {
    const storedId = sessionStorage.getItem("patientId");
    if (storedId && items.some((item) => item.maBN === storedId)) return storedId;

    const phoneNumber = getCurrentPhoneNumber();
    if (!phoneNumber) return "";
    const matched = items.find((item) => item.soDienThoai === phoneNumber);

    if (matched?.maBN) {
      sessionStorage.setItem("patientId", matched.maBN);
      return matched.maBN;
    }
    return "";
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [lichHenRes, bacSiRes, benhNhanRes] = await Promise.all([
        searchLichHen(null, 1, 2000),
        searchBacSi(null, 1, 2000),
        searchBenhNhan(null, 1, 2000),
      ]);

      const lichHenRows = getSearchRows(lichHenRes);
      const bacSiRows = getSearchRows(bacSiRes);
      const benhNhanRows = getSearchRows(benhNhanRes);

      const normalizedAppointments = Array.isArray(lichHenRows)
        ? lichHenRows.map(normalizeLichHen)
        : [];
      const normalizedDoctors = Array.isArray(bacSiRows)
        ? bacSiRows.map(normalizeBacSi)
        : [];
      const normalizedPatients = Array.isArray(benhNhanRows)
        ? benhNhanRows.map(normalizeBenhNhan)
        : [];

      const patientId = resolvePatientId(normalizedPatients);
      setNoPatientProfile(!patientId);
      const filteredAppointments = patientId
        ? normalizedAppointments.filter((item) => item.maBN === patientId)
        : [];

      setAppointments(filteredAppointments);
      setDoctors(normalizedDoctors);

      const storedAppointmentId = sessionStorage.getItem("currentLichHenId");
      if (storedAppointmentId) {
        const exists = filteredAppointments.some(
          (item) => item.maLH === storedAppointmentId,
        );
        if (exists) {
          setSelectedRowKeys([storedAppointmentId]);
        }
      }
    } catch {
      messageApi.error("Không tải được lịch hẹn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const tableRows = useMemo(() => {
    return appointments.map((item, index) => {
      const doctor = doctors.find((d) => d.maBS === item.maBS);
      return {
        key: item.maLH || index,
        maLH: item.maLH,
        date: formatDate(item.thoiGianKham),
        time: formatTime(item.thoiGianKham),
        doctor: doctor?.hoTen || "Chưa cập nhật",
        department: doctor?.chuyenKhoa || "Chưa cập nhật",
        status: item.trangThai || "Chờ xác nhận",
        raw: item,
      };
    });
  }, [appointments, doctors]);

  const columns = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Giờ", dataIndex: "time", key: "time" },
    { title: "Bác sĩ", dataIndex: "doctor", key: "doctor" },
    { title: "Khoa", dataIndex: "department", key: "department" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || "default"}>{status}</Tag>
      ),
    },
  ];

  const handleCancel = async () => {
    if (!selectedRowKeys.length) return;
    setLoading(true);
    try {
      const targets = appointments.filter((item) =>
        selectedRowKeys.includes(item.maLH),
      );
      await Promise.all(
        targets.map((item) =>
          updateLichHen(
            createLichHenRequest(
              item.maLH,
              item.thoiGianKham,
              "Đã hủy",
              item.maBN,
              item.maBS,
            ),
          ),
        ),
      );
      messageApi.success(`Đã gửi yêu cầu hủy cho ${targets.length} lịch khám.`);
      setSelectedRowKeys([]);
      await loadData();
    } catch (error) {
      const msg = error?.response?.data?.message ?? error?.response?.data?.Message;
      messageApi.error(msg || "Không thể hủy lịch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cancellation-page">
      {contextHolder}
      <section className="cancellation-banner">
        <div className="banner-content">
          <div className="banner-left">
            <h1>Lưu ý quan trọng khi hủy lịch</h1>
            <ul className="banner-features">
              {features.map((item, index) => (
                <li key={index}>
                  <CheckCircleFilled className="banner-icon" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="banner-actions">
              <Button
                type="primary"
                size="large"
                className="banner-btn"
                icon={<PhoneOutlined />}
              >
                Hotline: 0123 456 789
              </Button>
            </div>
          </div>
          <div className="banner-right">
            <img
              src={doctorImage}
              alt="Minh họa bệnh viện"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <div className="main-container">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card
              className="instruction-card"
              title={
                <span>
                  <InfoCircleOutlined /> Hướng dẫn thao tác
                </span>
              }
            >
              <Steps
                direction="vertical"
                size="small"
                current={selectedRowKeys.length > 0 ? 1 : 0}
                items={[
                  { title: "Chọn lịch cần hủy", description: "Tích vào ô bên phải danh sách." },
                  { title: "Xác nhận yêu cầu", description: "Nhấn nút hủy sáng mờ trên bảng." },
                  { title: "Chờ xử lý", description: "Hệ thống sẽ duyệt yêu cầu tự động." },
                ]}
              />
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <div className="table-container-card">
              <div className="table-header">
                <Title level={4}>Danh sách đặt lịch của bạn</Title>

                <Popconfirm
                  title="Xác nhận hủy các lịch đã chọn?"
                  onConfirm={handleCancel}
                >
                  <Button
                    type="primary"
                    danger
                    disabled={!selectedRowKeys.length}
                    className={`glass-button ${
                      selectedRowKeys.length > 0 ? "active" : ""
                    }`}
                    icon={<DeleteOutlined />}
                  >
                    Xác nhận hủy
                    {selectedRowKeys.length > 0 && ` (${selectedRowKeys.length})`}
                  </Button>
                </Popconfirm>
              </div>

              {noPatientProfile && !loading && (
                <Alert
                  style={{ marginBottom: 16 }}
                  type="warning"
                  showIcon
                  message="Không tìm thấy hồ sơ bệnh nhân khớp với số điện thoại tài khoản của bạn."
                  description="Vui lòng liên hệ lễ tân để liên kết tài khoản với hồ sơ bệnh nhân."
                />
              )}

              <Spin spinning={loading} description="Đang tải...">
                <Table
                  rowSelection={{
                    type: "checkbox",
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                    columnPosition: "right",
                  }}
                  columns={columns}
                  dataSource={tableRows}
                  pagination={false}
                  className="custom-table"
                  locale={{ emptyText: "Chưa có lịch phù hợp." }}
                />
              </Spin>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
