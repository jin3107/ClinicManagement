import "./revenue.scss";
import { useEffect, useMemo, useState } from "react";
import {
  DatePicker,
  Button,
  message,
  Card,
  Table,
  Empty,
} from "antd";

import {
  DollarOutlined,
  BarChartOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";
import { searchHoaDon } from "../../../apis/HoaDonAPI";

const { RangePicker } = DatePicker;

const getSearchRows = (response) => {
  const payload = response?.data ?? {};
  const searchData = payload?.data ?? payload?.Data ?? {};

  return searchData?.data ?? searchData?.Data ?? [];
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("vi-VN") + " ₫";

export default function Revenue() {
  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState(null);
  const [searched, setSearched] = useState(false);

  const [hoaDons, setHoaDons] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const loadHoaDon = async () => {
      setLoading(true);

      try {
        const response = await searchHoaDon(null, 1, 500);

        const rows = getSearchRows(response);

        setHoaDons(Array.isArray(rows) ? rows : []);
      } catch {
        messageApi.error("Không tải được danh sách hóa đơn");
      } finally {
        setLoading(false);
      }
    };

    loadHoaDon();
  }, [messageApi]);

  const paidHoaDons = useMemo(() => {
    return hoaDons.filter((item) =>
      (item?.trangThaiThanhToan || "")
        .toLowerCase()
        .includes("đã"),
    );
  }, [hoaDons]);

  const handleStatistic = () => {
    if (!range || range.length !== 2) {
      messageApi.warning("Vui lòng chọn khoảng thời gian");
      return;
    }

    const [start, end] = range;

    const filtered = paidHoaDons.filter((item) => {
      if (!item?.ngayThanhToan) return false;

      const currentDate = dayjs(item.ngayThanhToan);

      return (
        currentDate.isAfter(start.startOf("day")) &&
        currentDate.isBefore(end.endOf("day"))
      );
    });

    if (!filtered.length) {
      setResult({
        total: 0,
        rows: [],
        empty: true,
      });

      setSearched(true);
      return;
    }

    const total = filtered.reduce(
      (sum, item) => sum + Number(item?.tongTien || 0),
      0,
    );

    setResult({
      total,
      rows: filtered,
      empty: false,
    });

    setSearched(true);

    messageApi.success("Thống kê thành công");
  };

  const columns = [
    {
      title: "NGÀY THANH TOÁN",
      dataIndex: "ngayThanhToan",
      width: "25%",
      render: (value) =>
        value ? dayjs(value).format("DD/MM/YYYY") : "—",
    },
    {
      title: "BỆNH NHÂN",
      dataIndex: "tenBenhNhan",
      width: "45%",
      render: (value) => value || "Chưa cập nhật",
    },
    {
      title: "TỔNG TIỀN",
      width: "30%",
      align: "right",
      render: (_, record) => (
        <span className="amt total-cell">
          {formatMoney(record?.tongTien)}
        </span>
      ),
    },
  ];

  return (
    <div className="revenue-page">
      {contextHolder}

      <Card className="filter-card" variant="borderless">
        <div className="section-label">
          <SearchOutlined />
          Thống kê doanh thu hóa đơn theo ngày thanh toán
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label>Từ ngày – Đến ngày</label>

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
            className="stat-btn"
            size="large"
            loading={loading}
          >
            Thống kê
          </Button>
        </div>
      </Card>

      {searched && result && (
        <>
          {result.empty ? (
            <Card className="result-card" variant="borderless">
              <Empty description="Không có hóa đơn trong khoảng thời gian này" />

              <p className="empty-note">
                Tổng tiền: <b>0 ₫</b>
              </p>
            </Card>
          ) : (
            <Card className="table-card" variant="borderless">
              <div className="table-title">
                <DollarOutlined />
                Chi tiết hóa đơn đã thanh toán
              </div>

              <Table
                columns={columns}
                dataSource={result.rows}
                rowKey="maHD"
                loading={loading}
                size="middle"
                pagination={{
                  pageSize: 7,
                  showSizeChanger: false,
                }}
                className="clean-table"
                summary={() => (
                  <Table.Summary.Row className="summary-row">
                    <Table.Summary.Cell index={0} colSpan={2}>
                      <b>
                        Tổng cộng ({result.rows.length} hóa đơn)
                      </b>
                    </Table.Summary.Cell>

                    <Table.Summary.Cell index={1} align="right">
                      <b
                        className="amt total-cell"
                        style={{ fontSize: "16px" }}
                      >
                        {formatMoney(result.total)}
                      </b>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
            </Card>
          )}
        </>
      )}
    </div>
  );
}