import "../auth.scss";
import "./forgotpassword.scss";
import heroImage from "../../../assets/image/img4.jpg";
import logo from "../../../assets/image/LogoBYT.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Result,
  Space,
  Steps,
  Typography,
} from "antd";
import {
  createSendOtpRequest,
  createVerifyOtpRequest,
  createResetPasswordRequest,
} from "../../../interfaces";
import {
  sendOtp as sendOtpApi,
  verifyOtp as verifyOtpApi,
  resetPassword as resetPasswordApi,
} from "../../../apis";

const { Title, Paragraph } = Typography;

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  const validationErrors = data?.errors ?? data?.Errors;
  const firstValidationMsg = validationErrors
    ? Object.values(validationErrors).flat().find(Boolean)
    : null;
  const msg = data?.message ?? data?.Message ?? data?.title ?? data?.Title;
  return firstValidationMsg || msg || fallback;
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [emailForm] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const handleSendOtp = async (values) => {
    setError("");
    setSubmitting(true);
    try {
      const response = await sendOtpApi(createSendOtpRequest(values.email));
      const res = response?.data ?? {};
      const isSuccess = res?.isSuccess ?? res?.IsSuccess;
      const msg = res?.message ?? res?.Message;

      if (!isSuccess) {
        setError(msg || "Không thể gửi mã OTP.");
        return;
      }

      setEmail(values.email);
      setCurrentStep(1);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể gửi mã OTP."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (values) => {
    setError("");
    setSubmitting(true);
    try {
      const response = await verifyOtpApi(
        createVerifyOtpRequest(email, values.code),
      );
      const res = response?.data ?? {};
      const isSuccess = res?.isSuccess ?? res?.IsSuccess;
      const msg = res?.message ?? res?.Message;

      if (!isSuccess) {
        setError(msg || "Mã OTP không đúng.");
        return;
      }

      setCurrentStep(2);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể xác thực mã OTP."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (values) => {
    setError("");
    setSubmitting(true);
    try {
      const response = await resetPasswordApi(
        createResetPasswordRequest(
          email,
          values.newPassword,
          values.confirmNewPassword,
        ),
      );
      const res = response?.data ?? {};
      const isSuccess = res?.isSuccess ?? res?.IsSuccess;
      const msg = res?.message ?? res?.Message;

      if (!isSuccess) {
        const isExpiredSession =
          msg?.toLowerCase().includes("otp") || msg?.toLowerCase().includes("xác thực");
        setError(msg || "Không thể đặt lại mật khẩu.");
        if (isExpiredSession) setCurrentStep(0);
        return;
      }

      setDone(true);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể đặt lại mật khẩu."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSubmitting(true);
    try {
      const response = await sendOtpApi(createSendOtpRequest(email));
      const res = response?.data ?? {};
      const isSuccess = res?.isSuccess ?? res?.IsSuccess;
      if (!isSuccess) setError(res?.message || res?.Message || "Không thể gửi lại mã OTP.");
    } catch (err) {
      setError(getErrorMessage(err, "Không thể gửi lại mã OTP."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="auth-page forgot-password-page">
        <div className="auth-shell">
          <aside className="auth-visual">
            <div className="auth-badge">
              <img src={logo} alt="Bộ Y tế" loading="eager" decoding="async" />
              <div>
                <span className="auth-badge-title">
                  Hệ thống quản lý phòng khám
                </span>
              </div>
            </div>
            <Title level={2}>Quên mật khẩu?</Title>
            <Paragraph>
              Nhập email đã đăng ký để nhận mã xác thực (OTP) đặt lại mật khẩu.
            </Paragraph>
            <img
              className="auth-illustration"
              src={heroImage}
              alt="Bệnh viện"
              loading="lazy"
              decoding="async"
            />
          </aside>

          <Card className="auth-card" variant="borderless">
            {done ? (
              <Result
                className="forgot-password-result"
                status="success"
                title="Đổi mật khẩu thành công!"
                subTitle="Bạn có thể đăng nhập bằng mật khẩu mới."
                extra={
                  <Button type="primary" onClick={() => navigate("/login")}>
                    Đăng nhập
                  </Button>
                }
              />
            ) : (
              <>
                <div className="auth-card-header">
                  <Title level={2}>Đặt lại mật khẩu</Title>
                </div>

                <Steps
                  current={currentStep}
                  size="small"
                  style={{ marginBottom: 24 }}
                  items={[
                    { title: "Email" },
                    { title: "Xác thực OTP" },
                    { title: "Mật khẩu mới" },
                  ]}
                />

                {currentStep === 0 && (
                  <Form
                    form={emailForm}
                    layout="vertical"
                    onFinish={handleSendOtp}
                    autoComplete="off"
                    className="auth-form"
                  >
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: "Nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                      ]}
                    >
                      <Input placeholder="Email đăng ký tài khoản" />
                    </Form.Item>

                    {error && <Alert message={error} type="error" showIcon />}

                    <Space className="auth-actions" wrap>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                      >
                        Gửi mã OTP
                      </Button>
                      <Button onClick={() => navigate("/login")} disabled={submitting}>
                        Quay lại đăng nhập
                      </Button>
                    </Space>
                  </Form>
                )}

                {currentStep === 1 && (
                  <Form
                    form={otpForm}
                    layout="vertical"
                    onFinish={handleVerifyOtp}
                    autoComplete="off"
                    className="auth-form"
                  >
                    <Paragraph type="secondary">
                      Mã OTP gồm 6 chữ số đã được gửi tới <b>{email}</b>. Mã có
                      hiệu lực trong 5 phút.
                    </Paragraph>

                    <Form.Item
                      label="Mã OTP"
                      name="code"
                      rules={[
                        { required: true, message: "Nhập mã OTP" },
                        { len: 6, message: "Mã OTP gồm 6 chữ số" },
                      ]}
                    >
                      <Input placeholder="Nhập mã OTP" maxLength={6} />
                    </Form.Item>

                    {error && <Alert message={error} type="error" showIcon />}

                    <Space className="auth-actions" wrap>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                      >
                        Xác thực
                      </Button>
                      <Button onClick={handleResendOtp} disabled={submitting}>
                        Gửi lại mã
                      </Button>
                      <Button
                        onClick={() => {
                          setError("");
                          setCurrentStep(0);
                        }}
                        disabled={submitting}
                      >
                        Quay lại
                      </Button>
                    </Space>
                  </Form>
                )}

                {currentStep === 2 && (
                  <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handleResetPassword}
                    autoComplete="off"
                    className="auth-form"
                  >
                    <Form.Item
                      label="Mật khẩu mới"
                      name="newPassword"
                      rules={[
                        { required: true, message: "Nhập mật khẩu mới" },
                        { min: 8, message: "Mật khẩu ít nhất 8 ký tự" },
                        { max: 40, message: "Mật khẩu tối đa 40 ký tự" },
                      ]}
                    >
                      <Input.Password placeholder="Mật khẩu mới" />
                    </Form.Item>

                    <Form.Item
                      label="Xác nhận mật khẩu"
                      name="confirmNewPassword"
                      dependencies={["newPassword"]}
                      rules={[
                        { required: true, message: "Xác nhận mật khẩu" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue("newPassword") === value
                            )
                              return Promise.resolve();
                            return Promise.reject(
                              new Error("Mật khẩu không khớp"),
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password placeholder="Nhập lại mật khẩu mới" />
                    </Form.Item>

                    {error && <Alert message={error} type="error" showIcon />}

                    <Space className="auth-actions" wrap>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                      >
                        Đổi mật khẩu
                      </Button>
                      <Button
                        onClick={() => {
                          setError("");
                          setCurrentStep(1);
                        }}
                        disabled={submitting}
                      >
                        Quay lại
                      </Button>
                    </Space>
                  </Form>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
