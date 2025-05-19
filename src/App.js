import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import JiyaAI from './components/JiyaAI';
import Dashboard from './components/Dashboard';
import QuickAccess from './components/QuickAccess';
import Header from './components/Header';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="app-layout">
        <Header />
        <Layout className="main-layout">
          <QuickAccess />
          <Content className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/jiya-ai" element={<JiyaAI />} />
              <Route path="/transactions" element={<div>Transactions (Coming Soon)</div>} />
              <Route path="/add-income" element={<div>Add Income (Coming Soon)</div>} />
              <Route path="/add-expense" element={<div>Add Expense (Coming Soon)</div>} />
              <Route path="/budget" element={<div>Budget (Coming Soon)</div>} />
              <Route path="/reports" element={<div>Reports (Coming Soon)</div>} />
              <Route path="/shared-expenses" element={<div>Shared Expenses (Coming Soon)</div>} />
              <Route path="/notifications" element={<div>Notifications (Coming Soon)</div>} />
              <Route path="/settings" element={<div>Settings (Coming Soon)</div>} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
