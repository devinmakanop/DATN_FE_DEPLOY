import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Tag, Spin, Button, notification, Space,
  Input, List, Modal
} from 'antd';
import axiosToken from '../../context/axiosToken';
import './TravelAgencyDetail.css';

const { Title, Paragraph, Text, Link } = Typography;
const { TextArea } = Input;

function TravelAgencyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL_CLIENT;

  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

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
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      Modal.confirm({
        title: 'Yêu cầu đăng nhập',
        content: 'Bạn cần đăng nhập để thực hiện thao tác này. Chuyển đến trang đăng nhập?',
        okText: 'Đăng nhập',
        cancelText: 'Hủy',
        onOk: () => navigate('/login'),
        zIndex: 99999
      });
      return;
    }

    setLikeLoading(true);
    try {
      await axiosToken.post(`${API_BASE_URL}/likes/travelAgency/${id}?action=${action}`);
      await fetchAgencyDetail();
    } catch (err) {
      notification.error({
        message: 'Thao tác không thành công',
        description: err.message,
      });
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    const user = JSON.parse(localStorage.getItem('user'))?.fullName;

    if (!user) {
      Modal.confirm({
        title: 'Yêu cầu đăng nhập',
        content: 'Bạn cần đăng nhập để bình luận. Chuyển đến trang đăng nhập?',
        okText: 'Đăng nhập',
        cancelText: 'Hủy',
        onOk: () => navigate('/login'),
        zIndex: 99999,
      });
      return;
    }

    if (!comment.trim()) {
      return notification.warning({
        message: 'Bình luận trống',
        description: 'Vui lòng nhập nội dung bình luận.',
      });
    }

    setCommentLoading(true);
    try {
      await axiosToken.post(`${API_BASE_URL}/comments/travelAgency/${id}`, {
        user,
        comment,
      });
      setComment('');
      await fetchAgencyDetail();
      notification.success({ message: 'Đã thêm bình luận' });
    } catch (error) {
      notification.error({
        message: 'Lỗi gửi bình luận',
        description: error.message,
      });
    } finally {
      setCommentLoading(false);
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
        ← Quay lại
      </Button>

      <div className="travel-agency-header">
        {agency.imageUrl && (
          <img
            src={agency.imageUrl}
            alt={agency.name}
            className="travel-agency-image"
          />
        )}

        <div className="travel-agency-info">
          <Title level={2}>{agency.name}</Title>

          <Paragraph><Text strong>🏢 Địa chỉ:</Text> {agency.address}</Paragraph>
          <Paragraph><Text strong>📞 Điện thoại:</Text> {agency.phone}</Paragraph>
          <Paragraph>
            <Text strong>✉️ Email:</Text>{' '}
            <a href={`mailto:${agency.email}`}>{agency.email}</a>
          </Paragraph>
          <Paragraph>
            <Text strong>🔗 Website:</Text>{' '}
            <Link href={agency.website} target="_blank" rel="noopener noreferrer">
              {agency.website}
            </Link>
          </Paragraph>
          <Paragraph>
            <Text strong>🛎️ Dịch vụ:</Text>{' '}
            {agency.services?.map((service, idx) => (
              <Tag key={idx} color="blue">{service}</Tag>
            ))}
          </Paragraph>

          <Space style={{ marginTop: 12 }}>
            <Button onClick={() => handleLikeAction('like')} loading={likeLoading}>
              👍 Like ({agency.likeCount ?? 0})
            </Button>
            <Button onClick={() => handleLikeAction('dislike')} loading={likeLoading} danger>
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

      <hr style={{ margin: '24px 0' }} />

      <Title level={4}>💬 Bình luận</Title>

      <TextArea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Nhập bình luận của bạn..."
        maxLength={300}
        showCount
      />
      <div style={{ textAlign: 'right', marginTop: 25 }}>
        <Button type="primary" onClick={handleAddComment} loading={commentLoading}>
          Gửi bình luận
        </Button>
      </div>

      <List
        style={{ marginTop: 24 }}
        dataSource={agency.comments || []}
        locale={{ emptyText: 'Chưa có bình luận nào.' }}
        itemLayout="horizontal"
        renderItem={(cmt, index) => (
          <List.Item key={index}>
            <List.Item.Meta
              avatar={
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(cmt.user)}`}
                  alt="avatar"
                  style={{ borderRadius: '50%' }}
                  width={40}
                />
              }
              title={<strong>{cmt.user}</strong>}
              description={cmt.comment}
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default TravelAgencyDetail;
