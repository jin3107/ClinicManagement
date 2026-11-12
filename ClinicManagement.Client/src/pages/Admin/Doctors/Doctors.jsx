import "../admin.scss";
import "./doctors.scss";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  createBacSi,
  deleteBacSi,
  searchBacSi,
  updateBacSi,
} from "../../../apis";
import { createFilter } from "../../../helpers";
import { createBacSiRequest } from "../../../interfaces";
import { normalizeBacSi } from "../../../models";

const { Text } = Typography;

const DEFAULT_FILTERS = { searchBy: "hoTen", keyword: "" };
const DEFAULT_FORM = {
  hoTen: "",
  chuyenKhoa: "",
  soDienThoai: "",
  email: "",
  password: "",
};
const PAGE_SIZE = 10;

const SEARCH_BY_OPTIONS = [
  { value: "hoTen", label: "Họ tên" },
  { value: "chuyenKhoa", label: "Chuyên khoa" },
];

const buildFilters = ({ searchBy, keyword } = {}) => {
  if (!keyword?.trim()) return null;
  const fieldName = searchBy === "chuyenKhoa" ? "Chuyên khoa" : "Họ tên";
  return [createFilter(fieldName, keyword.trim())];
};

export default function Doctors() {
  const [doctorForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const loadDoctors = useCallback(
    async (page = 1, nextFilters = DEFAULT_FILTERS) => {
      setLoading(true);
      try {
        const response = await searchBacSi(
          buildFilters(nextFilters),
          page,
          PAGE_SIZE,
        );
        const payload = response?.data ?? {};
        const searchData = payload?.data ?? payload?.Data ?? {};
        const data = searchData?.data ?? searchData?.Data ?? [];

        setDoctors(Array.isArray(data) ? data.map(normalizeBacSi) : []);
        setCurrentPage(
          searchData?.currentPage ?? searchData?.CurrentPage ?? page,
        );
        setTotalRows(searchData?.totalRows ?? searchData?.TotalRows ?? 0);
      } catch (err) {
        const msg =
          err?.response?.data?.message ?? err?.response?.data?.Message;
        messageApi.error(msg || "Không tải được danh sách bác sĩ.");
      } finally {
        setLoading(false);
      }
    },
    [messageApi],
  );

  useEffect(() => {
    loadDoctors(1, DEFAULT_FILTERS);
  }, [loadDoctors]);

  const handleFilterChange = (changed) => {
    const nextFilters = { ...filters, ...changed };
    setFilters(nextFilters);
    loadDoctors(1, nextFilters);
  };

  const handleOpenCreate = () => {
    setSelectedDoctor(null);
    setIsModalOpen(true);
    doctorForm.setFieldsValue(DEFAULT_FORM);
  };

  const handleOpenEdit = (record) => {
    setSelectedDoctor(record);
    setIsModalOpen(true);
    doctorForm.setFieldsValue({ ...record, password: "" });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
    doctorForm.resetFields();
  };

  const handleSubmitDoctor = async (values) => {
    setSubmitting(true);
    try {
      const payload = createBacSiRequest(
        selectedDoctor?.maBS ?? "",
        values.hoTen,
        values.chuyenKhoa,
        values.soDienThoai,
        values.email,
        values.password,
      );

      const response = selectedDoctor
        ? await updateBacSi(payload)
        : await createBacSi(payload);
      const res = response?.data ?? {};
      const isSuccess = res?.isSuccess ?? res?.IsSuccess;
      const msg = res?.message ?? res?.Message;

      if (!isSuccess) {
        messageApi.error(msg || "Không thể lưu thông tin bác sĩ.");
        return;
      }

      messageApi.success(
        msg || (selectedDoctor ? "Đã cập nhật bác sĩ." : "Đã thêm bác sĩ."),
      );
      handleCloseModal();
      await loadDoctors(selectedDoctor ? currentPage : 1, filters);
    } catch (err) {
      const data = err?.response?.data;
      const validationErrors = data?.errors ?? data?.Errors;
      const firstValidationMsg = validationErrors
        ? Object.values(validationErrors).flat().find(Boolean)
        : null;
      const msg = data?.message ?? data?.Message ?? data?.title ?? data?.Title;
      messageApi.error(
        firstValidationMsg || msg || "Không thể lưu thông tin bác sĩ.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record) => {
    setLoading(true);
    try {
      const response = await deleteBacSi(record.maBS);
      const res = response?.data ?? {};
      const isSuccess = res?.isSuccess ?? res?.IsSuccess;
      const msg = res?.message ?? res?.Message;

      if (!isSuccess) {
        messageApi.error(msg || "Không thể xóa bác sĩ.");
        return;
      }

      messageApi.success(msg || "Đã xóa bác sĩ.");
      const nextPage =
        doctors.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      await loadDoctors(nextPage, filters);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.Message;
      messageApi.error(msg || "Không thể xóa bác sĩ.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Bác sĩ",
      dataIndex: "hoTen",
      key: "hoTen",
      render: (text, record) => (
        <div>
          <div>{text || "Chưa cập nhật"}</div>
          <Text type="secondary">{record.email || record.maBS}</Text>
        </div>
      ),
    },
    {
      title: "Chuyên khoa",
      dataIndex: "chuyenKhoa",
      key: "chuyenKhoa",
      render: (value) => value || <Text type="secondary">Chưa cập nhật</Text>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "soDienThoai",
      key: "soDienThoai",
      render: (value) => value || <Text type="secondary">Chưa cập nhật</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (value) =>
        value || <Text type="secondary">Chưa có tài khoản</Text>,
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
            onClick={() => handleOpenEdit(record)}
          />
          <Popconfirm
            title={`Xóa bác sĩ ${record.hoTen}?`}
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
    <div className="admin-doctors-page">
        {contextHolder}
        <header className="admin-header">
          <div>
            <Text type="secondary" className="admin-subtitle">
              Theo dõi thông tin bác sĩ và chuyên khoa.
            </Text>
          </div>
          <Space wrap>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
            >
              Thêm bác sĩ
            </Button>
          </Space>
        </header>

        <Card
          className="admin-section"
          title="Danh sách bác sĩ"
          extra={
            <Space.Compact>
              <Select
                value={filters.searchBy}
                options={SEARCH_BY_OPTIONS}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    keyword: "",
                    searchBy: value,
                  }))
                }
                style={{ width: 130 }}
              />
              <Input.Search
                placeholder={
                  filters.searchBy === "chuyenKhoa"
                    ? "Tìm theo chuyên khoa"
                    : "Tìm theo tên bác sĩ"
                }
                allowClear
                value={filters.keyword}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, keyword: e.target.value }))
                }
                onSearch={(value) => handleFilterChange({ keyword: value })}
                onClear={() => handleFilterChange({ keyword: "" })}
                style={{ width: 250 }}
              />
            </Space.Compact>
          }
        >
          <Table
            rowKey={(record) => record.maBS}
            columns={columns}
            dataSource={doctors}
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: PAGE_SIZE,
              total: totalRows,
              onChange: (page) => loadDoctors(page, filters),
              showTotal: (total) => `${total} bác sĩ`,
            }}
            scroll={{ x: 720 }}
            size="small"
          />
        </Card>

        <Modal
          title={selectedDoctor ? "Cập nhật bác sĩ" : "Thêm bác sĩ"}
          open={isModalOpen}
          onCancel={handleCloseModal}
          onOk={() => doctorForm.submit()}
          confirmLoading={submitting}
          okText={selectedDoctor ? "Cập nhật" : "Thêm mới"}
          cancelText="Hủy"
          destroyOnHidden
          forceRender
        >
          <Form
            form={doctorForm}
            layout="vertical"
            initialValues={DEFAULT_FORM}
            onFinish={handleSubmitDoctor}
            autoComplete="off"
          >
            <Form.Item
              label="Họ tên"
              name="hoTen"
              rules={[{ required: true, message: "Nhập họ tên bác sĩ" }]}
            >
              <Input placeholder="Họ tên bác sĩ" />
            </Form.Item>
            <Form.Item
              label="Chuyên khoa"
              name="chuyenKhoa"
              rules={[{ required: true, message: "Nhập chuyên khoa" }]}
            >
              <Input placeholder="Chuyên khoa" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="soDienThoai"
              rules={[{ required: true, message: "Nhập số điện thoại" }]}
            >
              <Input placeholder="Số điện thoại" maxLength={10} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Email đăng nhập" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={
                selectedDoctor
                  ? []
                  : [{ required: true, message: "Nhập mật khẩu" }]
              }
            >
              <Input.Password
                placeholder={
                  selectedDoctor
                    ? "Để trống nếu không đổi"
                    : "Mật khẩu đăng nhập"
                }
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
}
