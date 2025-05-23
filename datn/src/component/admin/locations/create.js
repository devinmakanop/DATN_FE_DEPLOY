import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosToken from '../../context/axiosToken';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix lỗi icon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AdminLocationCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [position, setPosition] = useState({ lat: 21.0285, lng: 105.8542 }); // Mặc định Hà Nội
  const API = process.env.REACT_APP_API_URL_ADMIN || 'http://localhost:5000';

  // Component để điều khiển fly map
  const MapFlyTo = ({ position }) => {
    const map = useMap();
    React.useEffect(() => {
      if (position?.lat && position?.lng) {
        map.flyTo([position.lat, position.lng], 15, { duration: 1.5 });
      }
    }, [position, map]);
    return null;
  };

  // Geocode địa chỉ
  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: address, format: 'json' },
      });

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const newPosition = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setPosition(newPosition);
        form.setFieldsValue(newPosition);
        message.success('Tọa độ đã được cập nhật!');
      } else {
        message.warning('Không tìm thấy địa chỉ');
      }
    } catch (error) {
      message.error('Lỗi khi lấy tọa độ');
      console.error('Error fetching coordinates:', error);
    }
  };

  // Submit form
  const onFinish = (values) => {
    const payload = {
      name: values.name,
      type: values.type,
      description: values.description,
      imageUrl: values.imageUrl,
      address: values.address,
      coordinates: {
        lat: parseFloat(values.lat),
        lng: parseFloat(values.lng),
      },
    };

    axiosToken
      .post(`${API}/locations`, payload)
      .then(() => {
        message.success('Địa điểm đã được tạo thành công!');
        form.resetFields();
        navigate('/admin/locations');
      })
      .catch((error) => {
        message.error('Tạo địa điểm thất bại');
        console.error('Error creating location:', error);
      });
  };

  // Bắt sự kiện click trên bản đồ
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

  return (
    <Card title="Thêm địa điểm mới" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{
          name: '',
          type: '',
          address: '',
          description: '',
          lat: position.lat,
          lng: position.lng,
        }}
      >
        <Form.Item
          label="Tên địa điểm"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên địa điểm' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Loại địa điểm"
          name="type"
          rules={[{ required: true, message: 'Vui lòng chọn loại địa điểm' }]}
          style={{ marginBottom: 8 }}
        >
          <Select placeholder="Chọn loại" style={{ width: 200 }}>
            <Select.Option value="văn hóa">Văn hóa</Select.Option>
            <Select.Option value="lịch sử">Lịch sử</Select.Option>
            <Select.Option value="thiên nhiên">Thiên nhiên</Select.Option>
            <Select.Option value="giải trí">Giải trí</Select.Option>
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

        <Form.Item label="Latitude" hidden name="lat" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>

        <Form.Item label="Longitude" hidden name="lng" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>

        <div style={{ height: 300, marginBottom: 16 }}>
          <MapContainer
            center={[position.lat, position.lng]}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapFlyTo position={position} />
            <LocationSelector />
          </MapContainer>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm địa điểm
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AdminLocationCreate;
