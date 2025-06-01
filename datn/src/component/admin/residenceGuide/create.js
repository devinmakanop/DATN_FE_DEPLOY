import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
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
    <Card title="Thêm hướng dẫn tạm trú" style={{ maxWidth: 800, margin: '0 auto', marginTop: 24 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input placeholder="Nhập tiêu đề hướng dẫn" />
        </Form.Item>

        <Form.Item
          label="Mô tả ngắn"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập mô tả ngắn" />
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

        <Form.List name="steps" rules={[{ required: true, message: 'Vui lòng thêm ít nhất 1 bước' }]}>
          {(fields, { add, remove }) => (
            <>
              <label style={{ fontWeight: 500 }}>Các bước hướng dẫn</label>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  style={{ marginBottom: 16 }}
                  type="inner"
                  title={`Bước ${name + 1}`}
                  extra={
                    <Button danger type="text" icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                  }
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'title']}
                    label="Tiêu đề bước"
                    rules={[{ required: true, message: 'Nhập tiêu đề bước' }]}
                  >
                    <Input placeholder="Ví dụ: Bước 1: Chuẩn bị giấy tờ" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'content']}
                    label="Nội dung bước"
                    rules={[{ required: true, message: 'Nhập nội dung bước' }]}
                  >
                    <Input.TextArea rows={3} placeholder="Mô tả chi tiết cho bước này" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'image']}
                    label="Ảnh minh họa (nếu có)"
                    rules={[{ type: 'url', message: 'Link ảnh không hợp lệ' }]}
                  >
                    <Input placeholder="https://..." />
                  </Form.Item>
                </Card>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm bước hướng dẫn
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

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
