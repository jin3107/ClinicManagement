import "./booking.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import hospitalImage from "../../../assets/image/Hospital.jpg";
import doctorImage from "../../../assets/image/doctor.jpg";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Table,
  Tag,
  Row,
  Col,
  Radio,
  Avatar,
  message,
  Spin,
} from "antd";
import {
  createBenhNhan,
  createLichHen,
  searchBacSi,
  searchBenhNhan,
  searchLichHen,
  searchLichLamViec,
  updateBenhNhan,
} from "../../../apis";
import { createFilter, toLocalDateString } from "../../../helpers";
import {
  createBenhNhanRequest,
  createLichHenRequest,
} from "../../../interfaces";
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
  if (
    !start ||
    !end ||
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
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

export default function Booking() {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeOptions, setTimeOptions] = useState([]); // tg còn trống
  const [form] = Form.useForm();
  const bookingRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [, setPatients] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [patientId, setPatientId] = useState(
    sessionStorage.getItem("patientId") || "",
  );

  const features = [
    "Đặt khám theo giờ, không cần chờ lấy số thứ tự",
    "Được hoàn phí khám nếu hủy phiếu",
    "Hưởng chính sách hoàn tiền khi đặt online",
  ];

  const departmentOptions = useMemo(() => {
    const unique = new Map();
    doctors.forEach((doctor) => {
      if (doctor.chuyenKhoa) unique.set(doctor.chuyenKhoa, doctor.chuyenKhoa);
    });
    return Array.from(unique.values()).map((value) => ({
      value,
      label: value,
    }));
  }, [doctors]);

  const selectedDepartment = Form.useWatch("department", form);

  const doctorOptions = useMemo(() => {
    const filtered = selectedDepartment
      ? doctors.filter((doctor) => doctor.chuyenKhoa === selectedDepartment)
      : doctors;
    return filtered.map((doctor) => ({
      value: doctor.maBS,
      label: `${doctor.hoTen}${doctor.chuyenKhoa ? ` - ${doctor.chuyenKhoa}` : ""}`,
      data: doctor,
    }));
  }, [doctors, selectedDepartment]);

  const scheduleRows = useMemo(() => {
    return appointments.map((item, index) => ({
      key: item.maLH || index,
      doctor:
        doctors.find((doctor) => doctor.maBS === item.maBS)?.hoTen ||
        "Chưa cập nhật",
      time: formatTime(item.thoiGianKham),
      status: item.trangThai || "Chờ xác nhận",
    }));
  }, [appointments, doctors]);

  const columns = [
    { title: "Tên bác sĩ", dataIndex: "doctor", key: "doctor" },
    { title: "Giờ khám", dataIndex: "time", key: "time", width: 110 },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || "default"}>{status}</Tag>
      ),
    },
  ];

  const handleScroll = () => {
    bookingRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const loadDoctors = async () => {
    const response = await searchBacSi(null, 1, 2000);
    const rows = getSearchRows(response);
    setDoctors(Array.isArray(rows) ? rows.map(normalizeBacSi) : []);
  };

  const loadPatients = async () => {
    const response = await searchBenhNhan(null, 1, 2000);
    const rows = getSearchRows(response);
    const normalized = Array.isArray(rows) ? rows.map(normalizeBenhNhan) : [];
    setPatients(normalized);
    return normalized;
  };

  const loadTodayAppointments = async () => {
    const today = new Date();
    const filters = [createFilter("Thời gian khám", toLocalDateString(today))];
    const response = await searchLichHen(filters, 1, 2000);
    const rows = getSearchRows(response);
    setAppointments(Array.isArray(rows) ? rows.map(normalizeLichHen) : []);
  };

  const resolvePatientProfile = async (items) => {
    if (patientId) {
      const found = items.find((item) => item.maBN === patientId);
      if (found) return found;
    }

    const phoneNumber = sessionStorage.getItem("phoneNumber") || "";
    if (!phoneNumber) return null;

    const matched = items.find((item) => item.soDienThoai === phoneNumber);

    if (matched?.maBN) {
      setPatientId(matched.maBN);
      sessionStorage.setItem("patientId", matched.maBN);
    }
    return matched || null;
  };

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        await loadDoctors();
        const patientRows = await loadPatients();
        await loadTodayAppointments();
        if (!mounted) return;
        const matched = await resolvePatientProfile(patientRows);
        if (matched) {
          form.setFieldsValue({
            name: matched.hoTen,
            dob: matched.ngaySinh ? dayjs(matched.ngaySinh) : null,
            gender: matched.gioiTinh ? "male" : "female",
            phone: matched.soDienThoai,
            cccd: matched.soBHYT,
            address: matched.diaChi,
            symptoms: matched.tienSuDiUng,
          });
        }
      } catch {
        messageApi.error("Không tải được dữ liệu đặt lịch.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      mounted = false;
    };
  }, [form, messageApi, patientId]);

  const loadTimeSlots = async (dateValue, doctorId) => {
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
        ? rows
            .map(normalizeLichLamViec)
            .filter((item) => item.maBS === doctorId)
        : [];

      const timeSlots = shifts.length
        ? buildTimeSlots(shifts[0].gioBatDau, shifts[0].gioKetThuc)
        : ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30"];

      const appointmentFilters = [
        createFilter("Thời gian khám", toLocalDateString(date)),
      ];
      const appointmentResponse = await searchLichHen(
        appointmentFilters,
        1,
        200,
      );
      const appointmentRows = getSearchRows(appointmentResponse);
      const normalizedAppointments = Array.isArray(appointmentRows)
        ? appointmentRows.map(normalizeLichHen)
        : [];

      const occupiedTimes = normalizedAppointments
        .filter(
          (item) =>
            item.maBS === doctorId &&
            item.trangThai !== "Đã hủy" &&
            item.thoiGianKham,
        )
        .map((item) => formatTime(item.thoiGianKham));

      setBookedTimes(occupiedTimes);
      setTimeOptions(timeSlots.filter((time) => !occupiedTimes.includes(time)));
    } catch {
      messageApi.error("Không lấy được giờ trống.");
    }
  };

  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) return;
    loadTimeSlots(selectedDate, selectedDoctorId);
  }, [selectedDate, selectedDoctorId]);

  const handleDoctorChange = (value) => {
    setSelectedDoctorId(value);
    const doctor = doctors.find((item) => item.maBS === value);
    if (doctor?.chuyenKhoa) {
      form.setFieldsValue({ department: doctor.chuyenKhoa });
    }
  };

  const handleDateChange = (value) => {
    setSelectedDate(value);
    form.setFieldsValue({ time: undefined });
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const gender = values.gender === "male";
      const patientRequest = createBenhNhanRequest(
        patientId,
        values.name,
        toDateValue(values.dob),
        gender,
        values.phone,
        values.address,
        values.cccd,
        values.symptoms,
      );

      let resolvedPatientId = patientId;
      if (!resolvedPatientId && values.phone) {
        const filter = [createFilter("Số điện thoại", values.phone)];
        const response = await searchBenhNhan(filter, 1, 5);
        const rows = getSearchRows(response);
        const found = Array.isArray(rows)
          ? rows.map(normalizeBenhNhan)[0]
          : null;
        if (found?.maBN) resolvedPatientId = found.maBN;
      }

      let patientResponse;
      if (resolvedPatientId) {
        patientResponse = await updateBenhNhan({
          ...patientRequest,
          maBN: resolvedPatientId,
        });
      } else {
        patientResponse = await createBenhNhan(patientRequest);
      }

      const patientPayload = patientResponse?.data ?? {};
      const patientSuccess =
        patientPayload?.isSuccess ?? patientPayload?.IsSuccess ?? true;
      const patientMessage = patientPayload?.message ?? patientPayload?.Message;
      if (!patientSuccess) {
        messageApi.error(
          patientMessage || "Không thể lưu thông tin bệnh nhân.",
        );
        return;
      }

      const patientData = patientPayload?.data ?? patientPayload?.Data ?? {};
      const patientNormalized = normalizeBenhNhan(patientData);

      if (!patientNormalized.maBN) {
        messageApi.error("Không thể lưu thông tin bệnh nhân.");
        return;
      }

      resolvedPatientId = patientNormalized.maBN;
      setPatientId(resolvedPatientId);
      sessionStorage.setItem("patientId", resolvedPatientId);

      const appointmentDate = buildDateTime(values.date, values.time);
      if (!appointmentDate) {
        messageApi.error("Vui lòng chọn ngày và giờ khám.");
        return;
      }

      const appointmentRequest = createLichHenRequest(
        "",
        appointmentDate,
        "Đã đặt",
        resolvedPatientId,
        values.doctor,
      );

      const appointmentResponse = await createLichHen(appointmentRequest);
      const appointmentPayload = appointmentResponse?.data ?? {};
      const isSuccess =
        appointmentPayload?.isSuccess ?? appointmentPayload?.IsSuccess ?? true;
      const msg = appointmentPayload?.message ?? appointmentPayload?.Message;

      if (!isSuccess) {
        messageApi.error(msg || "Không thể đặt lịch.");
        return;
      }

      messageApi.success(msg || "Đặt lịch thành công.");
      form.resetFields(["department", "doctor", "date", "time", "symptoms"]);
      await loadTodayAppointments();
      if (selectedDoctorId && selectedDate) {
        await loadTimeSlots(selectedDate, selectedDoctorId);
      }
    } catch (error) {
      const data = error?.response?.data;
      const msg = data?.message ?? data?.Message;
      messageApi.error(msg || "Không thể đặt lịch.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSelectedDoctorId(null);
    setSelectedDate(null);
    setTimeOptions([]);
  };

  return (
    <div className="booking-page">
      {contextHolder}
      <section className="booking-banner">
        <div className="banner-content">
          <div className="banner-left">
            <h1>ĐẶT KHÁM TẠI CƠ SỞ</h1>
            <ul className="banner-features">
              {features.map((item, index) => (
                <li key={index}>
                  <CheckCircleFilled className="banner-icon" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              type="primary"
              size="large"
              className="banner-btn"
              onClick={handleScroll}
            >
              Đặt khám ngay
            </Button>
          </div>
          <div className="banner-right">
            <img
              src={hospitalImage}
              alt="Phòng khám"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <Spin spinning={loading} description="Đang tải...">
        <Row gutter={16}>
          <Col xs={24} lg={14}>
            <div className="booking-card" ref={bookingRef}>
              <h2 className="booking-card-title">Nhập thông tin đặt lịch</h2>

              <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                onFinish={handleSubmit}
              >
                <div className="form-section">
                  <h3 className="form-section-title">Thông tin bệnh nhân</h3>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Họ tên"
                        name="name"
                        rules={[
                          { required: true, message: "Vui lòng nhập họ tên" },
                        ]}
                      >
                        <Input placeholder="Nhập họ tên" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Giới tính"
                        name="gender"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn giới tính",
                          },
                        ]}
                      >
                        <Radio.Group>
                          <Radio value="male">Nam</Radio>
                          <Radio value="female">Nữ</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Ngày sinh"
                        name="dob"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày sinh",
                          },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại",
                          },
                        ]}
                      >
                        <Input placeholder="Nhập số điện thoại" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="CCCD/BHYT"
                        name="cccd"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập CCCD/BHYT",
                          },
                        ]}
                      >
                        <Input placeholder="Nhập CCCD/BHYT" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[
                          { required: true, message: "Vui lòng nhập địa chỉ" },
                        ]}
                      >
                        <Input placeholder="Nhập địa chỉ" />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item label="Triệu chứng/Dị ứng" name="symptoms">
                        <Input.TextArea
                          autoSize={{ minRows: 1, maxRows: 5 }}
                          placeholder="Mô tả triệu chứng hoặc dị ứng"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Thông tin đặt lịch</h3>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Khoa/Chuyên khoa"
                        name="department"
                        rules={[
                          { required: true, message: "Vui lòng chọn khoa" },
                        ]}
                      >
                        <Select
                          placeholder="Chọn khoa"
                          options={departmentOptions}
                          onChange={() => {
                            form.setFieldsValue({ doctor: undefined });
                            setSelectedDoctorId(null);
                            setTimeOptions([]);
                          }}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Ngày khám"
                        name="date"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày khám",
                          },
                        ]}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          onChange={handleDateChange}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Bác sĩ"
                        name="doctor"
                        rules={[
                          { required: true, message: "Vui lòng chọn bác sĩ" },
                        ]}
                      >
                        <Select
                          placeholder="Chọn bác sĩ"
                          options={doctorOptions}
                          onChange={handleDoctorChange}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Giờ khám"
                        name="time"
                        rules={[
                          { required: true, message: "Vui lòng chọn giờ khám" },
                        ]}
                      >
                        <Select
                          placeholder={
                            selectedDoctorId && selectedDate
                              ? "Chọn giờ khám"
                              : "Chọn bác sĩ và ngày khám trước"
                          }
                          options={timeOptions.map((time) => ({
                            value: time,
                            label: time,
                          }))}
                          disabled={!selectedDoctorId || !selectedDate}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <div className="form-actions">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="submit-btn"
                  >
                    Xác nhận đặt lịch
                  </Button>
                  <Button
                    type="default"
                    className="reset-btn"
                    onClick={handleReset}
                  >
                    Xóa
                  </Button>
                </div>
              </Form>
            </div>
          </Col>

          <Col xs={24} lg={10}>
            <div className="booking-card">
              <h3 className="booking-card-title">Lịch khám hôm nay</h3>
              <Table
                columns={columns}
                dataSource={scheduleRows}
                pagination={false}
                bordered
                size="small"
                className="booking-table"
                locale={{ emptyText: "Chưa có lịch khám." }}
              />
            </div>

            <div className="booking-card booking-notes">
              <h3 className="booking-card-title">Lưu ý quan trọng</h3>
              <ul className="notes-list">
                <li>Đến trước giờ hẹn 15 phút</li>
                <li>Mang theo CCCD và thẻ BHYT</li>
                <li>Tuân thủ hướng dẫn y tế của cơ sở</li>
              </ul>
            </div>

            <div className="booking-card">
              <h3 className="booking-card-title">Bác sĩ chuyên khoa</h3>
              <div className="doctors-list">
                {(doctors.length ? doctors.slice(0, 2) : []).map((doctor) => (
                  <div className="doctor-item" key={doctor.maBS}>
                    <Avatar size={48} src={doctorImage} />
                    <div className="doctor-info">
                      <div className="doctor-name">{doctor.hoTen}</div>
                      <div className="doctor-dept">
                        {doctor.chuyenKhoa || "Chưa cập nhật"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedDoctorId && bookedTimes.length > 0 && (
              <div className="booking-card booking-notes">
                <h3 className="booking-card-title">Khung giờ đã đặt</h3>
                <div className="notes-list">
                  {bookedTimes.map((time) => (
                    <Tag key={time} color="red">
                      {time}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Spin>
    </div>
  );
}
