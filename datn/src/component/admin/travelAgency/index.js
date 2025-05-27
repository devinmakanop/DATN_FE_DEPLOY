import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  const columns = [
    {
      title: 'Tên công ty',
      dataIndex: 'name',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/travel-agencies/${record._id}`)}>Xem</Button>
          <Button type="link" onClick={() => navigate(`/travel-agencies/edit/${record._id}`)}>Sửa</Button>
          <Button danger type="link" onClick={() => handleDelete(record._id)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Danh sách công ty du lịch</h2>
      <Button type="primary" onClick={() => navigate('/admin/travelAgency/create')} style={{ marginBottom: 16 }}>
        Thêm công ty
      </Button>
      <Table rowKey="_id" dataSource={agencies} columns={columns} loading={loading} />
    </div>
  );
};

export default TravelAgencyAdmin;
