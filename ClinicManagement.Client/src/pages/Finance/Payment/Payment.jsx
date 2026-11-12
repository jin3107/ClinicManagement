import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./payment.scss";
import {
  Table, Button, Card, Divider, Tag, message, Modal, Spin,
} from "antd";
import {
  PrinterOutlined,
  UserOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  BankOutlined,
  WarningOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  searchPhieuKham,
  searchBenhNhan,
  searchLichHen,
  searchDonThuoc,
  searchDanhMucThuoc,
  updatePhieuKham,
  getPhieuKhamDichVuByExam,
} from "../../../apis";
import { searchHoaDon, createHoaDon, updateHoaDon } from "../../../apis/HoaDonAPI";
import { createPhieuKhamRequest } from "../../../interfaces";
import { createHoaDonRequest } from "../../../interfaces/requests/HoaDonRequest";
import {
  normalizePhieuKham,
  normalizeBenhNhan,
  normalizeLichHen,
  normalizeDonThuoc,
  normalizeDanhMucThuoc,
} from "../../../models";
import { normalizeHoaDon } from "../../../models/HoaDon";
import { buildVietQrUrl } from "../../../config/payment";

/* ── Helpers ── */
const METHOD_MAP = {
  cash: { label: "Tiền mặt",     icon: <DollarOutlined /> },
  bank: { label: "Chuyển khoản", icon: <BankOutlined /> },
};

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
  return date.toLocaleDateString("vi-VN");
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("vi-VN") + " ₫";


const buildMedicineItems = (donThuoc, danhMucThuocs) => {
  const items = donThuoc?.chiTietDonThuocs || [];
  return items.map((item, index) => {
    const thuoc = danhMucThuocs.find((t) => t.maThuoc === item.maThuoc);
    const unitPrice = Number(item?.donGia ?? thuoc?.donGia ?? 0);
    const quantity = Number(item?.soLuong ?? 0);
    return {
      key: item?.maCTDT || `${item?.maThuoc || "thuoc"}-${index}`,
      maThuoc: item?.maThuoc,
      tenThuoc: item?.tenThuoc || thuoc?.tenThuoc || "Chưa cập nhật",
      soLuong: quantity,
      lieuDung: item?.lieuDung || "",
      donGia: unitPrice,
      thanhTien: unitPrice * quantity,
      chongChiDinh: thuoc?.chongChiDinh || "",
    };
  });
};

