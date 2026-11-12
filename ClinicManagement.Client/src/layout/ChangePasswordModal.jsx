import { useState } from "react";
import { Alert, Form, Input, Modal } from "antd";
import { changePassword as changePasswordApi } from "../apis";
import { createChangePasswordRequest } from "../interfaces";

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  const validationErrors = data?.errors ?? data?.Errors;
  const firstValidationMsg = validationErrors
    ? Object.values(validationErrors).flat().find(Boolean)
    : null;
  const msg = data?.message ?? data?.Message ?? data?.title ?? data?.Title;
  return firstValidationMsg || msg || fallback;
};

export default function ChangePasswordModal({ open, onClose }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (submitting) return;
    form.resetFields();
    setError("");
    onClose();
  };

  const handleSubmit = async (values) => {
    setError("");
    setSubmitting(true);
    try {
      const response = await changePasswordApi(
        createChangePasswordRequest(
          values.currentPassword,
          values.newPassword,
          values.confirmNewPassword,
        ),
      );
      const res = response?.data ?? {};
      const isSuccess = res?.isSuccess ?? res?.IsSuccess;
      const msg = res?.message ?? res?.Message;

      if (!isSuccess) {
        setError(msg || "Không thể đổi mật khẩu.");
        return;
      }

      form.resetFields();
      onClose(true);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể đổi mật khẩu."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title="Đổi mật khẩu"
      okText="Đổi mật khẩu"
      cancelText="Huỷ"
      confirmLoading={submitting}
      onOk={() => form.submit()}
      maskClosable={!submitting}
      closable={!submitting}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Form.Item
          label="Mật khẩu hiện tại"
          name="currentPassword"
          rules={[{ required: true, message: "Nhập mật khẩu hiện tại" }]}
        >
          <Input.Password placeholder="Mật khẩu hiện tại" autoComplete="current-password" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: "Nhập mật khẩu mới" },
            { min: 8, message: "Mật khẩu ít nhất 8 ký tự" },
            { max: 40, message: "Mật khẩu tối đa 40 ký tự" },
            {
              pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/,
              message: "Mật khẩu cần chữ hoa, chữ thường, số và ký tự đặc biệt",
            },
          ]}
        >
          <Input.Password placeholder="Mật khẩu mới" autoComplete="new-password" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmNewPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Xác nhận mật khẩu mới" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không khớp"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu mới" autoComplete="new-password" />
        </Form.Item>

        {error && <Alert message={error} type="error" showIcon />}
      </Form>
    </Modal>
  );
}
