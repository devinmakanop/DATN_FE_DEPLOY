import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TravelAgencyAdminEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_API_URL_ADMIN || 'http://localhost:5000';

  useEffect(() => {
    const fetchAgency = async () => {
      try {
        const res = await axios.get(`${API}/travelAgency/${id}`);
        const data = res.data;
        form.setFieldsValue({
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          website: data.website,
          description: data.description,
          services: data.services?.join(', '),
        });
      } catch (err) {
        message.error('Lỗi khi tải dữ liệu công ty');
      } finally {
        setLoading(false);
      }
    };
    fetchAgency();
  }, [id, API, form]);

  const handleUploadImage = async () => {
    if (!file) return null;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'DATN_preset');
    data.append('folder', 'DATN/admin/restaurants');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dw0niuzdf/image/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (result.secure_url) return result.secure_url;
      message.error('Upload ảnh thất bại');
      return null;
    } catch (err) {
      message.error('Upload ảnh thất bại');
      return null;
    }
  };

  const onFinish = async (values) => {
    let imageUrl = null;
    if (file) {
      imageUrl = await handleUploadImage();
      if (!imageUrl) return;
    }

    const payload = {
      ...values,
      services: values.services ? values.services.split(',').map(s => s.trim()) : [],
    };

    if (imageUrl) payload.imageUrl = imageUrl;

    try {
      await axios.put(`${API}/travelAgency/${id}`, payload);
      message.success('Cập nhật thành công');
      navigate('/admin/travelAgency');
    } catch (err) {
      message.error('Cập nhật thất bại');
    }
  };

  return (
    <Card title="Chỉnh sửa công ty du lịch" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Tên công ty" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Website" name="website">
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Dịch vụ (ngăn cách dấu phẩy)" name="services">
          <Input placeholder="VD: Tour nội địa, Visa, Du thuyền" />
        </Form.Item>
        <Form.Item label="Cập nhật ảnh mới (tùy chọn)">
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TravelAgencyAdminEdit;
