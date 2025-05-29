import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Avatar } from 'antd';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import "./SidebarClient.css";

export default function SidebarClient() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Lỗi phân tích user từ localStorage:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const userDropdownMenu = (
    <Menu>
      <Menu.Item key="profile" disabled>
        <UserOutlined /> {user?.fullName || "Người dùng"}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined /> Đăng xuất
      </Menu.Item>
    </Menu>
  );

  // Menu chính
  const baseMenuItems = [
    {
      key: '/locations',
      label: (
        <Link to="/locations" className={`textMenu ${location.pathname === '/locations' ? 'active' : ''}`}>
          Địa điểm
        </Link>
      ),
    },
    {
      key: '/restaurants',
      label: (
        <Link to="/restaurants" className={`textMenu ${location.pathname === '/restaurants' ? 'active' : ''}`}>
          Nhà hàng
        </Link>
      ),
    },
    {
      key: '/residenceGuides',
      label: (
        <Link to="/residenceGuides" className={`textMenu ${location.pathname === '/residenceGuides' ? 'active' : ''}`}>
          Tạm trú
        </Link>
      ),
    },
    {
      key: '/travelAgency',
      label: (
        <Link to="/travelAgency" className={`textMenu ${location.pathname === '/travelAgency' ? 'active' : ''}`}>
          Lữ hành
        </Link>
      ),
    },
    {
      key: '/accommodations',
      label: (
        <Link to="/accommodations" className={`textMenu ${location.pathname === '/accommodations' ? 'active' : ''}`}>
          Khách sạn
        </Link>
      ),
    },
  ];

  // Thêm item user hoặc đăng nhập
  const userMenuItem = user
    ? {
        key: 'user',
        label: (
          <Dropdown overlay={userDropdownMenu} className='infor-user' placement="bottomRight" arrow>
            <span style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
              <Avatar style={{ backgroundColor: '#87d068', marginRight: 8 }} icon={<UserOutlined />} />
            </span>
          </Dropdown>
        ),
      }
    : {
        key: 'login',
        label: (
          <span
            className="btn-loginClient"
            style={{ cursor: 'pointer', color: '#1890ff'}}
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </span>
        ),
      };

  return (
    <div className='header'>
      <div className='header-top'>
        <img
          className='logo'
          src='https://res.cloudinary.com/dw0niuzdf/image/upload/v1728139022/Sale-bear-images/admin/logo/l0u53ogrukfu33smgnlb.jpg'
          alt="Logo"
        />
      </div>

      <div className={`mt-1 menu-container`}>
        <Menu
          mode="horizontal"
          className="menuClient"
          items={[...baseMenuItems, userMenuItem]}
          selectable={false}
        />
      </div>
    </div>
  );
}
