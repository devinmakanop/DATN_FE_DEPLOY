import React, { useEffect, useState, useCallback } from 'react';
import { Button, Row, Table, Modal, Col, notification, Select } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import { useNavigate } from 'react-router-dom';
import './index.css';
import axiosToken from '../../context/axiosToken';

const { confirm } = Modal;
const { Option } = Select;

function AdminLocations() {
  const API_BASE_URL = process.env.REACT_APP_API_URL_ADMIN;
  const [locationList, setLocationList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const navigate = useNavigate();

  const locationTypes = ['văn hóa', 'lịch sử', 'thiên nhiên', 'giải trí'];

  // Fetch tất cả địa điểm
  const fetchLocationList = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosToken.get(`${API_BASE_URL}/locations`);
      if (Array.isArray(response.data)) {
        setLocationList(response.data);
      } else {
        setFetchError("Dữ liệu không đúng định dạng.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setFetchError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  // Fetch địa điểm theo loại
  const fetchLocationByType = useCallback(async (type) => {
    setIsLoading(true);
    try {
      const response = await axiosToken.get(`${API_BASE_URL}/locations/type/${type}`);
      if (Array.isArray(response.data)) {
        setLocationList(response.data);
      } else {
        setFetchError("Dữ liệu không đúng định dạng.");
      }
    } catch (error) {
      console.error("Fetch by type error:", error);
      setFetchError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchLocationList();
  }, [fetchLocationList]);

  useEffect(() => {
    if (fetchError) {
      notification.error({
        message: 'Lỗi khi tải dữ liệu',
        description: fetchError,
        placement: 'topRight',
      });
    }
  }, [fetchError]);

  const handleTypeChange = (value) => {
    setSelectedType(value);
    if (value) {
      fetchLocationByType(value);
    } else {
      fetchLocationList(); // nếu clear dropdown thì fetch toàn bộ
    }
  };

  const handleViewDetail = (location) => {
    navigate(`/admin/locations/detail/${location._id}`);
  };

  const handleEditLocation = (location) => {
    navigate(`/admin/locations/edit/${location._id}`);
  };

  const handleAddLocation = () => {
    navigate(`/admin/locations/create`);
  };

  const handleDeleteLocation = async (location) => {
    try {
      await axiosToken.delete(`${API_BASE_URL}/locations/${location._id}`);
      setLocationList((prevList) => prevList.filter((item) => item._id !== location._id));

      notification.success({
        message: 'Xóa thành công',
        description: 'Địa điểm đã được xóa khỏi danh sách.',
        placement: 'topRight',
      });
    } catch (error) {
      console.error("Delete error:", error);
      notification.error({
        message: 'Xóa thất bại',
        description: 'Xóa địa điểm thất bại.',
        placement: 'topRight',
      });
      setFetchError(error.message);
    }
  };

  const showDeleteConfirmation = (location) => {
    if (!location || !location._id) {
      console.warn("Không có thông tin địa điểm để xóa");
      return;
    }

    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa địa điểm này?',
      content: `Tên địa điểm: ${location.name}`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      centered: true,
      okButtonProps: {
        style: {
          background: 'linear-gradient(135deg, #6253e1, #04befe)',
          color: '#fff',
        },
      },
      onOk() {
        handleDeleteLocation(location);
      },
      onCancel() {
        console.log('Đã hủy xóa địa điểm');
      },
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('selectedRowKeys:', selectedRowKeys);
      console.log('selectedRows:', selectedRows);
    },
  };

  const tableColumns = [
    {
      title: 'Tên địa điểm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Vị trí',
      key: 'coordinates',
      render: (_, record) => {
        const { lat, lng } = record.coordinates || {};
        const mapsUrl = lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null;
        return mapsUrl ? (
          <Button type="link" onClick={() => window.open(mapsUrl, '_blank')}>
            Xem vị trí
          </Button>
        ) : 'N/A';
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, location) => (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button
            type="primary"
            onClick={() => handleViewDetail(location)}
            style={{ background: 'linear-gradient(135deg, #6253e1, #04befe)' }}
          >
            <b>Chi tiết</b>
          </Button>
          <Button type="primary" className="btn-warn" onClick={() => handleEditLocation(location)}>
            <b>Sửa</b>
          </Button>
          <Button danger onClick={() => showDeleteConfirmation(location)}>
            <b>Xóa</b>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="product">
      <h1>Danh sách địa điểm</h1>
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Button type="primary" onClick={handleAddLocation}>
            Thêm địa điểm
          </Button>
        </Col>
        <Col>
          <Select
            allowClear
            placeholder="Chọn loại địa điểm"
            onChange={handleTypeChange}
            value={selectedType}
            style={{ width: 200 }}
          >
            {locationTypes.map((type) => (
              <Option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      {locationList.length === 0 ? (
        <div>Không có địa điểm để hiển thị.</div>
      ) : (
        <Table
          rowSelection={rowSelection}
          columns={tableColumns}
          dataSource={locationList.map((item) => ({ ...item, key: item._id }))}
        />
      )}
    </div>
  );
}

export default AdminLocations;
