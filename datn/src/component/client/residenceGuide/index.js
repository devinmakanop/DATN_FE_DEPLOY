import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin, notification } from 'antd';
import axiosToken from '../../context/axiosToken'; // hoặc axios thường nếu không dùng token
import './ClientResidencyGuides.css';

const { Title, Paragraph } = Typography;

function ClientResidencyGuides() {
  const API_BASE_URL = process.env.REACT_APP_API_URL_CLIENT;
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const response = await axiosToken.get(`${API_BASE_URL}/residenceGuide`);
      setGuides(response.data || []);
    } catch (error) {
      notification.error({
        message: 'Lỗi tải dữ liệu',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  return (
    <div className="client-residency-guides-container">
      <Title level={2} className="mb-4">Hướng dẫn & Tài liệu tạm trú</Title>

      {loading ? (
        <div className="text-center mt-5">
          <Spin size="large" />
        </div>
      ) : guides.length === 0 ? (
        <p className="text-center">Không có dữ liệu.</p>
      ) : (
        <Row gutter={[16, 16]}>
          {guides.map((guide) => (
            <Col key={guide._id} xs={24} sm={12} md={8}>
              <a href={guide.link} target="_blank" rel="noopener noreferrer">
                <Card hoverable className="guide-card">
                  <Title level={5}>{guide.title}</Title>
                  <Paragraph>{guide.description}</Paragraph>
                </Card>
              </a>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ClientResidencyGuides;
