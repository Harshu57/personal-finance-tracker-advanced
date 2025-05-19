import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, List, Avatar, Typography, Spin, Tag, Tooltip, Steps } from 'antd';
import {
  RobotOutlined,
  SendOutlined,
  UserOutlined,
  LoadingOutlined,
  BulbOutlined,
  CodeOutlined,
  ExperimentOutlined,
  BookOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import './JiyaAI.css';

const { Text, Paragraph } = Typography;
const { Step } = Steps;

const JiyaAI = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hello! I'm Jiya, your advanced AI assistant. I can help you with complex problem-solving, code analysis, system design, and more. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState([]); // Store conversation context
  const [thinking, setThinking] = useState({ active: false, step: 0 });
  const messagesEndRef = useRef(null);

  const thinkingSteps = [
    'Analyzing context and requirements',
    'Decomposing problem',
    'Gathering relevant information',
    'Formulating solution approach'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Advanced thinking simulation
  const simulateThinking = async () => {
    setThinking({ active: true, step: 0 });
    for (let i = 0; i < thinkingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setThinking(prev => ({ ...prev, step: i }));
    }
    setThinking({ active: false, step: 0 });
  };

  // Enhanced context analysis
  const analyzeContext = (conversationContext) => {
    const recentContext = conversationContext.slice(-5);
    const topics = new Set();
    const concepts = new Set();
    const requirements = new Set();

    recentContext.forEach(msg => {
      // Extract topics from conversation
      const text = msg.content.toLowerCase();
      if (text.includes('code') || text.includes('programming')) topics.add('programming');
      if (text.includes('design') || text.includes('architecture')) topics.add('system_design');
      if (text.includes('algorithm') || text.includes('complexity')) topics.add('algorithms');
      if (text.includes('data') || text.includes('analysis')) topics.add('data_analysis');

      // Identify key concepts
      if (text.includes('how') || text.includes('explain')) concepts.add('explanation_needed');
      if (text.includes('compare') || text.includes('difference')) concepts.add('comparison_needed');
      if (text.includes('optimize') || text.includes('improve')) concepts.add('optimization_needed');

      // Detect requirements
      if (text.includes('example')) requirements.add('examples_needed');
      if (text.includes('step')) requirements.add('step_by_step_needed');
      if (text.includes('code')) requirements.add('code_examples_needed');
    });

    return {
      topics: Array.from(topics),
      concepts: Array.from(concepts),
      requirements: Array.from(requirements)
    };
  };

  // Advanced response generation with context awareness
  const generateResponse = async (userInput) => {
    try {
      setIsTyping(true);
      await simulateThinking();

      const userInputLower = userInput.toLowerCase();
      let response = '';

      // Add user input to context
      const updatedContext = [...context, { role: 'user', content: userInput }];
      setContext(updatedContext);

      // Analyze context for better understanding
      const contextAnalysis = analyzeContext(updatedContext);
      
      // Generate response based on context analysis
      response = await generateContextAwareResponse(userInputLower, contextAnalysis);

      // Add bot response to context
      setContext([...updatedContext, { role: 'assistant', content: response }]);

      // Update messages with bot response
      setMessages(prev => [...prev, {
        type: 'bot',
        content: response,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "I encountered an error while processing your request. Let me try to break this down differently. Could you provide more specific details about what you're trying to achieve?",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Context-aware response generation
  const generateContextAwareResponse = async (input, contextAnalysis) => {
    // Decompose the problem
    const problemComponents = decomposeProblem(input);
    
    // Generate appropriate response based on problem components
    if (problemComponents.isSystemDesign) {
      return generateSystemDesignResponse(input, contextAnalysis);
    } else if (problemComponents.isCodeAnalysis) {
      return generateCodeAnalysisResponse(input, contextAnalysis);
    } else if (problemComponents.isAlgorithmic) {
      return generateAlgorithmicResponse(input, contextAnalysis);
    } else if (problemComponents.isConceptual) {
      return generateConceptualResponse(input, contextAnalysis);
    }

    return generateGeneralResponse(input, contextAnalysis);
  };

  // Problem decomposition
  const decomposeProblem = (input) => {
    return {
      isSystemDesign: input.includes('system') || input.includes('design') || input.includes('architecture'),
      isCodeAnalysis: input.includes('code') || input.includes('debug') || input.includes('implement'),
      isAlgorithmic: input.includes('algorithm') || input.includes('optimize') || input.includes('complexity'),
      isConceptual: input.includes('explain') || input.includes('what') || input.includes('how'),
      requiresExamples: input.includes('example') || input.includes('show'),
      needsStepByStep: input.includes('step') || input.includes('guide') || input.includes('how'),
    };
  };

  // Specialized response generators
  const generateSystemDesignResponse = (input, contextAnalysis) => {
    return `Let me help you with the system design. Here's a comprehensive approach:

1. Requirements Analysis:
   - Functional Requirements
   - Non-functional Requirements (Scalability, Reliability, Performance)
   - System Constraints

2. High-Level Design:
   - System Architecture
   - Component Breakdown
   - Data Flow Diagram
   - API Design

3. Detailed Component Design:
   - Database Schema
   - Service Interfaces
   - Caching Strategy
   - Load Balancing

4. Scalability Considerations:
   - Horizontal vs Vertical Scaling
   - Database Sharding
   - Microservices Architecture
   - CDN Implementation

Would you like me to elaborate on any of these aspects or provide specific examples?`;
  };

  const generateCodeAnalysisResponse = (input, contextAnalysis) => {
    return `I'll help analyze the code. Let's break it down:

1. Code Structure Analysis:
   - Architecture Patterns
   - Design Patterns Used
   - Component Dependencies
   - Code Organization

2. Performance Analysis:
   - Time Complexity
   - Space Complexity
   - Resource Usage
   - Bottlenecks

3. Code Quality:
   - Best Practices
   - Clean Code Principles
   - Error Handling
   - Edge Cases

4. Optimization Opportunities:
   - Algorithm Improvements
   - Memory Optimization
   - Performance Tuning
   - Code Reusability

Which aspect would you like me to focus on first?`;
  };

  const generateAlgorithmicResponse = (input, contextAnalysis) => {
    return `Let's solve this algorithmic challenge systematically:

1. Problem Understanding:
   - Input/Output Requirements
   - Constraints and Edge Cases
   - Example Test Cases
   - Pattern Recognition

2. Solution Approaches:
   - Brute Force Approach
   - Optimized Solution
   - Space-Time Tradeoffs
   - Algorithm Selection

3. Implementation Strategy:
   - Data Structure Choice
   - Algorithm Implementation
   - Error Handling
   - Edge Case Handling

4. Optimization:
   - Time Complexity Analysis
   - Space Complexity Analysis
   - Performance Improvements
   - Code Optimization

Would you like me to elaborate on any of these aspects?`;
  };

  const generateConceptualResponse = (input, contextAnalysis) => {
    return `Let me explain this concept comprehensively:

1. Core Concepts:
   - Fundamental Principles
   - Key Components
   - Underlying Theory
   - Common Patterns

2. Practical Application:
   - Real-world Usage
   - Implementation Strategies
   - Best Practices
   - Common Pitfalls

3. Advanced Topics:
   - Advanced Patterns
   - Performance Considerations
   - Scalability Aspects
   - Edge Cases

4. Related Concepts:
   - Dependencies
   - Alternatives
   - Trade-offs
   - Evolution

Which aspect would you like me to explore further?`;
  };

  const generateGeneralResponse = (input, contextAnalysis) => {
    const { topics, concepts, requirements } = contextAnalysis;
    
    return `I understand you're interested in ${topics.join(', ')}. Let me provide a comprehensive response:

1. Current Context:
   ${concepts.map(c => `- ${c.replace('_', ' ')}`).join('\n   ')}

2. Key Considerations:
   - Problem Definition
   - Solution Approach
   - Implementation Strategy
   - Best Practices

3. Next Steps:
   ${requirements.map(r => `- ${r.replace('_', ' ')}`).join('\n   ')}

4. Additional Resources:
   - Documentation
   - Examples
   - References
   - Tools

How would you like to proceed with this discussion?`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');

    // Generate bot response
    generateResponse(currentInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="jiya-ai-container">
      <Card 
        title={
          <div className="assistant-header">
            <RobotOutlined className="assistant-icon" />
            <span>Jiya AI Assistant</span>
            <Tag color="blue">Advanced AI</Tag>
          </div>
        }
        className="chat-card"
        extra={
          <div className="capability-indicators">
            <Tooltip title="Advanced Problem Solving">
              <ThunderboltOutlined className="capability-icon" />
            </Tooltip>
            <Tooltip title="System Design">
              <BranchesOutlined className="capability-icon" />
            </Tooltip>
            <Tooltip title="Code Analysis">
              <CodeOutlined className="capability-icon" />
            </Tooltip>
            <Tooltip title="API Integration">
              <ApiOutlined className="capability-icon" />
            </Tooltip>
          </div>
        }
      >
        <div className="messages-container">
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(message) => {
              return (
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
              );
            }}
          />
          {thinking.active && (
            <div className="thinking-process">
              <Steps current={thinking.step} size="small">
                {thinkingSteps.map((step, index) => (
                  <Step key={index} title={step} />
                ))}
              </Steps>
            </div>
          )}
          {isTyping && (
            <div className="typing-indicator">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              <Text type="secondary">Jiya is thinking...</Text>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="input-container">
          <Input.TextArea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about system design, code analysis, algorithms, or any complex problem..."
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
          <BulbOutlined /> Tip: Try asking about system design patterns, code optimization, or complex algorithmic problems!
        </div>
      </Card>
    </div>
  );
};

export default JiyaAI; 