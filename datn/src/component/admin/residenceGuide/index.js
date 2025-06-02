import React, { useEffect, useState } from 'react';
import { Table, Typography, Spin, message, Button, Popconfirm, Space } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';

const { Link, Paragraph } = Typography;

const ResidenceGuideAdmin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchGuides = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/residenceGuide');
      setData(response.data);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu hướng dẫn tạm trú');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteGuide = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/residenceGuide/${id}`);
      message.success('Xóa thành công');
      fetchGuides(); // làm mới lại danh sách
    } catch (error) {
      message.error('Không thể xóa hướng dẫn');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: text => <strong>{text}</strong>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: text => <Paragraph ellipsis={{ rows: 2 }}>{text}</Paragraph>,
    },
    {
      title: 'Liên kết',
      dataIndex: 'link',
      key: 'link',
      render: link => (
        <Link href={link} target="_blank" rel="noopener noreferrer">
          Mở
        </Link>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            style={{
              background: 'linear-gradient(135deg, #6253e1, #04befe)',
              border: 'none',
              color: '#fff',
              fontWeight: '600',
            }}
            onClick={() => navigate(`/admin/residenceGuide/detail/${record._id}`)}
          >
            Xem chi tiết
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => deleteGuide(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              style={{
                fontWeight: '600',
                border: 'none',
              }}
              type="primary"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Hướng dẫn tạm trú cho người nước ngoài</h2><br></br>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/residenceGuide/create')}
          style={{
            background: 'linear-gradient(135deg, #6253e1, #04befe)',
            border: 'none',
            fontWeight: '600',
            alignItems: 'center',
            gap: 6,
          }}
        >
          Thêm hướng dẫn
        </Button>
      </div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={data}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 6 }}
          bordered
        />
      )}
    </div>
  );
};

export default ResidenceGuideAdmin;
