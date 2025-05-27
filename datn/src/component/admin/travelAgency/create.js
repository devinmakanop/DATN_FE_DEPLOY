import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTravelAgency = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const data = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      email: values.email,
      website: values.website,
      description: values.description,
      services: values.services.split(',').map(s => s.trim()),
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(values.lng), // kinh độ
          parseFloat(values.lat), // vĩ độ
        ],
      },
    };

    try {
      await axios.post('http://localhost:5000/api/travelAgency', data);
      message.success('Thêm công ty du lịch thành công');
    } catch (err) {
      console.error(err);
      message.error('Thêm thất bại');
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h2>Thêm công ty du lịch</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Tên công ty" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Số điện thoại">
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item name="website" label="Website">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="services" label="Dịch vụ (ngăn cách bởi dấu phẩy)">
          <Input placeholder="VD: Tour nội địa, Visa, Du thuyền" />
        </Form.Item>
        <Form.Item name="lat" label="Vĩ độ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lng" label="Kinh độ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Thêm</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTravelAgency;
