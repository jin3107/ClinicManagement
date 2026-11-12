import {
  Form,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Radio,
  message,
} from "antd";

import { useState } from "react";
import "./patientintake.scss";

import { createBenhNhan } from "../../../apis/BenhNhanAPI";
import { createBenhNhanRequest } from "../../../interfaces";

export default function PatientIntake() {
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      const payload = createBenhNhanRequest(
        "",
        values.name,
        values.dob?.toDate?.() || values.dob,
        values.gender === "male",
        values.phone,
        values.address,
        values.cccd,
        values.symptoms || "",
      );

      await createBenhNhan(payload);

      messageApi.success("Thêm bệnh nhân thành công");

      console.log("Payload:", payload);

      form.resetFields();
    } catch (error) {
      console.error(error);

      messageApi.error("Không thể thêm bệnh nhân");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div className="patient-intake-page">
      {contextHolder}

      {/* PAGE HEADER */}
      <div className="patient-intake-header">
        <div>
          <p>Theo dõi và quản lý lịch khám của bạn nhanh chóng, tiện lợi.</p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="patient-intake-card">
        <h2 className="patient-intake-card-title">Nhập thông tin bệnh nhân</h2>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={handleSubmit}
        >
          {/* PATIENT INFO */}
          <div className="form-section">
            <h3 className="form-section-title">Thông tin bệnh nhân</h3>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Họ tên"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập họ tên",
                    },
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
                  <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
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
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ",
                    },
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

          <div className="form-actions">
            <Button
              type="primary"
              htmlType="submit"
              className="submit-btn"
              loading={isSubmitting}
            >
              Xác nhận thêm bệnh nhân
            </Button>

            <Button type="default" className="reset-btn" onClick={handleReset}>
              Xóa
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
