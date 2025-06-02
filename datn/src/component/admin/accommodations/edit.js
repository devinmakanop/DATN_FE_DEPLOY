import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Spin } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

function AdminAccommodationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/accommodations/${id}`);
        // Chuyển mảng images về chuỗi ngăn cách dấu phẩy để edit
        const data = {
          ...res.data,
          images: (res.data.images || []).join(','),
        };
        form.setFieldsValue(data);
      } catch (error) {
        notification.error({
          message: 'Lỗi tải dữ liệu',
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, form]);

  const onFinish = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/accommodations/${id}`, values);
      notification.success({ message: 'Cập nhật thành công' });
      navigate('/admin/accommodations');
    } catch (error) {
      notification.error({
        message: 'Lỗi cập nhật',
        description: error.response?.data?.message || error.message,
      });
    }
  };

  if (loading) return <Spin style={{ margin: 50 }} />;

  return (
    <div style={{ padding: 20 }}>
      <h1>Sửa Khách sạn / Nhà nghỉ</h1>
      <Form {...layout} form={form} onFinish={onFinish} scrollToFirstError>
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

        <Form.Item name="rating" label="Đánh giá" rules={[
          { type: 'number', min: 0, max: 5, message: 'Điểm đánh giá từ 0 đến 5' }
        ]}>
          <Input type="number" step="0.1" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
          <Button type="primary" htmlType="submit">Lưu</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AdminAccommodationEdit;
