import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Select, Upload } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { UploadOutlined } from '@ant-design/icons';

// Fix icon leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AdminRestaurantEdit = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [position, setPosition] = useState({ lat: 21.0285, lng: 105.8542 });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.REACT_APP_API_URL_ADMIN || 'http://localhost:5000';

  useEffect(() => {
    axios.get(`${API}/restaurants/${id}`)
      .then(res => {
        const restaurant = res.data;
        const { name, category, address, description, imageUrl, coordinates } = restaurant;
        form.setFieldsValue({
          name, category, address, description,
          lat: coordinates.lat,
          lng: coordinates.lng
        });
        setPosition({ lat: coordinates.lat, lng: coordinates.lng });
        setLoading(false);
      })
      .catch(err => {
        message.error('Không thể tải dữ liệu nhà hàng');
        console.error(err);
        setLoading(false);
      });
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
      return result.secure_url || null;
    } catch (err) {
      message.error('Upload ảnh thất bại');
      console.error('Upload failed:', err);
      return null;
    }
  };

  const MapFlyTo = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      map.flyTo([position.lat, position.lng], 15, { duration: 1.5 });
    }, [position, map]);
    return null;
  };

  const LocationSelector = () => {
    useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        setPosition({ lat, lng });
        form.setFieldsValue({ lat, lng });
      },
    });
    return <Marker position={position} />;
  };

  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: address, format: 'json' },
      });

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const newPosition = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setPosition(newPosition);
        form.setFieldsValue({ lat: newPosition.lat, lng: newPosition.lng });
        message.success('Tọa độ đã được cập nhật!');
      } else {
        message.warning('Không tìm thấy địa chỉ');
      }
    } catch (error) {
      message.error('Lỗi khi lấy tọa độ');
      console.error('Error fetching coordinates:', error);
    }
  };

  const onFinish = async (values) => {
    let imageUrl = null;
    if (file) {
      imageUrl = await handleUploadImage();
      if (!imageUrl) return;
    }

    const payload = {
      name: values.name,
      category: values.category,
      description: values.description,
      imageUrl: imageUrl || undefined, // giữ nguyên nếu không đổi
      address: values.address,
      coordinates: {
        lat: parseFloat(values.lat),
        lng: parseFloat(values.lng),
      },
    };

    axios.put(`${API}/restaurants/${id}`, payload)
      .then(() => {
        message.success('Cập nhật nhà hàng thành công!');
      })
      .catch((error) => {
        message.error('Cập nhật thất bại');
        console.error(error);
      });
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <Card title="Chỉnh sửa nhà hàng" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="Tên nhà hàng" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Loại nhà hàng" name="category" rules={[{ required: true }]}>
          <Select placeholder="Chọn loại">
            <Select.Option value="ẩm thực Việt">Ẩm thực Việt</Select.Option>
            <Select.Option value="ẩm thực Âu">Ẩm thực Âu</Select.Option>
            <Select.Option value="ẩm thực Nhật">Ẩm thực Nhật</Select.Option>
            <Select.Option value="cafe & trà">Cafe & Trà</Select.Option>
            <Select.Option value="ăn nhanh">Ăn nhanh</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input.Search
            placeholder="Nhập địa chỉ để lấy tọa độ"
            enterButton="Lấy tọa độ"
            onSearch={fetchCoordinates}
          />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Cập nhật ảnh mới (nếu cần)">
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

        <Form.Item label="Latitude" hidden name="lat" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>

        <Form.Item label="Longitude" hidden name="lng" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>

        <div style={{ height: 300, marginBottom: 16 }}>
          <MapContainer center={[position.lat, position.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapFlyTo position={position} />
            <LocationSelector />
          </MapContainer>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật nhà hàng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AdminRestaurantEdit;
