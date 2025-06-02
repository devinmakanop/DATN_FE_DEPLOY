import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Select, Upload } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { UploadOutlined } from '@ant-design/icons';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AdminLocationUpdate = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [position, setPosition] = useState({ lat: 21.0285, lng: 105.8542 });
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const API = process.env.REACT_APP_API_URL_ADMIN || 'http://localhost:5000';

  useEffect(() => {
    axios.get(`${API}/locations/${id}`)
      .then(res => {
        const data = res.data;
        form.setFieldsValue({
          name: data.name,
          type: data.type,
          description: data.description,
          address: data.address,
          lat: data.coordinates?.lat,
          lng: data.coordinates?.lng,
        });
        setPosition({
          lat: data.coordinates?.lat,
          lng: data.coordinates?.lng,
        });
        setImageUrl(data.imageUrl);
      })
      .catch(() => {
        message.error('Không thể tải dữ liệu địa điểm');
      });
  }, [id, API, form]);

  const handleUploadImage = async () => {
    if (!file) return imageUrl;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'DATN_preset');
    data.append('folder', 'DATN/admin');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dw0niuzdf/image/upload', {
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
      console.error(err);
      message.error('Upload ảnh thất bại');
      return null;
    }
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
    }
  };

  const onFinish = async (values) => {
    const uploadedImage = await handleUploadImage();
    if (!uploadedImage) return;

    const payload = {
      name: values.name,
      type: values.type,
      description: values.description,
      imageUrl: uploadedImage,
      address: values.address,
      coordinates: {
        lat: parseFloat(values.lat),
        lng: parseFloat(values.lng),
      },
    };

    axios.put(`${API}/locations/${id}`, payload)
      .then(() => {
        message.success('Cập nhật địa điểm thành công!');
        navigate('/admin/locations');
      })
      .catch(() => {
        message.error('Cập nhật địa điểm thất bại');
      });
  };

  const MapFlyTo = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (position?.lat && position?.lng) {
        map.flyTo([position.lat, position.lng], 15, { duration: 1.5 });
      }
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

  return (
    <Card title="Cập nhật địa điểm" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Tên địa điểm" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Loại địa điểm" name="type" rules={[{ required: true }]}>
          <Select style={{ width: 200 }}>
            <Select.Option value="văn hóa">Văn hóa</Select.Option>
            <Select.Option value="lịch sử">Lịch sử</Select.Option>
            <Select.Option value="thiên nhiên">Thiên nhiên</Select.Option>
            <Select.Option value="giải trí">Giải trí</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input.Search enterButton="Lấy tọa độ" onSearch={fetchCoordinates} />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Tải ảnh (nếu muốn thay)">
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
          </Upload>
          {imageUrl && (
            <div style={{ marginTop: 10 }}>
              <img src={imageUrl} alt="Preview" width={200} />
            </div>
          )}
        </Form.Item>

        <Form.Item name="lat" hidden rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lng" hidden rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <div style={{ height: 300, marginBottom: 16 }}>
          <MapContainer center={[position.lat, position.lng]} zoom={15} style={{ height: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapFlyTo position={position} />
            <LocationSelector />
          </MapContainer>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật địa điểm
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AdminLocationUpdate;
