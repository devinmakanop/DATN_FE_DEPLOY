import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card, Spin, Divider, List, Avatar, Button, notification, Typography, Space
} from 'antd';
import axios from 'axios';
import './RestaurantDetail.css';

const { Title, Paragraph } = Typography;

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

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
    setLikeLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/likes/restaurant/${id}?action=${action}`);
      await fetchRestaurant(); // cập nhật lại dữ liệu sau khi like
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
    fetchRestaurant();
  }, [id]);

  if (loading) return <Spin className="loading-center" />;

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
            />
          )}
          <div className="restaurant-info">
            <Title level={2}>{restaurant.name}</Title>
            <Paragraph><strong>📍 Địa chỉ:</strong> {restaurant.address}</Paragraph>
            <Paragraph><strong>🍲 Ẩm thực:</strong> {restaurant.cuisine}</Paragraph>
            <Paragraph><strong>📝 Mô tả:</strong> {restaurant.description}</Paragraph>

            <Space style={{ marginTop: 12 }}>
              <Button
                onClick={() => handleLikeAction('like')}
                loading={likeLoading}
              >
                👍 Like ({restaurant.likeCount ?? 0})
              </Button>
              <Button
                onClick={() => handleLikeAction('dislike')}
                loading={likeLoading}
                danger
              >
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
        <List
          dataSource={restaurant.comments}
          locale={{ emptyText: 'Chưa có bình luận nào.' }}
          renderItem={(comment) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{comment.user?.charAt(0).toUpperCase()}</Avatar>}
                title={<strong>{comment.user}</strong>}
                description={comment.comment}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default RestaurantDetail;
