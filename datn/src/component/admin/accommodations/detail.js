import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Spin, notification } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const { Paragraph } = Typography;

function AdminAccommodationDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/accommodations/${id}`);
        setData(res.data);
      } catch (error) {
        notification.error({
          message: 'Lỗi tải chi tiết',
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <Spin style={{ margin: 50 }} />;

  if (!data) return <div>Không tìm thấy dữ liệu</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Chi tiết Khách sạn / Nhà nghỉ</h1>
      <Card title={data.name} style={{ maxWidth: 700 }}>
        <p><b>Địa chỉ:</b> {data.address}</p>
        <p><b>Điện thoại:</b> {data.phone}</p>
        <p><b>Mô tả:</b> <Paragraph>{data.description}</Paragraph></p>
        <p><b>Đánh giá:</b> {data.rating ?? 'Chưa có'}</p>
        <p><b>Số lượt thích:</b> {data.likeCount}</p>
        <p><b>Số lượt không thích:</b> {data.dislikeCount}</p>
        <p><b>Ảnh:</b></p>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={data.images || []}
          renderItem={img => (
            <List.Item>
              <img src={img} alt="accommodation" style={{ width: '100%', maxHeight: 150, objectFit: 'cover' }} />
            </List.Item>
          )}
        />
        <p><b>Bình luận:</b></p>
        <List
          dataSource={data.comments || []}
          renderItem={item => (
            <List.Item>
              <b>{item.user}:</b> {item.comment}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default AdminAccommodationDetail;
