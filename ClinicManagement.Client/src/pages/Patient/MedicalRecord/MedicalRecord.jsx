import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Typography,
  Button,
  Space,
  message,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

import { createBenhNhan } from "../../../apis";

import "./medicalrecord.scss";

const { Title, Text } = Typography;
const { Option } = Select;

const SERVICE_MAP = {
  general: "Khám tổng quát",
  specialist: "Khám chuyên khoa",
  inject: "Tiêm vaccine",
  test: "Xét nghiệm",
};

export default function MedicalRecord() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs());

  const watchedFullName = Form.useWatch("fullName", form);
  const watchedMedicalCode = Form.useWatch("medicalCode", form);
  const watchedService = Form.useWatch("service", form);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        hoTen: values.fullName,
        ngaySinh: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
        gioiTinh: values.gender === "male",
        soDienThoai: values.phone,
        diaChi: values.address,
        soBHYT: values.medicalCode,
        tienSuDiUng: values.allergy || "",
      };

      await createBenhNhan(payload);

      messageApi.success("Đã lưu hồ sơ bệnh nhân thành công!");

      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi lưu bệnh nhân:", error);
      const errorMsg =
        error.response?.data?.message || "Vui lòng kiểm tra lại dữ liệu.";
      messageApi.error(`Có lỗi xảy ra: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-record-page">
      {contextHolder}

      <div className="content-grid">
        <Card className="form-card">
          <div className="section-heading">
            <Title level={5}>Thông tin bệnh nhân</Title>
          </div>

          <Form
            form={form}
            layout="vertical"
            name="patientIntake"
            onFinish={handleFinish}
            initialValues={{ gender: "female" }}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input placeholder="Nguyễn Văn A" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Giới tính"
                  name="gender"
                  rules={[
                    { required: true, message: "Vui lòng chọn giới tính" },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="female">Nữ</Radio>
                    <Radio value="male">Nam</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Ngày sinh"
                  name="birthday"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày sinh" },
                  ]}
                >
                  <DatePicker
                    className="full-width"
                    placeholder="Chọn ngày sinh"
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                  ]}
                >
                  <Input placeholder="0912 345 678" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Địa chỉ"
                  name="address"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                  <Input placeholder="Số nhà, phường, quận" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Dịch vụ khám"
                  name="service"
                  rules={[
                    { required: true, message: "Vui lòng chọn khoa khám" },
                  ]}
                >
                  <Select placeholder="Chọn khoa khám">
                    <Option value="general">Khám tổng quát</Option>
                    <Option value="specialist">Khám chuyên khoa</Option>
                    <Option value="inject">Tiêm vaccine</Option>
                    <Option value="test">Xét nghiệm</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Số BHYT/CCCD"
                  name="medicalCode"
                  rules={[
                    { required: true, message: "Vui lòng nhập số BHYT/CCCD" },
                  ]}
                >
                  <Input placeholder="Nhập mã số..." />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Dị ứng" name="allergy">
                  <Input placeholder="Tiền sử dị ứng (nếu có)" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item className="button-group">
                  <Space size="middle">
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Lưu hồ sơ
                    </Button>
                    <Button
                      htmlType="button"
                      onClick={() => form.resetFields()}
                      disabled={loading}
                    >
                      Xóa trắng
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card className="summary-card">
          <div className="summary-header">
            <Title level={5}>Tóm tắt hồ sơ</Title>
            <Text type="secondary">Thông tin nhanh trước khi lưu hồ sơ.</Text>
          </div>

          <div className="summary-row">
            <Text strong>Họ tên bệnh nhân</Text>
            <Text>{watchedFullName || "--"}</Text>
          </div>

          <div className="summary-row">
            <Text strong>Số BHYT/CCCD</Text>
            <Text>{watchedMedicalCode || "--"}</Text>
          </div>

          <div className="summary-row">
            <Text strong>Dịch vụ / Khoa</Text>
            <Text>{watchedService ? SERVICE_MAP[watchedService] : "--"}</Text>
          </div>

          <div className="summary-row">
            <Text strong>Tiếp nhận lúc</Text>
            <Text>{currentTime.format("HH:mm - DD/MM/YYYY")}</Text>
          </div>

          <div className="summary-status">
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
            <Text>Hệ thống sẵn sàng ghi nhận</Text>
          </div>
        </Card>
      </div>
    </div>
  );
}
