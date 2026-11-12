import "../admin.scss";
import "./dashboard.scss";
import { useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
  Spin,
} from "antd";
import dayjs from "dayjs";

import { searchBacSi } from "../../../apis";
import { searchLichLamViec } from "../../../apis";
import { searchPhieuKham } from "../../../apis";
import { searchHoaDon } from "../../../apis/";
import { searchLichHen } from "../../../apis";

const { Text } = Typography;

const getSearchRows = (response) => {
  const payload = response?.data ?? {};
  const searchData = payload?.data ?? payload?.Data ?? {};
  return searchData?.data ?? searchData?.Data ?? [];
};

const doctorColumns = [
  { title: "Bác sĩ", dataIndex: "doctor", key: "doctor" },
  { title: "Chuyên khoa", dataIndex: "department", key: "department" },
  { title: "Lượt khám", dataIndex: "visits", key: "visits", align: "center" },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [bacSis, setBacSis] = useState([]);
  const [lichHens, setLichHens] = useState([]);
  const [phieuKhams, setPhieuKhams] = useState([]);
  const [hoaDons, setHoaDons] = useState([]);
  const [lichLamViecs, setLichLamViecs] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [bacSiRes, lichHenRes, phieuKhamRes, hoaDonRes, lichLamViecRes] =
        await Promise.all([
          searchBacSi(null, 1, 500),
          searchLichHen(null, 1, 1000),
          searchPhieuKham(null, 1, 1000),
          searchHoaDon(null, 1, 1000),
          searchLichLamViec(null, 1, 500),
        ]);

      setBacSis(getSearchRows(bacSiRes));
      setLichHens(getSearchRows(lichHenRes));
      setPhieuKhams(getSearchRows(phieuKhamRes));
      setHoaDons(getSearchRows(hoaDonRes));
      setLichLamViecs(getSearchRows(lichLamViecRes));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      message.error("Không thể tải dữ liệu tổng quan.");
    } finally {
      setLoading(false);
    }
  };

  const metricData = useMemo(() => {
    const today = dayjs();

    const todayAppointments = lichHens.filter((item) => {
      return item.thoiGianKham && dayjs(item.thoiGianKham).isSame(today, "day");
    }).length;

    const pendingPatients = phieuKhams.filter((item) => {
      const status = (item.trangThaiTiepNhan || "").toLowerCase();
      return status.includes("chưa") || status.includes("chờ");
    }).length;

    const totalRevenue = hoaDons.reduce((sum, item) => {
      return sum + (Number(item.tongTien) || 0);
    }, 0);

    return [
      { title: "Lịch hẹn hôm nay", value: todayAppointments },
      { title: "Bệnh nhân chờ khám", value: pendingPatients },
      {
        title: "Tổng doanh thu",
        value: `${totalRevenue.toLocaleString("vi-VN")}đ`,
      },
    ];
  }, [lichHens, phieuKhams, hoaDons]);

  const schedulesData = useMemo(() => {
    const today = dayjs();

    const todaySchedules = lichLamViecs.filter((item) => {
      return item.ngayLamViec && dayjs(item.ngayLamViec).isSame(today, "day");
    });

    const groupedSchedules = {};
    todaySchedules.forEach((lich) => {
      const bsInfo = bacSis.find((b) => String(b.maBS) === String(lich.maBS));
      const khoa = bsInfo?.chuyenKhoa || "Khám chung";

      const doctorName = lich.tenBacSi || bsInfo?.hoTen || "Bác sĩ ẩn danh";

      if (!groupedSchedules[khoa]) {
        groupedSchedules[khoa] = {
          title: `Khoa ${khoa}`,
          description: [],
          status: "Đang trực",
          color: "success",
        };
      }

      if (!groupedSchedules[khoa].description.includes(doctorName)) {
        groupedSchedules[khoa].description.push(doctorName);
      }
    });

    return Object.values(groupedSchedules);
  }, [lichLamViecs, bacSis]);

  const topDoctors = useMemo(() => {
    const doctorVisitCount = {};

    phieuKhams.forEach((pk) => {
      if (pk.maBS) {
        doctorVisitCount[pk.maBS] = (doctorVisitCount[pk.maBS] || 0) + 1;
      }
    });

    const sortedDoctors = Object.entries(doctorVisitCount)
      .map(([maBS, visits]) => {
        const bsInfo = bacSis.find((b) => String(b.maBS) === String(maBS));
        return {
          key: maBS,
          doctor: bsInfo?.hoTen || "Bác sĩ ẩn danh",
          department: bsInfo?.chuyenKhoa || "Đa khoa",
          visits: visits,
        };
      })
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5); // Chỉ lấy 5 bác sĩ dẫn đầu

    return sortedDoctors;
  }, [phieuKhams, bacSis]);

  const handleCreateReport = () => {
    const today = dayjs();
    const lines = [];

    lines.push(`Báo cáo tổng quan phòng khám - ${today.format("DD/MM/YYYY")}`);
    lines.push("");
    lines.push("CHỈ SỐ TỔNG QUAN");
    metricData.forEach((item) => lines.push(`${item.title},${item.value}`));

    lines.push("");
    lines.push("LỊCH LÀM VIỆC HÔM NAY");
    lines.push("Khoa,Bác sĩ trực,Trạng thái");
    if (schedulesData.length) {
      schedulesData.forEach((item) =>
        lines.push(`${item.title},"${item.description.join("; ")}",${item.status}`),
      );
    } else {
      lines.push("Không có lịch làm việc nào được xếp trong hôm nay.,,");
    }

    lines.push("");
    lines.push("TOP BÁC SĨ THEO LƯỢT KHÁM (TOÀN THỜI GIAN)");
    lines.push("Bác sĩ,Chuyên khoa,Lượt khám");
    if (topDoctors.length) {
      topDoctors.forEach((item) =>
        lines.push(`${item.doctor},${item.department},${item.visits}`),
      );
    } else {
      lines.push("Chưa có dữ liệu lượt khám.,,");
    }

    const csvContent = "﻿" + lines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bao-cao-tong-quan-${today.format("YYYY-MM-DD")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success("Đã tạo báo cáo tổng quan.");
  };

  return (
    <div className="admin-page admin-dashboard-page">
      <header className="admin-header">
        <div>
          <Text type="secondary" className="admin-subtitle">
            Tổng quan nhanh tình hình hoạt động phòng khám hôm nay.
          </Text>
        </div>
        <Space wrap>
          <Button type="primary" onClick={handleCreateReport}>
            Tạo báo cáo
          </Button>
        </Space>
      </header>

      <Spin spinning={loading} tip="Đang tải dữ liệu tổng quan...">
        {/* Thẻ thống kê */}
        <Row gutter={[10, 0]}>
          {metricData.map((item) => (
            <Col key={item.title} xs={24} md={8}>
              <Card className="metric-card">
                <Statistic title={item.title} value={item.value} />
              </Card>
            </Col>
          ))}
        </Row>

        <Row
          className="admin-section"
          gutter={[16, 16]}
          style={{ marginTop: 16 }}
        >
          {/* Lịch làm việc */}
          <Col xs={24} lg={11}>
            <Card
              title="Lịch làm việc hôm nay"
              extra={<Tag color="processing">Trong ngày</Tag>}
            >
              <div className="admin-list">
                {schedulesData.length > 0 ? (
                  schedulesData.map((item) => (
                    <div className="admin-list-item" key={item.title}>
                      <div className="info">
                        <h4>{item.title}</h4>
                        <div className="doctor-list">
                          {item.description.map((doctor) => (
                            <p key={doctor}>{doctor}</p>
                          ))}
                        </div>
                      </div>
                      <Tag color={item.color}>{item.status}</Tag>
                    </div>
                  ))
                ) : (
                  <Text type="secondary">
                    Không có lịch làm việc nào được xếp trong hôm nay.
                  </Text>
                )}
              </div>
            </Card>
          </Col>

          {/* Top Bác sĩ */}
          <Col xs={24} lg={13}>
            <Card title="Top bác sĩ theo lượt khám (Toàn thời gian)">
              <Table
                columns={doctorColumns}
                dataSource={topDoctors}
                pagination={false}
                size="small"
                locale={{ emptyText: "Chưa có dữ liệu lượt khám." }}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}
