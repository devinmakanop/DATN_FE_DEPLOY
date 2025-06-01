import React from 'react';
import { Row, Col } from 'antd';
import { Outlet } from 'react-router-dom';
import SidebarClient from './SidebarClient';
import ChatWidget from './AI/index'; 

export default function Client() {
  return (
    <>
      <Row>
        <Col>
          <SidebarClient />
        </Col>
      </Row>
      <Row style={{ position: 'relative', top: '140px' }}>
        <Col span={2}></Col>
        <Col span={18}>
          <div
            style={{
              background: 'linear-gradient(135deg,rgb(121, 163, 241) 0%,rgb(40, 99, 202) 100%)', // gradient xanh nước biển
              padding: '24px',
              borderRadius: '12px',
              width: "82vw",
              minHeight: '80vh',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              color: 'white', // chữ trắng cho tương phản tốt trên nền xanh
            }}
          >
            <Outlet />
          </div>
        </Col>
      </Row>
      <ChatWidget />
    </>
  );
}
