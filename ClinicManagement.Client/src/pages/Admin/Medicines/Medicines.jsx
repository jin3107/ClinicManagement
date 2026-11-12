import "../admin.scss";
import "./medicines.scss";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  createDanhMucThuoc,
  deleteDanhMucThuoc,
  searchDanhMucThuoc,
  updateDanhMucThuoc,
} from "../../../apis";
import { createFilter } from "../../../helpers";
import { createDanhMucThuocRequest } from "../../../interfaces";
import { normalizeDanhMucThuoc } from "../../../models";

const { Text } = Typography;

const DEFAULT_FORM = { tenThuoc: "", donGia: 0, chongChiDinh: "" };
const PAGE_SIZE = 10;

const formatMoney = (value) => Number(value || 0).toLocaleString("vi-VN") + " ₫";

export default function Medicines() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [medicines, setMedicines] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [keyword, setKeyword] = useState("");

  const loadMedicines = useCallback(
    async (page = 1, searchKeyword = "") => {
      setLoading(true);
      try {
        const filters = searchKeyword.trim()
          ? [createFilter("Tên thuốc", searchKeyword.trim())]
          : null;
        const response = await searchDanhMucThuoc(filters, page, PAGE_SIZE);
        const payload = response?.data ?? {};
        const searchData = payload?.data ?? payload?.Data ?? {};
        const data = searchData?.data ?? searchData?.Data ?? [];

        setMedicines(Array.isArray(data) ? data.map(normalizeDanhMucThuoc) : []);
        setCurrentPage(searchData?.currentPage ?? searchData?.CurrentPage ?? page);
        setTotalRows(searchData?.totalRows ?? searchData?.TotalRows ?? 0);
      } catch (err) {
        const msg = err?.response?.data?.message ?? err?.response?.data?.Message;
        messageApi.error(msg || "Không tải được danh mục thuốc.");
      } finally {
        setLoading(false);
      }
    },
    [messageApi],
  );

  useEffect(() => {
    loadMedicines(1, "");
  }, [loadMedicines]);

  const handleOpenCreate = () => {
    setSelected(null);
    setIsModalOpen(true);
    form.setFieldsValue(DEFAULT_FORM);
  };

  const handleOpenEdit = (record) => {
    setSelected(record);
    setIsModalOpen(true);
    form.setFieldsValue(record);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelected(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = createDanhMucThuocRequest(
        selected?.maThuoc ?? "",
        values.tenThuoc,
        values.donGia,
        values.chongChiDinh,
      );

      const response = selected
        ? await updateDanhMucThuoc(payload)
        : await createDanhMucThuoc(payload);
      const res = response?.data ?? {};
      const isSuccess = res?.isSuccess ?? res?.IsSuccess;
      const msg = res?.message ?? res?.Message;

      if (!isSuccess) {
        messageApi.error(msg || "Không thể lưu thông tin thuốc.");
        return;
      }

      messageApi.success(msg || (selected ? "Đã cập nhật thuốc." : "Đã thêm thuốc."));
      handleCloseModal();
      await loadMedicines(selected ? currentPage : 1, keyword);
    } catch (err) {
      const data = err?.response?.data;
      const validationErrors = data?.errors ?? data?.Errors;
      const firstValidationMsg = validationErrors
        ? Object.values(validationErrors).flat().find(Boolean)
        : null;
      const msg = data?.message ?? data?.Message ?? data?.title ?? data?.Title;
      messageApi.error(firstValidationMsg || msg || "Không thể lưu thông tin thuốc.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record) => {
    setLoading(true);
    try {
      const response = await deleteDanhMucThuoc(record.maThuoc);
      const res = response?.data ?? {};
      const isSuccess = res?.isSuccess ?? res?.IsSuccess;
      const msg = res?.message ?? res?.Message;

      if (!isSuccess) {
        messageApi.error(msg || "Không thể xóa thuốc.");
        return;
      }

      messageApi.success(msg || "Đã xóa thuốc.");
      const nextPage =
        medicines.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      await loadMedicines(nextPage, keyword);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.Message;
      messageApi.error(msg || "Không thể xóa thuốc.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Tên thuốc",
      dataIndex: "tenThuoc",
      key: "tenThuoc",
    },
    {
      title: "Đơn giá",
      dataIndex: "donGia",
      key: "donGia",
      align: "right",
      render: (value) => formatMoney(value),
    },
    {
      title: "Chống chỉ định",
      dataIndex: "chongChiDinh",
      key: "chongChiDinh",
      render: (value) => value || <Text type="secondary">Không có</Text>,
    },
    {
      title: "",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
          <Popconfirm
            title={`Xóa thuốc "${record.tenThuoc}"?`}
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
    <div className="admin-medicines-page">
      {contextHolder}
      <header className="admin-header">
        <div>
          <Text type="secondary" className="admin-subtitle">
            Quản lý danh mục thuốc dùng để kê đơn.
          </Text>
        </div>
        <Space wrap>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
            Thêm thuốc
          </Button>
        </Space>
      </header>

      <Card
        className="admin-section"
        title="Danh mục thuốc"
        extra={
          <Input.Search
            placeholder="Tìm theo tên thuốc"
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onSearch={(value) => loadMedicines(1, value)}
            onClear={() => loadMedicines(1, "")}
            style={{ width: 250 }}
          />
        }
      >
        <Table
          rowKey={(record) => record.maThuoc}
          columns={columns}
          dataSource={medicines}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: PAGE_SIZE,
            total: totalRows,
            onChange: (page) => loadMedicines(page, keyword),
            showTotal: (total) => `${total} thuốc`,
          }}
          scroll={{ x: 720 }}
          size="small"
        />
      </Card>

      <Modal
        title={selected ? "Cập nhật thuốc" : "Thêm thuốc"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText={selected ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        destroyOnHidden
        forceRender
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={DEFAULT_FORM}
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Tên thuốc"
            name="tenThuoc"
            rules={[{ required: true, message: "Nhập tên thuốc" }]}
          >
            <Input placeholder="Tên thuốc" />
          </Form.Item>
          <Form.Item
            label="Đơn giá"
            name="donGia"
            rules={[{ required: true, message: "Nhập đơn giá" }]}
          >
            <InputNumber
              min={0.01}
              style={{ width: "100%" }}
              placeholder="Đơn giá (VNĐ)"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/,/g, "")}
            />
          </Form.Item>
          <Form.Item label="Chống chỉ định" name="chongChiDinh">
            <Input.TextArea placeholder="Chống chỉ định (nếu có)" autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
