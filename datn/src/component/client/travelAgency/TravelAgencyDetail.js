import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Typography, Tag, Spin, Button, notification, Space
} from 'antd';
import axiosToken from '../../context/axiosToken'; 
import './TravelAgencyDetail.css';

const { Title, Paragraph, Text, Link } = Typography;

function TravelAgencyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL_CLIENT;

  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  const fetchAgencyDetail = async () => {
    setLoading(true);
    try {
      const res = await axiosToken.get(`${API_BASE_URL}/travelAgency/${id}`);
      setAgency(res.data);
    } catch (error) {
      notification.error({
        message: 'Lỗi tải dữ liệu công ty du lịch',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLikeAction = async (action) => {
    setLikeLoading(true);
    try {
      await axiosToken.post(`${API_BASE_URL}/likes/travelAgency/${id}?action=${action}`);
      await fetchAgencyDetail(); // Cập nhật lại dữ liệu sau khi like/dislike
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
    fetchAgencyDetail();
  }, [id]);

  if (loading) {
    return <Spin className="loading-center" size="large" />;
  }

  if (!agency) {
    return (
      <div className="text-center mt-5">
        <Title level={3}>Không tìm thấy công ty du lịch</Title>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="travel-agency-detail-container">
      <Button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        Quay lại
      </Button>

      <Card bordered={false}>
        <div className="restaurant-header">
          {agency.imageUrl && (
            <img
              src={agency.imageUrl}
              alt={agency.name}
              className="restaurant-image"
            />
          )}
          <div className="restaurant-info">
            <Title level={2}>{agency.name}</Title>

            <Paragraph><strong>🏢 Địa chỉ:</strong> {agency.address}</Paragraph>
            <Paragraph><strong>📞 Điện thoại:</strong> {agency.phone}</Paragraph>
            <Paragraph>
              <strong>✉️ Email:</strong>{' '}
              <a href={`mailto:${agency.email}`}>{agency.email}</a>
            </Paragraph>
            <Paragraph>
              <strong>🔗 Website:</strong>{' '}
              <Link href={agency.website} target="_blank" rel="noopener noreferrer">
                {agency.website}
              </Link>
            </Paragraph>

            <Paragraph>
              <strong>🛎️ Dịch vụ:</strong>{' '}
              {agency.services?.map((service, idx) => (
                <Tag key={idx} color="blue">{service}</Tag>
              ))}
            </Paragraph>

            <Space style={{ marginTop: 12 }}>
              <Button
                onClick={() => handleLikeAction('like')}
                loading={likeLoading}
              >
                👍 Like ({agency.likeCount ?? 0})
              </Button>
              <Button
                onClick={() => handleLikeAction('dislike')}
                loading={likeLoading}
                danger
              >
                👎 Dislike ({agency.dislikeCount ?? 0})
              </Button>
            </Space>

            {agency.coordinates?.lat && agency.coordinates?.lng && (
              <div className="mt-2">
                <Button
                  type="link"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${agency.coordinates.lat},${agency.coordinates.lng}`,
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
      </Card>
    </div>
  );
}

export default TravelAgencyDetail;
