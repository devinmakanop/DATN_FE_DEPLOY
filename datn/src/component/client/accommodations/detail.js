import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Spin, Divider, Button, Typography, Space,
  notification, Input, List, Modal
} from 'antd';
import axios from 'axios';
import './AccommodationDetail.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

function AccommodationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const fetchHotel = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/accommodations/${id}`);
      setHotel(res.data);
    } catch (error) {
      notification.error({
        message: 'Không thể tải dữ liệu khách sạn',
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
        zIndex: 99999,
      });
      return;
    }

    setLikeLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/likes/accommodation/${id}?action=${action}`);
      await fetchHotel();
    } catch (error) {
      notification.error({
        message: 'Thao tác không thành công',
        description: error.message,
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
      await axios.post(`http://localhost:5000/api/comments/accommodation/${id}`, {
        user,
        comment,
      });
      setComment('');
      await fetchHotel();
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
    fetchHotel();
  }, [id]);

  if (loading) {
    return <Spin className="loading-center" size="large" />;
  }

  if (!hotel) {
    return <Paragraph style={{ textAlign: 'center', marginTop: 50 }}>Không tìm thấy khách sạn.</Paragraph>;
  }

  return (
    <div className="accommodation-detail-container" style={{ padding: 24 }}>
      <Button type="primary" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        ← Quay lại
      </Button>

      <Card bordered={false}>
        <div
          className="accommodation-top-section"
          style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}
        >
          {/* Ảnh bên trái */}
          {hotel.images && hotel.images.length > 0 && (
            <div
              className="accommodation-carousel-wrapper"
              style={{ flex: '1 1 40%', maxWidth: '40%' }}
            >
              <div
                className="accommodation-carousel"
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              >
                {hotel.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Ảnh ${idx + 1}`}
                    className="accommodation-image"
                    style={{
                      width: '100%',
                      borderRadius: 8,
                      objectFit: 'cover',
                      maxHeight: 200,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Thông tin bên phải */}
          <div
            className="accommodation-info"
            style={{ flex: '1 1 60%', maxWidth: '60%' }}
          >
            <Title level={2}>{hotel.name}</Title>

            <Paragraph>
              <Text strong>📍 Địa chỉ:</Text> {hotel.address}
            </Paragraph>
            <Paragraph>
              <Text strong>📞 Điện thoại:</Text> {hotel.phone}
            </Paragraph>
            <Paragraph>
              <Text strong>📝 Mô tả:</Text> {hotel.description || 'Không có mô tả'}
            </Paragraph>

            <Space style={{ marginTop: 12 }}>
              <Button
                onClick={() => handleLikeAction('like')}
                loading={likeLoading}
              >
                👍 Like ({hotel.likeCount ?? 0})
              </Button>
              <Button
                onClick={() => handleLikeAction('dislike')}
                loading={likeLoading}
                danger
              >
                👎 Dislike ({hotel.dislikeCount ?? 0})
              </Button>
            </Space>
          </div>
        </div>

        <Divider />
        <Title level={4}>💬 Bình luận của khách</Title>

        <TextArea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Nhập bình luận của bạn..."
          maxLength={300}
          showCount
        />
        <div style={{ textAlign: 'right', marginTop: 25 }}>
          <Button
            type="primary"
            onClick={handleAddComment}
            loading={commentLoading}
          >
            Gửi bình luận
          </Button>
        </div>

        <List
          style={{ marginTop: 24 }}
          dataSource={hotel.comments || []}
          locale={{ emptyText: 'Chưa có bình luận nào.' }}
          itemLayout="horizontal"
          renderItem={(cmt, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                avatar={
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      cmt.user
                    )}`}
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
      </Card>
    </div>
  );
}

export default AccommodationDetail;
