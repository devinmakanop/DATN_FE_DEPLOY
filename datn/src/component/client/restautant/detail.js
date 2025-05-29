import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Spin, Divider, Button, Typography, Space,
  notification, Input, List, Modal
} from 'antd';
import axios from 'axios';
import './RestaurantDetail.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const fetchRestaurant = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
      setRestaurant(res.data);
    } catch (error) {
      notification.error({
        message: 'Lỗi tải chi tiết nhà hàng',
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
      await axios.post(`http://localhost:5000/api/likes/restaurant/${id}?action=${action}`);
      await fetchRestaurant();
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
      await axios.post(`http://localhost:5000/api/comments/restaurant/${id}`, {
        user,
        comment,
      });
      setComment('');
      await fetchRestaurant();
      notification.success({ message: 'Đã thêm bình luận' });
    } catch (err) {
      notification.error({
        message: 'Lỗi gửi bình luận',
        description: err.message,
      });
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  if (loading) return <Spin className="loading-center" size="large" />;
  if (!restaurant) return <p className="text-center">Không tìm thấy nhà hàng.</p>;

  return (
    <div className="restaurant-detail-container">
      <Card bordered={false}>
        <div className="restaurant-header">
          {restaurant.imageUrl && (
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="restaurant-image"
              style={{ height: 280, objectFit: 'cover', width: '100%' }}
            />
          )}
          <div className="restaurant-info">
            <Title level={2}>{restaurant.name}</Title>
            <Paragraph><strong>📍 Địa chỉ:</strong> {restaurant.address}</Paragraph>
            <Paragraph><strong>🍲 Ẩm thực:</strong> {restaurant.cuisine}</Paragraph>
            <Paragraph><strong>📝 Mô tả:</strong> {restaurant.description || 'Không có mô tả'}</Paragraph>

            <Space style={{ marginTop: 12 }}>
              <Button onClick={() => handleLikeAction('like')} loading={likeLoading}>
                👍 Like ({restaurant.likeCount ?? 0})
              </Button>
              <Button onClick={() => handleLikeAction('dislike')} loading={likeLoading} danger>
                👎 Dislike ({restaurant.dislikeCount ?? 0})
              </Button>
            </Space>

            {restaurant.coordinates?.lat && restaurant.coordinates?.lng && (
              <div className="mt-2">
                <Button
                  type="link"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${restaurant.coordinates.lat},${restaurant.coordinates.lng}`,
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
          dataSource={restaurant.comments || []}
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
      </Card>
    </div>
  );
}

export default RestaurantDetail;
