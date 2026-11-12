import "./doctoractivity.scss";
import { useEffect, useMemo, useState } from "react";
import { DatePicker, Button, message, Table } from "antd";

import { BarChartOutlined, TeamOutlined } from "@ant-design/icons";

import dayjs from "dayjs";

import { searchBacSi } from "../../../apis/BacSiAPI";
import { searchPhieuKham } from "../../../apis/PhieuKhamAPI";

const { RangePicker } = DatePicker;

const getSearchRows = (response) => {
  const payload = response?.data ?? {};
  const searchData = payload?.data ?? payload?.Data ?? {};

  return searchData?.data ?? searchData?.Data ?? [];
};

export default function DoctorActivity() {
  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState(false);

  const [range, setRange] = useState(null);
  const [rows, setRows] = useState([]);
  const [searched, setSearched] = useState(false);

  const [summary, setSummary] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [phieuKhams, setPhieuKhams] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [bacSiRes, phieuKhamRes] = await Promise.all([
          searchBacSi(null, 1, 500),
          searchPhieuKham(null, 1, 1000),
        ]);

        const bacSiRows = getSearchRows(bacSiRes);
        const phieuKhamRows = getSearchRows(phieuKhamRes);

        setDoctors(Array.isArray(bacSiRows) ? bacSiRows : []);
        setPhieuKhams(Array.isArray(phieuKhamRows) ? phieuKhamRows : []);
      } catch {
        messageApi.error("Không tải được dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [messageApi]);

  const handleStatistic = () => {
    if (!range || range.length !== 2) {
      messageApi.warning("Vui lòng chọn khoảng thời gian");
      return;
    }

    const [start, end] = range;

    const filtered = phieuKhams.filter((item) => {
      if (!item?.ngayKham) return false;

      const currentDate = dayjs(item.ngayKham);

      return (
        currentDate.isAfter(start.startOf("day")) &&
        currentDate.isBefore(end.endOf("day"))
      );
    });

    const result = doctors
      .map((doctor) => {
        const count = filtered.filter(
          (item) => item.maBS === doctor.maBS,
        ).length;

        return {
          ...doctor,
          soPhieuKham: count,
          active: count > 0,
        };
      })
      .sort((a, b) => b.soPhieuKham - a.soPhieuKham);

    const total = result.reduce((sum, item) => sum + item.soPhieuKham, 0);

    const active = result.filter((item) => item.active).length;

    const inactive = result.length - active;

    setRows(result);

    setSummary({
      total,
      active,
      inactive,
      totalBS: result.length,
    });

    setSearched(true);

    messageApi.success("Thống kê thành công");
  };

  const maxCount = useMemo(() => {
    if (!rows.length) return 1;

    return Math.max(...rows.map((item) => item.soPhieuKham));
  }, [rows]);

  const columns = [
    {
      title: "BÁC SĨ",
      dataIndex: "hoTen",
      render: (value) => (
        <span className="bs-name">{value || "Chưa cập nhật"}</span>
      ),
    },
    {
      title: "CHUYÊN KHOA",
      dataIndex: "chuyenKhoa",
      render: (value) => (
        <span className="spec-text">{value || "Chưa cập nhật"}</span>
      ),
    },
    {
      title: "SỐ PHIẾU KHÁM",
      dataIndex: "soPhieuKham",
      align: "right",
      render: (value) => (
        <div className="count-cell">
          <div className="count-bar-wrap">
            <div
              className="count-bar"
              style={{
                width: maxCount > 0 ? `${(value / maxCount) * 100}%` : "0%",
              }}
            />
          </div>

          <span className="count-num">{value} ca</span>
        </div>
      ),
    },
  ];

  return (
    <div className="doctorstats">
      {contextHolder}

      <div className="ds-body">
        <div className="filter-card">
          <div className="section-label">
            <BarChartOutlined />
            Chọn khoảng thời gian thống kê
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Từ ngày – Đến ngày (Ngày khám)</label>

              <RangePicker
                value={range}
                onChange={(value) => {
                  setRange(value);
                  setSearched(false);
                }}
                format="DD/MM/YYYY"
                placeholder={["Từ ngày", "Đến ngày"]}
                style={{ width: 280 }}
              />
            </div>

            <Button
              type="primary"
              icon={<BarChartOutlined />}
              onClick={handleStatistic}
              size="large"
              className="stat-btn"
              loading={loading}
            >
              Thống kê
            </Button>
          </div>
        </div>

        {searched && summary && (
          <div className="summary-chips">
            <div className="chip">
              <TeamOutlined />
              <b>{summary.totalBS}</b> bác sĩ
            </div>

            <div className="chip">
              <BarChartOutlined />
              Tổng <b>{summary.total}</b> phiếu khám
            </div>
          </div>
        )}

        {searched && (
          <div className="table-wrap">
            <div className="table-title">
              <BarChartOutlined />
              Thống kê hoạt động bác sĩ
            </div>

            <Table
              columns={columns}
              dataSource={rows}
              rowKey="maBS"
              size="middle"
              loading={loading}
              pagination={false}
              className="clean-table"
              locale={{
                emptyText: "Không có dữ liệu",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
