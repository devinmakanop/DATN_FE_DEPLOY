import React, { useEffect, useState } from 'react';
import { Card, Typography, Tag, Rate, Spin, Button, notification } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axiosToken from '../../context/axiosToken'; // hoặc axios thường nếu không có token
import './TravelAgencyDetail.css';

const { Title, Paragraph, Text, Link } = Typography;

function TravelAgencyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL_CLIENT;

  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchAgencyDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spin size="large" />
      </div>
    );
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

      <Card title={agency.name} bordered>
        <Rate allowHalf disabled defaultValue={agency.rating} />
        <Paragraph style={{ marginTop: 16 }}>{agency.description}</Paragraph>

        <Paragraph>
          <Text strong>Địa chỉ:</Text> {agency.address}
        </Paragraph>
        <Paragraph>
          <Text strong>Điện thoại:</Text> {agency.phone}
        </Paragraph>
        <Paragraph>
          <Text strong>Email:</Text>{' '}
          <a href={`mailto:${agency.email}`}>{agency.email}</a>
        </Paragraph>
        <Paragraph>
          <Text strong>Website:</Text>{' '}
          <Link href={agency.website} target="_blank" rel="noopener noreferrer">
            {agency.website}
          </Link>
        </Paragraph>

        <Paragraph>
          <Text strong>Dịch vụ:</Text>{' '}
          {agency.services.map((service, idx) => (
            <Tag key={idx} color="blue">
              {service}
            </Tag>
          ))}
        </Paragraph>
      </Card>
    </div>
  );
}

export default TravelAgencyDetail;
