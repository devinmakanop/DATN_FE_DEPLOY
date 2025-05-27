import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card, Spin, Divider, Button, Typography, Space, notification
} from 'antd';
import axios from 'axios';
import './LocationDetail.css';

const { Title, Paragraph } = Typography;

function LocationDetail() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  const fetchLocation = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/locations/${id}`);
      setLocation(res.data);
    } catch (error) {
      notification.error({
        message: 'Lỗi tải chi tiết địa điểm',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLikeAction = async (action) => {
    setLikeLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/likes/location/${id}?action=${action}`);
      await fetchLocation();
    } catch (err) {
      notification.error({
        message: 'Thao tác không thành công',
        description: err.message,
      });
    } finally {
      setLikeLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, [id]);

  if (loading) return <Spin className="loading-center" />;

  if (!location) return <p className="text-center">Không tìm thấy địa điểm.</p>;

  return (
    <div className="location-detail-container">
      <Card bordered={false}>
        <div className="location-header">
          {location.imageUrl && (
            <img
              src={location.imageUrl}
              alt={location.name}
              className="location-image"
              style={{ height: 280, objectFit: 'cover', width: '100%' }}
            />
          )}
          <div className="location-info">
            <Title level={2}>{location.name}</Title>
            <Paragraph><strong>📌 Loại:</strong> {location.type}</Paragraph>
            <Paragraph><strong>📍 Địa chỉ:</strong> {location.address}</Paragraph>
            <Paragraph><strong>ℹ️ Mô tả:</strong> {location.description || 'Không có mô tả'}</Paragraph>

            <Space style={{ marginTop: 12 }}>
              <Button onClick={() => handleLikeAction('like')} loading={likeLoading}>
                👍 Like ({location.likeCount ?? 0})
              </Button>
              <Button onClick={() => handleLikeAction('dislike')} loading={likeLoading} danger>
                👎 Dislike ({location.dislikeCount ?? 0})
              </Button>
            </Space>

            {location.coordinates?.lat && location.coordinates?.lng && (
              <div className="mt-2">
                <Button
                  type="link"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}`,
                      '_blank'
                    )
                  }
                >
                  🗺️ Xem trên bản đồ
                </Button>
              </div>
            )}
          </div>
        </div>

        <Divider />
        <Title level={4}>💬 Bình luận của khách</Title>
        <Paragraph>Chức năng bình luận sẽ được bổ sung sau.</Paragraph>
      </Card>
    </div>
  );
}

export default LocationDetail;
