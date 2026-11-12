import "./servicerequest.scss";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message,
  Spin,
} from "antd";
import {
  searchDanhMucDichVu,
  searchBenhNhan,
  searchLichHen,
  searchBacSi,
  searchPhieuKham,
  createPhieuKhamDichVu,
  getPhieuKhamDichVuByExam,
} from "../../../apis";
import { createFilter, toLocalDateString } from "../../../helpers";
import {
  normalizeDanhMucDichVu,
  normalizeBenhNhan,
  normalizeLichHen,
  normalizeBacSi,
  normalizePhieuKham,
} from "../../../models";

const getSearchRows = (response) => {
  const payload = response?.data ?? {};
  const searchData = payload?.data ?? payload?.Data ?? {};
  return searchData?.data ?? searchData?.Data ?? [];
};

const getListPayload = (response) => {
  const payload = response?.data ?? {};
  return payload?.data ?? payload?.Data ?? [];
};

const formatMoney = (value) => Number(value || 0).toLocaleString("vi-VN") + " ₫";

export default function ServiceRequest() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [phieuKhams, setPhieuKhams] = useState([]);
  const [lichHens, setLichHens] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(
    sessionStorage.getItem("currentPhieuKhamId") || "",
  );
  const [examServices, setExamServices] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const resolveDoctorId = (items) => {
    const storedId = sessionStorage.getItem("doctorId");
    if (storedId && items.some((item) => item.maBS === storedId)) return storedId;

    const userName = sessionStorage.getItem("userName") || "";
    const matched = items.find((item) => item.email === userName);

    if (matched?.maBS) {
      sessionStorage.setItem("doctorId", matched.maBS);
      return matched.maBS;
    }
    return "";
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const [serviceRes, benhNhanRes, lichHenRes, bacSiRes, phieuKhamRes] =
        await Promise.all([
          searchDanhMucDichVu(null, 1, 2000),
          searchBenhNhan(null, 1, 2000),
          searchLichHen([createFilter("Thời gian khám", toLocalDateString(today))], 1, 2000),
          searchBacSi(null, 1, 2000),
          searchPhieuKham([createFilter("Ngày khám", toLocalDateString(today))], 1, 2000),
        ]);

      const normalizedServices = Array.isArray(getSearchRows(serviceRes))
        ? getSearchRows(serviceRes).map(normalizeDanhMucDichVu)
        : [];
      const normalizedPatients = Array.isArray(getSearchRows(benhNhanRes))
        ? getSearchRows(benhNhanRes).map(normalizeBenhNhan)
        : [];
      const normalizedAppointments = Array.isArray(getSearchRows(lichHenRes))
        ? getSearchRows(lichHenRes).map(normalizeLichHen)
        : [];
      const normalizedDoctors = Array.isArray(getSearchRows(bacSiRes))
        ? getSearchRows(bacSiRes).map(normalizeBacSi)
        : [];
      const normalizedExams = Array.isArray(getSearchRows(phieuKhamRes))
        ? getSearchRows(phieuKhamRes).map(normalizePhieuKham)
        : [];

      const doctorId = resolveDoctorId(normalizedDoctors);
      const doctorAppointmentIds = new Set(
        normalizedAppointments
          .filter((item) => !doctorId || item.maBS === doctorId)
          .map((item) => item.maLH),
      );
      const doctorExams = normalizedExams.filter((exam) =>
        doctorAppointmentIds.has(exam.maLH),
      );

      setServices(normalizedServices);
      setPatients(normalizedPatients);
      setLichHens(normalizedAppointments);
      setPhieuKhams(doctorExams.length ? doctorExams : normalizedExams);
    } catch {
      messageApi.error("Không tải được danh mục dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadExamServices = async (maPK) => {
    if (!maPK) {
      setExamServices([]);
      return;
    }
    try {
      const response = await getPhieuKhamDichVuByExam(maPK);
      const rows = getListPayload(response);
      setExamServices(Array.isArray(rows) ? rows : []);
    } catch {
      messageApi.error("Không tải được danh sách dịch vụ của phiếu khám.");
    }
  };

  useEffect(() => {
    loadExamServices(selectedExamId);
  }, [selectedExamId]);

  const examOptions = useMemo(() => {
    return phieuKhams.map((exam) => {
      const appointment = lichHens.find((lh) => lh.maLH === exam.maLH);
      const patient = patients.find((p) => p.maBN === appointment?.maBN);
      return {
        value: exam.maPK,
        label: `${patient?.hoTen || exam.tenBenhNhan || "Bệnh nhân"} - ${
          appointment ? new Date(appointment.thoiGianKham).toLocaleString("vi-VN") : ""
        }`,
      };
    });
  }, [phieuKhams, lichHens, patients]);

  const serviceOptions = useMemo(() => {
    const alreadyOrdered = new Set(examServices.map((item) => item.maDV ?? item.MaDV));
    return services
      .filter((service) => !alreadyOrdered.has(service.maDV))
      .map((service) => ({
        value: service.maDV,
        label: `${service.tenDV} - ${formatMoney(service.donGia)}`,
      }));
  }, [services, examServices]);

  const handleExamChange = (value) => {
    setSelectedExamId(value);
    sessionStorage.setItem("currentPhieuKhamId", value);
    form.setFieldsValue({ services: undefined });
  };

  const handleSubmit = async (values) => {
    if (!selectedExamId) {
      messageApi.warning("Vui lòng chọn phiếu khám.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await createPhieuKhamDichVu({
        maPK: selectedExamId,
        maDichVus: values.services,
      });
      const res = response?.data ?? {};
      const isSuccess = res?.isSuccess ?? res?.IsSuccess;
      const msg = res?.message ?? res?.Message;

      if (!isSuccess) {
        messageApi.error(msg || "Không thể gửi yêu cầu dịch vụ.");
        return;
      }

      messageApi.success("Đã gửi yêu cầu dịch vụ.");
      form.resetFields(["services"]);
      await loadExamServices(selectedExamId);
    } catch (error) {
      const data = error?.response?.data;
      messageApi.error(data?.message ?? data?.Message ?? "Không thể gửi yêu cầu dịch vụ.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { title: "Dịch vụ", dataIndex: "tenDV", key: "tenDV" },
    {
      title: "Đơn giá",
      dataIndex: "donGia",
      key: "donGia",
      align: "right",
      render: (value) => formatMoney(value),
    },
  ];

  return (
    <div className="doctor-service-request-page">
      {contextHolder}
      <div className="doctor-page-header">
        <div>
          <p>
            Chỉ định dịch vụ bổ sung như xét nghiệm, X-quang, siêu âm hoặc tiêm
            chủng cho bệnh nhân đang khám.
          </p>
        </div>
      </div>

      <Spin spinning={loading} description="Đang tải...">
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={9}>
            <Card title="Yêu cầu dịch vụ mới" className="doctor-card">
              <Alert
                className="request-alert"
                type="info"
                showIcon
                message="Dịch vụ được gắn vào phiếu khám và sẽ cộng vào hóa đơn khi thanh toán."
              />

              <Form
                className="doctor-form"
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
              >
                <div className="note-group">
                  <label>Phiếu khám</label>
                  <Form.Item
                    name="exam"
                    initialValue={selectedExamId || undefined}
                    rules={[{ required: true, message: "Chọn phiếu khám" }]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      options={examOptions}
                      notFoundContent="Không có phiếu khám hôm nay"
                      onChange={handleExamChange}
                    />
                  </Form.Item>
                </div>
                <div className="note-group">
                  <label>Loại dịch vụ</label>
                  <Form.Item
                    name="services"
                    rules={[{ required: true, message: "Chọn dịch vụ" }]}
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      optionFilterProp="label"
                      options={serviceOptions}
                      disabled={!selectedExamId}
                      notFoundContent="Chưa có dịch vụ trong danh mục"
                    />
                  </Form.Item>
                </div>
                <Space wrap>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    Gửi yêu cầu
                  </Button>
                  <Button onClick={() => form.resetFields(["services"])} disabled={submitting}>
                    Xóa
                  </Button>
                </Space>
              </Form>
            </Card>
          </Col>

          <Col xs={24} xl={15}>
            <Card title="Dịch vụ của phiếu khám đang chọn" className="doctor-card">
              <Table
                className="doctor-table"
                columns={columns}
                dataSource={examServices}
                rowKey={(row) => row.id ?? row.Id}
                pagination={false}
                scroll={{ x: 480 }}
                locale={{
                  emptyText: selectedExamId
                    ? "Chưa có dịch vụ nào cho phiếu khám này."
                    : "Chọn phiếu khám để xem dịch vụ đã yêu cầu.",
                }}
                summary={(rows) =>
                  rows.length ? (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>
                        <b>Tổng cộng</b>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <b>
                          {formatMoney(
                            rows.reduce((sum, row) => sum + Number(row.donGia || 0), 0),
                          )}
                        </b>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  ) : null
                }
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}
