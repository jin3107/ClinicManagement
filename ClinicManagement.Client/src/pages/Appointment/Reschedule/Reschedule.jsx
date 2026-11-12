import "./reschedule.scss";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Alert,
  Form,
  DatePicker,
  Select,
  Button,
  Table,
  Tag,
  Row,
  Col,
  message,
  Spin,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  searchLichHen,
  updateLichHen,
  searchBacSi,
  searchBenhNhan,
  searchLichLamViec,
} from "../../../apis";
import { createFilter, toLocalDateString } from "../../../helpers";
import { createLichHenRequest } from "../../../interfaces";
import {
  normalizeBacSi,
  normalizeBenhNhan,
  normalizeLichHen,
  normalizeLichLamViec,
} from "../../../models";

const STATUS_COLORS = {
  "Đã hủy": "red",
  "Chờ xác nhận": "blue",
  "Đã xác nhận": "green",
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

const buildDateTime = (dateValue, timeValue) => {
  const date = toDateValue(dateValue);
  if (!date || !timeValue) return null;
  const [hours, minutes] = timeValue.split(":").map(Number);
  const result = new Date(date);
  result.setHours(hours || 0, minutes || 0, 0, 0);
  return result;
};

const buildTimeSlots = (startValue, endValue, stepMinutes = 30) => {
  const start = toDateValue(startValue);
  const end = toDateValue(endValue);
  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return [];
  }
  const slots = [];
  const cursor = new Date(start);
  while (cursor < end) {
    slots.push(formatTime(cursor));
    cursor.setMinutes(cursor.getMinutes() + stepMinutes);
  }
  return slots;
};

const getCurrentPhoneNumber = () =>
  sessionStorage.getItem("phoneNumber") || "";

const isCancelledAppointment = (appointment) => appointment?.trangThai === "Đã hủy";

