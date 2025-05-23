import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResidenceGuideCreate = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/residenceGuide', values);
      message.success('Thêm hướng dẫn thành công');
    } catch (error) {
      console.error(error);
      message.error('Không thể thêm hướng dẫn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Thêm hướng dẫn tạm trú" style={{ maxWidth: 600, margin: '0 auto', marginTop: 24 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input placeholder="Nhập tiêu đề hướng dẫn" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả ngắn" />
        </Form.Item>

        <Form.Item
          label="Liên kết"
          name="link"
          rules={[
            { required: true, message: 'Vui lòng nhập liên kết' },
            { type: 'url', message: 'Liên kết không hợp lệ' },
          ]}
        >
          <Input placeholder="https://..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm hướng dẫn
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ResidenceGuideCreate;
