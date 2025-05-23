import React from 'react';
import { Form, Input, Button, InputNumber, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RestaurantCreate = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/restaurants', values);
      message.success('Đã thêm nhà hàng thành công');
    } catch (error) {
      message.error('Thêm thất bại');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <h2>Thêm nhà hàng mới</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên nhà hàng"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhà hàng' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Loại ẩm thực"
          name="cuisine"
          rules={[{ required: true, message: 'Vui lòng nhập loại ẩm thực' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="URL ảnh"
          name="imageUrl"
          rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Đánh giá (1-5)"
          name="rating"
          rules={[{ required: true, message: 'Vui lòng nhập đánh giá' }]}
        >
          <InputNumber min={1} max={5} step={0.1} />
        </Form.Item>

        <Form.Item label="Tọa độ (Latitude)" name={['coordinates', 'lat']} rules={[{ required: true }]}>
          <InputNumber step={0.0001} />
        </Form.Item>

        <Form.Item label="Tọa độ (Longitude)" name={['coordinates', 'lng']} rules={[{ required: true }]}>
          <InputNumber step={0.0001} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm nhà hàng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RestaurantCreate;
