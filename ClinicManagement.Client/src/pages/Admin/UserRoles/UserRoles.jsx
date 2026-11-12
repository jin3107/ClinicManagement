import "../admin.scss";
import "./userroles.scss";
import { useCallback, useEffect, useState } from "react";
import { Table, Button, Form, Input, Select, Tag, Space,
  Popconfirm, Card, Typography, message,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { createNhanVien, searchNhanVien, updateNhanVien, deleteNhanVien } from "../../../apis";
import { normalizeNhanVien } from "../../../models/NhanVien";

const { Title, Text } = Typography;

const ROLE_LABELS = {
  SuperAdmin: "Quản lý",
  BacSi: "Bác sĩ",
  LeTan: "Lễ tân",
  BenhNhan: "Bệnh nhân",
};

const ROLE_COLORS = {
  SuperAdmin: "blue",
  BacSi: "green",
  LeTan: "orange",
  BenhNhan: "default",
};

const ROLE_OPTIONS = [
  { value: "SuperAdmin", label: "Quản lý" },
  { value: "BacSi", label: "Bác sĩ" },
  { value: "LeTan", label: "Lễ tân" },
];

const DEFAULT_FORM = {
  maNV: "",
  hoTen: "",
  email: "",
  soDienThoai: "",
  password: "",
  role: "LeTan",
};

export default function UserRoles() {
  const [nhanViens, setNhanViens] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 10;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const loadNhanViens = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const response = await searchNhanVien(null, page, pageSize);
        const payload = response?.data ?? {};
        const searchData = payload?.data ?? {};
        const data = Array.isArray(searchData.data) ? searchData.data : [];
        setNhanViens(data.map(normalizeNhanVien));
        setCurrentPage(searchData.currentPage ?? page);
        setTotalRows(searchData.totalRows ?? 0);
      } catch {
        messageApi.error("Không tải được danh sách nhân viên.");
      } finally {
        setLoading(false);
      }
    },
    [messageApi],
  );

  useEffect(() => {
    loadNhanViens(1);
  }, [loadNhanViens]);

  const handleSelect = (record) => {
    setSelected(record);
    form.setFieldsValue({ ...record, password: "" });
  };

  const handleClear = () => {
    setSelected(null);
    form.resetFields();
    form.setFieldsValue(DEFAULT_FORM);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        HoTen: values.hoTen,
        Email: values.email,
        SoDienThoai: values.soDienThoai,
        Password: values.password,
        Role: values.role,
      };

      let response;
      if (selected) {
        payload.MaNV = selected.maNV;
        response = await updateNhanVien(payload);
      } else {
        response = await createNhanVien(payload);
      }

      const res = response?.data ?? {};
      const isSuccess = res?.isSuccess ?? res?.IsSuccess;
      const msg = res?.message ?? res?.Message;

      if (!isSuccess) {
        messageApi.error(msg || "Không thể lưu nhân viên.");
        return;
      }

      messageApi.success(msg || (selected ? "Đã cập nhật." : "Đã thêm mới."));
      await loadNhanViens(currentPage);
      handleClear();
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.Message;
      messageApi.error(msg || "Không thể lưu nhân viên.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record) => {
    setLoading(true);
    try {
      const response = await deleteNhanVien(record.maNV);
      const res = response?.data ?? {};
      const isSuccess = res?.isSuccess ?? res?.IsSuccess;
      const msg = res?.message ?? res?.Message;

      if (!isSuccess) {
        messageApi.error(msg || "Không thể xóa.");
        return;
      }

      messageApi.success("Đã xóa nhân viên.");
      if (selected?.maNV === record.maNV) handleClear();
      await loadNhanViens(currentPage);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.Message;
      messageApi.error(msg || "Không thể xóa.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "hoTen",
      key: "hoTen",
      render: (text, record) => (
        <div>
          <div className="user-roles-name">{text}</div>
          <Text type="secondary" className="user-roles-email">
            {record.email}
          </Text>
        </div>
      ),
    },
    {
      title: "SĐT",
      dataIndex: "soDienThoai",
      key: "soDienThoai",
      render: (v) => v || <Text type="secondary">—</Text>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={ROLE_COLORS[role] ?? "default"}>
          {ROLE_LABELS[role] ?? role}
        </Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleSelect(record)}
          />
          <Popconfirm
            title={`Xóa nhân viên ${record.hoTen}?`}
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
      <div className="admin-page user-roles-page">
        {contextHolder}
        <header className="admin-header">
          <div>
            <Text type="secondary" className="admin-subtitle">
              Phân quyền nhân viên theo tài khoản đăng nhập.
            </Text>
          </div>
        </header>

        <div className="user-roles-layout">
          <Card
            className="user-roles-form-card"
            title={selected ? "Cập nhật nhân viên" : "Thêm nhân viên"}
            variant="outlined"
          >
            <Form
              className="user-roles-form"
              form={form}
              layout="vertical"
              initialValues={DEFAULT_FORM}
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <div className="user-roles-form-grid">
                <Form.Item
                  label="Họ tên"
                  name="hoTen"
                  rules={[{ required: true, message: "Nhập họ tên" }]}
                >
                  <Input placeholder="Họ tên" />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="soDienThoai">
                  <Input placeholder="Số điện thoại" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Email không hợp lệ",
                    },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
                <Form.Item label="Vai trò" name="role">
                  <Select options={ROLE_OPTIONS} />
                </Form.Item>
                <Form.Item
                  className="user-roles-form-full"
                  label="Mật khẩu"
                  name="password"
                  rules={
                    selected ? [] : [{ required: true, message: "Nhập mật khẩu" }]
                  }
                >
                  <Input.Password
                    placeholder={selected ? "Để trống nếu không đổi" : "Mật khẩu"}
                  />
                </Form.Item>
              </div>
              <Form.Item className="user-roles-form-actions">
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    icon={<PlusOutlined />}
                  >
                    {selected ? "Cập nhật" : "Thêm mới"}
                  </Button>
                  {selected && <Button onClick={handleClear}>Hủy</Button>}
                </Space>
              </Form.Item>
            </Form>
          </Card>

          <Card
            className="user-roles-table-card"
            title="Danh sách nhân viên"
            variant="outlined"
          >
            <Table
              rowKey={(r) => r.maNV || r.email}
              columns={columns}
              dataSource={nhanViens}
              loading={loading}
              pagination={{
                current: currentPage,
                pageSize,
                total: totalRows,
                onChange: (page) => loadNhanViens(page),
                showTotal: (total) => `${total} nhân viên`,
              }}
              scroll={{ x: 600 }}
              size="small"
            />
          </Card>
        </div>
      </div>
  );
}
