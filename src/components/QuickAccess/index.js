import React from 'react';
import { Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  TransactionOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  WalletOutlined,
  FileTextOutlined,
  TeamOutlined,
  BellOutlined,
  RobotOutlined,
  SettingOutlined
} from '@ant-design/icons';
import './styles.css';

const QuickAccess = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Dashboard',
      icon: <DashboardOutlined />,
      path: '/dashboard',
      color: '#1890ff'
    },
    {
      title: 'Transactions',
      icon: <TransactionOutlined />,
      path: '/transactions',
      color: '#52c41a'
    },
    {
      title: 'Add Income',
      icon: <PlusCircleOutlined />,
      path: '/add-income',
      color: '#722ed1'
    },
    {
      title: 'Add Expense',
      icon: <MinusCircleOutlined />,
      path: '/add-expense',
      color: '#eb2f96'
    },
    {
      title: 'Budget',
      icon: <WalletOutlined />,
      path: '/budget',
      color: '#fa8c16'
    },
    {
      title: 'Reports',
      icon: <FileTextOutlined />,
      path: '/reports',
      color: '#13c2c2'
    },
    {
      title: 'Shared Expenses',
      icon: <TeamOutlined />,
      path: '/shared-expenses',
      color: '#2f54eb'
    },
    {
      title: 'Notifications',
      icon: <BellOutlined />,
      path: '/notifications',
      color: '#faad14'
    },
    {
      title: 'Jiya AI',
      icon: <RobotOutlined />,
      path: '/jiya-ai',
      color: '#a0d911'
    },
    {
      title: 'Settings',
      icon: <SettingOutlined />,
      path: '/settings',
      color: '#f5222d'
    }
  ];

  return (
    <div className="quick-access-container">
      <h2 className="quick-access-title">Quick Access</h2>
      <Row gutter={[16, 16]}>
        {sections.map((section) => (
          <Col xs={24} sm={12} md={8} lg={6} key={section.path}>
            <Card
              className="quick-access-card"
              onClick={() => navigate(section.path)}
              hoverable
            >
              <div className="quick-access-icon" style={{ color: section.color }}>
                {section.icon}
              </div>
              <h3 className="quick-access-card-title">{section.title}</h3>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default QuickAccess; 