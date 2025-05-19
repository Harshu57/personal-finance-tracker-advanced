import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, List, Avatar, Typography, Spin, Tag } from 'antd';
import {
  RobotOutlined,
  SendOutlined,
  UserOutlined,
  LoadingOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import './FinancialAssistant.css';

const { Text, Paragraph } = Typography;

const FinancialAssistant = ({ userData }) => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hello! I'm your personal financial assistant. I can help you with budgeting, investments, and financial planning. What would you like to know?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulated AI responses based on financial context
  const generateResponse = async (userInput) => {
    setIsTyping(true);
    
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userInputLower = userInput.toLowerCase();
    let response = '';

    // Context-aware responses
    if (userInputLower.includes('budget') || userInputLower.includes('spending')) {
      response = `Based on your recent spending patterns, I notice that:
      
1. Your highest expense category is Housing (35%)
2. You've been under budget in Entertainment
3. There's potential to save an additional $200/month

Would you like specific recommendations for reducing expenses?`;
    }
    else if (userInputLower.includes('invest') || userInputLower.includes('stock')) {
      response = `Here's my analysis of your investment situation:

1. Current Portfolio: $15,000
2. Asset Allocation: 60% Stocks, 30% Bonds, 10% Cash
3. Risk Profile: Moderate

Consider:
- Diversifying into index funds
- Increasing emergency fund
- Reviewing retirement contributions

Would you like more detailed investment advice?`;
    }
    else if (userInputLower.includes('save') || userInputLower.includes('saving')) {
      response = `I've analyzed your savings potential:

1. Current savings rate: 20% of income
2. Emergency fund: 2 months of expenses
3. Recommended actions:
   - Automate monthly savings
   - Increase emergency fund to 6 months
   - Consider high-yield savings account

Shall we create a savings plan together?`;
    }
    else if (userInputLower.includes('debt') || userInputLower.includes('loan')) {
      response = `Let me help you with debt management:

1. Current Debt: $10,000
2. Average Interest Rate: 15%
3. Recommended Strategy:
   - Prioritize high-interest debt
   - Consider debt consolidation
   - Set up automatic payments

Would you like a detailed debt repayment plan?`;
    }
    else if (userInputLower.includes('goal') || userInputLower.includes('target')) {
      response = `I see your financial goals:

1. Emergency Fund: 33% complete
2. House Down Payment: 30% complete
3. Debt Repayment: 40% complete

Based on your current pace:
- Emergency fund target: Achievable in 8 months
- House down payment: On track for 2025
- Debt-free status: Possible by end of year

Would you like to adjust these goals or create new ones?`;
    }
    else {
      response = `I'd be happy to help you with that. To provide the most relevant advice, could you specify if you're interested in:

1. Budgeting and Expense Tracking
2. Investment Strategies
3. Savings Goals
4. Debt Management
5. Financial Planning

What area would you like to focus on?`;
    }

    setMessages(prev => [...prev, {
      type: 'bot',
      content: response,
      timestamp: new Date()
    }]);
    setIsTyping(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      content: input,
      timestamp: new Date()
    }]);

    // Generate bot response
    generateResponse(input);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="financial-assistant-container">
      <Card 
        title={
          <div className="assistant-header">
            <RobotOutlined className="assistant-icon" />
            <span>Financial AI Assistant</span>
            <Tag color="blue">Powered by AI</Tag>
          </div>
        }
        className="chat-card"
      >
        <div className="messages-container">
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={message => (
              <List.Item className={`message-item ${message.type}`}>
                <List.Item.Meta
                  avatar={
                    message.type === 'bot' ? 
                      <Avatar icon={<RobotOutlined />} className="bot-avatar" /> :
                      <Avatar icon={<UserOutlined />} className="user-avatar" />
                  }
                  content={
                    <div className="message-content">
                      <Paragraph className="message-text">
                        {message.content}
                      </Paragraph>
                      <Text type="secondary" className="message-time">
                        {message.timestamp.toLocaleTimeString()}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          {isTyping && (
            <div className="typing-indicator">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              <Text type="secondary">AI is thinking...</Text>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="input-container">
          <Input.TextArea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your finances..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="chat-input"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            className="send-button"
          >
            Send
          </Button>
        </div>

        <div className="assistant-footer">
          <BulbOutlined /> Tip: Try asking about budgeting, investments, or savings goals
        </div>
      </Card>
    </div>
  );
};

export default FinancialAssistant; 