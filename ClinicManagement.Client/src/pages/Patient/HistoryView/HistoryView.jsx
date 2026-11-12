import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Table, Tag, Empty, Spin, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./historyview.scss";

import { searchPhieuKham } from "../../../apis";
import { searchHoaDon } from "../../../apis";
import { normalizePhieuKham } from "../../../models";
import { normalizeHoaDon } from "../../../models/HoaDon";

const getSearchRows = (response) => {
  const payload = response?.data ?? {};
  const searchData = payload?.data ?? payload?.Data ?? {};
  return searchData?.data ?? searchData?.Data ?? [];
};

const toDateValue = (value) => {
  if (!value) return null;
  if (value?.toDate) return value.toDate();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = toDateValue(value);
  if (!date) return "";
  return dayjs(date).format("DD/MM/YYYY");
};

export default function HistoryView() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [phieuKhams, setPhieuKhams] = useState([]);
  const [hoaDons, setHoaDons] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [phieuKhamRes, hoaDonRes] = await Promise.all([
        searchPhieuKham(null, 1, 2000),
        searchHoaDon(null, 1, 2000),
      ]);

      const phieuKhamRows = getSearchRows(phieuKhamRes);
      const hoaDonRows = getSearchRows(hoaDonRes);

      setPhieuKhams(
        Array.isArray(phieuKhamRows)
          ? phieuKhamRows.map(normalizePhieuKham)
          : [],
      );
      setHoaDons(
        Array.isArray(hoaDonRows) ? hoaDonRows.map(normalizeHoaDon) : [],
      );
    } catch {
      messageApi.error("Không tải được lịch sử khám.");
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isPaid = useCallback(
    (phieu) => {
      const status = (phieu?.trangThaiTiepNhan || "").toLowerCase();
      if (status.includes("đã thanh toán")) return true;
      const invoice = hoaDons.find((h) => h.maPK === phieu.maPK);
      return (invoice?.trangThaiThanhToan || "").toLowerCase().includes("đã");
    },
    [hoaDons],
  );

  const paidRecords = useMemo(() => {
    return phieuKhams
      .filter(isPaid)
      .sort((a, b) => toDateValue(b.ngayKham) - toDateValue(a.ngayKham));
  }, [phieuKhams, isPaid]);

  const tableRows = useMemo(() => {
    return paidRecords.map((item) => ({
      key: item.maPK || item.maLH,
      benhNhan: item.tenBenhNhan || "Chưa cập nhật",
      ngayKham: formatDate(item.ngayKham),
      bacSi: item.tenBacSi || "-",
      chuanDoan: item.chuanDoan || "—",
      huongDieuTri: item.huongDieuTri || "—",
      trangThai: item.trangThaiTiepNhan || "Đã thanh toán",
    }));
  }, [paidRecords]);

  const columns = [
    { title: "Bệnh nhân", dataIndex: "benhNhan", key: "benhNhan", width: 200 },
    { title: "Ngày khám", dataIndex: "ngayKham", key: "ngayKham", width: 130 },
    { title: "Bác sĩ", dataIndex: "bacSi", key: "bacSi", width: 200 },
    {
      title: "Chẩn đoán",
      dataIndex: "chuanDoan",
      key: "chuanDoan",
      ellipsis: true,
    },
    {
      title: "Hướng điều trị",
      dataIndex: "huongDieuTri",
      key: "huongDieuTri",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      width: 170,
      render: (value) => (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {value || "Đã thanh toán"}
        </Tag>
      ),
    },
  ];

  return (
    <div className="history-view-page">
      {contextHolder}
      <p>Danh sách các lần khám đã thanh toán.</p>

      <Spin spinning={loading} description="Đang tải...">
        <Card className="records-card">
          {tableRows.length ? (
            <Table
              columns={columns}
              dataSource={tableRows}
              rowKey="key"
              className="records-table"
              scroll={{ x: 1000 }}
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} lần khám`,
              }}
            />
          ) : (
            <Empty description="Chưa có lịch sử khám đã thanh toán" />
          )}
        </Card>
      </Spin>
    </div>
  );
}
