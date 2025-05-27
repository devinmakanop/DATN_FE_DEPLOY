import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Rate, Spin, notification, Carousel } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

function AccommodationList() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/accommodations');
        setAccommodations(res.data || []);
      } catch (error) {
        notification.error({
          message: 'Lỗi tải dữ liệu khách sạn',
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  const handleClick = (id) => {
    navigate(`/accommodations/${id}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
        Danh sách khách sạn và nhà nghỉ
      </Title>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : accommodations.length === 0 ? (
        <Paragraph style={{ textAlign: 'center' }}>Không có dữ liệu khách sạn.</Paragraph>
      ) : (
        <Row gutter={[24, 24]}>
          {accommodations.map((hotel) => (
            <Col key={hotel._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                onClick={() => handleClick(hotel._id)}
                title={hotel.name}
                cover={
                  <div style={{ width: '100%', overflow: 'hidden' }}>
                    <Carousel autoplay dots>
                      {hotel.images.map((img, idx) => (
                        <div key={idx} style={{ width: '100%', height: "200px" }}>
                          <img
                            alt={`${hotel.name} - ${idx + 1}`}
                            src={img}
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      ))}
                    </Carousel>
                  </div>
                }
              >
                <Paragraph ellipsis={{ rows: 3 }}>{hotel.description}</Paragraph>
                <Text strong>Địa chỉ: </Text>{hotel.address}<br />
                <Text strong>Điện thoại: </Text>{hotel.phone}<br />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default AccommodationList;
