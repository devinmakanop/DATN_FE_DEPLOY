import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Rate, Typography, Space, notification, Popconfirm } from 'antd';

const { Paragraph } = Typography;

function AdminAccommodation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/accommodations');
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          notification.error({
            message: 'Lỗi dữ liệu',
            description: 'Dữ liệu từ server không đúng định dạng.',
          });
        }
      } catch (error) {
        notification.error({
          message: 'Lỗi tải dữ liệu',
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  const handleView = (record) => {
    notification.info({ message: `Xem chi tiết: ${record.name}` });
    // navigate(`/admin/accommodations/detail/${record._id}`);
  };

  const handleEdit = (record) => {
    notification.info({ message: `Sửa: ${record.name}` });
    // navigate(`/admin/accommodations/edit/${record._id}`);
  };

  const handleDelete = (record) => {
    notification.success({ message: `Đã xóa: ${record.name}` });
    setData(prev => prev.filter(item => item._id !== record._id));
  };

  const columns = [
    {
      title: 'Tên khách sạn / nhà nghỉ',
      dataIndex: 'name',
      key: 'name',
      render: text => <b>{text}</b>
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: text => <Paragraph ellipsis={{ rows: 2, expandable: false }}>{text}</Paragraph>
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleView(record)}>Chi tiết</Button>
          <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title={`Bạn chắc chắn muốn xóa "${record.name}"?`}
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản lý Khách sạn & Nhà nghỉ</h1>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}

export default AdminAccommodation;
