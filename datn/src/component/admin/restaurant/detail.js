import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Image, Button, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AdminRestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL_ADMIN || 'http://localhost:5000';

  useEffect(() => {
    axios.get(`${API}/restaurants/${id}`)
      .then((res) => {
        setRestaurant(res.data);
        setLoading(false);
      })
      .catch((err) => {
        message.error('Không thể tải dữ liệu nhà hàng');
        console.error(err);
        setLoading(false);
      });
  }, [id, API]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!restaurant) return <p>Không tìm thấy nhà hàng</p>;

  const { name, category, address, description, imageUrl, coordinates } = restaurant;

  return (
    <Card
      title="Chi tiết nhà hàng"
      extra={
        <div>
          <Button
            type="primary"
            onClick={() => navigate(`/admin/restaurants/${id}/edit`)}
            style={{ marginRight: 8 }}
          >
            Chỉnh sửa
          </Button>
          <Button onClick={() => navigate('/admin/restaurants')}>Quay lại</Button>
        </div>
      }
      style={{ maxWidth: 800, margin: '0 auto' }}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tên nhà hàng">{name}</Descriptions.Item>
        <Descriptions.Item label="Loại">{category}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{address}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">{description}</Descriptions.Item>
        <Descriptions.Item label="Tọa độ">
          Lat: {coordinates.lat}, Lng: {coordinates.lng}
        </Descriptions.Item>
        <Descriptions.Item label="Hình ảnh">
          <Image width={300} src={imageUrl} alt="restaurant" />
        </Descriptions.Item>
        <Descriptions.Item label="Vị trí trên bản đồ">
          <div style={{ height: 300 }}>
            <MapContainer
              center={[coordinates.lat, coordinates.lng]}
              zoom={16}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[coordinates.lat, coordinates.lng]} />
            </MapContainer>
          </div>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default AdminRestaurantDetail;
