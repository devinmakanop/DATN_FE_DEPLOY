import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Spin, Tag, Button, notification, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosToken from '../../context/axiosToken'; // Thay bằng axios thường nếu bạn không dùng token
import './index.css';

const { Title, Paragraph, Text } = Typography;

const fixedLabels = {
  vi: {
    title: '🏢 Danh sách công ty du lịch',
    noData: 'Không có dữ liệu công ty du lịch.',
    loadError: 'Lỗi tải danh sách công ty du lịch',
    address: '📍 Địa chỉ',
    phone: '📞 Điện thoại',
    email: '✉️ Email',
    website: '🌐 Website',
    rating: '⭐ Đánh giá',
    viewMap: '🗺️ Xem bản đồ',
    noCoordinates: 'Công ty này chưa có tọa độ để xem bản đồ.',
  },
  en: {
    title: '🏢 Travel Agency List',
    noData: 'No travel agencies available.',
    loadError: 'Failed to load travel agency list',
    address: '📍 Address',
    phone: '📞 Phone',
    email: '✉️ Email',
    website: '🌐 Website',
    rating: '⭐ Rating',
    viewMap: '🗺️ View on map',
    noCoordinates: 'This agency does not have coordinates to show on the map.',
  },
  ko: {
    title: '🏢 여행사 목록',
    noData: '여행사 데이터가 없습니다.',
    loadError: '여행사 목록을 불러오는 데 실패했습니다',
    address: '📍 주소',
    phone: '📞 전화번호',
    email: '✉️ 이메일',
    website: '🌐 웹사이트',
    rating: '⭐ 평가',
    viewMap: '🗺️ 지도에서 보기',
    noCoordinates: '이 여행사는 지도에 표시할 좌표가 없습니다.',
  },
  'zh-CN': {
    title: '🏢 旅行社列表',
    noData: '没有旅行社数据。',
    loadError: '加载旅行社列表失败',
    address: '📍 地址',
    phone: '📞 电话',
    email: '✉️ 邮箱',
    website: '🌐 网站',
    rating: '⭐ 评分',
    viewMap: '🗺️ 在地图上查看',
    noCoordinates: '该旅行社没有可用于地图显示的坐标。',
  },
};

function ClientTravelAgency() {
  const API_BASE_URL = process.env.REACT_APP_API_URL_CLIENT;
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lng, setLng] = useState('vi');
  const navigate = useNavigate();

  useEffect(() => {
    const lang = localStorage.getItem('lng');
    setLng(lang);
  }, []);

  const fetchAgencies = async () => {
    setLoading(true);
    try {
      const res = await axiosToken.get(`${API_BASE_URL}/travelAgency?lng=${lng}`);
      setAgencies(res.data || []);
    } catch (error) {
      notification.error({
        message: fixedLabels[lng]?.loadError || 'Lỗi tải danh sách công ty du lịch',
        description: error.message || 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lng) fetchAgencies();
  }, [lng]);

  const goToDetail = (id) => {
    navigate(`/travelAgency/${id}`);
  };

  const openMap = (coordinates) => {
    if (!coordinates?.lat || !coordinates?.lng) {
      notification.warning({
        message: fixedLabels[lng]?.noCoordinates || 'Không có tọa độ',
        description:
          'Công ty du lịch này chưa có thông tin tọa độ để hiển thị bản đồ.',
      });
      return;
    }
    const url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  const labels = fixedLabels[lng] || fixedLabels.vi;

  return (
    <div className="client-travel-agency-list">
      <Title level={2} className="mb-4 text-color"  style={{ textAlign: 'center', marginBottom: 30 }}>{labels.title}</Title>

      {loading ? (
        <div className="text-center mt-5">
          <Spin size="large" />
        </div>
      ) : agencies.length === 0 ? (
        <Empty description={labels.noData} />
      ) : (
        <Row gutter={[35, 20]}>
          {agencies.map((agency) => (
            <Col key={agency._id} xs={24} sm={12} md={8} lg={8}>
              <Card
                hoverable
                className="travel-agency-card"
                onClick={() => goToDetail(agency._id)}
                style={{ cursor: 'pointer' }}
                cover={
                  agency.imageUrl ? (
                    <img
                      alt={agency.name}
                      src={agency.imageUrl}
                      style={{ objectFit: 'cover', height: 180, width: '100%' }}
                    />
                  ) : null
                }
              >
                <Title level={5} style={{ marginBottom: 12 }}>
                  <a
                    onClick={(e) => {
                      e.stopPropagation();
                      goToDetail(agency._id);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {agency.name}
                  </a>
                </Title>
                <Paragraph>{agency.description}</Paragraph>
                <Paragraph>
                  <Text strong>{labels.address}:</Text> {agency.address}
                  <br />
                  <Text strong>{labels.phone}:</Text> {agency.phone}
                  <br />
                  <Text strong>{labels.email}:</Text>{' '}
                  <a
                    href={`mailto:${agency.email}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {agency.email}
                  </a>
                  <br />
                  <Text strong>{labels.website}:</Text>{' '}
                  <a
                    href={agency.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {agency.website}
                  </a>
                </Paragraph>
                {typeof agency.rating !== 'undefined' && (
                  <Paragraph>
                    <Text strong>{labels.rating}: </Text>
                    <span style={{ color: '#faad14', fontWeight: 'bold' }}>
                      {agency.rating} / 5
                    </span>
                  </Paragraph>
                )}
                <Paragraph>
                  {agency.services?.map((service, idx) => (
                    <Tag key={idx} color="blue" style={{ marginBottom: 8 }}>
                      {service}
                    </Tag>
                  ))}
                </Paragraph>

                {/* Nút Xem bản đồ nằm dưới cùng, căn giữa */}
                {agency.coordinates?.lat && agency.coordinates?.lng && (
                  <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <Button
                      type="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        openMap(agency.coordinates);
                      }}
                    >
                      {labels.viewMap}
                    </Button>
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ClientTravelAgency;
