import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin, notification } from 'antd';
import axiosToken from '../../context/axiosToken'; // hoặc axios nếu không dùng token
import { useNavigate } from 'react-router-dom';
import './ClientResidencyGuides.css';

const { Title, Paragraph } = Typography;

const fixedLabels = {
  vi: {
    title: '📚 Hướng dẫn & Tài liệu tạm trú',
    noData: 'Không có dữ liệu.',
    loadError: 'Lỗi tải dữ liệu',
  },
  en: {
    title: '📚 Residency Guides & Documents',
    noData: 'No data available.',
    loadError: 'Failed to load data',
  },
  ko: {
    title: '📚 체류 가이드 및 문서',
    noData: '데이터가 없습니다.',
    loadError: '데이터를 불러오는데 실패했습니다',
  },
  'zh-CN': {
    title: '📚 居住指南与资料',
    noData: '没有数据。',
    loadError: '加载数据失败',
  },
};

function ClientResidencyGuides() {
  const API_BASE_URL = process.env.REACT_APP_API_URL_CLIENT;
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lng, setLng] = useState('vi');

  const navigate = useNavigate();

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const lang = localStorage.getItem('lng') || 'vi';
      setLng(lang);
      const response = await axiosToken.get(`${API_BASE_URL}/residenceGuide?lng=${lang}`);
      setGuides(response.data || []);
    } catch (error) {
      notification.error({
        message: fixedLabels[lng]?.loadError || 'Lỗi tải dữ liệu',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const labels = fixedLabels[lng] || fixedLabels.vi;

  return (
    <div className="client-residency-guides-container">
      <Title level={2} className="mb-4">{labels.title}</Title>

      {loading ? (
        <div className="text-center mt-5">
          <Spin size="large" />
        </div>
      ) : guides.length === 0 ? (
        <Paragraph className="text-center">{labels.noData}</Paragraph>
      ) : (
        <Row gutter={[16, 16]}>
          {guides.map((guide) => (
            <Col key={guide._id} xs={24} sm={12} md={8}>
              <Card
                hoverable
                className="guide-card"
                onClick={() => navigate(`/residenceGuide/${guide._id}`)}
              >
                <Title level={5}>{guide.title}</Title>
                <Paragraph ellipsis={{ rows: 2 }}>
                  {guide.description || '-'}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ClientResidencyGuides;
