import React, { useEffect, useState } from 'react';
import { Button, Row, Table, Modal, Col, notification, Typography, Image } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Paragraph } = Typography;
const { confirm } = Modal;

function AdminRestaurants() {
  const API_BASE_URL = 'http://localhost:5000/api';
  const [restaurantList, setRestaurantList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const navigate = useNavigate();

  const fetchRestaurantList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/restaurants`);
      if (Array.isArray(response.data)) {
        setRestaurantList(response.data);
      } else {
        setFetchError("Dữ liệu không đúng định dạng.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setFetchError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantList();
  }, []);

  useEffect(() => {
    if (fetchError) {
      notification.error({
        message: 'Lỗi khi tải dữ liệu',
        description: fetchError,
        placement: 'topRight',
      });
    }
  }, [fetchError]);

  const handleViewDetail = (restaurant) => {
    navigate(`/admin/restaurant/detail/${restaurant._id}`);
  };

  const handleEditRestaurant = (restaurant) => {
    navigate(`/admin/restaurant/edit/${restaurant._id}`);
  };

  const handleAddRestaurant = () => {
    navigate(`/admin/restaurant/create`);
  };

  const handleDeleteRestaurant = async (restaurant) => {
    try {
      await axios.delete(`${API_BASE_URL}/restaurants/${restaurant._id}`);
      setRestaurantList((prevList) => prevList.filter((item) => item._id !== restaurant._id));

      notification.success({
        message: 'Xóa thành công',
        description: 'Nhà hàng đã được xóa khỏi danh sách.',
        placement: 'topRight',
      });
    } catch (error) {
      console.error("Delete error:", error);
      notification.error({
        message: 'Xóa thất bại',
        description: 'Không thể xóa nhà hàng.',
        placement: 'topRight',
      });
      setFetchError(error.message);
    }
  };

  const showDeleteConfirmation = (restaurant) => {
    if (!restaurant || !restaurant._id) {
      console.warn("Không có thông tin nhà hàng để xóa");
      return;
    }

    confirm({
      title: 'Bạn có chắc chắn muốn xóa nhà hàng này?',
      content: `Tên nhà hàng: ${restaurant.name}`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      centered: true,
      okButtonProps: {
        style: {
          background: 'linear-gradient(135deg, #6253e1, #04befe)',
          color: '#fff',
        },
      },
      onOk() {
        handleDeleteRestaurant(restaurant);
      },
      onCancel() {
        console.log('Đã hủy xóa nhà hàng');
      },
    });
  };

  const tableColumns = [
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
      render: (text) => <b>{text}</b>,
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
      render: (text) => <Paragraph ellipsis={{ rows: 2 }}>{text}</Paragraph>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, restaurant) => (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button
            type="primary"
            onClick={() => handleViewDetail(restaurant)}
            style={{ background: 'linear-gradient(135deg, #6253e1, #04befe)' }}
          >
            <b>Chi tiết</b>
          </Button>
          <Button type="primary" className="btn-warn" onClick={() => handleEditRestaurant(restaurant)}>
            <b>Sửa</b>
          </Button>
          <Button danger onClick={() => showDeleteConfirmation(restaurant)}>
            <b>Xóa</b>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="product">
      <h1>Danh sách nhà hàng</h1>
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Button type="primary" onClick={handleAddRestaurant}>
            Thêm nhà hàng
          </Button>
        </Col>
      </Row>

      {restaurantList.length === 0 ? (
        <div>Không có nhà hàng để hiển thị.</div>
      ) : (
        <Table
          columns={tableColumns}
          dataSource={restaurantList.map((item) => ({ ...item, key: item._id }))}
          loading={isLoading}
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
}

export default AdminRestaurants;
