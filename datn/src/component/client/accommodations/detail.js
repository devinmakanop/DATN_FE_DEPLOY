import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Spin, Button, Carousel, Space, notification } from 'antd';
import axios from 'axios';
import './AccommodationDetail.css'; // Bạn tạo file CSS theo ví dụ dưới

const { Title, Paragraph, Text } = Typography;

function AccommodationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  const fetchHotel = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/accommodations/${id}`);
      setHotel(res.data);
    } catch (error) {
      notification.error({
        message: 'Không thể tải dữ liệu khách sạn',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLikeAction = async (action) => {
    setLikeLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/likes/accommodation/${id}?action=${action}`);
      await fetchHotel();
    } catch (error) {
      notification.error({
        message: 'Thao tác không thành công',
        description: error.message,
      });
    } finally {
      setLikeLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHotel();
  }, [id]);

  if (loading) {
    return <Spin className="loading-center" size="large" />;
  }

  if (!hotel) {
    return <Paragraph style={{ textAlign: 'center', marginTop: 50 }}>Không tìm thấy khách sạn.</Paragraph>;
  }

  return (
    <div className="accommodation-detail-container">
      <Button type="primary" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        ← Quay lại
      </Button>

      <div className="restaurant-header">
        {hotel.images && hotel.images.length > 0 && (
          <Carousel
            autoplay
            className="accommodation-carousel"
            dots={{ className: 'custom-carousel-dots' }}
          >
            {hotel.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Ảnh ${idx + 1}`}
                className="accommodation-image"
              />
            ))}
          </Carousel>
        )}

        <div className="restaurant-info">
          <Title level={2}>{hotel.name}</Title>

          <Paragraph><Text strong>📍 Địa chỉ:</Text> {hotel.address}</Paragraph>
          <Paragraph><Text strong>📞 Điện thoại:</Text> {hotel.phone}</Paragraph>
          <Paragraph><Text strong>📝 Mô tả:</Text> {hotel.description}</Paragraph>

          <Space style={{ marginTop: 12 }}>
            <Button
              onClick={() => handleLikeAction('like')}
              loading={likeLoading}
            >
              👍 Like ({hotel.likeCount ?? 0})
            </Button>
            <Button
              onClick={() => handleLikeAction('dislike')}
              loading={likeLoading}
              danger
            >
              👎 Dislike ({hotel.dislikeCount ?? 0})
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}

export default AccommodationDetail;
