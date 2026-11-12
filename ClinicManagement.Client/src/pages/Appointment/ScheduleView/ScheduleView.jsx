import "./scheduleview.scss";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Card, Table, Tag, Space, Button, message, Spin } from "antd";
import { EditOutlined, StopOutlined } from "@ant-design/icons";
import {
  searchLichHen,
  searchBacSi,
  searchBenhNhan,
} from "../../../apis";
import { normalizeBacSi, normalizeBenhNhan, normalizeLichHen } from "../../../models";

const STATUS_COLORS = {
  "Đã hủy": "error",
  "Chờ xác nhận": "blue",
  "Đã xác nhận": "success",
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

export default function ScheduleView() {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [noPatientProfile, setNoPatientProfile] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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
    } catch {
      messageApi.error("Không tải được lịch khám.");
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
    { title: "Ngày", dataIndex: "date" },
    { title: "Thời gian", dataIndex: "time" },
    { title: "Bác sĩ", dataIndex: "doctor" },
    { title: "Khoa", dataIndex: "department" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Link
            to="/reschedule"
            onClick={() =>
              sessionStorage.setItem("currentLichHenId", record.maLH)
            }
          >
            <Button
              type="link"
              className="actionBtn editBtn"
              icon={<EditOutlined />}
              disabled={record.status === "Đã hủy"}
            />
          </Link>
          <Link
            to="/cancellation"
            onClick={() =>
              sessionStorage.setItem("currentLichHenId", record.maLH)
            }
          >
            <Button
              type="link"
              className="actionBtn cancelBtn"
              icon={<StopOutlined />}
              disabled={record.status === "Đã hủy"}
            />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div className="scheduleView-page">
      {contextHolder}
      <div className="scheduleView-header">
        <div>
          <p>Theo dõi và quản lý lịch khám của bạn nhanh chóng, tiện lợi.</p>
        </div>
      </div>
      <Card className="scheduleView-table" bordered={false}>
        <div className="tableHeader">
          <div>
            <h3>Lịch khám của bạn</h3>
          </div>
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
            columns={columns}
            dataSource={tableRows}
            size="medium"
            locale={{ emptyText: "Không có lịch khám phù hợp." }}
          />
        </Spin>
      </Card>
    </div>
  );
}
