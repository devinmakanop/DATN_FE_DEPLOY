import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

function AdminAccommodationCreate() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/accommodations', values);
      notification.success({ message: 'Tạo mới thành công' });
      navigate('/admin/accommodations');
    } catch (error) {
      notification.error({
        message: 'Lỗi tạo mới',
        description: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Tạo mới Khách sạn / Nhà nghỉ</h1>
      <Form {...layout} onFinish={onFinish} scrollToFirstError>
        <Form.Item
          name="name"
          label="Tên"
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="phone" label="Điện thoại">
          <Input />
        </Form.Item>

        <Form.Item name="images" label="Ảnh (URL, cách nhau dấu phẩy)">
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
          <Button type="primary" htmlType="submit">Tạo mới</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AdminAccommodationCreate;
