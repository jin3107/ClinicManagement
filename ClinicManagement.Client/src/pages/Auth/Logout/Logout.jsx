import "../auth.scss";
import "./logout.scss";
import logoutImage from "../../../assets/image/logout.jpg";
import logo from "../../../assets/image/LogoBYT.png";
import { useNavigate } from "react-router-dom";
import { logout as logoutApi } from "../../../apis";
import { useState } from "react";
import { Alert, Button, Card, Space, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function Logout() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleLogout = async () => {
		setError("");
		setLoading(true);
		try {
			await logoutApi();
		} catch {
			// ignore when backend is not ready
		}
		sessionStorage.clear();
		setLoading(false);
		navigate("/login");
	};

	return (
		<div className="auth-page logout-page">
			<div className="auth-shell">
				<aside className="auth-visual">
					<div className="auth-badge">
						<img src={logo} alt="Bộ Y tế" loading="eager" decoding="async" />
						<div>
							<span className="auth-badge-title">Hệ thống quản lý phòng khám</span>
						</div>
					</div>
					<Text type="secondary">Cảm ơn bạn đã tin tưởng và sử dụng hệ thống quản lý phòng khám.</Text>

					<img className="auth-illustration" src={logoutImage} alt="Bệnh viện" loading="lazy" decoding="async" />
				</aside>
				<Card className="auth-card" variant="borderless">
					<div className="auth-card-header">
						<Title level={2}>Đăng xuất</Title>
					</div>
					<Card className="logout-panel" size="small">
						<Space align="start">
							<div className="logout-icon">
								<ExclamationCircleOutlined />
							</div>
							<div>
								<Title level={4}>Bạn muốn đăng xuất?</Title>
								<Text type="secondary">Lưu lại mọi thay đổi trước khi đăng xuất.</Text>
							</div>
						</Space>
					</Card>
					<Space className="auth-actions" wrap>
						<Button type="primary" onClick={handleLogout} loading={loading}>
							Đăng xuất
						</Button>
						<Button onClick={() => navigate(-1)}>Quay lại</Button>
					</Space>
					{error && <Alert message={error} type="error" showIcon />}
				</Card>
			</div>
		</div>
	);
}
