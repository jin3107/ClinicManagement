import "./workingschedule.scss";
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  DatePicker,
  Select,
  Card,
  message,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// Import API
import { searchBacSi } from "../../../apis";
import {
  searchLichLamViec,
  createLichLamViec,
  updateLichLamViec,
  deleteLichLamViec,
} from "../../../apis";

const { Option } = Select;

const GIO_OPTIONS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

const getSearchRows = (response) => {
  const payload = response?.data ?? {};
  const searchData = payload?.data ?? payload?.Data ?? {};
  return searchData?.data ?? searchData?.Data ?? [];
};

const extractTime = (timeString) => {
  if (!timeString) return "";
  if (timeString.includes("T")) return dayjs(timeString).format("HH:mm");
  return timeString.substring(0, 5);
};

const getAppResponse = (response) => response?.data ?? {};

export default function WorkingSchedule() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [bacSis, setBacSis] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [formData, setFormData] = useState({
    maLLV: null,
    ngayLamViec: null,
    maBS: null,
    gioBatDau: null,
    gioKetThuc: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bacSiRes, lichLamViecRes] = await Promise.all([
        searchBacSi(null, 1, 500),
        searchLichLamViec(null, 1, 1000),
      ]);
      setBacSis(getSearchRows(bacSiRes));
      setSchedules(getSearchRows(lichLamViecRes));
    } catch (error) {
      console.error(error);
      messageApi.error("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const doctorOptions = bacSis.map((doctor) => ({
    label: `${doctor.hoTen} - ${doctor.chuyenKhoa || "Đa khoa"}`,
    value: doctor.maBS,
  }));

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      maLLV: null,
      ngayLamViec: null,
      maBS: null,
      gioBatDau: null,
      gioKetThuc: null,
    });
  };

  const handleEdit = (record) => {
    setFormData({
      maLLV: record.maLLV,
      ngayLamViec: record.ngayLamViec ? dayjs(record.ngayLamViec) : null,
      maBS: record.maBS,
      gioBatDau: extractTime(record.gioBatDau),
      gioKetThuc: extractTime(record.gioKetThuc),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    const { maLLV, ngayLamViec, maBS, gioBatDau, gioKetThuc } = formData;

    if (!ngayLamViec || !maBS || !gioBatDau || !gioKetThuc) {
      messageApi.warning("Vui lòng điền đầy đủ thông tin phân công!");
      return;
    }

    if (gioBatDau >= gioKetThuc) {
      messageApi.warning("Giờ kết thúc phải sau giờ bắt đầu.");
      return;
    }

    setSubmitLoading(true);
    try {
      const dateStr = ngayLamViec.format("YYYY-MM-DD");
      const payload = {
        maBS,
        ngayLamViec: `${dateStr}T00:00:00`,
        gioBatDau: `${dateStr}T${gioBatDau}:00`,
        gioKetThuc: `${dateStr}T${gioKetThuc}:00`,
      };

      let response;
      if (maLLV) {
        payload.maLLV = maLLV;
        response = await updateLichLamViec(payload);
      } else {
        response = await createLichLamViec(payload);
      }

      const appResponse = getAppResponse(response);
      const isSuccess = appResponse?.isSuccess ?? appResponse?.IsSuccess;
      if (isSuccess === false) {
        messageApi.error(
          appResponse?.message ?? appResponse?.Message ?? "Không thể lưu lịch làm việc.",
        );
        return;
      }

      messageApi.success(maLLV ? "Cập nhật thành công!" : "Phân công thành công!");
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Chi tiết lỗi API:", error.response?.data || error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.Message ||
        error.response?.data?.title ||
        "Không thể lưu lịch làm việc.";
      messageApi.error(errorMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLichLamViec(id);
      messageApi.success("Đã xóa lịch làm việc.");
      if (formData.maLLV === id) resetForm();
      loadData();
    } catch (error) {
      console.error("Chi tiết lỗi xóa:", error);
      messageApi.error("Không thể xóa lịch làm việc.");
    }
  };

  const tableData = schedules.map((item) => {
    const doctor = bacSis.find((bs) => String(bs.maBS) === String(item.maBS));
    return {
      ...item,
      hoTen: doctor?.hoTen || item.tenBacSi || "Không rõ",
      chuyenKhoa: doctor?.chuyenKhoa || "Không rõ",
    };
  });

  const columns = [
    {
      title: "NGÀY",
      dataIndex: "ngayLamViec",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : ""),
    },
    {
      title: "GIỜ BẮT ĐẦU",
      dataIndex: "gioBatDau",
      render: (v) => extractTime(v),
    },
    {
      title: "GIỜ KẾT THÚC",
      dataIndex: "gioKetThuc",
      render: (v) => extractTime(v),
    },
    { title: "BÁC SĨ", dataIndex: "hoTen" },
    { title: "KHOA", dataIndex: "chuyenKhoa" },
    {
      title: "THAO TÁC",
      align: "center",
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="text"
            icon={<EditOutlined />}
            className="edit-btn"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa lịch này?"
            onConfirm={() => handleDelete(record.maLLV)}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className="delete-btn"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const isEditing = !!formData.maLLV;

  return (
    <div className="workingschedule-page">
      {contextHolder}
      <Card className="assign-card" variant="borderless">
        <div className="section-label">
          {isEditing ? <EditOutlined /> : <PlusOutlined />}
          {isEditing
            ? " Cập nhật lịch làm việc"
            : " Phân công lịch làm việc mới"}
        </div>

        <div className="assign-form">
          <div className="form-group">
            <label>Ngày làm việc</label>
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
              style={{ width: "100%" }}
              value={formData.ngayLamViec}
              onChange={(date) => handleChange("ngayLamViec", date)}
            />
          </div>

          <div className="form-group">
            <label>Bác sĩ</label>
            <Select
              showSearch
              placeholder="Chọn bác sĩ"
              options={doctorOptions}
              optionFilterProp="label"
              style={{ width: "100%" }}
              value={formData.maBS}
              onChange={(val) => handleChange("maBS", val)}
            />
          </div>

          <div className="form-group">
            <label>Giờ bắt đầu</label>
            <Select
              placeholder="Giờ bắt đầu"
              style={{ width: "100%" }}
              value={formData.gioBatDau}
              onChange={(val) => handleChange("gioBatDau", val)}
            >
              {GIO_OPTIONS.map((h) => (
                <Option key={h} value={h}>
                  {h}
                </Option>
              ))}
            </Select>
          </div>

          <div className="form-group">
            <label>Giờ kết thúc</label>
            <Select
              placeholder="Giờ kết thúc"
              style={{ width: "100%" }}
              value={formData.gioKetThuc}
              onChange={(val) => handleChange("gioKetThuc", val)}
            >
              {GIO_OPTIONS.map((h) => (
                <Option key={h} value={h}>
                  {h}
                </Option>
              ))}
            </Select>
          </div>

          <div className="form-group form-group--btn">
            <label>&nbsp;</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                type="primary"
                icon={isEditing ? <SaveOutlined /> : <PlusOutlined />}
                className="assign-btn"
                onClick={handleSubmit}
                loading={submitLoading}
                style={{ flex: 1 }}
              >
                {isEditing ? "Cập nhật" : "Xác nhận"}
              </Button>
              {isEditing && (
                <Button
                  onClick={resetForm}
                  style={{ flex: 0.5, height: "38px", borderRadius: "9px" }}
                >
                  Hủy
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className="table-card" variant="borderless">
        <div className="table-title">
          <CalendarOutlined /> Danh sách lịch làm việc
        </div>
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey={(record) => record.maLLV || record.id}
          size="medium"
          loading={loading}
          pagination={{ pageSize: 8 }}
          className="clean-table"
          locale={{ emptyText: "Chưa có lịch làm việc nào." }}
        />
      </Card>
    </div>
  );
}
