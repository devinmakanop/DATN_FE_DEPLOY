import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, Spin, Select, notification, Button, Typography, Empty
} from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const { Option } = Select;
const { Title, Text } = Typography;

function ClientRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsFull, setRestaurantsFull] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState(null);

  const cuisineTypes = ['Việt', 'Âu', 'Nhật'];

  const fetchRestaurants = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/restaurants');
      setRestaurants(response.data || []);
      setRestaurantsFull(response.data || []);
    } catch (error) {
      notification.error({
        message: 'Lỗi tải nhà hàng',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCuisineChange = (value) => {
    setSelectedCuisine(value);
    if (!value) {
      setRestaurants(restaurantsFull);
    } else {
      const filtered = restaurantsFull.filter(r => r.cuisine === value);
      setRestaurants(filtered);
    }
  };

 const handleSortByLikes = async () => {
  setIsLoading(true);
  try {
    const response = await axios.get('http://localhost:5000/api/restaurants/top-liked');
    setRestaurants(response.data || []);
  } catch (error) {
    notification.error({
      message: 'Lỗi tải dữ liệu',
      description: error.message,
    });
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="client-restaurants-container">
      <Title level={2} className=" mb-4">🍽️ Khám phá Nhà hàng</Title>

      <div className="filter-bar mb-4 ">
        <Select
          allowClear
          placeholder="🥢 Chọn loại ẩm thực"
          value={selectedCuisine}
          onChange={handleCuisineChange}
          style={{ width: 250, marginRight: 16 }}
        >
          {cuisineTypes.map((type) => (
            <Option key={type} value={type}>{type}</Option>
          ))}
        </Select>

        <Button type="primary" onClick={handleSortByLikes}>
          🔥 Sắp xếp theo lượt thích
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-5">
          <Spin size="large" />
        </div>
      ) : restaurants.length === 0 ? (
        <Empty description="Không có nhà hàng nào." />
      ) : (
        <Row gutter={[35, 20]}>
          {restaurants.map((restaurant) => (
            <Col key={restaurant._id} xs={24} sm={12} md={8} lg={8}>
              <Link to={`/restaurants/${restaurant._id}`}>
                <Card className="restaurant-card" hoverable>
                  {restaurant.imageUrl && (
                    <div className="card-image-wrapper">
                      <img
                        alt={restaurant.name}
                        src={restaurant.imageUrl}
                        className="card-image"
                        style={{ height: 200, objectFit: 'cover', width: '100%' }}
                      />
                    </div>
                  )}
                  <div className="card-content">
                    <Title level={5}>{restaurant.name}</Title>
                    <Text><strong>🍲 Ẩm thực:</strong> {restaurant.cuisine}</Text><br />
                    <Text><strong>📍 Địa chỉ:</strong> {restaurant.address}</Text>

                    <div className="like-dislike-container text-center mt-2">
                      <span className="like-item">👍 {restaurant.likeCount ?? 0}</span>
                      <span className="dislike-item ms-3">👎 {restaurant.dislikeCount ?? 0}</span>
                    </div>

                    {restaurant.coordinates?.lat && restaurant.coordinates?.lng && (
                      <div className="text-center mt-2">
                        <Button
                          type="link"
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(
                              `https://www.google.com/maps?q=${restaurant.coordinates.lat},${restaurant.coordinates.lng}`,
                              '_blank'
                            );
                          }}
                        >
                          🗺️ Xem trên bản đồ
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ClientRestaurants;
