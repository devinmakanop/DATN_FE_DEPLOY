import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  Spin,
  Button,
  Space,
  notification,
  Divider,
  Image,
} from 'antd';
import axiosToken from '../../context/axiosToken';
import './ClientResidencyGuides.css';

const { Title, Paragraph, Text, Link } = Typography;

const fixedLabels = {
  vi: {
    loading: 'Đang tải chi tiết...',
    notFound: 'Không tìm thấy hướng dẫn.',
    error: 'Lỗi khi tải chi tiết hướng dẫn',
    description: 'Mô tả',
    noDescription: 'Không có mô tả',
    docLink: 'Liên kết tài liệu',
    stepsTitle: 'Các bước thực hiện',
    back: '⬅ Quay lại danh sách',
  },
  en: {
    loading: 'Loading details...',
    notFound: 'Guide not found.',
    error: 'Error loading guide details',
    description: 'Description',
    noDescription: 'No description available',
    docLink: 'Document link',
    stepsTitle: 'Steps to follow',
    back: '⬅ Back to list',
  },
  ko: {
    loading: '세부 정보 불러오는 중...',
    notFound: '가이드를 찾을 수 없습니다.',
    error: '가이드 세부 정보를 불러오는 중 오류 발생',
    description: '설명',
    noDescription: '설명 없음',
    docLink: '문서 링크',
    stepsTitle: '진행 단계',
    back: '⬅ 목록으로 돌아가기',
  },
  'zh-CN': {
    loading: '正在加载详细信息...',
    notFound: '未找到指南。',
    error: '加载指南详情时出错',
    description: '描述',
    noDescription: '暂无描述',
    docLink: '文档链接',
    stepsTitle: '操作步骤',
    back: '⬅ 返回列表',
  },
};

const ClientResidencyGuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL_CLIENT;

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const lng = localStorage.getItem('lng') || 'vi';
  const labels = fixedLabels[lng] || fixedLabels.vi;

  const fetchGuide = async () => {
    try {
      const response = await axiosToken.get(`${API_BASE_URL}/residenceGuide/${id}?lng=${lng}`);
      setGuide(response.data);
    } catch (error) {
      notification.error({
        message: labels.error,
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuide();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
        <Spin size="large" tip={labels.loading} />
      </div>
    );
  }

  if (!guide) {
    return (
      <Paragraph style={{ textAlign: 'center', marginTop: 80 }}>
        {labels.notFound}
      </Paragraph>
    );
  }

  return (
    <div className="client-residency-guides-container" style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <Card
        bordered
        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        bodyStyle={{ padding: 24 }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={3}>{guide.title}</Title>

          <Paragraph>
            <Text strong>{labels.description}:</Text><br />
            {guide.description || <Text type="secondary">{labels.noDescription}</Text>}
          </Paragraph>

          {guide.link && (
            <Paragraph>
              <Text strong>{labels.docLink}:</Text><br />
              <Link href={guide.link} target="_blank" rel="noopener noreferrer">
                {guide.link}
              </Link>
            </Paragraph>
          )}

          {guide.steps && guide.steps.length > 0 && (
            <>
              <Divider orientation="left" orientationMargin="0">
                {labels.stepsTitle}
              </Divider>
              <div>
                {guide.steps.map((step, index) => (
                  <Card
                    key={index}
                    type="inner"
                    title={`Bước ${index + 1}: ${step.title}`}
                    style={{ marginBottom: 16, borderRadius: 10 }}
                  >
                    <Paragraph>{step.content}</Paragraph>
                    {step.image && (
                      <div style={{ textAlign: 'center', marginTop: 12 }}>
                        <Image
                          src={step.image}
                          alt={`Ảnh bước ${index + 1}`}
                          style={{ maxHeight: 300, objectFit: 'contain' }}
                          placeholder
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button type="primary" onClick={() => navigate(`/residencyGuides?lng=${lng}`)}>
              {labels.back}
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ClientResidencyGuideDetail;
