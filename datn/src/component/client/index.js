import React from 'react';
import { Row, Col } from 'antd';
import { Outlet } from 'react-router-dom';
import SidebarClient from './SidebarClient';

export default function Client() {
    return (

        <>
            <Row>
                <Col>
                    <SidebarClient />
                </Col>
            </Row>
            <Row style={{position: 'relative', top: '140px'}}>
                <Col span={2}>
                </Col>
                <Col span={18}>
                    <Outlet />
                </Col>
            </Row>
        </>
    );
}