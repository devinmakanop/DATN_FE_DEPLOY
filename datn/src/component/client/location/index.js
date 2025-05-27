import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, Spin, Select, notification, Button, Typography, Empty
} from 'antd';
import { Link } from 'react-router-dom';
import axiosToken from '../../context/axiosToken';
import './ClientLocations.css';

const { Option } = Select;
const { Title, Text } = Typography;

function ClientLocations() {
  const API_BASE_URL = process.env.REACT_APP_API_URL_CLIENT;
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null);

  const locationTypes = ['văn hóa', 'lịch sử', 'thiên nhiên', 'giải trí'];

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const response = await axiosToken.get(`${API_BASE_URL}/locations`);
      setLocations(response.data || []);
    } catch (error) {
      notification.error({
        message: 'Lỗi tải địa điểm',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocationsByType = async (type) => {
    setIsLoading(true);
    try {
      const response = await axiosToken.get(`${API_BASE_URL}/locations/type/${type}`);
      setLocations(response.data || []);
    } catch (error) {
      notification.error({
        message: 'Lỗi tải theo loại',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopLikedLocations = async () => {
    setIsLoading(true);
    try {
      const response = await axiosToken.get(`${API_BASE_URL}/locations/top-liked`);
      setLocations(response.data || []);
    } catch (error) {
      notification.error({
        message: 'Lỗi tải địa điểm nổi bật',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleTypeChange = (value) => {
    setSelectedType(value);
    if (value) {
      fetchLocationsByType(value);
    } else {
      fetchLocations();
    }
  };

  return (
    <div className="client-locations-container mb-5">
      <Title level={2} className="text-center mb-4">🌍 Khám phá địa điểm</Title>

      <div className="filter-bar mb-5 text-center">
        <Select
          allowClear
          placeholder="🎯 Chọn loại địa điểm"
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

        <Button type="primary" onClick={fetchTopLikedLocations}>
          🔥 Sắp xếp theo lượt thích
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center mt-5">
          <Spin size="large" />
        </div>
      ) : locations.length === 0 ? (
        <Empty description="Không có địa điểm nào" />
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
                  <Text><strong>📌 Loại:</strong> {location.type}</Text><br />
                  <Text><strong>📍 Địa chỉ:</strong> {location.address}</Text>

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
                        🗺️ Xem trên bản đồ
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
