import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, Spin, Select, notification, Button, Typography, Empty
} from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ClientLocations.css';

const { Option } = Select;
const { Title, Text } = Typography;

const fixedLabels = {
  vi: {
    title: '🌍 Khám phá địa điểm',
    typePlaceholder: '🎯 Chọn loại địa điểm',
    sortLikes: '🔥 Sắp xếp theo lượt thích',
    type: '📌 Loại',
    address: '📍 Địa chỉ',
    map: '🗺️ Xem trên bản đồ',
    noData: 'Không có địa điểm nào.',
    loadError: 'Lỗi tải địa điểm',
  },
  en: {
    title: '🌍 Explore Locations',
    typePlaceholder: '🎯 Select location type',
    sortLikes: '🔥 Sort by likes',
    type: '📌 Type',
    address: '📍 Address',
    map: '🗺️ View on map',
    noData: 'No locations available.',
    loadError: 'Failed to load locations',
  },
  ko: {
    title: '🌍 장소 탐색',
    typePlaceholder: '🎯 장소 유형 선택',
    sortLikes: '🔥 좋아요 순 정렬',
    type: '📌 유형',
    address: '📍 주소',
    map: '🗺️ 지도에서 보기',
    noData: '장소 데이터가 없습니다.',
    loadError: '장소 데이터를 불러오는 데 실패했습니다',
  },
  'zh-CN': {
    title: '🌍 探索地点',
    typePlaceholder: '🎯 选择地点类型',
    sortLikes: '🔥 按点赞排序',
    type: '📌 类型',
    address: '📍 地址',
    map: '🗺️ 在地图上查看',
    noData: '没有可用的地点。',
    loadError: '加载地点失败',
  },
};

function ClientLocations() {
  const [locations, setLocations] = useState([]);
  const [locationsFull, setLocationsFull] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null);
  const [lng, setLng] = useState('vi');

  const locationTypes = ['văn hóa', 'lịch sử', 'thiên nhiên', 'giải trí'];

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const lang = localStorage.getItem('lng') || 'vi';
      setLng(lang);
      const response = await axios.get(`http://localhost:5000/api/locations?lng=${lang}`);
      setLocations(response.data || []);
      setLocationsFull(response.data || []);
    } catch (error) {
      notification.error({
        message: fixedLabels[lng]?.loadError || 'Lỗi tải địa điểm',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    if (!value) {
      setLocations(locationsFull);
    } else {
      const filtered = locationsFull.filter(loc => loc.type === value);
      setLocations(filtered);
    }
  };

  const handleSortByLikes = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/locations/top-liked?lng=${lng}`);
      setLocations(res.data || []);
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
    fetchLocations();
  }, []);

  const labels = fixedLabels[lng] || fixedLabels.vi;

  return (
    <div className="client-locations-container mb-5">
      <Title level={2} className=" mb-4">{labels.title}</Title>

      <div className="filter-bar mb-5">
        <Select
          allowClear
          placeholder={labels.typePlaceholder}
          value={selectedType}
          onChange={handleTypeChange}
          style={{ width: 260, marginRight: 16 }}
        >
          {locationTypes.map((type) => (
            <Option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Option>
          ))}
        </Select>

        <Button className='btn-orange' type="primary" onClick={handleSortByLikes}>
          {labels.sortLikes}
        </Button>
      </div>

      {isLoading ? (
        <div className=" mt-5">
          <Spin size="large" />
        </div>
      ) : locations.length === 0 ? (
        <Empty description={labels.noData} />
      ) : (
        <Row gutter={[24, 24]}>
          {locations.map((location) => (
            <Col key={location._id} xs={24} sm={12} md={8} lg={6}>
              <Link to={`/locations/${location._id}`}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={location.name}
                      src={location.imageUrl || location.image}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                  className="location-card"
                >
                  <Title level={5} className="text-center">{location.name}</Title>
                  <Text><strong>{labels.type}:</strong> {location.type}</Text><br />
                  <Text><strong>{labels.address}:</strong> {location.address}</Text>

                  <div className="like-dislike-container mt-2 text-center">
                    <span className="like-item">👍 {location.likeCount ?? 0}</span>
                    <span className="dislike-item ml-3">👎 {location.dislikeCount ?? 0}</span>
                  </div>

                  {location.coordinates?.lat && location.coordinates?.lng && (
                    <div className="text-center mt-2">
                      <Button
                        type="link"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(
                            `https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}`,
                            '_blank'
                          );
                        }}
                      >
                        {labels.map}
                      </Button>
                    </div>
                  )}
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ClientLocations;
