import "./dashboard.scss";
import { Link } from "react-router-dom";
import { Button, Card, Col, Progress, Row, Space, Table, Tag, message, Spin } from "antd";
import {
  ExperimentOutlined,
  FileAddOutlined,
  FileSearchOutlined,
  MedicineBoxOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import {
  searchBacSi,
  searchBenhNhan,
  searchLichHen,
  searchPhieuKham,
} from "../../../apis";
import { createFilter, toLocalDateString } from "../../../helpers";
import {
  normalizeBacSi,
  normalizeBenhNhan,
  normalizeLichHen,
  normalizePhieuKham,
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

const formatTime = (value) => {
  const date = toDateValue(value);
  if (!date || Number.isNaN(date.getTime())) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [phieuKhams, setPhieuKhams] = useState([]);
  const [patients, setPatients] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const resolveDoctor = (items) => {
    const storedId = sessionStorage.getItem("doctorId");
    if (storedId) {
      const found = items.find((item) => item.maBS === storedId);
      if (found) return found;
    }

    const userName = sessionStorage.getItem("userName") || "";
    const matched = items.find((item) => item.email === userName);

    if (matched?.maBS) {
      sessionStorage.setItem("doctorId", matched.maBS);
    }
    return matched;
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const [bacSiRes, benhNhanRes, lichHenRes, phieuKhamRes] = await Promise.all([
        searchBacSi(null, 1, 2000),
        searchBenhNhan(null, 1, 2000),
        searchLichHen([createFilter("Thời gian khám", toLocalDateString(today))], 1, 2000),
        searchPhieuKham([createFilter("Ngày khám", toLocalDateString(today))], 1, 2000),
      ]);

      const doctors = Array.isArray(getSearchRows(bacSiRes))
        ? getSearchRows(bacSiRes).map(normalizeBacSi)
        : [];
      const patientRows = Array.isArray(getSearchRows(benhNhanRes))
        ? getSearchRows(benhNhanRes).map(normalizeBenhNhan)
        : [];
      const appointmentRows = Array.isArray(getSearchRows(lichHenRes))
        ? getSearchRows(lichHenRes).map(normalizeLichHen)
        : [];
      const phieuKhamRows = Array.isArray(getSearchRows(phieuKhamRes))
        ? getSearchRows(phieuKhamRes).map(normalizePhieuKham)
        : [];

      const currentDoctor = resolveDoctor(doctors);
      const filteredAppointments = currentDoctor
        ? appointmentRows.filter((item) => item.maBS === currentDoctor.maBS)
        : appointmentRows;
      const filteredPhieuKhams = currentDoctor
        ? phieuKhamRows.filter((item) => item.maBS === currentDoctor.maBS)
        : phieuKhamRows;

      setDoctor(currentDoctor || null);
      setPatients(patientRows);
      setAppointments(filteredAppointments);
      setPhieuKhams(filteredPhieuKhams);
    } catch {
      messageApi.error("Không tải được dữ liệu bác sĩ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const patientRows = useMemo(() => {
    return appointments.map((item) => {
      const patient = patients.find((p) => p.maBN === item.maBN);
      const phieuKham = phieuKhams.find((pk) => pk.maLH === item.maLH);
      const status = phieuKham?.trangThaiTiepNhan || item.trangThai || "Chờ khám";
      return {
        key: item.maLH,
        name: patient?.hoTen || phieuKham?.tenBenhNhan || "Chưa cập nhật",
        time: formatTime(item.thoiGianKham),
        symptom: phieuKham?.trieuChung || "Chưa cập nhật",
        status,
      };
    });
  }, [appointments, patients, phieuKhams]);

  const stats = useMemo(() => {
    const total = appointments.length;
    const completed = phieuKhams.filter((pk) =>
      pk.trangThaiTiepNhan?.toLowerCase().includes("đã khám"),
    ).length;
    const waiting = total - completed;
    const storedRequests = JSON.parse(
      sessionStorage.getItem("doctorServiceRequests") || "[]",
    );
    return [
      { label: "Bệnh nhân hôm nay", value: total },
      { label: "Bệnh nhân chờ khám", value: waiting },
      { label: "Đã khám", value: completed },
      { label: "Yêu cầu dịch vụ", value: storedRequests.length || 0 },
    ];
  }, [appointments, phieuKhams]);

  const progressPercent = useMemo(() => {
    if (!appointments.length) return 0;
    const completed = stats[2]?.value || 0;
    return Math.round((completed / appointments.length) * 100);
  }, [appointments.length, stats]);

  const quickActions = [
    {
      description: "Cập nhật triệu chứng, chẩn đoán và hướng điều trị.",
      path: "/doctor/patient-info",
      icon: <FileAddOutlined />,
    },
    {
      description: "Tra cứu hồ sơ cá nhân và lịch sử khám bệnh.",
      path: "/doctor/patient-view",
      icon: <FileSearchOutlined />,
    },
    {
      description: "Chỉ định xét nghiệm, X-quang hoặc dịch vụ bổ sung.",
      path: "/doctor/service-request",
      icon: <ExperimentOutlined />,
    },
    {
      description: "Lập danh sách thuốc, số lượng và liều dùng.",
      path: "/doctor/prescription",
      icon: <MedicineBoxOutlined />,
    },
  ];

  const columns = [
    { title: "Bệnh nhân", dataIndex: "name", key: "name" },
    { title: "Giờ khám", dataIndex: "time", key: "time", width: 110 },
    { title: "Triệu chứng", dataIndex: "symptom", key: "symptom" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Đang khám" ? "processing" : "blue"}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="doctor-dashboard-page">
      {contextHolder}
      <div className="doctor-page-header">
        <div>
          <p>
            Theo dõi danh sách khám trong ngày và truy cập nhanh các nghiệp vụ
            ghi thông tin bệnh nhân, yêu cầu dịch vụ, kê thuốc.
          </p>
        </div>
        <Link to="/doctor/patient-info">
          <Button type="primary" size="large">
            Bắt đầu ca khám
          </Button>
        </Link>
      </div>

      <Spin spinning={loading} description="Đang tải...">
        <Row gutter={[16, 16]}>
          {stats.map((item) => (
            <Col xs={24} sm={12} xl={6} key={item.label}>
              <Card className="doctor-card doctor-stat">
                <div className="doctor-stat-label">{item.label}</div>
                <div className="doctor-stat-value">{item.value}</div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} className="dashboard-main">
          <Col xs={24} xl={15}>
            <Card title="Danh sách bệnh nhân hôm nay" className="doctor-card">
              <Table
                className="doctor-table"
                columns={columns}
                dataSource={patientRows}
                pagination={false}
                size="medium"
                scroll={{ x: 700 }}
                locale={{ emptyText: "Chưa có bệnh nhân hôm nay." }}
              />
            </Card>
          </Col>
          <Col xs={24} xl={9}>
            <Card title="Tiến độ ca khám" className="doctor-card">
              <Space direction="vertical" size={18} className="progress-block">
                <Progress percent={progressPercent} status="active" />
                <div className="progress-note">
                  {stats[2]?.value || 0}/{stats[0]?.value || 0} lượt khám đã hoàn
                  tất. Còn {stats[1]?.value || 0} bệnh nhân đang chờ.
                </div>
                <div className="shift-info">
                  <span>
                    Ca làm việc: {doctor?.chuyenKhoa ? "Theo chuyên khoa" : "Chưa cập nhật"}
                  </span>
                </div>
                <div className="shift-info">
                  <span>Chuyên khoa: {doctor?.chuyenKhoa || "Chưa cập nhật"}</span>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {quickActions.map((action) => (
            <Col xs={24} md={12} xl={6} key={action.path}>
              <Link to={action.path} className="action-card">
                <p>{action.description}</p>
                <span className="action-card-link">
                  <ExportOutlined />
                </span>
              </Link>
            </Col>
          ))}
        </Row>
      </Spin>
    </div>
  );
}
