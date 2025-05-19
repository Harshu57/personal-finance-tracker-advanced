import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Typography, Avatar, Tooltip, Popover, Space } from 'antd';
import { SendOutlined, CloseOutlined, QuestionCircleOutlined, BulbOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { financeKnowledge, getAdvice, detectSubcategory } from './financeKnowledge';
import jiyaAvatar from '../../assets/bot/jiya-avatar.svg';
import './styles.css';

const { Text, Title } = Typography;

const welcomeMessages = [
  "Hi there! I'm Jiya, your friendly finance sidekick. How can I help you make money moves today? 💸",
  "Hello! Jiya here, your personal finance cheerleader. Ask me anything about money, goals, or this app! 🌟",
  "Hey! I'm Jiya, your smart money mentor. Ready to take charge of your finances? Let's chat! 😊",
  "Welcome! Jiya at your service. Need budgeting tips, investment ideas, or app help? Just ask! 🤗"
];

const dailyTips = [
  "Automate your savings to make building wealth effortless! 💰",
  "Review your subscriptions—cancel what you don't use! 🧾",
  "Try a no-spend weekend challenge! 🚫🛒",
  "Set a small, achievable savings goal for this week. You got this! 🎯",
  "Track every expense for a week—you'll be surprised where your money goes! 👀",
  "Invest early, even if it's a small amount. Time is your best friend! ⏳",
  "Review your budget monthly and adjust as needed. Flexibility is key! 🔄"
];

const financialChallenges = [
  "No Spend Week: Challenge yourself to spend only on essentials for 7 days!",
  "Cash-Only Challenge: Use only cash for all purchases this week.",
  "Meal Prep Challenge: Prepare all your meals at home for 5 days.",
  "Round-Up Savings: Every time you spend, round up and save the difference.",
  "Unsubscribe & Save: Cancel one unused subscription and put that money into savings."
];

const quickReplies = [
  "How do I use the Nightingale chart?",
  "Give me a budgeting tip",
  "How can I save more?",
  "Suggest an investment strategy",
  "What's a good way to pay off debt?",
  "Show me a daily tip"
];

function parseEmojis(text) {
  // Simple emoji parsing for common codes
  return text
    .replace(/:smile:/g, '😄')
    .replace(/:moneybag:/g, '💰')
    .replace(/:bulb:/g, '💡')
    .replace(/:fire:/g, '🔥')
    .replace(/:star:/g, '⭐')
    .replace(/:rocket:/g, '🚀');
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const processUserInput = (input) => {
    const lowercaseInput = input.toLowerCase();
    
    // Match user input to topics and provide specific advice
    
    // Check for app usage questions
    if (lowercaseInput.includes('how to use') || 
        lowercaseInput.includes('app') || 
        lowercaseInput.includes('dashboard') ||
        lowercaseInput.includes('transaction') ||
        lowercaseInput.includes('add income') || 
        lowercaseInput.includes('add expense') ||
        lowercaseInput.includes('help with app') ||
        lowercaseInput.includes('how do i')) {
      const subcategory = detectSubcategory('appHelp', lowercaseInput);
      return { 
        type: 'appHelp', 
        response: getAdvice('appHelp', subcategory)
      };
    }
    
    // Check for budgeting questions
    if (lowercaseInput.includes('budget') || 
        lowercaseInput.includes('spending') || 
        lowercaseInput.includes('track expenses') ||
        lowercaseInput.includes('50/30/20') ||
        lowercaseInput.includes('envelope')) {
      const subcategory = detectSubcategory('budgeting', lowercaseInput);
      return { 
        type: 'budgeting', 
        response: getAdvice('budgeting', subcategory)
      };
    }
    
    // Check for saving questions
    if (lowercaseInput.includes('save') || 
        lowercaseInput.includes('saving') || 
        lowercaseInput.includes('emergency fund') ||
        lowercaseInput.includes('savings account')) {
      const subcategory = detectSubcategory('saving', lowercaseInput);
      return { 
        type: 'saving',
        response: getAdvice('saving', subcategory)
      };
    }
    
    // Check for investing questions
    if (lowercaseInput.includes('invest') || 
        lowercaseInput.includes('stock') || 
        lowercaseInput.includes('mutual fund') ||
        lowercaseInput.includes('etf') ||
        lowercaseInput.includes('portfolio') ||
        lowercaseInput.includes('return')) {
      const subcategory = detectSubcategory('investing', lowercaseInput);
      return { 
        type: 'investing', 
        response: getAdvice('investing', subcategory)
      };
    }
    
    // Check for debt questions
    if (lowercaseInput.includes('debt') || 
        lowercaseInput.includes('loan') || 
        lowercaseInput.includes('credit card') ||
        lowercaseInput.includes('mortgage') ||
        lowercaseInput.includes('interest')) {
      const subcategory = detectSubcategory('debt', lowercaseInput);
      return { 
        type: 'debt', 
        response: getAdvice('debt', subcategory)
      };
    }
    
    // Check for tax questions
    if (lowercaseInput.includes('tax') || 
        lowercaseInput.includes('deduction') || 
        lowercaseInput.includes('irs') ||
        lowercaseInput.includes('filing')) {
      const subcategory = detectSubcategory('taxes', lowercaseInput);
      return { 
        type: 'taxes', 
        response: getAdvice('taxes', subcategory)
      };
    }
    
    // Check for retirement questions
    if (lowercaseInput.includes('retire') || 
        lowercaseInput.includes('401k') || 
        lowercaseInput.includes('ira') ||
        lowercaseInput.includes('pension') ||
        lowercaseInput.includes('retirement')) {
      const subcategory = detectSubcategory('retirement', lowercaseInput);
      return { 
        type: 'retirement', 
        response: getAdvice('retirement', subcategory)
      };
    }

    // Try to identify general financial topics using keywords
    const financialKeywords = [
      {topic: 'budgeting', keywords: ['money', 'expense', 'spend', 'plan', 'allocate', 'track']},
      {topic: 'saving', keywords: ['save', 'emergency', 'fund', 'goal']},
      {topic: 'investing', keywords: ['growth', 'market', 'return', 'portfolio', 'risk']},
      {topic: 'debt', keywords: ['owe', 'payment', 'interest', 'pay off', 'credit']},
      {topic: 'taxes', keywords: ['write off', 'refund', 'file', 'deduct']},
      {topic: 'retirement', keywords: ['future', 'pension', 'social security', 'withdraw']}
    ];

    for (const topic of financialKeywords) {
      if (topic.keywords.some(keyword => lowercaseInput.includes(keyword))) {
        return {
          type: topic.topic,
          response: getAdvice(topic.topic)
        };
      }
    }
    
    // Default response if no specific topic is matched
    return { 
      type: 'general', 
      response: [
        "Hmm, that's a new one! 🤔 I'm Jiya, your personal finance assistant. Try asking about budgeting, saving, investing, debt, taxes, retirement, or how to use this app.",
        "I'm not sure I caught that, but I'm always learning! Ask me about money tips, app features, or just say hi! 😊",
        "Oops, I didn't get that. But I'm here to help with anything finance or app-related! 💡",
        "That one's a bit tricky! Try asking about budgeting, saving, investing, or how to use the app. Or just say hello! 👋"
      ][Math.floor(Math.random() * 4)]
    };
  };

  const sendBotMessage = (response) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: response }]);
      setIsTyping(false);
    }, 800);
  };

  const handleSendMessage = (customInput) => {
    const userInput = typeof customInput === 'string' ? customInput : inputValue;
    if (userInput.trim() === '') return;
    setMessages([...messages, { sender: 'user', text: userInput }]);
    setIsTyping(true);
    const { response } = processUserInput(userInput);
    sendBotMessage(response);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleDailyTip = () => {
    setIsTyping(true);
    sendBotMessage(dailyTips[Math.floor(Math.random() * dailyTips.length)]);
  };

  const handleChallenge = () => {
    setIsTyping(true);
    sendBotMessage("Here's a financial challenge for you: " + financialChallenges[Math.floor(Math.random() * financialChallenges.length)]);
  };

  return (
    <div className="ai-assistant-container">
      {!isOpen ? (
        <Tooltip title="Ask Jiya" placement="left">
          <Button 
            type="primary" 
            shape="circle" 
            size="large"
            className="assistant-button"
            onClick={() => setIsOpen(true)}
          >
            <img src={jiyaAvatar} alt="Jiya" className="button-avatar" />
          </Button>
        </Tooltip>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-content">
              <Avatar src={jiyaAvatar} className="assistant-avatar" />
              <Title level={5} style={{ margin: 0 }}>Jiya</Title>
            </div>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={() => setIsOpen(false)} 
            />
          </div>
          <div className="messages-container">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {message.sender === 'bot' && 
                  <Avatar src={jiyaAvatar} size="small" className="message-avatar" />
                }
                <div className="message-text">
                  {parseEmojis(message.text)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot-message typing-indicator">
                <Avatar src={jiyaAvatar} size="small" className="message-avatar" />
                <div className="message-text">
                  <span className="typing-dot">.</span>
                  <span className="typing-dot">.</span>
                  <span className="typing-dot">.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-container">
            <Input 
              placeholder="Ask Jiya about finances or app help..." 
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
            />
          </div>
          <div className="quick-replies">
            <Space wrap>
              {quickReplies.map((reply, idx) => (
                <Button key={idx} size="small" onClick={() => handleSendMessage(reply)}>{reply}</Button>
              ))}
              <Button size="small" icon={<BulbOutlined />} onClick={handleDailyTip}>Daily Tip</Button>
              <Button size="small" icon={<ThunderboltOutlined />} onClick={handleChallenge}>Challenge</Button>
            </Space>
          </div>
          <div className="chat-footer">
            <Popover 
              content={
                <div style={{ maxWidth: 250 }}>
                  <p>Ask me about:</p>
                  <ul style={{ paddingLeft: 20, margin: 0 }}>
                    <li>Budgeting methods & tips</li>
                    <li>Saving strategies</li>
                    <li>Investment advice</li>
                    <li>Debt management</li>
                    <li>Tax information</li>
                    <li>Retirement planning</li>
                    <li>How to use this app</li>
                  </ul>
                </div>
              } 
              title="Jiya - Financial Assistant"
              trigger="click"
            >
              <QuestionCircleOutlined /> Need help?
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant; 