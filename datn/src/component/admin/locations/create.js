import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Select, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
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

const AdminLocationCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [position, setPosition] = useState({ lat: 21.0285, lng: 105.8542 });
  const [file, setFile] = useState(null);
  const API = process.env.REACT_APP_API_URL_ADMIN || 'http://localhost:5000';

  // Upload ảnh lên Cloudinary
  const handleUploadImage = async () => {
    if (!file) return null;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'DATN_preset');  // thay bằng preset của bạn
    data.append('folder', 'DATN/admin');          // folder trên cloudinary

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dw0niuzdf/image/upload', { // thay your_cloud_name
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

  const MapFlyTo = ({ position }) => {
    const map = useMap();
    React.useEffect(() => {
      if (position?.lat && position?.lng) {
        map.flyTo([position.lat, position.lng], 15, { duration: 1.5 });
      }
    }, [position, map]);
    return null;
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
    const imageUrl = await handleUploadImage();

    if (!imageUrl) return;

    const payload = {
      name: values.name,
      type: values.type,
      description: values.description,
      imageUrl: imageUrl,
      address: values.address,
      coordinates: {
        lat: parseFloat(values.lat),
        lng: parseFloat(values.lng),
      },
    };

    axios.post(`${API}/locations`, payload)
      .then(() => {
        message.success('Địa điểm đã được tạo thành công!');
        form.resetFields();
        setFile(null);
        navigate('/admin/locations');
      })
      .catch((error) => {
        message.error('Tạo địa điểm thất bại');
        console.error('Error creating location:', error);
      });
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

        <Form.Item
          label="Tải ảnh"
          required
          tooltip="Ảnh này sẽ được hiển thị trong danh sách địa điểm"
        >
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false; // Ngăn AntD tự upload
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
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
