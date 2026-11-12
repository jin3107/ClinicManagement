import "../auth.scss";
import "./login.scss";
import heroImage from "../../../assets/image/img1.png";
import logo from "../../../assets/image/LogoBYT.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, Button, Card, Checkbox, Form, Input, Typography } from "antd";
import { login as loginApi } from "../../../apis";
import { createLoginRequest, normalizeLoginResponse } from "../../../interfaces";

const { Title, Paragraph, Text } = Typography;

export default function Login() {
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const getRoleKey = (value) =>
		String(value || "")
			.toLowerCase()
			.replace(/[_\s-]+/g, "");

	const getDefaultRoute = (roleValue) => {
		const key = getRoleKey(roleValue);
		if (["superadmin", "admin", "quanly", "manager"].includes(key))
			return "/admin/dashboard";
		if (["bacsi", "doctor"].includes(key)) return "/doctor/dashboard";
		if (["letan", "receptionist"].includes(key))
			return "/receptionist/dashboard";
		// Đường dẫn cũ: "/". Theo tài liệu, bệnh nhân có màn hình chính riêng.
		return "/patient/dashboard";
	};

	const handleSubmit = async (values) => {
		setError("");
		setLoading(true);
		try {
			const response = await loginApi(createLoginRequest(
				values.userName,
				values.password
			));
			const result = response?.data;
			if (!result?.isSuccess) {
				setError(result?.message || "Đăng nhập thất bại.");
				return;
			}
			const data = normalizeLoginResponse(result.data ?? {});
			
			if (data.accessToken) sessionStorage.setItem("accessToken", data.accessToken);
			if (data.role) sessionStorage.setItem("role", data.role);
			if (data.userName) sessionStorage.setItem("userName", data.userName);
			if (data.phoneNumber) sessionStorage.setItem("phoneNumber", data.phoneNumber);
			else sessionStorage.removeItem("phoneNumber");

			navigate(getDefaultRoute(data.role));
		} catch {
			setError("Không thể kết nối máy chủ.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-page login-page">
			<div className="auth-shell">
				<aside className="auth-visual">
					<div className="auth-badge">
						<img src={logo} alt="Bộ Y tế" loading="eager" decoding="async" />
						<div>
							<span className="auth-badge-title">Hệ thống quản lý phòng khám</span>
						</div>
					</div>
					<Title level={2}>Chào mừng trở lại</Title>
						<Text type="secondary">Phòng khám hỗ trợ và tiếp nhận khám chữa bệnh từ thứ 2 đến thứ 6</Text>
					<img className="auth-illustration" src={heroImage} alt="Bác sĩ" loading="eager" decoding="async" />
				</aside>
				<Card className="auth-card" variant="borderless">
					<div className="auth-card-header">
						<Title level={2}>Đăng nhập</Title>
					</div>
					<Form className="auth-form" layout="vertical" onFinish={handleSubmit}>
						<Form.Item
							label="Tài khoản"
							name="userName"
							rules={[{ required: true, message: "Nhập tài khoản" }]}
						>
							<Input placeholder="Email hoặc số điện thoại" autoComplete="username" />
						</Form.Item>
						<Form.Item
							label="Mật khẩu"
							name="password"
							rules={[{ required: true, message: "Nhập mật khẩu" }]}
						>
							<Input.Password placeholder="Nhập mật khẩu" autoComplete="current-password" />
						</Form.Item>
						<div className="auth-row">
							<Link className="auth-link-button" to="/forgotpassword">
								Quên mật khẩu?
							</Link>
						</div>
						{error && <Alert message={error} type="error" showIcon />}
						<Button type="primary" htmlType="submit" loading={loading} block>
							Đăng nhập
						</Button>
					</Form>
					<div className="auth-footer">
						<Text type="secondary">Chưa có tài khoản?</Text>
						<Link className="auth-link" to="/register">
							Đăng ký
						</Link>
					</div>
				</Card>
			</div>
		</div>
	);
}
