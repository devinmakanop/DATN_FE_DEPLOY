import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  InsertRowAboveOutlined,
  InsertRowBelowOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './SideBarAdmin.css';

const { Sider } = Layout;

export default function SidebarAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

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
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={220}
      style={{
        height: '100vh',
        background: '#001529',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header / Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: '16px',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '16px'
      }}>
        {!collapsed && <span>Admin Panel</span>}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: '#fff' }}
        />
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{
          flex: 1,
          background: '#001529',
          color: '#fff'
        }}
        items={items}
        theme="dark"
      />

      {/* Logout Button */}
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <Button
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          type="primary"
          style={{ width: '100%' }}
        >
          {!collapsed && 'Đăng xuất'}
        </Button>
      </div>
    </Sider>
  );
}