/* ══════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════ */
export default function Payment() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [phieuKhams, setPhieuKhams] = useState([]);
  const [hoaDons, setHoaDons] = useState([]);
  const [benhNhans, setBenhNhans] = useState([]);
  const [lichHens, setLichHens] = useState([]);
  const [donThuocs, setDonThuocs] = useState([]);
  const [danhMucThuocs, setDanhMucThuocs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [method, setMethod] = useState(null);
  const [printModal, setPrintModal] = useState(false);
  const [examServices, setExamServices] = useState([]);
  const handlePrintNow = () => {
    window.print();
    setPrintModal(false);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [phieuRes, benhNhanRes, lichHenRes, donThuocRes, thuocRes, hoaDonRes] =
        await Promise.all([
          searchPhieuKham(null, 1, 2000),
          searchBenhNhan(null, 1, 2000),
          searchLichHen(null, 1, 2000),
          searchDonThuoc(null, 1, 2000),
          searchDanhMucThuoc(null, 1, 2000),
          searchHoaDon(null, 1, 2000),
        ]);

      const phieuRows = getSearchRows(phieuRes);
      const benhNhanRows = getSearchRows(benhNhanRes);
      const lichHenRows = getSearchRows(lichHenRes);
      const donThuocRows = getSearchRows(donThuocRes);
      const thuocRows = getSearchRows(thuocRes);
      const hoaDonRows = getSearchRows(hoaDonRes);

      setPhieuKhams(Array.isArray(phieuRows) ? phieuRows.map(normalizePhieuKham) : []);
      setBenhNhans(Array.isArray(benhNhanRows) ? benhNhanRows.map(normalizeBenhNhan) : []);
      setLichHens(Array.isArray(lichHenRows) ? lichHenRows.map(normalizeLichHen) : []);
      setDonThuocs(Array.isArray(donThuocRows) ? donThuocRows.map(normalizeDonThuoc) : []);
      setDanhMucThuocs(Array.isArray(thuocRows) ? thuocRows.map(normalizeDanhMucThuoc) : []);
      setHoaDons(Array.isArray(hoaDonRows) ? hoaDonRows.map(normalizeHoaDon) : []);
    } catch {
      messageApi.error("Không tải được dữ liệu thanh toán.");
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getStatusText = (value) => (value || "").toLowerCase();

  const isPaidPhieu = (phieu) => {
    if (!phieu) return false;
    if (getStatusText(phieu.trangThaiTiepNhan).includes("đã thanh toán")) return true;
    const invoice = hoaDons.find((h) => h.maPK === phieu.maPK);
    return getStatusText(invoice?.trangThaiThanhToan).includes("đã");
  };

  const isWaitingPhieu = (phieu) => {
    const status = getStatusText(phieu?.trangThaiTiepNhan);
    return !isPaidPhieu(phieu) && (status.includes("chờ") || status.includes("đã khám"));
  };

  const waiting = phieuKhams.filter(isWaitingPhieu);

  const selected = useMemo(
    () => phieuKhams.find((item) => item.maPK === selectedId) || null,
    [phieuKhams, selectedId],
  );

  const selectedHoaDon = useMemo(
    () => (selected ? hoaDons.find((h) => h.maPK === selected.maPK) : null),
    [hoaDons, selected],
  );

  const selectedLichHen = useMemo(
    () => (selected ? lichHens.find((lh) => lh.maLH === selected.maLH) : null),
    [lichHens, selected],
  );

  const selectedPatient = useMemo(
    () =>
      selectedLichHen
        ? benhNhans.find((bn) => bn.maBN === selectedLichHen.maBN)
        : null,
    [benhNhans, selectedLichHen],
  );

  const selectedDonThuoc = useMemo(
    () => (selected ? donThuocs.find((dt) => dt.maPK === selected.maPK) : null),
    [donThuocs, selected],
  );

  useEffect(() => {
    let active = true;
    if (!selected?.maPK) {
      setExamServices([]);
      return;
    }
    getPhieuKhamDichVuByExam(selected.maPK)
      .then((response) => {
        if (!active) return;
        const payload = response?.data ?? {};
        const rows = payload?.data ?? payload?.Data ?? [];
        setExamServices(Array.isArray(rows) ? rows : []);
      })
      .catch(() => {
        if (active) setExamServices([]);
      });
    return () => {
      active = false;
    };
  }, [selected?.maPK]);

  const items = selected ? buildMedicineItems(selectedDonThuoc, danhMucThuocs) : [];
  const medicineTotal = items.reduce((sum, item) => sum + item.thanhTien, 0);
  const serviceTotal = examServices.reduce(
    (sum, item) => sum + Number(item.donGia ?? item.DonGia ?? 0),
    0,
  );
  const total = medicineTotal + serviceTotal;
  // Only trust the invoice's own tongTien once it's already been paid — before that,
  // an existing HoaDon row may still carry a placeholder 0, which must not silently
  // override the freshly computed medication total (see finding 4.4).
  const invoiceTotal =
    selectedHoaDon && selectedHoaDon.trangThaiThanhToan === "Đã thanh toán"
      ? selectedHoaDon.tongTien
      : total;

  const stats = {
    chua: waiting.length,
    da: hoaDons.filter((h) =>
      (h.trangThaiThanhToan || "").toLowerCase().includes("đã"),
    ).length,
    tong: hoaDons.reduce(
      (sum, h) =>
        (h.trangThaiThanhToan || "").toLowerCase().includes("đã")
          ? sum + Number(h.tongTien || 0)
          : sum,
      0,
    ),
  };

  const getPatientByPhieu = (phieu) => {
    if (!phieu?.maLH) return null;
    const appointment = lichHens.find((lh) => lh.maLH === phieu.maLH);
    if (!appointment?.maBN) return null;
    return benhNhans.find((bn) => bn.maBN === appointment.maBN) || null;
  };

  const resolvePatientName = (phieu) =>
    phieu?.tenBenhNhan || getPatientByPhieu(phieu)?.hoTen || "Chưa cập nhật";

  const calcTotalByPhieu = (maPK) => {
    const donThuoc = donThuocs.find((dt) => dt.maPK === maPK) || null;
    const rows = buildMedicineItems(donThuoc, danhMucThuocs);
    return rows.reduce((sum, row) => sum + row.thanhTien, 0);
  };

  const handleSelect = (phieu) => {
    setSelectedId(phieu.maPK);
    setMethod(null);
  };

  const handlePay = async () => {
    if (!selected) {
      messageApi.warning("Vui lòng chọn phiếu khám.");
      return;
    }
    if (!method) {
      messageApi.warning("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    setPaying(true);
    try {
      const ngayThanhToan = new Date();
      const invoiceRequest = createHoaDonRequest(
        selectedHoaDon?.maHD || "",
        ngayThanhToan,
        invoiceTotal,
        "Đã thanh toán",
        "",
        selected.maPK,
      );

      const invoiceResponse = selectedHoaDon?.maHD
        ? await updateHoaDon(invoiceRequest)
        : await createHoaDon(invoiceRequest);

      const invoicePayloadData = invoiceResponse?.data ?? {};
      const invoiceSuccess =
        invoicePayloadData?.isSuccess ?? invoicePayloadData?.IsSuccess ?? true;
      const invoiceMsg =
        invoicePayloadData?.message ?? invoicePayloadData?.Message;

      if (!invoiceSuccess) {
        messageApi.error(invoiceMsg || "Không thể cập nhật hóa đơn.");
        return;
      }

      const phieuRequest = createPhieuKhamRequest(
        selected.maPK,
        selected.ngayKham,
        selected.trieuChung,
        selected.chuanDoan,
        selected.huongDieuTri,
        "Đã thanh toán",
        selected.maLH,
        selected.maBS,
      );

      const phieuResponse = await updatePhieuKham(phieuRequest);
      const phieuPayload = phieuResponse?.data ?? {};
      const phieuSuccess = phieuPayload?.isSuccess ?? phieuPayload?.IsSuccess ?? true;
      const phieuMsg = phieuPayload?.message ?? phieuPayload?.Message;

      if (!phieuSuccess) {
        messageApi.error(phieuMsg || "Không thể cập nhật phiếu khám.");
        return;
      }

      messageApi.success(
        `Thanh toán thành công! ${formatMoney(invoiceTotal)} – ${METHOD_MAP[method].label}`,
      );
      setSelectedId(null);
      setMethod(null);
      await loadData();
    } catch (error) {
      const msg =
        error?.response?.data?.message ??
        error?.response?.data?.Message ??
        "Không thể thanh toán.";
      messageApi.error(msg);
    } finally {
      setPaying(false);
    }
  };

  /* ── Cột bảng DS ── */
  const listColumns = [
    {
      title: "Bệnh nhân",
      render: (_, r) => (
        <div className="patient-cell">
          <span className="patient-name">{resolvePatientName(r)}</span>
        </div>
      ),
    },
    {
      title: "Ngày khám",
      dataIndex: "ngayKham",
      width: 110,
      render: (v) => formatDate(v),
    },
    {
      title: "Bác sĩ",
      dataIndex: "tenBacSi",
      render: (value) => value || "Chưa cập nhật",
    },
    {
      title: "Tổng tiền",
      dataIndex: "maPK",
      align: "right",
      render: (value, record) => {
        const invoice = hoaDons.find((h) => h.maPK === record.maPK);
        const totalValue =
          invoice?.trangThaiThanhToan === "Đã thanh toán"
            ? invoice.tongTien
            : calcTotalByPhieu(record.maPK);
        return <span className="price-cell">{formatMoney(totalValue)}</span>;
      },
    },
    {
      title: "", width: 80, align: "center",
      render: (_, r) => (
        <Button type="primary" size="small" className="sel-btn" onClick={() => handleSelect(r)}>
          Chọn
        </Button>
      ),
    },
  ];

  /* ── Cột chi phí ── */
  const svcColumns = [
    { title: "Thuốc", dataIndex: "tenThuoc" },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      width: 90,
      render: (value) => value || "—",
    },
    {
      title: "Đơn giá",
      dataIndex: "donGia",
      align: "right",
      render: (value) => <span className="price-cell">{formatMoney(value)}</span>,
    },
    {
      title: "Thành tiền",
      dataIndex: "thanhTien",
      align: "right",
      render: (value) => <span className="price-cell">{formatMoney(value)}</span>,
    },
  ];

  return (
    <div className="payment-page">
      {contextHolder}

      {/* ── Header ── */}
      <div className="payment-header">
        <div>
          <p>Quản lý hóa đơn và xác nhận thanh toán cho phiếu khám.</p>
        </div>
        <div className="stat-group">
          <div className="stat-card">
            <span>Chờ thanh toán</span>
            <strong>{stats.chua}</strong>
          </div>
          <div className="stat-card">
            <span>Đã thanh toán</span>
            <strong>{stats.da}</strong>
          </div>
          <div className="stat-card">
            <span>Doanh thu</span>
            <strong>{formatMoney(stats.tong)}</strong>
          </div>
        </div>
      </div>

      <Spin spinning={loading} description="Đang tải...">
        {/* ── Main 2-column layout ── */}
        <div className="main-layout">

          {/* ════ LEFT COLUMN ════ */}
          <div className="left-col">

            {/* Bảng DS phiếu khám */}
            <Card className="list-card"
              title={<span className="card-title"><UserOutlined /> Phiếu khám chờ thanh toán</span>}>
              <Table
                dataSource={waiting}
                columns={listColumns}
                rowKey="maPK"
                size="middle"
                className="pay-table"
                pagination={{ pageSize: 6, showSizeChanger: false }}
                rowClassName={(r) => r.maPK === selected?.maPK ? "row-sel" : ""}
                locale={{ emptyText: "Không có phiếu chờ thanh toán" }}
              />
            </Card>

            {/* Thông tin BN + PK (hiện khi chọn) */}
            {selected && (
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-title">Thông tin bệnh nhân</div>
                  <div className="info-row"><span className="info-label">Họ tên</span>        <span className="info-value strong">{selectedPatient?.hoTen || resolvePatientName(selected)}</span></div>
                  <div className="info-row"><span className="info-label">Ngày sinh</span>     <span className="info-value">{formatDate(selectedPatient?.ngaySinh) || "—"}</span></div>
                  <div className="info-row"><span className="info-label">Giới tính</span>     <span className="info-value">{selectedPatient ? (selectedPatient.gioiTinh ? "Nam" : "Nữ") : "—"}</span></div>
                  <div className="info-row"><span className="info-label">Số BHYT</span>       <span className="info-value">{selectedPatient?.soBHYT || "—"}</span></div>
                  <div className="info-row"><span className="info-label">Tiền sử dị ứng</span><span className="info-value">{selectedPatient?.tienSuDiUng || "—"}</span></div>
                </div>

                <div className="info-card">
                  <div className="info-title">Thông tin phiếu khám</div>
                  <div className="info-row"><span className="info-label">Ngày khám</span>     <span className="info-value">{formatDate(selected.ngayKham)}</span></div>
                  <div className="info-row"><span className="info-label">Bác sĩ</span>        <span className="info-value">{selected.tenBacSi || "Chưa cập nhật"}</span></div>
                  <div className="info-row"><span className="info-label">Chẩn đoán</span>     <span className="info-value">{selected.chuanDoan || "—"}</span></div>
                  <div className="info-row"><span className="info-label">Hướng điều trị</span><span className="info-value">{selected.huongDieuTri || "—"}</span></div>
                  <div className="info-row"><span className="info-label">Trạng thái</span>    <span className="info-value">{selected.trangThaiTiepNhan || "—"}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div className="right-col">
            {selected ? (
              <Card className="pay-card"
                title={<span className="card-title"><FileTextOutlined /> Chi phí khám</span>}>

                <div className="invoice-meta">
                  <div className="invoice-status">
                    <span>Trạng thái hóa đơn</span>
                    <Tag color={selectedHoaDon?.trangThaiThanhToan === "Đã thanh toán" ? "green" : "orange"}>
                      {selectedHoaDon?.trangThaiThanhToan || "Chưa thanh toán"}
                    </Tag>
                  </div>
                  <div className="invoice-status">
                    <span>Ngày thanh toán</span>
                    <strong>{formatDate(selectedHoaDon?.ngayThanhToan) || "—"}</strong>
                  </div>
                </div>

                <Table
                  dataSource={items}
                  columns={svcColumns}
                  rowKey="key"
                  pagination={false}
                  size="small"
                  className="svc-table"
                  locale={{ emptyText: "Chưa có thuốc trong toa." }}
                  summary={() => (
                    <Table.Summary.Row className="svc-summary">
                      <Table.Summary.Cell index={0} colSpan={3}>
                        <b>Tổng tiền thuốc ({items.length} mục)</b>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3} align="right">
                        <b className="total-sum">{formatMoney(medicineTotal)}</b>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />

                <Table
                  dataSource={examServices}
                  rowKey={(row) => row.id ?? row.Id}
                  pagination={false}
                  size="small"
                  className="svc-table"
                  style={{ marginTop: 12 }}
                  columns={[
                    { title: "Dịch vụ", dataIndex: "tenDV", key: "tenDV" },
                    {
                      title: "Đơn giá",
                      dataIndex: "donGia",
                      key: "donGia",
                      align: "right",
                      render: (value) => formatMoney(value),
                    },
                  ]}
                  locale={{ emptyText: "Chưa có dịch vụ chỉ định." }}
                  summary={() =>
                    examServices.length ? (
                      <Table.Summary.Row className="svc-summary">
                        <Table.Summary.Cell index={0}>
                          <b>Tổng tiền dịch vụ ({examServices.length} mục)</b>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1} align="right">
                          <b className="total-sum">{formatMoney(serviceTotal)}</b>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    ) : null
                  }
                />

                <div className="total-box">
                  <span className="total-label">Tổng tiền (Hóa đơn)</span>
                  <span className="total-amount">{formatMoney(invoiceTotal)}</span>
                </div>

                <Divider style={{ margin: "14px 0 10px" }} />

                <div className="method-label">Phương thức thanh toán</div>
                <div className="method-btns">
                  {Object.entries(METHOD_MAP).map(([key, val]) => (
                    <button
                      key={key}
                      className={`method-btn${method === key ? " active" : ""}`}
                      onClick={() => setMethod(key)}
                    >
                      {val.icon} {val.label}
                    </button>
                  ))}
                </div>

                {method === "bank" && (
                  <div className="qr-box">
                    <img
                      className="qr-image"
                      src={buildVietQrUrl(
                        invoiceTotal,
                        `Thanh toan kham benh ${selected.maPK.slice(0, 8)}`,
                      )}
                      alt="Mã QR chuyển khoản"
                    />
                    <p className="qr-hint">
                      Quét mã bằng ứng dụng ngân hàng để chuyển khoản{" "}
                      <b>{formatMoney(invoiceTotal)}</b>. Sau khi bệnh nhân đã
                      chuyển khoản thành công, nhấn "Xác nhận thanh toán" bên
                      dưới.
                    </p>
                  </div>
                )}

                <div className="action-row">
                  <Button
                    icon={<PrinterOutlined />}
                    size="large"
                    className="print-btn"
                    onClick={() => setPrintModal(true)}
                  >
                    In hóa đơn
                  </Button>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    size="large"
                    className="pay-btn"
                    disabled={!method || paying}
                    loading={paying}
                    onClick={handlePay}
                  >
                    Xác nhận thanh toán
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="pay-card empty-right">
                <div className="empty-state">
                  <DollarOutlined className="empty-icon" />
                  <p>Chọn phiếu khám để xem chi phí và thanh toán</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Spin>

      {/* ── Modal in hóa đơn ── */}
      <Modal
        open={printModal}
        onCancel={() => setPrintModal(false)}
        title={<span><PrinterOutlined /> Xem trước Hóa đơn</span>}
        width={520}
        className="print-modal"
        footer={
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button onClick={() => setPrintModal(false)}>Đóng</Button>
            <Button type="primary" icon={<PrinterOutlined />}
              onClick={() => { messageApi.success("Đang in hóa đơn..."); handlePrintNow(); }}>
              In ngay
            </Button>
          </div>
        }>
        {selected && (
          <div className="invoice-preview">
            <div className="inv-clinic">Phòng khám đa khoa</div>
            <div className="inv-title">Hóa đơn khám bệnh</div>
            <div className="inv-meta-box">
              <div><b>Bệnh nhân:</b> {selectedPatient?.hoTen || resolvePatientName(selected)} ({selectedPatient ? (selectedPatient.gioiTinh ? "Nam" : "Nữ") : "—"})</div>
              <div><b>Bác sĩ:</b> {selected.tenBacSi || "Chưa cập nhật"}</div>
              <div><b>Chẩn đoán:</b> {selected.chuanDoan || "—"}</div>
              <div><b>Số BHYT:</b> {selectedPatient?.soBHYT || "—"}</div>
              <div><b>Ngày khám:</b> {formatDate(selected.ngayKham)}</div>
              <div><b>Ngày thanh toán:</b> {formatDate(selectedHoaDon?.ngayThanhToan) || "—"}</div>
            </div>
            <Divider style={{ margin: "10px 0" }} />
            <table className="inv-table">
              <thead><tr><th>Thuốc / Dịch vụ</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.key}>
                    <td>{s.tenThuoc}</td>
                    <td>{s.soLuong || "—"}</td>
                    <td className="inv-price">{formatMoney(s.donGia)}</td>
                    <td className="inv-price">{formatMoney(s.thanhTien)}</td>
                  </tr>
                ))}
                {examServices.map((s) => (
                  <tr key={s.id ?? s.Id}>
                    <td>{s.tenDV ?? s.TenDV}</td>
                    <td>—</td>
                    <td className="inv-price">{formatMoney(s.donGia ?? s.DonGia)}</td>
                    <td className="inv-price">{formatMoney(s.donGia ?? s.DonGia)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Divider style={{ margin: "10px 0" }} />
            <div className="inv-total">
              <span>TỔNG CỘNG</span>
              <span className="inv-total-num">{formatMoney(invoiceTotal)}</span>
            </div>
            <Divider style={{ margin: "10px 0" }} />
            <div className="toa-title">Toa thuốc</div>
            <div className="toa-list">
              {items.map((item) => (
                <div key={item.key} className="toa-item">
                  <div className="toa-name">{item.tenThuoc}</div>
                  <div className="toa-lieu">Liều dùng: {item.lieuDung || "—"} · SL: {item.soLuong || "—"}</div>
                  {item.chongChiDinh && (
                    <div className="toa-ccd"><WarningOutlined /> Chống chỉ định: {item.chongChiDinh}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="inv-footer">Cảm ơn quý bệnh nhân đã tin tưởng!</div>
          </div>
        )}
      </Modal>
    </div>
  );
}