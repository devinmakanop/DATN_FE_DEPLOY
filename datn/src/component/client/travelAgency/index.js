import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Spin, Rate, Tag, notification } from 'antd';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate
import axiosToken from '../../context/axiosToken'; // Đổi nếu không dùng token
import './index.css';

const { Title, Paragraph, Text, Link } = Typography;

function ClientTravelAgency() {
  const API_BASE_URL = process.env.REACT_APP_API_URL_CLIENT;
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Khởi tạo

  const fetchAgencies = async () => {
    setLoading(true);
    try {
      const res = await axiosToken.get(`${API_BASE_URL}/travelAgency`);
      setAgencies(res.data || []);
    } catch (error) {
      notification.error({
        message: 'Không thể tải danh sách công ty du lịch',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const goToDetail = (id) => {
    navigate(`/travelAgency/${id}`);
  };

  return (
    <div className="client-travel-agency-list">
      <Title level={2} className="mb-4">Danh sách công ty du lịch</Title>

      {loading ? (
        <div className="text-center mt-5">
          <Spin size="large" />
        </div>
      ) : agencies.length === 0 ? (
        <p>Không có dữ liệu.</p>
      ) : (
        <Row gutter={[16, 16]}>
          {agencies.map((agency) => (
            <Col key={agency._id} xs={24} sm={12} md={8}>
              <Card
                hoverable
                title={
                  <a
                    onClick={() => goToDetail(agency._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {agency.name}
                  </a>
                }
                extra={<Rate allowHalf disabled defaultValue={agency.rating} />}
                onClick={() => goToDetail(agency._id)} // Click anywhere trên Card cũng vào detail
                style={{ cursor: 'pointer' }}
              >
                <Paragraph>{agency.description}</Paragraph>
                <Paragraph>
                  <Text strong>Địa chỉ:</Text> {agency.address}<br />
                  <Text strong>Điện thoại:</Text> {agency.phone}<br />
                  <Text strong>Email:</Text> <a href={`mailto:${agency.email}`} onClick={e => e.stopPropagation()}>{agency.email}</a><br />
                  <Text strong>Website:</Text> <Link href={agency.website} target="_blank" onClick={e => e.stopPropagation()}>{agency.website}</Link>
                </Paragraph>
                <Paragraph>
                  {agency.services.map((s, idx) => (
                    <Tag style={{marginBottom: "15px"}} key={idx} color="blue">{s}</Tag>
                  ))}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ClientTravelAgency;
