import "../auth.scss";
import "./register.scss";
import heroImage from "../../../assets/image/img6.jpg";
import logo from "../../../assets/image/LogoBYT.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, Button, Card, Checkbox, Form, Input, Typography } from "antd";
import { register as registerApi } from "../../../apis";
import {
  createRegisterRequest,
  normalizeRegisterResponse,
} from "../../../interfaces";

const { Title, Paragraph, Text } = Typography;

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setError("");
    setLoading(true);
    try {
      const response = await registerApi(
        createRegisterRequest(
          values.name,
          values.email,
          values.phoneNumber,
          values.password,
          values.confirmPassword,
        ),
      );
      const result = response?.data;
      if (!result?.isSuccess) {
        setError(result?.message || "Đăng ký thất bại.");
        return;
      }

      const data = normalizeRegisterResponse(result.data ?? {});

      if (data.accessToken)
        sessionStorage.setItem("accessToken", data.accessToken);
      if (data.role) sessionStorage.setItem("role", data.role);
      if (data.userName) sessionStorage.setItem("userName", data.userName);

      navigate("/login");
    } catch {
      setError("Không thể kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register-page">
      <div className="auth-shell">
        <aside className="auth-visual">
          <div className="auth-badge">
            <img src={logo} alt="Bộ Y tế" loading="eager" decoding="async" />
              <span className="auth-badge-title">
                Hệ thống quản lý phòng khám
              </span>
          </div>
          <Title level={2}>Tạo tài khoản mới</Title>
          <Text type="secondary">Thông tin bệnh nhân được lưu trữ và bảo mật trên hệ thống.</Text>
          <img className="auth-illustration" src={heroImage} alt="Phòng khám" loading="lazy" decoding="async" />
        </aside>
        <Card className="auth-card" variant="borderless">
          <div className="auth-card-header">
            <Title level={2}>Đăng ký</Title>
          </div>
          <Form className="auth-form" layout="vertical" onFinish={handleSubmit}>
            <div className="auth-grid">
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[{ required: true, message: "Nhập họ tên" }]}
              >
                <Input placeholder="Nhập họ tên" autoComplete="name" />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[{ required: true, message: "Nhập số điện thoại" }]}
              >
                <Input placeholder="Nhập số điện thoại" autoComplete="tel" />
              </Form.Item>
            </div>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Nhập email" autoComplete="email" />
            </Form.Item>
            <div className="auth-grid">
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Tạo mật khẩu" },
                  { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
                  {
                    pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/,
                    message:
                      "Mật khẩu cần chữ hoa, chữ thường, số và ký tự đặc biệt",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Tạo mật khẩu"
                  autoComplete="new-password"
                />
              </Form.Item>
              <Form.Item
                label="Xác nhận"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Nhập lại mật khẩu" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp"),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                />
              </Form.Item>
            </div>
            <Form.Item
              name="agree"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Vui lòng đồng ý với điều khoản sử dụng."),
                        ),
                },
              ]}
            >
              <Checkbox>Đồng ý với điều khoản sử dụng</Checkbox>
            </Form.Item>
            {error && <Alert message={error} type="error" showIcon />}
            <Button type="primary" htmlType="submit" loading={loading} block>
              Tạo tài khoản
            </Button>
          </Form>
          <div className="auth-footer">
            <Text type="secondary">Đã có tài khoản?</Text>
            <Link className="auth-link" to="/login">
              Đăng nhập
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
