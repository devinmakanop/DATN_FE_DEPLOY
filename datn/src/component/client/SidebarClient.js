import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Avatar, Select } from 'antd';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import "./SidebarClient.css";

const { Option } = Select;

export default function SidebarClient() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('vi');

  const labels = {
    vi: {
      locations: "Địa điểm",
      restaurants: "Nhà hàng",
      residenceGuides: "Tạm trú",
      travelAgency: "Lữ hành",
      accommodations: "Khách sạn",
      login: "Đăng nhập",
      logout: "Đăng xuất",
      user: "Người dùng",
    },
    en: {
      locations: "Locations",
      restaurants: "Restaurants",
      residenceGuides: "Residence",
      travelAgency: "Travel",
      accommodations: "Hotels",
      login: "Login",
      logout: "Logout",
      user: "User",
    },
    ko: {
      locations: "장소",
      restaurants: "음식점",
      residenceGuides: "임시 거주",
      travelAgency: "여행사",
      accommodations: "호텔",
      login: "로그인",
      logout: "로그아웃",
      user: "사용자",
    },
    "zh-CN": {
      locations: "地点",
      restaurants: "餐厅",
      residenceGuides: "暂住",
      travelAgency: "旅行社",
      accommodations: "酒店",
      login: "登录",
      logout: "登出",
      user: "用户",
    },
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedLang = localStorage.getItem("lng");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Lỗi phân tích user từ localStorage:", e);
      }
    }

    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []);

  const handleLanguageChange = (value) => {
    setLanguage(value);
    localStorage.setItem('lng', value);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const userDropdownMenu = (
    <Menu>
      <Menu.Item key="profile" disabled>
        <UserOutlined /> {user?.fullName || labels[language]?.user}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined /> {labels[language]?.logout}
      </Menu.Item>
    </Menu>
  );

  const baseMenuItems = [
    {
      key: '/locations',
      label: (
        <Link to="/locations" className={`textMenu ${location.pathname === '/locations' ? 'active' : ''}`}>
          {labels[language]?.locations}
        </Link>
      ),
    },
    {
      key: '/restaurants',
      label: (
        <Link to="/restaurants" className={`textMenu ${location.pathname === '/restaurants' ? 'active' : ''}`}>
          {labels[language]?.restaurants}
        </Link>
      ),
    },
    {
      key: '/residenceGuides',
      label: (
        <Link to="/residenceGuides" className={`textMenu ${location.pathname === '/residenceGuides' ? 'active' : ''}`}>
          {labels[language]?.residenceGuides}
        </Link>
      ),
    },
    {
      key: '/travelAgency',
      label: (
        <Link to="/travelAgency" className={`textMenu ${location.pathname === '/travelAgency' ? 'active' : ''}`}>
          {labels[language]?.travelAgency}
        </Link>
      ),
    },
    {
      key: '/accommodations',
      label: (
        <Link to="/accommodations" className={`textMenu ${location.pathname === '/accommodations' ? 'active' : ''}`}>
          {labels[language]?.accommodations}
        </Link>
      ),
    },
  ];

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
            style={{ cursor: 'pointer', color: '#1890ff' }}
            onClick={() => navigate("/login")}
          >
            {labels[language]?.login}
          </span>
        ),
      };

  return (
    <div className='header'>
      <div className='header-top' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img
          className='logo'
          src='https://res.cloudinary.com/dw0niuzdf/image/upload/v1748773269/DATN/admin/nxq2p3zjp84izlsvyiru.jpg'
          alt="Logo"
        />
        {/* Select ngôn ngữ */}
        <div className='language-select-wrapper'>
          <Select
            value={language}
            onChange={handleLanguageChange}
            style={{ width: 120 , zIndex:  99999999999}}
          >
            <Option value="vi">Tiếng Việt</Option>
            <Option value="ko">한국어</Option>
            <Option value="en">English</Option>
            <Option value="zh-CN">中文</Option>
          </Select>
        </div>
      </div>

      <div className="mt-1 menu-container">
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
