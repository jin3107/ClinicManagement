import "./patientcount.scss";
import { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  DatePicker,
  Table,
  Statistic,
  Button,
  message,
  Tag, // Đã import thêm Tag từ Ant Design
} from "antd";

// Đã import thêm các Icon cần thiết
import {
  ReloadOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";
import { searchBenhNhan } from "../../../apis/BenhNhanAPI";
import { searchPhieuKham } from "../../../apis/PhieuKhamAPI";
import { searchBacSi } from "../../../apis/BacSiAPI";

const { RangePicker } = DatePicker;

const getSearchRows = (response) => {
  const payload = response?.data ?? {};
  const searchData = payload?.data ?? payload?.Data ?? {};
  return searchData?.data ?? searchData?.Data ?? [];
};

const normalizeBenhNhan = (item) => ({
  maBN: item?.maBN ?? item?.MaBN ?? item?.id ?? "", // Thêm item?.id phòng hờ API trả về id
  hoTen: item?.hoTen ?? item?.HoTen ?? "",
  soBHYT: item?.soBHYT ?? item?.SoBHYT ?? "",
});

const normalizePhieuKham = (item) => ({
  maPK: item?.maPK ?? item?.MaPK ?? "",
  maBS: item?.maBS ?? item?.MaBS ?? "",
  maBN: item?.maBN ?? item?.MaBN ?? "",
  ngayKham: item?.ngayKham ?? item?.NgayKham ?? null,
  trangThaiTiepNhan: item?.trangThaiTiepNhan ?? item?.TrangThaiTiepNhan ?? "",
});

const normalizeBacSi = (item) => ({
  maBS: item?.maBS ?? item?.MaBS ?? item?.id ?? "", // Thêm item?.id phòng hờ API trả về id
  hoTen: item?.hoTen ?? item?.HoTen ?? "",
});

export default function PatientCount() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState(null);
  const [benhNhans, setBenhNhans] = useState([]);
  const [phieuKhams, setPhieuKhams] = useState([]);
  const [bacSis, setBacSis] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [benhNhanRes, phieuKhamRes, bacSiRes] = await Promise.all([
        searchBenhNhan(null, 1, 1000),
        searchPhieuKham(null, 1, 1000),
        searchBacSi(null, 1, 500),
      ]);

      const benhNhanRows = getSearchRows(benhNhanRes);
      const phieuKhamRows = getSearchRows(phieuKhamRes);
      const bacSiRows = getSearchRows(bacSiRes);

      setBenhNhans(
        Array.isArray(benhNhanRows) ? benhNhanRows.map(normalizeBenhNhan) : [],
      );

      setPhieuKhams(
        Array.isArray(phieuKhamRows)
          ? phieuKhamRows.map(normalizePhieuKham)
          : [],
      );

      setBacSis(Array.isArray(bacSiRows) ? bacSiRows.map(normalizeBacSi) : []);
    } catch (error) {
      console.error(error);
      messageApi.error("Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const patientRecords = useMemo(() => {
    return phieuKhams.map((item, index) => {
      // SỬA LỖI TẠI ĐÂY: Dùng String() để đảm bảo kiểu chuỗi khi so sánh
      const benhNhan = benhNhans.find(
        (x) => String(x.maBN) === String(item.maBN),
      );

      const bacSi = bacSis.find((x) => String(x.maBS) === String(item.maBS));

      return {
        key: item.maPK || index,
        date: item.ngayKham
          ? dayjs(item.ngayKham).format("DD/MM/YYYY")
          : "Chưa cập nhật",
        name: benhNhan?.hoTen || "Chưa cập nhật",
        bhyt: benhNhan?.soBHYT || "Chưa cập nhật",
        doctor: bacSi?.hoTen || "Chưa cập nhật",
        status: item.trangThaiTiepNhan || "Chưa khám",
      };
    });
  }, [phieuKhams, benhNhans, bacSis]);

  const filteredRecords = useMemo(() => {
    let records = [...patientRecords];

    if (range && range.length === 2) {
      const [start, end] = range;
      records = records.filter((item) => {
        const currentDate = dayjs(item.date, "DD/MM/YYYY");
        return (
          currentDate.isSame(start, "day") ||
          currentDate.isSame(end, "day") ||
          (currentDate.isAfter(start, "day") &&
            currentDate.isBefore(end, "day"))
        );
      });
    }
    return records;
  }, [patientRecords, range]);

  const patientSummary = useMemo(() => {
    const total = patientRecords.length;
    const done = patientRecords.filter((item) =>
      item.status.toLowerCase().includes("đã"),
    ).length;
    const pending = total - done;

    return [
      { key: "total", title: "Tổng bệnh nhân", value: total },
      { key: "done", title: "Đã khám / Thanh toán", value: done },
      { key: "pending", title: "Chưa khám", value: pending },
    ];
  }, [patientRecords]);

  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Bệnh nhân",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "BHYT",
      dataIndex: "bhyt",
      key: "bhyt",
      align: "center",
    },
    {
      title: "Bác sĩ",
      dataIndex: "doctor",
      key: "doctor",
    },
    {
      title: "Trạng thái", // Đổi tiêu đề hoặc giữ nguyên, đây là cột chứa thông tin thanh toán/khám
      dataIndex: "status",
      key: "status",
      render: (status) => {
        // Tùy chỉnh màu sắc và icon dựa vào nội dung chữ
        let color = "default";
        let icon = <MinusCircleOutlined />;

        const textLower = status.toLowerCase();

        if (
          textLower.includes("đã thanh toán") ||
          textLower.includes("đã khám")
        ) {
          color = "success"; // Màu xanh lá
          icon = <CheckCircleOutlined />;
        } else if (textLower.includes("chưa")) {
          color = "warning"; // Màu cam
          icon = <SyncOutlined spin />; // Icon xoay biểu thị đang chờ
        } else {
          color = "processing"; // Màu xanh dương cho các trạng thái khác
        }

        return (
          <Tag
            icon={icon}
            color={color}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "13px",
            }}
          >
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="patientCountPage">
      {contextHolder}

      <Row gutter={[20, 20]} className="summaryRow">
        {patientSummary.map((item) => (
          <Col xs={24} sm={12} md={8} key={item.key}>
            <Card className="summaryCard" bordered={false}>
              <Statistic
                title={item.title}
                value={item.value}
                valueStyle={{ color: "#0b4f84" }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="tableCard" bordered={false}>
        <div className="tableHeader">
          <h3>Danh sách bệnh nhân</h3>
          <div style={{ display: "flex", gap: 12 }}>
            <RangePicker
              value={range}
              onChange={(dates) => setRange(dates)}
              format="DD/MM/YYYY"
            />
            <Button
              icon={<ReloadOutlined />}
              type="primary"
              onClick={loadData}
              loading={loading}
            >
              Làm mới
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredRecords}
          loading={loading}
          pagination={{ pageSize: 5 }}
          rowClassName={() => "tableRow"}
          locale={{ emptyText: "Không có bản ghi phù hợp." }}
        />
      </Card>
    </div>
  );
}
