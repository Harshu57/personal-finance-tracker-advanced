import React from 'react';
import { Card, Progress, Row, Col, Typography, List, Tooltip, Button, Tag } from 'antd';
import {
  SafetyCertificateOutlined,
  DollarCircleOutlined,
  PieChartOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import './FinancialHealth.css';

const { Title, Text, Paragraph } = Typography;

const FinancialHealth = ({ 
  income = 5000,
  expenses = 3000,
  savings = 1000,
  debt = 10000,
  investments = 15000,
  emergencyFund = 6000,
  goals = [
    {
      id: 1,
      title: "Emergency Fund",
      target: 18000,
      current: 6000,
      deadline: "2024-12-31",
      category: "Savings",
      priority: "High"
    },
    {
      id: 2,
      title: "Down Payment",
      target: 50000,
      current: 15000,
      deadline: "2025-06-30",
      category: "Investment",
      priority: "Medium"
    },
    {
      id: 3,
      title: "Debt Repayment",
      target: 10000,
      current: 4000,
      deadline: "2024-09-30",
      category: "Debt",
      priority: "High"
    }
  ]
}) => {
  // Calculate financial health metrics
  const calculateHealthScore = () => {
    let score = 0;
    
    // Savings ratio (savings/income) - up to 25 points
    const savingsRatio = (savings / income) * 100;
    score += Math.min(savingsRatio * 1.25, 25);
    
    // Debt-to-income ratio - up to 25 points
    const debtRatio = (debt / (income * 12)) * 100;
    score += Math.min((100 - debtRatio) / 4, 25);
    
    // Emergency fund coverage - up to 25 points
    const monthsCovered = emergencyFund / expenses;
    score += Math.min(monthsCovered * 4.17, 25);
    
    // Investment ratio - up to 25 points
    const investmentRatio = (investments / (income * 12)) * 100;
    score += Math.min(investmentRatio, 25);
    
    return Math.round(score);
  };

  const healthScore = calculateHealthScore();

  const getScoreColor = (score) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#1890ff';
    if (score >= 40) return '#faad14';
    return '#f5222d';
  };

  const recommendations = [
    {
      title: 'Emergency Fund',
      status: emergencyFund >= expenses * 6,
      message: emergencyFund >= expenses * 6 
        ? 'Great job! You have adequate emergency savings.'
        : 'Aim to save 6 months of expenses in your emergency fund.',
    },
    {
      title: 'Savings Rate',
      status: (savings / income) >= 0.2,
      message: (savings / income) >= 0.2
        ? 'Excellent savings rate!'
        : 'Try to save at least 20% of your monthly income.',
    },
    {
      title: 'Debt Management',
      status: (debt / (income * 12)) <= 0.36,
      message: (debt / (income * 12)) <= 0.36
        ? 'Your debt level is manageable.'
        : 'Work on reducing your debt-to-income ratio.',
    },
    {
      title: 'Investment Growth',
      status: investments > 0,
      message: investments > 0
        ? 'Keep growing your investment portfolio!'
        : 'Consider starting an investment portfolio.',
    },
  ];

  const getGoalProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getGoalStatus = (current, target, deadline) => {
    const progress = (current / target) * 100;
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (progress >= 100) return { color: '#52c41a', text: 'Completed' };
    if (daysLeft < 30) return { color: '#f5222d', text: 'Urgent' };
    if (progress < 25) return { color: '#faad14', text: 'Just Started' };
    return { color: '#1890ff', text: 'In Progress' };
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#f5222d';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#1890ff';
    }
  };

  return (
    <div className="financial-health-container">
      <Title level={2}>
        <SafetyCertificateOutlined /> Financial Health Dashboard
      </Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card className="health-score-card">
            <Title level={3}>Financial Health Score</Title>
            <Progress
              type="circle"
              percent={healthScore}
              strokeColor={getScoreColor(healthScore)}
              strokeWidth={10}
              format={(percent) => (
                <div className="score-label">
                  <span className="score-number">{percent}</span>
                  <span className="score-text">points</span>
                </div>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={16}>
          <Card className="metrics-card">
            <Title level={3}>Key Metrics</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Tooltip title="Monthly savings as percentage of income">
                  <Card className="metric-item">
                    <DollarCircleOutlined className="metric-icon" />
                    <Text>Savings Rate</Text>
                    <Title level={4}>{((savings / income) * 100).toFixed(1)}%</Title>
                  </Card>
                </Tooltip>
              </Col>
              <Col span={12}>
                <Tooltip title="Debt as percentage of annual income">
                  <Card className="metric-item">
                    <AlertOutlined className="metric-icon" />
                    <Text>Debt Ratio</Text>
                    <Title level={4}>{((debt / (income * 12)) * 100).toFixed(1)}%</Title>
                  </Card>
                </Tooltip>
              </Col>
              <Col span={12}>
                <Tooltip title="Months of expenses covered by emergency fund">
                  <Card className="metric-item">
                    <SafetyCertificateOutlined className="metric-icon" />
                    <Text>Emergency Fund</Text>
                    <Title level={4}>{(emergencyFund / expenses).toFixed(1)} months</Title>
                  </Card>
                </Tooltip>
              </Col>
              <Col span={12}>
                <Tooltip title="Investment portfolio value">
                  <Card className="metric-item">
                    <PieChartOutlined className="metric-icon" />
                    <Text>Investments</Text>
                    <Title level={4}>${investments.toLocaleString()}</Title>
                  </Card>
                </Tooltip>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card className="goals-card">
        <div className="goals-header">
          <Title level={3}><TrophyOutlined /> Financial Goals Progress</Title>
          <Button type="primary" icon={<PlusOutlined />}>Add Goal</Button>
        </div>
        <Row gutter={[16, 16]} className="goals-grid">
          {goals.map(goal => (
            <Col xs={24} sm={12} lg={8} key={goal.id}>
              <Card 
                className="goal-card"
                title={
                  <div className="goal-card-header">
                    <Text strong>{goal.title}</Text>
                    <Tag color={getPriorityColor(goal.priority)}>{goal.priority}</Tag>
                  </div>
                }
              >
                <Progress
                  percent={getGoalProgress(goal.current, goal.target)}
                  strokeColor={getGoalStatus(goal.current, goal.target, goal.deadline).color}
                  strokeWidth={8}
                />
                <div className="goal-details">
                  <div className="goal-amount">
                    <Text type="secondary">Progress</Text>
                    <Text strong>${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</Text>
                  </div>
                  <div className="goal-deadline">
                    <Text type="secondary">Deadline</Text>
                    <Text strong>{new Date(goal.deadline).toLocaleDateString()}</Text>
                  </div>
                  <Tag color={getGoalStatus(goal.current, goal.target, goal.deadline).color}>
                    {getGoalStatus(goal.current, goal.target, goal.deadline).text}
                  </Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card className="recommendations-card">
        <Title level={3}>Recommendations</Title>
        <List
          dataSource={recommendations}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  item.status ? 
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '24px' }} /> :
                    <AlertOutlined style={{ color: '#faad14', fontSize: '24px' }} />
                }
                title={item.title}
                description={item.message}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default FinancialHealth; 