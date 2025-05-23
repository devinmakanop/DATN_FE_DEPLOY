import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Rate, Spin, Button, Carousel, notification } from 'antd';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;

function AccommodationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
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

    fetchHotel();
  }, [id]);

  if (loading) {
    return <Spin style={{ display: 'block', margin: '80px auto' }} size="large" />;
  }

  if (!hotel) {
    return <Paragraph style={{ textAlign: 'center', marginTop: 50 }}>Không tìm thấy khách sạn.</Paragraph>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <Button type="primary" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        ← Quay lại
      </Button>

      <Title level={2}>{hotel.name}</Title>

      <Carousel autoplay style={{ marginBottom: 20 }}>
        {hotel.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Ảnh ${idx + 1}`}
            style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 8 }}
          />
        ))}
      </Carousel>

      <Paragraph><Text strong>Địa chỉ: </Text>{hotel.address}</Paragraph>
      <Paragraph><Text strong>Điện thoại: </Text>{hotel.phone}</Paragraph>
      <Paragraph><Text strong>Mô tả: </Text>{hotel.description}</Paragraph>
      <Paragraph><Text strong>Đánh giá: </Text><Rate disabled allowHalf defaultValue={hotel.rating} /></Paragraph>
    </div>
  );
}

export default AccommodationDetail;
