import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import "./dashboard.scss";
import scheduleImage from "../../../assets/image/card-benhnhan-01.jpg";
import bookingImage from "../../../assets/image/card-letan-05.jpg";
import rescheduleImage from "../../../assets/image/card-letan-06.jpg";
import cancellationImage from "../../../assets/image/card-letan-07.jpg";

export default function PatientDashboard() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 1,
      title: "Xem lịch",
      image: scheduleImage,
      // Đường dẫn cũ: /finance/payment
      path: "/scheduleview",
    },
    {
      id: 2,
      title: "Đặt lịch",
      image: bookingImage,
      // Đường dẫn cũ: /finance/payment
      path: "/booking",
    },
    {
      id: 3,
      title: "Đổi lịch",
      image: rescheduleImage,
      // Đường dẫn cũ: /finance/payment
      path: "/reschedule",
    },
    {
      id: 4,
      title: "Hủy lịch",
      image: cancellationImage,
      // Đường dẫn cũ: /finance/payment
      path: "/cancellation",
    },
  ];

  return (
    <div className="patient-dashboard-page">
      <section className="dashboard-banner">
        <div className="banner-content">
          <div className="banner-left">
            <h1>Chào mừng đến với Quản lý Phòng khám</h1>
            <p>Hệ thống quản lý hoàn toàn cho phòng khám đa khoa</p>
          </div>
          <div className="banner-right"></div>
        </div>
      </section>
      <div className="menu-grid">
        {menuItems.map((item) => (
          <Card
            key={item.id}
            className="menu-card"
            hoverable
            onClick={() => navigate(item.path)}
            cover={
              <div className="card-image-wrapper">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            }
          >
          </Card>
        ))}
      </div>
    </div>
  );
}
