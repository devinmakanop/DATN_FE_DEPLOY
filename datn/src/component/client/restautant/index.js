import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, Spin, Select, notification, Button, Typography, Empty
} from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const { Option } = Select;
const { Title, Text } = Typography;

const fixedLabels = {
  vi: {
    title: '🍽️ Khám phá Nhà hàng',
    cuisinePlaceholder: '🥢 Chọn loại ẩm thực',
    sortLikes: '🔥 Sắp xếp theo lượt thích',
    cuisine: '🍲 Ẩm thực',
    address: '📍 Địa chỉ',
    map: '🗺️ Xem trên bản đồ',
    noData: 'Không có nhà hàng nào.',
    loadError: 'Lỗi tải nhà hàng',
  },
  en: {
    title: '🍽️ Discover Restaurants',
    cuisinePlaceholder: '🥢 Select cuisine',
    sortLikes: '🔥 Sort by likes',
    cuisine: '🍲 Cuisine',
    address: '📍 Address',
    map: '🗺️ View on map',
    noData: 'No restaurants available.',
    loadError: 'Failed to load restaurants',
  },
  ko: {
    title: '🍽️ 레스토랑 탐색',
    cuisinePlaceholder: '🥢 요리 종류 선택',
    sortLikes: '🔥 좋아요 순 정렬',
    cuisine: '🍲 요리',
    address: '📍 주소',
    map: '🗺️ 지도에서 보기',
    noData: '레스토랑 데이터가 없습니다.',
    loadError: '레스토랑 데이터를 불러오는 데 실패했습니다',
  },
  'zh-CN': {
    title: '🍽️ 探索餐厅',
    cuisinePlaceholder: '🥢 选择菜系',
    sortLikes: '🔥 按点赞排序',
    cuisine: '🍲 菜系',
    address: '📍 地址',
    map: '🗺️ 在地图上查看',
    noData: '没有餐厅数据。',
    loadError: '加载餐厅数据失败',
  },
};

function ClientRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsFull, setRestaurantsFull] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [lng, setLng] = useState('vi');

  const cuisineTypes = ['Việt', 'Âu', 'Nhật'];

  const fetchRestaurants = async () => {
    setIsLoading(true);
    try {
      const lang = localStorage.getItem('lng') || 'vi';
      setLng(lang);
      const res = await axios.get(`http://localhost:5000/api/restaurants?lng=${lang}`);
      setRestaurants(res.data || []);
      setRestaurantsFull(res.data || []);
    } catch (error) {
      notification.error({
        message: fixedLabels[lng]?.loadError || 'Lỗi tải nhà hàng',
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
      const res = await axios.get(`http://localhost:5000/api/restaurants/top-liked?lng=${lng}`);
      setRestaurants(res.data || []);
    } catch (error) {
      notification.error({
        message: fixedLabels[lng]?.loadError || 'Lỗi tải dữ liệu',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const labels = fixedLabels[lng] || fixedLabels.vi;

  return (
    <div className="client-restaurants-container">
      <Title level={2} className="mb-4 text-color"  style={{ textAlign: 'center', marginBottom: 30 }}>{labels.title}</Title>

      <div className="filter-bar mb-4">
        <Select
          allowClear
          placeholder={labels.cuisinePlaceholder}
          value={selectedCuisine}
          onChange={handleCuisineChange}
          style={{ width: 250, marginRight: 16 }}
        >
          {cuisineTypes.map((type) => (
            <Option key={type} value={type}>{type}</Option>
          ))}
        </Select>

        <Button className='btn-orange' type="primary" onClick={handleSortByLikes}>
          {labels.sortLikes}
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-5">
          <Spin size="large" />
        </div>
      ) : restaurants.length === 0 ? (
        <Empty description={labels.noData} />
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
                    <Text><strong>{labels.cuisine}:</strong> {restaurant.cuisine}</Text><br />
                    <Text><strong>{labels.address}:</strong> {restaurant.address}</Text>

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
                          {labels.map}
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
