import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Spin, notification, Carousel } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

// Nhãn cố định theo ngôn ngữ
const fixedLabels = {
  vi: {
    title: 'Danh sách khách sạn và nhà nghỉ',
    address: 'Địa chỉ',
    phone: 'Điện thoại',
    noData: 'Không có dữ liệu khách sạn.',
    loadError: 'Lỗi tải dữ liệu khách sạn',
  },
  en: {
    title: 'List of Hotels and Accommodations',
    address: 'Address',
    phone: 'Phone',
    noData: 'No accommodation data available.',
    loadError: 'Failed to load accommodation data',
  },
  ko: {
    title: '호텔 및 숙박 목록',
    address: '주소',
    phone: '전화',
    noData: '숙박 데이터가 없습니다.',
    loadError: '숙박 데이터 로드 실패',
  },
  'zh-CN': {
    title: '酒店及住宿列表',
    address: '地址',
    phone: '电话',
    noData: '没有住宿数据。',
    loadError: '加载住宿数据失败',
  },
};

function AccommodationList() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lng, setLng] = useState(localStorage.getItem('lng') || 'vi'); // lấy luôn từ localStorage lần đầu
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/accommodations?lng=${lng}`);
        setAccommodations(res.data || []);
      } catch (error) {
        notification.error({
          message: fixedLabels[lng]?.loadError || fixedLabels.vi.loadError,
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, [lng]); // thêm lng vào dependency để khi lng thay đổi thì fetch lại

  // Giả sử bạn có 1 cách để thay đổi ngôn ngữ, ví dụ nút bấm hay dropdown
  // Ví dụ thêm một dropdown đổi ngôn ngữ:
  const handleChangeLanguage = (newLng) => {
    setLng(newLng);
    localStorage.setItem('lng', newLng);
  };

  const handleClick = (id) => {
    navigate(`/accommodations/${id}`);
  };

  const labels = fixedLabels[lng] || fixedLabels.vi;

  return (
    <div style={{ padding: 20 }}>
      {/* Ví dụ thêm dropdown chọn ngôn ngữ */}
      <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
        {labels.title}
      </Title>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : accommodations.length === 0 ? (
        <Paragraph style={{ textAlign: 'center' }}>{labels.noData}</Paragraph>
      ) : (
        <Row gutter={[24, 24]}>
          {accommodations.map((hotel) => (
            <Col key={hotel._id} xs={24} sm={12} md={8} lg={8}>
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
                <Text strong>{labels.address}: </Text>{hotel.address}<br />
                <Text strong>{labels.phone}: </Text>{hotel.phone}<br />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default AccommodationList;
