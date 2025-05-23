import React from 'react';
import { Menu } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  UnorderedListOutlined,
  InsertRowBelowOutlined,
  InsertRowAboveOutlined
} from "@ant-design/icons";

export default function SidebarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      label: <Link to="/admin/locations">Địa điểm</Link>,
      icon: <InsertRowAboveOutlined />,
      key: "/admin/locations",
    },
    {
      label: <Link to="/admin/residenceGuide">Tư vấn tạm trú</Link>,
      icon: <InsertRowBelowOutlined />,
      key: "/admin/residenceGuide",
    },
    {
      label: <Link to="/admin/restaurant">Nhà hàng</Link>,
      icon: <InsertRowAboveOutlined />,
      key: "/admin/restaurant",
    },
    {
      label: <Link to="/admin/travelAgency">Công ty lữ hành</Link>,
      icon: <InsertRowAboveOutlined />,
      key: "/admin/travelAgency",
    },
    {
      label: <Link to="/admin/accommodations">Khách sạn</Link>,
      icon: <InsertRowAboveOutlined />,
      key: "/admin/accommodations",
    },
  ];

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={[location.pathname]}
      defaultOpenKeys={['lichhen']}
      style={{ height: '100%', borderRight: 0 }}
      items={items}
    />
  );
}
