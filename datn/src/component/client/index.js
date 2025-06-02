import React from 'react';
import { Row, Col } from 'antd';
import { Outlet } from 'react-router-dom';
import SidebarClient from './SidebarClient';
import ChatWidget from './AI/index';

export default function Client() {
  const backgroundStyle = {
    backgroundImage: 'url(https://yenvan.edu.vn/wp-content/uploads/2023/10/Ha-Noi.jpg)', // Ảnh nền
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    width: '100vw',
    minHeight: '100vh', // Chiều cao toàn màn hình
    paddingTop: '140px',
  };

  return (
    <div style={backgroundStyle}>
      <Row>
        <Col>
          <SidebarClient />
        </Col>
      </Row>
      <Row>
        <Col span={2}></Col>
        <Col span={18}>
          <Outlet />
        </Col>
      </Row>
      <ChatWidget />
    </div>
  );
}
