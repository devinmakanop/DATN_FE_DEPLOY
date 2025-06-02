import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, message, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Paragraph } = Typography;

const TravelAgencyAdmin = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAgencies = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/travelAgency');
      setAgencies(res.data);
    } catch (err) {
      message.error('Lỗi khi tải dữ liệu công ty du lịch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Bạn có chắc muốn xóa công ty này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/travelAgency/${id}`);
          message.success('Đã xóa thành công');
          fetchAgencies();
        } catch (err) {
          message.error('Xóa thất bại');
        }
      },
    });
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #6253e1, #04befe)',
    border: 'none',
    color: '#fff',
    fontWeight: 600,
    padding: '4px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  };

  const dangerButtonStyle = {
    fontWeight: 600,
    border: 'none',
  };

  const columns = [
    {
      title: 'Tên công ty',
      dataIndex: 'name',
      key: 'name',
      render: text => <strong>{text}</strong>
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: text => <Paragraph ellipsis={{ rows: 2 }}>{text}</Paragraph>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            style={buttonStyle}
            onClick={() => navigate(`/admin/travelAgency/detail/${record._id}`)}
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            type="primary" className="btn-warn" 
            onClick={() => navigate(`/admin/travelAgency/edit/${record._id}`)}
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            style={dangerButtonStyle}
            onClick={() => handleDelete(record._id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý công ty du lịch</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{
          ...buttonStyle,
          marginBottom: 16,
          fontWeight: 600,
          gap: 8,
        }}
        onClick={() => navigate('/admin/travelAgency/create')}
      >
        Thêm công ty
      </Button>
      <Table
        rowKey="_id"
        dataSource={agencies}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default TravelAgencyAdmin;
