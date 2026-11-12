import "./patientinfo.scss";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Input, Row, Select, Space, Tag, message, Spin } from "antd";
import { Link } from "react-router-dom";
import {
  searchBacSi,
  searchBenhNhan,
  searchLichHen,
  searchPhieuKham,
  createPhieuKham,
  updatePhieuKham,
} from "../../../apis";
import { createFilter, toLocalDateString } from "../../../helpers";
import { createPhieuKhamRequest } from "../../../interfaces";
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

export default function PatientInfo() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [phieuKhams, setPhieuKhams] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
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

      const storedLichHenId = sessionStorage.getItem("currentLichHenId");
      if (storedLichHenId) {
        const storedAppointment = filteredAppointments.find(
          (item) => item.maLH === storedLichHenId,
        );
        if (storedAppointment) {
          setSelectedAppointment(storedAppointment);
          sessionStorage.setItem("currentLichHenId", storedLichHenId);
        }
      }
    } catch {
      messageApi.error("Không tải được dữ liệu khám bệnh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const appointmentOptions = useMemo(() => {
    return appointments.map((item) => {
      const patient = patients.find((p) => p.maBN === item.maBN);
      const patientName = patient?.hoTen || "Bệnh nhân";
      return {
        value: item.maLH,
        label: `${patientName} - ${formatTime(item.thoiGianKham)}`,
      };
    });
  }, [appointments, patients]);

  const currentPatient = useMemo(() => {
    if (!selectedAppointment) return null;
    return patients.find((p) => p.maBN === selectedAppointment.maBN) || null;
  }, [patients, selectedAppointment]);

  const currentPhieuKham = useMemo(() => {
    if (!selectedAppointment) return null;
    return phieuKhams.find((pk) => pk.maLH === selectedAppointment.maLH) || null;
  }, [phieuKhams, selectedAppointment]);

  useEffect(() => {
    if (!currentPhieuKham) {
      form.resetFields();
      return;
    }
    form.setFieldsValue({
      trieuChung: currentPhieuKham.trieuChung,
      chuanDoan: currentPhieuKham.chuanDoan,
      huongDieuTri: currentPhieuKham.huongDieuTri,
      trangThaiTiepNhan: currentPhieuKham.trangThaiTiepNhan || "Đang khám",
    });
  }, [currentPhieuKham, form]);

  const handleAppointmentChange = (value) => {
    const appointment = appointments.find((item) => item.maLH === value);
    setSelectedAppointment(appointment || null);
    if (appointment?.maLH) {
      sessionStorage.setItem("currentLichHenId", appointment.maLH);
    }
  };

  const handleSubmit = async (values) => {
    if (!selectedAppointment) {
      messageApi.error("Vui lòng chọn bệnh nhân đang khám.");
      return;
    }

    setLoading(true);
    try {
      const request = createPhieuKhamRequest(
        currentPhieuKham?.maPK || "",
        toDateValue(selectedAppointment.thoiGianKham) || new Date(),
        values.trieuChung,
        values.chuanDoan,
        values.huongDieuTri,
        values.trangThaiTiepNhan || "Đang khám",
        selectedAppointment.maLH,
        doctor?.maBS,
      );

      const response = currentPhieuKham
        ? await updatePhieuKham(request)
        : await createPhieuKham(request);

      const payload = response?.data ?? {};
      const isSuccess = payload?.isSuccess ?? payload?.IsSuccess ?? true;
      const msg = payload?.message ?? payload?.Message;

      if (!isSuccess) {
        messageApi.error(msg || "Không thể lưu phiếu khám.");
        return;
      }

      const data = payload?.data ?? payload?.Data ?? {};
      const normalized = normalizePhieuKham(data);

      if (normalized?.maPK) {
        sessionStorage.setItem("currentPhieuKhamId", normalized.maPK);
      }

      messageApi.success(msg || "Đã lưu thông tin khám.");
      await loadData();
    } catch (error) {
      const msg = error?.response?.data?.message ?? error?.response?.data?.Message;
      messageApi.error(msg || "Không thể lưu phiếu khám.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-patient-info-page">
      {contextHolder}
      <div className="doctor-page-header">
        <div>
          <p>
            Ghi nhận triệu chứng, chẩn đoán và hướng điều trị cho lần khám hiện
            tại theo yêu cầu quản lý khám bệnh.
          </p>
        </div>
        <Tag color="processing">Đang khám</Tag>
      </div>

      <Spin spinning={loading} description="Đang tải...">
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={8}>
            <Card title="Thông tin bệnh nhân" className="doctor-card">
              <div className="medical-ticket">
                <div className="ticket-row">
                  <span>
                    Họ và tên: <strong>{currentPatient?.hoTen || "Chưa chọn"}</strong>
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
                    Giờ khám: <strong>{formatTime(selectedAppointment?.thoiGianKham)}</strong>
                  </span>
                </div>
                <div className="ticket-row">
                  <span>
                    Khoa: <strong>{doctor?.chuyenKhoa || "Chưa cập nhật"}</strong>
                  </span>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} xl={16}>
            <Card title="Phiếu ghi nhận khám bệnh" className="doctor-card">
              <Form
                form={form}
                layout="vertical"
                className="doctor-note-form"
                onFinish={handleSubmit}
              >
                <div className="note-group">
                  <label>Bệnh nhân</label>
                  <Select
                    showSearch
                    options={appointmentOptions}
                    placeholder="Chọn bệnh nhân"
                    value={selectedAppointment?.maLH}
                    onChange={handleAppointmentChange}
                  />
                </div>

                <div className="note-group">
                  <label>Triệu chứng</label>
                  <Form.Item name="trieuChung">
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </div>

                <div className="note-group">
                  <label>Chẩn đoán</label>
                  <Form.Item name="chuanDoan">
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </div>

                <div className="note-group">
                  <label>Hướng điều trị</label>
                  <Form.Item name="huongDieuTri">
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </div>

                <div className="note-group">
                  <label>Trạng thái tiếp nhận</label>
                  <Form.Item name="trangThaiTiepNhan" initialValue="Đang khám">
                    <Select
                      options={[
                        { value: "Đang khám", label: "Đang khám" },
                        { value: "Đã khám", label: "Đã khám" },
                        { value: "Chờ khám", label: "Chờ khám" },
                      ]}
                    />
                  </Form.Item>
                </div>

                <Space wrap>
                  <Button type="primary" size="large" htmlType="submit">
                    Lưu thông tin khám
                  </Button>
                  <Link to="/doctor/prescription">
                    <Button disabled={!currentPhieuKham && !sessionStorage.getItem("currentPhieuKhamId")}>
                      Chuyển sang kê thuốc
                    </Button>
                  </Link>
                  <Link to="/doctor/service-request">
                    <Button disabled={!selectedAppointment}>
                      Yêu cầu dịch vụ
                    </Button>
                  </Link>
                </Space>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}
