import React, { useState, useEffect } from 'react';
import { Button, Menu, Switch, TreeSelect } from 'antd';
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import "./SidebarClient.css";



export default function SidebarClient({ toggleTheme }) {
    const location = useLocation();
    const API = process.env.REACT_APP_API_URL_CLIENT;
    const navigate = useNavigate();

     const menuItems = [
    {
      key: '/',
      label: (
        <Link to="/">
          <span className={`textMenu ${location.pathname === '/' ? 'active' : ''}`}>
            Trang chủ
          </span>
        </Link>
      ),
    },
    {
      key: '/locations',
      label: (
        <Link to="/locations">
          <span className={`textMenu ${location.pathname === '/locations' ? 'active' : ''}`}>
            Địa điểm
          </span>
        </Link>
      ),
    },
    {
      key: '/restaurants',
      label: (
        <Link to="/restaurants">
          <span className={`textMenu ${location.pathname === '/restaurants' ? 'active' : ''}`}>
            Nhà hàng
          </span>
        </Link>
      ),
    },
    {
      key: '/residenceGuides',
      label: (
        <Link to="/residenceGuides">
          <span className={`textMenu ${location.pathname === '/residenceGuides' ? 'active' : ''}`}>
            Tạm trú
          </span>
        </Link>
      ),
    },{
      key: '/travelAgency',
      label: (
        <Link to="/travelAgency">
          <span className={`textMenu ${location.pathname === '/travelAgency' ? 'active' : ''}`}>
            Lữ hành
          </span>
        </Link>
      ),
    },{
      key: '/accommodations',
      label: (
        <Link to="/accommodations">
          <span className={`textMenu ${location.pathname === '/accommodations' ? 'active' : ''}`}>
            Khách sạn
          </span>
        </Link>
      ),
    },
  ];

    return (
        <>
            <div className='header'>
                <div className='header-top'>
                    <img className='logo' src='https://res.cloudinary.com/dw0niuzdf/image/upload/v1728139022/Sale-bear-images/admin/logo/l0u53ogrukfu33smgnlb.jpg' />
                </div>

                <div className={`mt-1 menu-container `}>
                    <div >
                        <Menu
                            mode="horizontal"
                            className="menuClient"
                            items={menuItems}
                        />
                    </div>

                    <Button className='btn-loginClient' onClick={() => navigate("/login")}>
                        Đăng nhập
                    </Button>
                </div>
            </div>
        </>
    );
}