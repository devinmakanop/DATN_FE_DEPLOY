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
  const [carouselIndex, setCarouselIndex] = useState(0);

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

  const nextSlide = () => {
    if (!hotel?.images) return;
    setCarouselIndex((prev) => (prev + 1 >= hotel.images.length ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (!hotel?.images) return;
    setCarouselIndex((prev) => (prev - 1 < 0 ? hotel.images.length - 1 : prev - 1));
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

  const currentImage = hotel.images && hotel.images.length > 0
    ? hotel.images[carouselIndex]
    : null;

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
          {/* Carousel ảnh 1 ảnh */}
          {currentImage && (
            <div
              className="accommodation-carousel-wrapper"
              style={{
                flex: '1 1 40%',
                maxWidth: '40%',
                position: 'relative',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 0 8px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src={currentImage}
                alt={`Ảnh ${carouselIndex + 1}`}
                style={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <Button
                size="small"
                onClick={prevSlide}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 8,
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  borderRadius: '50%',
                  opacity: 0.7,
                }}
              >
                ‹
              </Button>
              <Button
                size="small"
                onClick={nextSlide}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: 8,
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  borderRadius: '50%',
                  opacity: 0.7,
                }}
              >
                ›
              </Button>
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
