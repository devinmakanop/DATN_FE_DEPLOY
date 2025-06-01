import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
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

const AddTravelAgency = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [position, setPosition] = useState({ lat: 21.0285, lng: 105.8542 }); // Hà Nội làm mặc định
  const [file, setFile] = useState(null);
  const API = process.env.REACT_APP_API_URL_ADMIN || 'http://localhost:5000';

  // Upload ảnh lên Cloudinary
  const handleUploadImage = async () => {
    if (!file) return null;

    const data = new FormData();
     data.append('file', file);
    data.append('upload_preset', 'DATN_preset');  // Thay bằng preset Cloudinary của bạn
    data.append('folder', 'DATN/admin/restaurants'); // Thư mục trên Cloudinary (tuỳ chỉnh)

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dw0niuzdf/image/upload', { // Thay YOUR_CLOUD_NAME
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (result.secure_url) {
        return result.secure_url;
      } else {
        message.error('Upload ảnh thất bại');
        return null;
      }
    } catch (err) {
      console.error('Upload failed:', err);
      message.error('Upload ảnh thất bại');
      return null;
    }
  };

  // Map flyTo khi tọa độ thay đổi
  const MapFlyTo = ({ position }) => {
    const map = useMap();
    React.useEffect(() => {
      if (position?.lat && position?.lng) {
        map.flyTo([position.lat, position.lng], 15, { duration: 1.5 });
      }
    }, [position, map]);
    return null;
  };

  // Lấy tọa độ từ địa chỉ nhập
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

  // Bấm vào map chọn vị trí
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

  // Submit form
  const onFinish = async (values) => {
  const imageUrl = await handleUploadImage();
  if (!imageUrl) return;

  const payload = {
    name: values.name,
    address: values.address,
    phone: values.phone || '',
    email: values.email || '',
    website: values.website || '',
    description: values.description || '',
    services: values.services ? values.services.split(',').map(s => s.trim()) : [],
    imageUrl: imageUrl,  // đổi thành trường imageUrl
    location: {
      type: 'Point',
      coordinates: [parseFloat(values.lng), parseFloat(values.lat)],
    },
    coordinates: {
      lat: parseFloat(values.lat),
      lng: parseFloat(values.lng),
    },
  };

  try {
    await axios.post(`${API}/travelAgency`, payload);
    message.success('Thêm công ty du lịch thành công');
    form.resetFields();
    setFile(null);
    setPosition({ lat: 21.0285, lng: 105.8542 }); // reset về Hà Nội
  } catch (error) {
    console.error('Error creating travel agency:', error);
    message.error('Thêm thất bại');
  }
};

  return (
    <Card title="Thêm công ty du lịch mới" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{
          name: '',
          address: '',
          phone: '',
          email: '',
          website: '',
          description: '',
          services: '',
          lat: position.lat,
          lng: position.lng,
        }}
      >
        <Form.Item
          label="Tên công ty"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input.Search
            placeholder="Nhập địa chỉ để lấy tọa độ"
            enterButton="Lấy tọa độ"
            onSearch={fetchCoordinates}
          />
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

        <Form.Item
          label="Tải ảnh đại diện"
          required
          tooltip="Ảnh này sẽ được hiển thị trong danh sách công ty du lịch"
        >
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false; // ngăn AntD tự upload
            }}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        {/* Trường latitude, longitude ẩn */}
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
            Thêm công ty du lịch
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddTravelAgency;