export default function Reschedule() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [timeOptions, setTimeOptions] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [noPatientProfile, setNoPatientProfile] = useState(false);

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
      setPatients(normalizedPatients);

      const storedAppointmentId = sessionStorage.getItem("currentLichHenId");
      if (storedAppointmentId) {
        const storedAppointment = filteredAppointments.find(
          (item) => item.maLH === storedAppointmentId,
        );
        if (storedAppointment && !isCancelledAppointment(storedAppointment)) {
          setSelectedAppointment(storedAppointment);
          form.setFieldsValue({
            currentAppointment: storedAppointment.maLH,
            department: normalizedDoctors.find((d) => d.maBS === storedAppointment.maBS)
              ?.chuyenKhoa,
            doctor: storedAppointment.maBS,
            newDate: storedAppointment.thoiGianKham
              ? dayjs(storedAppointment.thoiGianKham)
              : null,
            newTime: formatTime(storedAppointment.thoiGianKham),
          });
          loadTimeSlots(storedAppointment.thoiGianKham, storedAppointment.maBS, storedAppointment.maLH);
        } else {
          sessionStorage.removeItem("currentLichHenId");
          setSelectedAppointment(null);
          setTimeOptions([]);
          form.resetFields();
        }
      }
    } catch {
      messageApi.error("Không tải được lịch hẹn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const appointmentOptions = useMemo(() => {
    return appointments
      .filter((item) => item.trangThai !== "Đã hủy")
      .map((item) => {
        const doctor = doctors.find((d) => d.maBS === item.maBS);
        const patient = patients.find((p) => p.maBN === item.maBN);
        return {
          value: item.maLH,
          label: `${patient?.hoTen || "Bệnh nhân"} - ${
            doctor?.hoTen || "Bác sĩ"
          } - ${formatDate(item.thoiGianKham)} ${formatTime(item.thoiGianKham)}`,
        };
      });
  }, [appointments, doctors, patients]);

  const doctorOptions = useMemo(() => {
    return doctors.map((doctor) => ({
      value: doctor.maBS,
      label: `${doctor.hoTen}${doctor.chuyenKhoa ? ` - ${doctor.chuyenKhoa}` : ""}`,
    }));
  }, [doctors]);

  const tableRows = useMemo(() => {
    return appointments.map((item, index) => {
      const doctor = doctors.find((d) => d.maBS === item.maBS);
      return {
        key: item.maLH || index,
        date: formatDate(item.thoiGianKham),
        time: formatTime(item.thoiGianKham),
        doctor: doctor?.hoTen || "Chưa cập nhật",
        department: doctor?.chuyenKhoa || "Chưa cập nhật",
        status: item.trangThai || "Chờ xác nhận",
      };
    });
  }, [appointments, doctors]);

  const columns = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Giờ", dataIndex: "time", key: "time" },
    { title: "Bác sĩ", dataIndex: "doctor", key: "doctor" },
    { title: "Khoa", dataIndex: "department", key: "department" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || "default"}>{status}</Tag>
      ),
    },
  ];

  const loadTimeSlots = async (dateValue, doctorId, excludeAppointmentId) => {
    if (!dateValue || !doctorId) {
      setTimeOptions([]);
      return;
    }

    try {
      const date = toDateValue(dateValue);
      const filters = [createFilter("Ngày làm việc", toLocalDateString(date))];
      const response = await searchLichLamViec(filters, 1, 2000);
      const rows = getSearchRows(response);
      const shifts = Array.isArray(rows)
        ? rows.map(normalizeLichLamViec).filter((item) => item.maBS === doctorId)
        : [];
      const timeSlots = shifts.length
        ? buildTimeSlots(shifts[0].gioBatDau, shifts[0].gioKetThuc)
        : ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30"];

      const appointmentFilters = [
        createFilter("Thời gian khám", toLocalDateString(date)),
      ];
      const appointmentResponse = await searchLichHen(appointmentFilters, 1, 2000);
      const appointmentRows = getSearchRows(appointmentResponse);
      const normalizedAppointments = Array.isArray(appointmentRows)
        ? appointmentRows.map(normalizeLichHen)
        : [];

      const occupiedTimes = normalizedAppointments
        .filter(
          (item) =>
            item.maBS === doctorId &&
            item.trangThai !== "Đã hủy" &&
            item.maLH !== excludeAppointmentId &&
            item.thoiGianKham,
        )
        .map((item) => formatTime(item.thoiGianKham));

      setBookedTimes(occupiedTimes);
      setTimeOptions(timeSlots.filter((time) => !occupiedTimes.includes(time)));
    } catch {
      messageApi.error("Không lấy được giờ trống.");
    }
  };

  const handleAppointmentChange = (value) => {
    const appointment = appointments.find((item) => item.maLH === value);
    if (isCancelledAppointment(appointment)) {
      sessionStorage.removeItem("currentLichHenId");
      setSelectedAppointment(null);
      setTimeOptions([]);
      form.resetFields();
      return;
    }

    setSelectedAppointment(appointment || null);
    if (!appointment) return;

    form.setFieldsValue({
      currentAppointment: value,
      department: doctors.find((d) => d.maBS === appointment.maBS)?.chuyenKhoa,
      doctor: appointment.maBS,
      newDate: appointment.thoiGianKham ? dayjs(appointment.thoiGianKham) : null,
      newTime: formatTime(appointment.thoiGianKham),
    });

    loadTimeSlots(appointment.thoiGianKham, appointment.maBS, appointment.maLH);
  };

  const handleSubmit = async (values) => {
    if (!selectedAppointment) {
      messageApi.error("Vui lòng chọn lịch khám cần đổi.");
      return;
    }

    const newDateTime = buildDateTime(values.newDate, values.newTime);
    if (!newDateTime) {
      messageApi.error("Vui lòng chọn ngày và giờ khám mới.");
      return;
    }

    setLoading(true);
    try {
      const request = createLichHenRequest(
        selectedAppointment.maLH,
        newDateTime,
        "Đã đặt",
        selectedAppointment.maBN,
        values.doctor || selectedAppointment.maBS,
      );

      const response = await updateLichHen(request);
      const payload = response?.data ?? {};
      const isSuccess = payload?.isSuccess ?? payload?.IsSuccess ?? true;
      const msg = payload?.message ?? payload?.Message;

      if (!isSuccess) {
        messageApi.error(msg || "Không thể đổi lịch.");
        return;
      }

      messageApi.success(msg || "Đã đổi lịch khám thành công.");
      await loadData();
    } catch (error) {
      const msg = error?.response?.data?.message ?? error?.response?.data?.Message;
      messageApi.error(msg || "Không thể đổi lịch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reschedule-page">
      {contextHolder}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <div className="reschedule-card">
            <h2 className="reschedule-card-title">Thông tin đổi lịch</h2>

            <Form form={form} layout="vertical" autoComplete="off" onFinish={handleSubmit}>
              <div className="form-section">
                <div className="notice-box">
                  <div className="notice-title">
                    <ExclamationCircleOutlined /> Lưu ý quan trọng
                  </div>
                  <div className="notice-text">
                    Bạn chỉ có thể đổi lịch khám trước 5 giờ khám.
                  </div>
                </div>

                <h3 className="form-section-title">Lịch khám hiện tại</h3>

                <Row gutter={16}>
                  <Col xs={24}>
                    <Form.Item
                      label="Chọn lịch khám cần đổi"
                      name="currentAppointment"
                      rules={[{ required: true, message: "Vui lòng chọn lịch khám" }]}
                    >
                      <Select
                        placeholder="Chọn lịch khám"
                        options={appointmentOptions}
                        onChange={handleAppointmentChange}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Lịch khám mới</h3>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Khoa/Chuyên khoa"
                      name="department"
                      rules={[{ required: true, message: "Vui lòng chọn khoa" }]}
                    >
                      <Select
                        placeholder="Chọn khoa"
                        options={Array.from(
                          new Map(
                            doctors
                              .filter((doctor) => doctor.chuyenKhoa)
                              .map((doctor) => [doctor.chuyenKhoa, doctor.chuyenKhoa]),
                          ).values(),
                        ).map((value) => ({ value, label: value }))}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Ngày khám mới"
                      name="newDate"
                      rules={[{ required: true, message: "Vui lòng chọn ngày khám" }]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        onChange={(value) => loadTimeSlots(value, form.getFieldValue("doctor"), selectedAppointment?.maLH)}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Bác sĩ"
                      name="doctor"
                      rules={[{ required: true, message: "Vui lòng chọn bác sĩ" }]}
                    >
                      <Select
                        placeholder="Chọn bác sĩ"
                        options={doctorOptions}
                        onChange={(value) => loadTimeSlots(form.getFieldValue("newDate"), value, selectedAppointment?.maLH)}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Giờ khám mới"
                      name="newTime"
                      rules={[{ required: true, message: "Vui lòng chọn giờ khám" }]}
                    >
                      <Select
                        placeholder="Chọn giờ khám"
                        options={timeOptions.map((time) => ({ value: time, label: time }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <div className="form-actions">
                <Button type="primary" htmlType="submit" className="submit-btn">
                  Xác nhận đổi lịch
                </Button>
                <Button type="default" className="reset-btn" onClick={() => form.resetFields()}>
                  Xóa
                </Button>
              </div>
            </Form>
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <Spin spinning={loading} description="Đang tải...">
            <div className="reschedule-card">
              <h3 className="reschedule-card-title">Lịch khám của tôi</h3>
              {noPatientProfile && !loading && (
                <Alert
                  style={{ marginBottom: 16 }}
                  type="warning"
                  showIcon
                  message="Không tìm thấy hồ sơ bệnh nhân khớp với số điện thoại tài khoản của bạn."
                  description="Vui lòng liên hệ lễ tân để liên kết tài khoản với hồ sơ bệnh nhân."
                />
              )}
              <Table
                columns={columns}
                dataSource={tableRows}
                pagination={false}
                bordered
                size="small"
                className="reschedule-table"
                locale={{ emptyText: "Chưa có lịch khám." }}
              />
            </div>

            <div className="reschedule-card reschedule-notes">
              <h3 className="reschedule-card-title">Lưu ý khi đổi lịch</h3>
              <ul className="notes-list">
                <li>Chỉ có thể đổi lịch trước 5 giờ khám</li>
                <li>Lịch mới phải khác với lịch cũ</li>
                <li>Không được đổi lịch quá 2 lần</li>
              </ul>
            </div>

            {bookedTimes.length > 0 && (
              <div className="reschedule-card reschedule-notes">
                <h3 className="reschedule-card-title">Khung giờ đã đặt</h3>
                <div className="notes-list">
                  {bookedTimes.map((time) => (
                    <Tag key={time} color="red">
                      {time}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </Spin>
        </Col>
      </Row>
    </div>
  );
}
