import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Spin, message, Button, Space, Divider, Image } from 'antd';

const { Title, Paragraph, Link, Text } = Typography;

const ResidenceGuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/residenceGuide/${id}`);
        if (!response.ok) throw new Error('Không thể lấy dữ liệu');
        const data = await response.json();
        setGuide(data);
      } catch (error) {
        message.error('Lỗi khi tải chi tiết hướng dẫn');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
        <Spin size="large" tip="Đang tải chi tiết..." />
      </div>
    );
  }

  if (!guide) {
    return <Paragraph style={{ textAlign: 'center', marginTop: 80 }}>Không tìm thấy hướng dẫn.</Paragraph>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <Card
        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        bodyStyle={{ padding: 24 }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Title level={3}>{guide.title}</Title>

          <Paragraph>
            <Text strong>Mô tả:</Text><br />
            {guide.description || 'Không có mô tả'}
          </Paragraph>

          <Paragraph>
            <Text strong>Liên kết:</Text>{' '}
            {guide.link ? (
              <Link href={guide.link} target="_blank" rel="noopener noreferrer">
                {guide.link}
              </Link>
            ) : (
              <Text type="secondary">Không có liên kết</Text>
            )}
          </Paragraph>

          <Divider />

          <Title level={4}>Các bước hướng dẫn</Title>
          {guide.steps && guide.steps.length > 0 ? (
            guide.steps.map((step, index) => (
              <Card
                key={index}
                type="inner"
                title={`Bước ${index + 1}: ${step.title}`}
                style={{ borderRadius: 10 }}
              >
                <Paragraph>{step.content}</Paragraph>
                {step.image && (
                  <Image
                    src={step.image}
                    alt={`Bước ${index + 1}`}
                    style={{ maxHeight: 300, objectFit: 'contain', marginTop: 12 }}
                    placeholder
                  />
                )}
              </Card>
            ))
          ) : (
            <Paragraph type="secondary">Không có bước hướng dẫn nào.</Paragraph>
          )}

          <Divider />

          <div style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={() => navigate('/admin/residence-guide')}>
              ⬅ Quay lại danh sách
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ResidenceGuideDetail;
