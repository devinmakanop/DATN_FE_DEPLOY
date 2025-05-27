import React, { useEffect, useState } from 'react';
import { Card, Spin, Button, message, Row, Col, Typography, Divider, Image } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { Title, Text, Paragraph } = Typography;

// Fix icon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AdminLocationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL_ADMIN || 'http://localhost:5000';

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(`${API}/locations/${id}`);
        setLocation(res.data);
      } catch (err) {
        console.error(err);
        message.error('Không thể tải dữ liệu địa điểm');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id, API]);

  if (loading) {
    return <Spin tip="Đang tải..." style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }} />;
  }

  if (!location) {
    return <p style={{ textAlign: 'center', marginTop: 80 }}>Không tìm thấy địa điểm</p>;
  }

  const { name, type, address, description, imageUrl, coordinates } = location;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <Card
        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        bodyStyle={{ padding: 24 }}
      >
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <Title level={3}>{name}</Title>
            <Divider />
            <Text strong>Loại:</Text>
            <Paragraph>{type}</Paragraph>

            <Text strong>Địa chỉ:</Text>
            <Paragraph>{address || 'Không có'}</Paragraph>

            <Text strong>Mô tả:</Text>
            <Paragraph>{description || 'Không có'}</Paragraph>

            <Text strong>Tọa độ:</Text>
            <Paragraph>
              {coordinates?.lat}, {coordinates?.lng}
            </Paragraph>
          </Col>

          <Col xs={24} md={12}>
            <Image
              src={imageUrl}
              alt={name}
              width="100%"
              height={250}
              style={{ objectFit: 'cover', borderRadius: 8 }}
              fallback="https://via.placeholder.com/500x300?text=No+Image"
            />
            <div style={{ marginTop: 16, height: 250, borderRadius: 8, overflow: 'hidden' }}>
              <MapContainer
                center={[coordinates?.lat, coordinates?.lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[coordinates?.lat, coordinates?.lng]} />
              </MapContainer>
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Button type="primary" onClick={() => navigate('/admin/locations')}>
            Quay lại danh sách
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminLocationDetail;
