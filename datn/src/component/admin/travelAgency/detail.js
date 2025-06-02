import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Image, Spin, message } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TravelAgencyAdminDetail = () => {
  const { id } = useParams();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_API_URL_ADMIN || 'http://localhost:5000';

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${API}/travelAgency/${id}`);
        setAgency(res.data);
      } catch (err) {
        message.error('Lỗi khi tải chi tiết công ty');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, API]);

  if (loading) return <Spin />;

  if (!agency) return null;

  return (
    <Card title="Chi tiết công ty du lịch">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tên công ty">{agency.name}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{agency.address}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{agency.phone}</Descriptions.Item>
        <Descriptions.Item label="Email">{agency.email}</Descriptions.Item>
        <Descriptions.Item label="Website">{agency.website}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">{agency.description}</Descriptions.Item>
        <Descriptions.Item label="Dịch vụ">{agency.services?.join(', ')}</Descriptions.Item>
        <Descriptions.Item label="Ảnh đại diện">
          <Image width={200} src={agency.imageUrl} />
        </Descriptions.Item>
        <Descriptions.Item label="Tọa độ">
          {agency.coordinates?.lat}, {agency.coordinates?.lng}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default TravelAgencyAdminDetail;
