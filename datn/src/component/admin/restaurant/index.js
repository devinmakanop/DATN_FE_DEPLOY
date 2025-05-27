import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, message, Typography, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Paragraph } = Typography;

const RestaurantAdmin = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/restaurants');
      setRestaurants(res.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách nhà hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xác nhận xoá nhà hàng?',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/restaurants/${id}`);
          message.success('Đã xoá thành công');
          fetchRestaurants();
        } catch (error) {
          message.error('Xoá thất bại');
        }
      }
    });
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (url) => <Image width={80} src={url} />,
    },
    {
      title: 'Tên nhà hàng',
      dataIndex: 'name',
      key: 'name',
      render: text => <strong>{text}</strong>,
    },
    {
      title: 'Loại ẩm thực',
      dataIndex: 'cuisine',
      key: 'cuisine',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: text => <Paragraph ellipsis={{ rows: 2 }}>{text}</Paragraph>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/restaurants/${record._id}`)}>Xem</Button>
          <Button icon={<EditOutlined />} onClick={() => navigate(`/restaurants/edit/${record._id}`)}>Sửa</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record._id)}>Xoá</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý nhà hàng</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate('/admin/restaurant/create')}
      >
        Tạo mới nhà hàng
      </Button>
      <Table
        dataSource={restaurants}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default RestaurantAdmin;
